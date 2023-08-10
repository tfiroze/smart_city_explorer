#!/usr/bin/env python
# coding: utf-8

# # Load Data

# In[1]:


# import modules
import pandas as pd
import numpy as np
import sqlalchemy as sqla
import pickle
from sqlalchemy import create_engine

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn import metrics

import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings("ignore")

import pymysql
from sshtunnel import SSHTunnelForwarder
from datetime import datetime, timedelta

import spacy

# Load pre-trained word embeddings (e.g., spaCy's medium English model)
nlp = spacy.load("en_core_web_md")


from shapely.geometry import MultiPolygon, Polygon
from shapely.ops import nearest_points
import geopandas as gpd
from shapely import wkt


# In[2]:


df_venue_static = pd.read_csv('../data_models/Recommendation_model/venue_static.csv')
df_venue_timings = pd.read_csv('../data_models/Recommendation_model/venue_timings.csv')
df_venue_merged = pd.read_csv('../data_models/Recommendation_model/venue_merged.csv')


# In[ ]:


df_venue_static = df_venue_static[df_venue_static['venue_type'] != 'LIBRARY']
df_venue_static.to_csv('../data_models/Recommendation_model/venue_static.csv', index=False)


# In[ ]:


df_manhattan_zone = pd.read_csv('../data_models/Recommendation_model/manhattan_zones.csv')
#df_manhattan_zone.head(50)


# # Manipulate Data

# ## Split into Hour and Day of the week

# In[ ]:


df_venue_merged['merged_time'] = pd.to_datetime(df_venue_merged['merged_time'])

# Add 'day_of_week' column (Monday as 0)
df_venue_merged['day_of_week'] = df_venue_merged['merged_time'].dt.dayofweek

# Add 'hour_integer' column
df_venue_merged['hour_integer'] = df_venue_merged['merged_time'].dt.hour


# In[ ]:


#print(df_venue_merged.head(10))


# ## Grouping Venue Types

# In[ ]:


venue_mapping = {
    'PARK': 'Park',
    'TOURIST_DESTINATION': 'Tourist Destination',
    'MUSEUM': 'Cultural Heritage',
    'HISTORICAL':'Cultural Heritage',
    'SCENIC_POINT': 'Scenic Landmarks',
    'BRIDGE': 'Scenic Landmarks',
    'NATURE_RESERVE': 'Nature Attractions',
    'ZOO': 'Nature Attractions',
    'BOTANICAL_GARDEN': 'Nature Attractions',
    'ARTS': 'Art',
    'DESSERT':'Art',
    'CHURCH': 'Religious',
    'SYNAGOGUE':'Religious',
    'VISITOR_CENTER': 'Tourist Destination',
    'LIBRARY':'Library',
    'SHOPPING_CENTER': 'Shopping Center',
    'APPAREL':'Fashion Convenience',
    'OTHER': 'Tourist Destination',
    'SHOPPING': 'Fashion Convenience',
    'CONVENIENCE_STORE':'Neighborhood Market',
    'SUPERMARKET': 'Neighborhood Market',
    'GROCERY':'Neighborhood Market',
    'MARKET':'Neighborhood Market',
    'GIFTS': 'Gifts & Souvenirs',
    'SOUVENIR_SHOP':'Gifts & Souvenirs',
    
}

df_venue_static['venue_mod_type'] = df_venue_static['venue_type'].replace(venue_mapping)


# In[ ]:


venue_to_zone_dict = {}

# Iterate through each row in the DataFrame
for index, row in df_venue_static.iterrows():
    venue_type = row['venue_mod_type']
    zone = row['zone_id']
    
    # If the venue_type is already in the dictionary, append the zone to its list
    if venue_type in venue_to_zone_dict:
        venue_to_zone_dict[venue_type].append(zone)
    # If the venue_type is not in the dictionary, create a new entry with the zone as a list
    else:
        venue_to_zone_dict[venue_type] = [zone]

#print(venue_to_zone_dict)


# In[ ]:


#df_venue_static.head(50)


# # Clearing Duplicates

# In[ ]:


# look for duplicates
#print('Number of duplicate (excluding first) rows in the table is: ', df_venue_static.duplicated().sum())

