import requests

url = "https://besttime.app/api/v1/venues/search"

params = {
    'api_key_private': 'pri_4ef5c438bdb74dfd99e16300ddea6073',
    'q': 'best restaurants in manhattan new york city',
    'num': 200,
    'fast': False,
    'format': 'raw'
}

response = requests.request("POST", url, params=params)
print(response.json())
