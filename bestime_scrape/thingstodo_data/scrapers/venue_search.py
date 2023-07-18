import requests
import json

url = "https://besttime.app/api/v1/venues/search"

params = {
    'api_key_private': 'pri_9bb9e768871f4c1394938563420f5d62',
    'q': 'things to do in Manhattan New York City USA',
    'num': 200,
    'fast': False,
    'format': 'raw'
}

response = requests.request("POST", url, params=params)
print(response.json())

save_file = open("things_to_do_venuesearch.json", "w")
json.dump(response.json(), save_file, indent=6)
save_file.close()