# use "keep=False" to mark all duplicates as true, including the original rows that were duplicated
#print('Number of duplicate rows (including first) in the table is:', df_venue_static[df_venue_static.duplicated(keep=False)].shape[0])


# In[ ]:


# look for duplicates
#print('Number of duplicate (excluding first) rows in the table is: ', df_venue_timings.duplicated().sum())

# use "keep=False" to mark all duplicates as true, including the original rows that were duplicated
#print('Number of duplicate rows (including first) in the table is:', df_venue_timings[df_venue_timings.duplicated(subset=['venue_id', 'day', 'opening_time', 'closing_time'], keep='first')].shape[0])


# In[ ]:


#print('Number of duplicate (excluding first) rows in the table is: ', df_venue_timings.drop_duplicates(subset=['venue_id', 'day', 'opening_time', 'closing_time'], inplace=True))
#df_venue_timings


# # Grouping Zones

# In[ ]:


venue_zone_grouping = {
    'Upper Manhattan': [128, 127, 243, 120, 244, 116, 42, 152, 41, 74, 75],
    'Upper West Side': [166, 24, 151, 43, 238, 239, 143, 142],
    'Upper East Side': [236,263, 262, 237, 141, 140 ],
    'Chelsea/Greenwhich market':[246, 68, 186, 90, 100, 234, 158, 249, 113, 249],
    'Lower Manhattan': [107, 224, 114, 211, 144, 148, 232, 231, 45, 13, 261, 209, 87, 88, 12 ],
    'Midtown Manhattan': [50, 48, 230, 163, 161, 162, 229, 233, 164, 170, 137, 224, 107, 234]
}


# In[ ]:


# venue_zone_grouping dictionary
venue_zone_grouping = {
    'Upper Manhattan': [128, 127, 243, 120, 244, 116, 42, 152, 41, 74, 75],
    'Upper West Side': [166, 24, 151, 43, 238, 239, 143, 142],
    'Upper East Side': [236, 263, 262, 237, 141, 140],
    'Chelsea/Greenwhich market': [246, 68, 186, 90, 100, 234, 158, 249, 113, 249],
    'Lower Manhattan': [107, 224, 114, 211, 144, 148, 232, 231, 45, 13, 261, 209, 87, 88, 12],
    'Midtown Manhattan': [50, 48, 230, 163, 161, 162, 229, 233, 164, 170, 137, 224, 107, 234],
}

# Function to map zone numbers to zone groups
def map_zone_group(zone_number):
    for zone_group, zone_numbers in venue_zone_grouping.items():
        if zone_number in zone_numbers:
            return zone_group
    return 'Other'  # If zone number not found in the dictionary, assign 'Other'

# Create the 'zone_group' column based on the mapping
df_venue_static['zone_group'] = df_venue_static['zone_id'].apply(map_zone_group)

#print(df_venue_static)


# In[ ]:


df_venue_static.to_csv('../data_models/Recommendation_model/zone_Grouping.csv', index=False)


# # Extracting Only Attratcion Types and Ignoring Restaurants

# In[ ]:


unique_type_values = df_venue_static['venue_mod_type'].unique()
#unique_type_values


# In[ ]:


specific_venue_types = ['Nature Attractions', 'Shopping Center', 'Tourist Destination', 'Cultural Heritage', 'Neighborhood Market', 'Fashion Convenience',  'Scenic Landmarks', 'Art', 'Religious', 'Park', 'Gifts & Souvenirs']

# Filter the DataFrame to only include rows with the specific venue types
df_venue_static_att = df_venue_static[df_venue_static['venue_mod_type'].isin(specific_venue_types)]

# Now 'filtered_df' contains only rows where the "Attraction_Type" is in the specified list
#print(df_venue_static_att)


# In[ ]:


# Filter out the restaurant types
restaurant_types = [venue for venue in unique_type_values if 'RESTAURANT' in venue]

# Assuming you have a dataframe named 'df_venue' which has a column 'venue_type'
# that matches the values in your unique_type_values array, you can filter it as follows:
df_venue_restaurant = df_venue_static[df_venue_static['venue_type'].isin(restaurant_types)]

