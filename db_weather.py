import json
import pymysql
from sshtunnel import SSHTunnelForwarder
from datetime import datetime, timedelta
import csv


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
    csv_files = ['./bestime_scrape/Scrape 1/forecast_1.csv']
# Load data from CSV files into the table
    for csv_file in csv_files:
        with open(csv_file, 'r') as file:
            csv_data = csv.reader(file)
            next(csv_data)  # Skip the header row
            for row in csv_data:
                # Check if the row contains specific values to skip
                for row in csv_data:
                    insert_query = '''
                    INSERT INTO weather_data (time, temperature_2m, apparent_temperature, precipitation, weathercode, visibility, windspeed_10m)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    '''
                    # Extract the values from the row and convert data types if needed
                    time = row[0]
                    temperature_2m = float(row[1])
                    apparent_temperature = float(row[2])
                    precipitation = float(row[3])
                    weathercode = int(row[4])
                    visibility = float(row[5])
                    windspeed_10m = float(row[6])
                    
                    # Execute the insert query with the extracted values
                    cursor.execute(insert_query, (time, temperature_2m, apparent_temperature, precipitation, weathercode, visibility, windspeed_10m))
    # Commit the changes and close the connection
    conn.commit()
    cursor.close()
    conn.close()



venue_merged_weather_busyness

