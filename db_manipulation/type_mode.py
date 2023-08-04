import json
import pymysql
from sshtunnel import SSHTunnelForwarder
from datetime import datetime, timedelta

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
    venue_mapping = {
        'PARK': 'Park',
        'TOURIST_DESTINATION': 'Tourist Destination',
        'MUSEUM': 'Cultural Heritage',
        'HISTORICAL': 'Cultural Heritage',
        'SCENIC_POINT': 'Scenic Landmarks',
        'BRIDGE': 'Scenic Landmarks',
        'NATURE_RESERVE': 'Nature Attractions',
        'ZOO': 'Nature Attractions',
        'BOTANICAL_GARDEN': 'Nature Attractions',
        'ARTS': 'Art',
        'DESSERT': 'Art',
        'CHURCH': 'Religious',
        'SYNAGOGUE': 'Religious',
        'VISITOR_CENTER': 'Tourist Destination',
        'LIBRARY': 'Library',
        'SHOPPING_CENTER': 'Shopping Center',
        'APPAREL': 'Fashion Convenience',
        'OTHER': 'Tourist Destination',
        'SHOPPING': 'Fashion Convenience',
        'CONVENIENCE_STORE': 'Neighborhood Market',
        'SUPERMARKET': 'Neighborhood Market',
        'GROCERY': 'Neighborhood Market',
        'MARKET': 'Neighborhood Market',
        'GIFTS': 'Gifts & Souvenirs',
        'SOUVENIR_SHOP': 'Gifts & Souvenirs'
    }
    # Read JSON data from file
    for venue_type, type_mod in venue_mapping.items():
        sql_query = f"UPDATE venue_static SET type_mod = '{type_mod}' WHERE venue_type = '{venue_type}'"
        cursor.execute(sql_query)

    # Close the MySQL connection
    conn.commit()
    cursor.close()
    conn.close()