#print(df_venue_restaurant)


# In[ ]:


unique_venue_types = df_venue_restaurant['venue_type'].unique()
#print(unique_venue_types)


# In[ ]:


unique_type_values_att = df_venue_static_att['venue_mod_type'].unique()
#unique_type_values_att


# # Actual Flow

# ### Input

# In[ ]:


import sys

params = sys.argv[1:]
substrings = params[0].split(',')
user_zone_input = substrings
user_zone_input = [attraction.replace('_', ' ') for attraction in user_zone_input]

substrings = params[1].split(',')
user_input_attractions = substrings
user_input_attractions = [attraction.replace('_', ' ') for attraction in user_input_attractions]

substrings = params[2].split(',')
user_input_restaurants = substrings

for i in range(len(user_input_restaurants)):
    user_input_restaurants[i] = user_input_restaurants[i].upper()
    


# user_zone_input = ["Chelsea/Greenwhich market","Upper Manhattan"]

# user_input_attractions = [
#         "Tourist Destination",
#         "Fashion Convenience",
#         "Neighborhood Market",
#         "Shopping Center"
#     ]

# user_input_restaurants = ['FRENCH_RESTAURANT', 'ITALIAN_RESTAURANT']


# In[ ]:


if len(user_input_attractions) < 4:
    x = 4 - len(user_input_attractions)
    
    updated_list = [num for num in unique_type_values_att if num not in user_input_attractions]
    
    # Always include either 'Park', 'Scenic Landmark', or 'Tourist Destination' if not in user's input
    core_attractions = ['Park', 'Scenic Landmarks', 'Tourist Destination']
    
    # Find out which core attractions are not in the user's input
    missing_core_attractions = [attraction for attraction in core_attractions if attraction not in user_input_attractions]
    
    # Compute similarities only for missing core attractions
    core_similarities = []
    user_input_tag_embedding = nlp(user_input_attractions[0]).vector

    for tag in missing_core_attractions:
        tag_embedding = nlp(tag).vector
        similarity = user_input_tag_embedding.dot(tag_embedding) / (np.linalg.norm(user_input_tag_embedding) * np.linalg.norm(tag_embedding))
        core_similarities.append(similarity)

    # Add the most similar core attraction to user's input
    if core_similarities:
        most_similar_core_index = np.argmax(core_similarities)
        user_input_attractions.append(missing_core_attractions[most_similar_core_index])
        x -= 1  # Decrement x as we've added a core attraction
        
        # Ensure that this attraction won't be added again from updated_list
        updated_list.remove(missing_core_attractions[most_similar_core_index])

    # Now, for the remaining attractions (if any)
    if x > 0:
        other_similarities = []
        
        for tag in updated_list:
            tag_embedding = nlp(tag).vector
            similarity = user_input_tag_embedding.dot(tag_embedding) / (np.linalg.norm(user_input_tag_embedding) * np.linalg.norm(tag_embedding))
            other_similarities.append(similarity)

        sorted_indices = np.argsort(other_similarities)[::-1]  # Descending order
        most_similar_tags = [updated_list[i] for i in sorted_indices]
        slice_most_similar_tags = most_similar_tags[0:x]
        user_input_attractions = user_input_attractions + slice_most_similar_tags


# In[ ]:


priority_table = pd.DataFrame({
    'Attraction': ['Park', 'Tourist Destination', 'Cultural Heritage', 'Scenic Landmarks', 'Nature Attractions',
                   'Religious', 'Art',  'Shopping Center', 'Fashion Convenience',
                   'Neighborhood Market', 'Gifts & Souvenirs'],
    'Opening_Time': ['9:00 AM', '9:00 AM', '11:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '10:00 AM', 
                     '10:00 AM', '10:00 AM', '10:00 AM', '10:00 AM'],
    'Closing_Time': ['6:00 PM', '6:00 PM', '6:00 PM', '11:00 PM', '6:00 PM', '6:00 PM', '6:00 PM', 
                     '6:00 PM', '6:00 PM', '6:00 PM', '6:00 PM']
})


# In[ ]:


# Assuming the following structure for df_venue_static_att: ['venue_id', 'venue_mod_type']

