import requests
import json
url = "https://besttime.app/api/v1/forecasts"

params = {
    'api_key_private': '',
    'venue_id': ''
}

response = requests.request("POST", url, params=params)
print(response.json())

save_file = open("restaurant_data", "w")
json.dump(response.json(), save_file, indent=6)
save_file.close()
