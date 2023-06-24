import json

# Read the JSON file
with open('venues.json') as f:
    data = json.load(f)

# Extract venue IDs
venue_ids = [venue['id'] for venue in data['venues']]