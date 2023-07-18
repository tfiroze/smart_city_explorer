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

# Load the JSON data
    with open('./bestime_scrape/Scrape 1/shopping_venueid_response.json') as file:
        data = json.load(file)

    # Get the list of venue IDs from the table of IDs in the database
    cursor = conn.cursor()
    cursor.execute("SELECT original_ven_id FROM venue_static")
    ids = cursor.fetchall()

    # Create the venue_timings table
    # cursor.execute("CREATE TABLE IF NOT EXISTS venue_timings ("
    #             "id INT PRIMARY KEY AUTO_INCREMENT,"
    #             "venue_id VARCHAR(255),"
    #             "day INT,"
    #             "opening_time INT,"
    #             "closing_time INT)")

    # Iterate over the venues in the JSON data
    
    for venue in data:
        status = venue.get("status")
        if status != "OK":
            continue
        if not venue["venue_info"]:
            continue  # Skip processing if venue_info is missing

        venue_id = venue["venue_info"]["venue_id"]
        if not venue_id:
            continue  # Skip processing if venue_id is missing
        # print(venue)
        

        # Check if the venue ID is in the list of IDs
        if venue_id in [id[0] for id in ids]:
            # Iterate over the analysis data for each day
            for analysis in venue["analysis"]:
                day = analysis["day_info"]["day_int"]
                opening_time = analysis["day_info"]["venue_open"]
                closing_time = analysis["day_info"]["venue_closed"]
                if opening_time == "Closed":
                    opening_time = -1
                if closing_time == "Closed":
                    closing_time = -1
                

                # Insert the venue timings into the venue_timings table
                insert_query = "INSERT INTO venue_timings (venue_id, day, opening_time, closing_time) VALUES (%s, %s, %s, %s)"
                values = (venue_id, day, opening_time, closing_time)
                cursor.execute(insert_query, values)

    # Commit the changes to the database
    conn.commit()

    # Close the cursor and the database connection
    cursor.close()
    conn.close()
