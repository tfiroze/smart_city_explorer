#!/usr/bin/env python
# coding: utf-8

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


# In[2]:


ssh_host = '137.43.49.79'
ssh_port = 22
ssh_username = 'student'
ssh_password = 'Ucd-cs-2023!'

mysql_user = 'root'
mysql_password = 'Group@18'
mysql_db = 'smartcityexplorer'

with SSHTunnelForwarder(
    (ssh_host, ssh_port),
    ssh_username=ssh_username,
    ssh_password=ssh_password,
    remote_bind_address=('127.0.0.1', 3306)
) as tunnel:
    conn = pymysql.connect(
        host='127.0.0.1',
        user=mysql_user,
        password=mysql_password,
        db=mysql_db,
        port=tunnel.local_bind_port
    )
    
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM venue_static")
    results = cursor.fetchall()

    # Convert the results to a pandas DataFrame
    import pandas as pd
    df_venue_static = pd.DataFrame(results, columns=[column[0] for column in cursor.description])
    
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM venue_timings")
    results = cursor.fetchall()
    df_venue_timings = pd.DataFrame(results, columns=[column[0] for column in cursor.description])

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM venue_merged")
    results = cursor.fetchall()
    df_venue_merged = pd.DataFrame(results, columns=[column[0] for column in cursor.description])    
    
    # Close the database connection
    conn.close()


# In[3]:


df_venue_merged['merged_time'] = pd.to_datetime(df_venue_merged['merged_time'])

# Add 'day_of_week' column (Monday as 0)
df_venue_merged['day_of_week'] = df_venue_merged['merged_time'].dt.dayofweek

# Add 'hour_integer' column
df_venue_merged['hour_integer'] = df_venue_merged['merged_time'].dt.hour


# In[4]:


venue_mapping = {
    'PARK': 'Park',
    'Tourist Destination': 'Tourist Destination',
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
    'Shopping Center': 'Shopping Center',
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


# In[5]:


venue_zone_grouping = {
    'Upper Manhattan': [128, 127, 243, 120, 244, 116, 42, 152, 41, 74, 75],
    'Upper West Side': [166, 24, 151, 43, 238, 239, 143, 142],
    'Upper East Side': [236,263, 262, 237, 141, 140 ],
    'Chelsea/Greenwhich market':[246, 68, 186, 90, 100, 234, 158, 249, 113, 249],
    'Lower Manhattan': [107, 224, 114, 211, 144, 148, 232, 231, 45, 13, 261, 209, 87, 88, 12 ],
    'Midtown Manhattan': [50, 48, 230, 163, 161, 162, 229, 233, 164, 170, 137, 224, 107, 234]
}


# In[6]:


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


# In[7]:


# df_venue_static.to_csv('services/venue_model/zone_Grouping.csv', index=False)


# In[8]:


unique_type_values = df_venue_static['venue_mod_type'].unique()


# In[9]:


specific_venue_types = ['Nature Attractions', 'Shopping Center', 'Tourist Destination', 'Cultural Heritage', 'Neighborhood Market', 'Fashion Convenience', 'Library', 'Scenic Landmarks', 'Art', 'Religious', 'Park', 'Gifts & Souvenirs']

# Filter the DataFrame to only include rows with the specific venue types
df_venue_static_att = df_venue_static[df_venue_static['venue_mod_type'].isin(specific_venue_types)]


# In[10]:


import sys

params = sys.argv[1:]
substrings = params[0].split(',')
user_zone_input = substrings
user_zone_input = [attraction.replace('_', ' ') for attraction in user_zone_input]

substrings = params[1].split(',')
user_input_attractions = substrings
user_input_attractions = [attraction.replace('_', ' ') for attraction in user_input_attractions]

# user_zone_input = ["Upper West Side", "Upper East Side"]
# user_input_attractions = ["Neighborhood Market", "Park", "Art"]


# In[11]:


unique_type_values_att = df_venue_static_att['venue_mod_type'].unique()


# In[12]:


if len(user_input_attractions) < 4:
    x = 4 - len(user_input_attractions)
    updated_list = [num for num in unique_type_values_att if num not in user_input_attractions]
    
    similarities = []
    user_input_tag_embedding = nlp(user_input_attractions[0]).vector

    for tag in updated_list:
        tag_embedding = nlp(tag).vector
        similarity = user_input_tag_embedding.dot(tag_embedding) / (np.linalg.norm(user_input_tag_embedding) * np.linalg.norm(tag_embedding))
        similarities.append(similarity)

    sorted_indices = np.argsort(similarities)[::-1]  # Descending order
    most_similar_tags = [updated_list[i] for i in sorted_indices]
    slice_most_similar_tags = most_similar_tags[0:x]
    user_input_attractions = user_input_attractions + slice_most_similar_tags


# In[13]:


priority_table = pd.DataFrame({
    'Attraction': ['Parks', 'Tourist Destination', 'Cultural Heritage', 'Scenic Landmarks', 'Nature Attractions',
                   'Religious', 'Art', 'Library', 'Shopping Center', 'Fashion Convenience',
                   'Neighborhood Market', 'Gifts & Souvenirs'],
    'Opening_Time': ['9:00 AM', '9:00 AM', '11:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '9:00 AM', '9:00 AM',
                     '10:00 AM', '10:00 AM', '10:00 AM', '10:00 AM'],
    'Closing_Time': ['6:00 PM', '6:00 PM', '5:00 PM', '1:00 AM', '4:00 PM', '5:00 PM', '5:00 PM', '7:00 PM',
                     '6:00 PM', '6:00 PM', '6:00 PM', '6:00 PM']
})


# Filter priority table based on user's input
filtered_priority = priority_table[priority_table['Attraction'].isin(user_input_attractions)]


# Create the suggested itinerary
itinerary = {}
current_date_time = datetime.now()

# Get the current date
current_date = current_date_time.date()

current_time = pd.Timestamp(f"{current_date} 9:00 AM")
for index, row in filtered_priority.iterrows():
    attraction = row['Attraction']
    start_time = pd.Timestamp(row['Opening_Time'])
    end_time = pd.Timestamp(row['Closing_Time'])
    
    # Check if the attraction can be visited within the day (9 AM to 7 PM)
    if end_time <= pd.Timestamp(f"{current_date} 7:00 PM") and current_time <= pd.Timestamp(f"{current_date} 7:00 PM"):
        # Handle the break from 1 am to 3 am
        if current_time.hour == 1:
            current_time = pd.Timestamp(f"{current_date} 3:00 AM")
        # Calculate the visit duration for the attraction
        visit_duration = min(2, (end_time - current_time).seconds / 3600)
        # Check if the visit exceeds the closing time (7 PM)
        if current_time + pd.Timedelta(hours=visit_duration) <= pd.Timestamp(f"{current_date} 7:00 PM"):
            itinerary[attraction] = f"{current_time.strftime('%I:%M %p')} - {(current_time + pd.Timedelta(hours=visit_duration)).strftime('%I:%M %p')}"
            current_time += pd.Timedelta(hours=visit_duration)
        else:
            break  # Stop adding attractions once it exceeds the closing time

# Print the suggested itinerary
itinerary_timing = []
opening_time = [9,11,15,17]
closing_time = [11,15,17,19]
for attraction, timing in itinerary.items():
    itinerary_timing.append(attraction)


# In[14]:


zone_group = []
for group in user_zone_input:
    for zone in venue_zone_grouping[group]:
        zone_group.append(zone)


# In[15]:


venue_type_dict = {}
for venue_type in itinerary_timing:
    matched_zones = df_venue_static_att[df_venue_static_att['venue_mod_type'] == venue_type]['original_ven_id'].unique()
    venue_type_dict[venue_type] = list(matched_zones)


# In[16]:


time_index = 0
filtered_venues = {}

# Loop through each venue type and check for the specified condition
for venue_type, venue_ids in venue_type_dict.items():
    valid_venues = []
    for venue_id in venue_ids:
        venue_info = df_venue_timings.loc[df_venue_timings['venue_id'] == venue_id]
        filtered_venue_info = venue_info.loc[(venue_info['day'] == 6) & (venue_info['opening_time'] <= opening_time[time_index]) 
#                                              & (venue_info['closing_time'] >= closing_time[time_index])
                                            ]
        if not filtered_venue_info.empty:
            valid_venues.append(venue_id)
    if valid_venues:
        filtered_venues[venue_type] = valid_venues
        time_index+=1


# In[17]:


manipulated_venues = {}

# Loop through each venue type and check for the specified condition
for venue_type, venue_ids in venue_type_dict.items():
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


# In[18]:


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

# Display the top 3 venues for each venue type
# for venue_type, top_venues in top_3_venues.items():
#     print(f"Venue Type: {venue_type}")
#     for rank, (venue_id, rating, busyness, score) in enumerate(top_venues, start=1):
#         print(f"Rank {rank}: Venue ID: {venue_id}, Rating: {rating}, Busyness: {busyness}, Score: {score}")
#     print()
    
print(top_3_venues)

