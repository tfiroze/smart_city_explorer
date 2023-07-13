import json
import pymysql
from sshtunnel import SSHTunnelForwarder
from datetime import datetime, timedelta
import csv
import hashlib
import random

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
    cursor.execute("SELECT DISTINCT venue_id FROM venue_merged")
    unique_venue_ids = cursor.fetchall()

    # Create the dictionary table
    cursor.execute("CREATE TABLE venue_static (original_ven_id VARCHAR(100), hash_ven_id INT)")

    # Create a set to keep track of generated IDs
    generated_ids = set()

    # Apply hashing and insert into the dictionary table
    for venue_id in unique_venue_ids:
        original_id = venue_id[0]
        # Generate a unique shorter ID within the specified range
        while True:
            hash_ven_id = random.randint(1000, 99999999)
            if hash_ven_id not in generated_ids:
                generated_ids.add(hash_ven_id)
                break
        cursor.execute("INSERT INTO venue_static (original_ven_id, hash_ven_id) VALUES (%s, %s)", (original_id, hash_ven_id))

    # Commit the changes to the database
    conn.commit()

    # Close the cursor and the database connection
    cursor.close()
    conn.close()