# 1. Get the venue_id for each venue_mod_type from df_venue_static_att
venue_ids_per_type = df_venue_static_att.groupby('venue_type')['hash_ven_id'].apply(list).to_dict()

# 2. Use the venue_id to filter entries in df_venue_timings
hourly_counts = {}
for hour in range(24):  # 24 hours
    for venue_type, venue_ids in venue_ids_per_type.items():
        mask = (df_venue_timings['venue_id'].isin(venue_ids)) & \
               (df_venue_timings['opening_time'] <= hour) & \
               (df_venue_timings['closing_time'] >= hour) & \
               (df_venue_timings['day'] == 6)  # Assuming 6 represents Sunday
        count = len(df_venue_timings[mask])
        if venue_type not in hourly_counts:
            hourly_counts[venue_type] = {}
        hourly_counts[venue_type][hour] = count

# 3. Determine most common opening and closing times
common_times = {}
for venue_type, counts in hourly_counts.items():
    open_hour = min(counts.keys())
    close_hour = max(counts.keys())
    common_times[venue_type] = {
        'Opening_Time': f'{open_hour}:00 AM' if open_hour < 12 else f'{open_hour-12 if open_hour > 12 else 12}:00 PM',
        'Closing_Time': f'{close_hour}:00 AM' if close_hour < 12 else f'{close_hour-12 if close_hour > 12 else 12}:00 PM'
    }

# 4. Update the priority table
for index, row in priority_table.iterrows():
    attraction = row['Attraction']
    if attraction in common_times:
        priority_table.at[index, 'Opening_Time'] = common_times[attraction]['Opening_Time']
        priority_table.at[index, 'Closing_Time'] = common_times[attraction]['Closing_Time']

#print(priority_table)


# In[ ]:


import pandas as pd
from datetime import datetime

current_date = datetime.now().strftime('%Y-%m-%d')

# Sort attractions based on their opening times
priority_table['Opening_Timestamp'] = pd.to_datetime(priority_table['Opening_Time'])
sorted_attractions = priority_table.set_index('Attraction').loc[user_input_attractions].sort_values('Opening_Timestamp').index.tolist()

# Initialize the itinerary dictionary
itinerary = {}

# Set the day's starting and ending time
start_of_day = pd.Timestamp(f"{current_date} 9:00 AM")
lunch_start = pd.Timestamp(f"{current_date} 1:00 PM")
lunch_end = pd.Timestamp(f"{current_date} 3:00 PM")
dinner_start = pd.Timestamp(f"{current_date} 7:00 PM")
dinner_end = pd.Timestamp(f"{current_date} 9:00 PM")
end_of_day = pd.Timestamp(f"{current_date} 9:00 PM")
current_time = start_of_day

for attraction in sorted_attractions:
    row = priority_table[priority_table['Attraction'] == attraction].iloc[0]
    opening_time = pd.Timestamp(f"{current_date} {row['Opening_Time']}")
    closing_time = pd.Timestamp(f"{current_date} {row['Closing_Time']}")

    # Skip if the attraction is already closed or will not open today
    if current_time > closing_time or current_time < opening_time:
        continue

    # If it's lunchtime, jump to after lunch.
    if lunch_start <= current_time < lunch_end:
        current_time = lunch_end
    
    # If it's dinnertime, jump to after dinner.
    if dinner_start <= current_time < dinner_end:
        current_time = dinner_end

    # Set the current time to the opening time if it's earlier
    if current_time < opening_time:
        current_time = opening_time

    # Calculate the visit duration (min of 2 hours or available time)
    visit_duration = min(2, (closing_time - current_time).seconds / 3600)

    # Add to the itinerary if within the day's limit
    if current_time + pd.Timedelta(hours=visit_duration) <= end_of_day:
        itinerary[attraction] = f"{current_time.strftime('%I:%M %p')} - {(current_time + pd.Timedelta(hours=visit_duration)).strftime('%I:%M %p')}"
        current_time += pd.Timedelta(hours=visit_duration)  # No buffer added here
    else:
        break

# Print the suggested itinerary
# print("Suggested Itinerary:", itinerary)
itinerary_timing = itinerary


# ## Zone grouping

# In[ ]:


zone_group = []
for group in user_zone_input:
    for zone in venue_zone_grouping[group]:
        zone_group.append(zone)
#zone_group


# In[ ]:


zone_type_dict = {}
for venue_type in itinerary_timing:
    matched_zones = df_venue_static_att[df_venue_static_att['venue_mod_type'] == venue_type]['zone_id'].unique()
    zone_type_dict[venue_type] = list(matched_zones)

# Print the resulting dictionary
#print(zone_type_dict)


# ## Restaurant Filtering

# In[ ]:


restaurant_zone_dict = {}
for restaurant_type in user_input_restaurants:
    # Find the zones where the user's selected restaurant types are located using df_venue_restaurant
    matched_zones = df_venue_restaurant[df_venue_restaurant['venue_mod_type'] == restaurant_type]['zone_id'].unique()
    restaurant_zone_dict[restaurant_type] = list(matched_zones)

# Print the resulting dictionary
#print(restaurant_zone_dict)


# In[ ]:


restaurants_with_zero_zones = []

# Iterate through the restaurant_zone_dict
for restaurant_type, zones in restaurant_zone_dict.items():
    if len(zones) == 0:
        restaurants_with_zero_zones.append(restaurant_type)

#print("Restaurant types with 0 zones:", restaurants_with_zero_zones)

filled_restaurant_with_zero_zone = {}

for res_type in restaurants_with_zero_zones:
    restaurant_to_zone_dict_copy = list(set(restaurant_zone_dict[res_type]))
    
    if len(restaurant_to_zone_dict_copy) <= 0:  # Modified condition
        # get all venue id of each zone and push it to restaurant_zone_dict of that type
        print('okay')
        continue  # Continue to next iteration of the loop
    
    zone_between_dist = []
    for user_zone in zone_group:
        for restaurant_zone in restaurant_to_zone_dict_copy:
            zone1_polygon = df_manhattan_zone[df_manhattan_zone['LocationID'] == user_zone]['the_geom'].iloc[0]
            zone2_polygon = df_manhattan_zone[df_manhattan_zone['LocationID'] == restaurant_zone]['the_geom'].iloc[0]
            distance = find_distance_between_zones(zone1_polygon, zone2_polygon)
            zone_between_dist.append((user_zone, restaurant_zone, distance)) 

    sorted_zone_between_dist = sorted(zone_between_dist, key=lambda x: x[2])[:3]
    new_zone = [df_venue_restaurant[
        (df_venue_restaurant['zone_id'] == item[1]) &
        (df_venue_restaurant['venue_mod_type'] == res_type)
    ]['original_ven_id'].tolist() for item in sorted_zone_between_dist]
    
    filled_restaurant_with_zero_zone[res_type] = list(set(item for sublist in new_zone for item in sublist))

#print(filled_restaurant_with_zero_zone)


# In[ ]:


restaurant_venue_dict = {}

for restaurant_type, zones in restaurant_zone_dict.items():
    # Filter the df_venue_restaurant dataframe for the specific restaurant type and zones
    matched_venues = df_venue_restaurant[
        (df_venue_restaurant['venue_mod_type'] == restaurant_type) &
        (df_venue_restaurant['zone_id'].isin(zones))
    ]['original_ven_id'].unique()  # Retrieving the unique venue_ids
    
    restaurant_venue_dict[restaurant_type] = list(matched_venues)

#print(restaurant_venue_dict)


# In[ ]:


user_venue_per_type_dict = {}
for venue_type in itinerary_timing:
    matched_zones = df_venue_static_att[df_venue_static_att['venue_mod_type'] == venue_type]['zone_id']
    matching_zones = matched_zones[matched_zones.isin(zone_group)]
    result_df = df_venue_static_att[df_venue_static_att['zone_id'].isin(matching_zones)]['original_ven_id']
    user_venue_per_type_dict[venue_type] = list(result_df)

# Print the resulting dictionary
#print(user_venue_per_type_dict)


# In[ ]:


types_with_zero_zones = []

# Iterate through the venue_type_dict
for venue_type, zones in user_venue_per_type_dict.items():
    if len(zones) == 0:
        types_with_zero_zones.append(venue_type)

