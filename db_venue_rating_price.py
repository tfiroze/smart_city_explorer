import json
import pymysql
from sshtunnel import SSHTunnelForwarder
from datetime import datetime, timedelta
import csv
import requests
import pandas as pd


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
    # Read JSON data from file
    cursor = conn.cursor()
    # Add 'rating' column to the table
    # alter_table_query = "ALTER TABLE venue_static ADD COLUMN rating FLOAT"
    # cursor.execute(alter_table_query)

    # # Add 'price' column to the table
    # alter_table_query = "ALTER TABLE venue_static ADD COLUMN price FLOAT"
    # cursor.execute(alter_table_query)

    # Select all rows from the table
    # select_query = "SELECT original_ven_id, name, latitude, longitude FROM venue_static"
    # cursor.execute(select_query)
    # rows = cursor.fetchall()
    # venue_data = []
    # # Iterate over each row
    # for row in rows:
    #     original_ven_id, name, latitude, longitude = row
    #     print(row)

    #     # Make an API request to get rating and price
    #     api_url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
    #     api_key = 'AIzaSyCTwfgq2ppI9vS11ErGXyNVHcqMbMCi1uc'
    #     params = {
    #         'input': name,
    #         'inputtype': 'textquery',
    #         'locationbias': f'point:{latitude},{longitude}',
    #         'fields': 'rating,price_level',
    #         'key': api_key
    #     }
        
    #     response = requests.get(api_url, params=params)

    #     data = response.json()
    #     print(data)
    #     if 'candidates' in data and len(data['candidates']) > 0:
    #         place = data['candidates'][0]
    #         rating = place.get('rating')
    #         price_level = place.get('price_level')
    #         venue_data.append((original_ven_id, name, rating, price_level))
    #     else:
    #         print('Place not found or no data available', name)
    # csv_file_path = 'venue_ratings.csv'

    # # Write the venue data to the CSV file
    # with open(csv_file_path, 'w', newline='', encoding='utf-8') as csv_file:
    #     writer = csv.writer(csv_file)
    #     writer.writerow(['Id','Venue Name', 'Rating', 'Price'])  # Write the header row
    #     writer.writerows(venue_data)  # Write the data rows

    # # Commit the changes to the database
    csv_file_path = 'venue_rating_price.csv'
    df = pd.read_csv(csv_file_path)


    # Iterate over each row in the DataFrame
    for index, row in df.iterrows():
        id = row['ID']
        rating = row['Rating']
        price = row['Price']

        # Update the table using the CSV data
        update_query = f"UPDATE venue_static SET rating = {rating}, price = {price} WHERE original_ven_id = '{id}'"
        cursor.execute(update_query)

    # Commit the changes to the database
    conn.commit()
    cursor.close()
    conn.close()      