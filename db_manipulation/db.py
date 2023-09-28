import json
import pymysql
from sshtunnel import SSHTunnelForwarder
from datetime import datetime, timedelta

ssh_host = '137.43.49.79'
ssh_port = 22
ssh_username = 'student'


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
    with open('bestime_scrape/Scrape 5/shopping_venueid_response5.json', 'r') as json_file:
        venues_data = json.load(json_file)

        # Iterate through each venue in the JSON data
        for venue_data in venues_data:
            venue_info = venue_data.get("venue_info")
            status = venue_data.get("status")
            if status != "OK":
                continue
            if not venue_info:
                continue  # Skip processing if venue_info is missing

            venue_id = venue_info.get("venue_id")
            if not venue_id:
                continue  # Skip processing if venue_id is missing

            venue_address = venue_info.get("venue_address")
            venue_type = venue_info.get("venue_type")
            venue_name = venue_info.get("venue_name")

            time = datetime(2023, 7, 17, 5, 0)
            analysis_info = venue_data.get("analysis")

            # Use context management for cursor
            with conn.cursor() as cursor:
                for daydata in analysis_info:
                    day_int = daydata["day_info"]["day_int"]
                    day_raw = daydata["day_raw"]

                    for i in range(0, len(day_raw)):
                        time = time + timedelta(hours=1)
                        print(time, day_raw[i])

                        # Insert data into the table
                        insert_query = "INSERT INTO venue_dynamic_data (venue_id, venue_address, venue_type, venue_name, time, busyness) VALUES (%s, %s, %s, %s, %s, %s)"
                        insert_values = (venue_id, venue_address, venue_type, venue_name, time, day_raw[i])  # Add the rest of the values here
                        try:
                            cursor.execute(insert_query, insert_values)
                        except pymysql.err.IntegrityError as e:  # Catch the IntegrityError
                            if e.args[0] == 1062:  # If error code is 1062 (Duplicate entry)
                                print("Duplicate entry found. Skipping this record.")
                                continue
                            else:
                                raise

                # Commit after all insertions are done
                conn.commit()
                print(f"Data for venue_id {venue_id} inserted successfully!")

    # Close the MySQL connection
    conn.close()