#print("Venue types with 0 zones:", types_with_zero_zones)


# In[ ]:


def find_distance_between_zones(zone1_polygon, zone2_polygon):
    # Find the nearest points between the two polygons
    nearest_points_result = nearest_points(wkt.loads(zone1_polygon), wkt.loads(zone2_polygon))

    # Calculate the distance between the nearest points
    distance = nearest_points_result[0].distance(nearest_points_result[1])
    return distance


# In[ ]:


filled_type_with_zero_zone = {}

for ven_type in types_with_zero_zones:
    venue_to_zone_dict_copy = list(set(venue_to_zone_dict[ven_type]))
    
    if len(venue_to_zone_dict_copy) <= 0: # Modified condition
        #get all venue id of each zone and push it to user_venue_per_type_dict of that type
        print('okay')
        continue  # Continue to next iteration of the loop
    
    zone_between_dist = []
    for user_zone in zone_group:
        for venue_zone in venue_to_zone_dict_copy:
            zone1_polygon = df_manhattan_zone[df_manhattan_zone['LocationID'] == user_zone]['the_geom'].iloc[0]
            zone2_polygon = df_manhattan_zone[df_manhattan_zone['LocationID'] == venue_zone]['the_geom'].iloc[0]
            distance = find_distance_between_zones(zone1_polygon, zone2_polygon)
            zone_between_dist.append((user_zone, venue_zone, distance)) 

    sorted_zone_between_dist = sorted(zone_between_dist, key=lambda x: x[2])[:3]
    new_zone = [df_venue_static_att[
        (df_venue_static_att['zone_id'] == item[1]) &
        (df_venue_static_att['venue_mod_type'] == ven_type)
    ]['original_ven_id'].tolist() for item in sorted_zone_between_dist]
    
    filled_type_with_zero_zone[ven_type] = list(set(item for sublist in new_zone for item in sublist))

#filled_type_with_zero_zone


# In[ ]:


# For venues
for key in user_venue_per_type_dict.keys():
    # Check if the value of the current key is an empty array
    if len(user_venue_per_type_dict[key]) == 0:
        # Check if the key exists in the filled dictionary for venues
        if key in filled_type_with_zero_zone:
            # Replace the value in the main dictionary with the value from the filled dictionary for venues
            user_venue_per_type_dict[key] = filled_type_with_zero_zone[key]

# For restaurants
for key in restaurant_venue_dict.keys():
    # Check if the value of the current key is an empty array
    if len(restaurant_venue_dict[key]) == 0:
        # Check if the key exists in the filled dictionary for restaurants
        if key in filled_restaurant_with_zero_zone:
            # Replace the value in the main dictionary with the value from the filled dictionary for restaurants
            restaurant_venue_dict[key] = filled_restaurant_with_zero_zone[key]

#print(user_venue_per_type_dict)
#print(restaurant_venue_dict)


# In[ ]:


today_day_num = datetime.now().weekday()  # 0: Monday, 6: Sunday

# A function to check if a venue is open today
def is_venue_open_today(venue_id, day_num):
    venue_today_info = df_venue_timings.loc[(df_venue_timings['venue_id'] == venue_id) & (df_venue_timings['day'] == day_num)]
    return not venue_today_info.empty and venue_today_info['opening_time'].iloc[0] != -1 and venue_today_info['closing_time'].iloc[0] != -1

# Update user_venue_per_type_dict
for attraction_type, venue_ids in user_venue_per_type_dict.items():
    user_venue_per_type_dict[attraction_type] = [venue_id for venue_id in venue_ids if is_venue_open_today(venue_id, today_day_num)]

#print(user_venue_per_type_dict)


# In[ ]:


# Update restaurant_zone_dict for restaurants open today
for restaurant_type, venue_ids in restaurant_venue_dict.items():
    restaurant_venue_dict[restaurant_type] = [venue_id for venue_id in venue_ids if is_venue_open_today(venue_id, today_day_num)]

#print(restaurant_venue_dict)


# In[ ]:


manipulated_restaurants = {}

