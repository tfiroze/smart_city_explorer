import requests
import json

url = "https://besttime.app/api/v1/venues/search"

params = {
    'api_key_private': 'pri_16f5b9e8cf9945f98c11c3ec479e7e6c',
    'q': 'restaurants in Manhattan New York City USA',
    'num': 200,
    'fast': False,
    'format': 'raw'
}

response = requests.request("POST", url, params=params)
print(response.json())

save_file = open("restaurant_search.json", "w")
json.dump(response.json(), save_file, indent=6)
save_file.close()
