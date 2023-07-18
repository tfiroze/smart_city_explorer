import json
import pymysql
from sshtunnel import SSHTunnelForwarder
from datetime import datetime, timedelta
import csv
import hashlib
import random
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
    cursor = conn.cursor()
    # Read JSON data from file
    alter_sql = "ALTER TABLE venue_static ADD COLUMN latitude FLOAT, ADD COLUMN longitude FLOAT, ADD COLUMN zone_id INT"
    cursor.execute(alter_sql)

    csv_file_path = './venues_in_zones.csv'
    venue_csv_df = pd.read_csv(csv_file_path)

    # Update the "venue_static" table
    for index, row in venue_csv_df.iterrows():
        venue_id = row['venue_id']
        latitude = row['venue_lat']
        longitude = row['venue_lon']
        zone_id = row['zone_id']

        sql = f"UPDATE venue_static SET latitude='{latitude}', longitude='{longitude}', zone_id='{zone_id}' WHERE original_ven_id='{venue_id}'"
        cursor.execute(sql)
    # Commit the changes to the database
    conn.commit()

    # Close the cursor and the database connection
    cursor.close()
    conn.close()



