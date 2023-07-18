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

    select_sql = "SELECT DISTINCT venue_id, venue_name, venue_address, venue_type FROM venue_dynamic_data"

# Execute the query and load results into a DataFrame
    distinct_df = pd.read_sql_query(select_sql, conn)


    csv_file_path = './distinct_venue.csv'
    venue_csv_df = pd.read_csv(csv_file_path)

    # Update the "venue_static" table
    for index, row in venue_csv_df.iterrows():
        venue_name = row['venue_name']
        venue_address = row['venue_address']
        venue_type = row['venue_type']
        venue_id = row['venue_id']

        update_sql = "UPDATE venue_static SET name=%s, address=%s, venue_type=%s WHERE original_ven_id=%s"
        cursor.execute(update_sql, (venue_name, venue_address, venue_type, venue_id))
    # Commit the changes to the database
    conn.commit()

    # Close the cursor and the database connection
    cursor.close()
    conn.close()