# Loop through each restaurant type and check for the specified condition
for restaurant_type, restaurant_ids in restaurant_venue_dict.items():
    valid_restaurants = []
    for restaurant_id in restaurant_ids:
        restaurant_hash_id = df_venue_restaurant[df_venue_restaurant['original_ven_id'] == restaurant_id]['hash_ven_id']
        restaurant_rating = df_venue_restaurant[df_venue_restaurant['original_ven_id'] == restaurant_id]['rating'].item()
        restaurant_hash_id = int(restaurant_hash_id)
        
        df_venue_merged['venue_id'] = df_venue_merged['venue_id'].astype(int)
        specific_restaurant_df = df_venue_merged[df_venue_merged['venue_id'] == restaurant_hash_id]
        average_busyness = specific_restaurant_df['busyness'].mean() 
        
        weight_rating = 0.6
        weight_busyness = 0.4
        composite_score = (weight_rating * restaurant_rating) + (weight_busyness * average_busyness)
        
        valid_restaurants.append((restaurant_id, restaurant_rating, average_busyness, composite_score))
    if valid_restaurants:
        manipulated_restaurants[restaurant_type] = valid_restaurants

#print(manipulated_restaurants)


# In[ ]:


manipulated_venues = {}

# Loop through each venue type and check for the specified condition
for venue_type, venue_ids in user_venue_per_type_dict.items():
    valid_venues = []
    for venue_id in venue_ids:
        venue_hash_id = df_venue_static.loc[df_venue_static['original_ven_id'] == venue_id]['hash_ven_id']
        venue_rating = df_venue_static.loc[df_venue_static['original_ven_id'] == venue_id]['rating'].item()
        venue_hash_id = int(venue_hash_id)
        df_venue_merged['venue_id'] = df_venue_merged['venue_id'].astype(int)
        specific_venue_df = df_venue_merged.loc[df_venue_merged['venue_id'] == venue_hash_id]
        average_busyness = specific_venue_df['busyness'].mean() 
        
        weight_rating = 0.6
        weight_busyness = 0.4
        composite_score = (weight_rating * venue_rating) + (weight_busyness * average_busyness)
        
        
        valid_venues.append((venue_id, venue_rating, average_busyness, composite_score))
    if valid_venues:
        manipulated_venues[venue_type] = valid_venues



# In[ ]:


top_3_restaurants = {}

# Loop through each restaurant type and its restaurants
for restaurant_type, restaurant_data in manipulated_restaurants.items():
    # Sort the restaurants based on the composite score (fourth element in the tuple, index 3)
    if len(restaurant_data) > 3:
        sorted_restaurants = sorted(restaurant_data, key=lambda x: x[3], reverse=True)
    
        # Keep only the top 3 restaurants for each restaurant type
        top_3_restaurants[restaurant_type] = sorted_restaurants[:3]
    else:
        top_3_restaurants[restaurant_type] = restaurant_data

top_3_restaurants


restaurant_keys = list(top_3_restaurants.keys())
restaurant_values = list(top_3_restaurants.values())

final_restaurants = []
for i in range(0, len(restaurant_keys)):
    # Check if the index is within the bounds of venue_values
    if i < len(restaurant_values):
        final_restaurants.append({
            'order': i,
            'type': restaurant_keys[i],
            'values': restaurant_values[i],
            'type_cat': 'attraction'
        })

print(final_restaurants)


# In[ ]:


print('|')

top_3_venues = {}

# Loop through each venue type and its venues
for venue_type, venue_data in manipulated_venues.items():
    # Sort the venues based on the composite score (fourth element in the tuple, index 3)
    if len(venue_data) > 3:
        sorted_venues = sorted(venue_data, key=lambda x: x[3], reverse=True)
    
        # Keep only the top 3 venues for each venue type
        top_3_venues[venue_type] = sorted_venues[:3]
    else:
        top_3_venues[venue_type] = venue_data


venue_keys = list(top_3_venues.keys())
venue_values = list(top_3_venues.values())

final_venues = []
for i in range(0, len(venue_keys)):
    # Check if the index is within the bounds of venue_values
    if i < len(venue_values):
        final_venues.append({
            'order': i,
            'type': venue_keys[i],
            'values': venue_values[i],
            'type_cat': 'attraction'
        })

print(final_venues)

