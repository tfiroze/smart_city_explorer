import json
import requests

def make_api_call(venue_id):
    url = "https://besttime.app/api/v1/forecasts"

    params = {
        'api_key_private': 'pri_d6e59a044de349eeb929f0b460fc3370',
        'venue_id': venue_id,
    }

    response = requests.request("POST", url, params=params)
    data = response.json()

    return data

def process_files(input_files):
    for input_file in input_files:
        with open("bestime_scrape/" + input_file, 'r') as f:
            venue_ids = json.load(f)

        responses = []
        for venue_id in venue_ids:
            response = make_api_call(venue_id)
            responses.append(response)

        output_file = input_file.replace('.json', '_response4.json')

        with open("bestime_scrape/" + output_file, 'w') as f:
            json.dump(responses, f)



input_files = ['shopping_venueid.json']  # Replace with the list of input JSON files

process_files(input_files)
print("Scraping completed!")