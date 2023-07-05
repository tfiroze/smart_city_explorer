import json

def extract_venue_ids(input_file, output_file):
    with open(input_file, 'r') as f:
        data = json.load(f)

    venue_ids = []
    venues = data.get('venues')  # Access the nested list of venues
    if venues:
        for item in venues:
            venue_id = item.get('venue_id')
            if venue_id:
                venue_ids.append(venue_id)

    with open(output_file, 'w') as f:
        json.dump(venue_ids, f)

# Usage
input_file = 'restaurant_output.json'  # Replace with the path to your input JSON file
output_file = 'restaurant_venueid.json'  # Replace with the desired path for the output JSON file

extract_venue_ids(input_file, output_file)
