import json

# Open the response file and load the data
with open('bestime_scrape/Scrape 1/restaurant_venueid_response.json', 'r') as file:
    response = json.load(file)

# Collect venue_ids where status is 'OK'
ok_venue_ids = [item['venue_info']['venue_id'] for item in response if item['status'] == 'OK']


with open('ok_venue_ids.json', 'w') as outfile:
    json.dump(ok_venue_ids, outfile)
# Print or process the ok_venue_ids
print(ok_venue_ids)

