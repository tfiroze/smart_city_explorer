# Separate search because if search directly for shopping center in manhanttan, some of the results are not in the Manhattan area
# So choose to split the search into several parts and merge the results in the later files

import requests
import json

url = "https://besttime.app/api/v1/venues/search"

shopping_params = {
    'api_key_private': 'pri_b8954c5236a14c90a0c4611801467a85',
    'q': 'shopping in Manhattan New York City USA',
    'num': 40,
    'fast': False,
    'format': 'raw'
}

market_params = {
    'api_key_private': 'pri_b8954c5236a14c90a0c4611801467a85',
    'q': 'market in Manhattan New York City USA',
    'num': 40,
    'fast': False,
    'format': 'raw'
}

apparel_params = {
    'api_key_private': 'pri_b8954c5236a14c90a0c4611801467a85',
    'q': 'apparel in Manhattan New York City USA',
    'num': 40,
    'fast': False,
    'format': 'raw'
}

gifts_params = {
    'api_key_private': 'pri_b8954c5236a14c90a0c4611801467a85',
    'q': 'gifts in Manhattan New York City USA',
    'num': 40,
    'fast': False,
    'format': 'raw'
}

res_shopping = requests.request("POST", url, params=shopping_params)
res_market = requests.request("POST", url, params=market_params)
res_apparel = requests.request("POST", url, params=apparel_params)
res_gifts = requests.request("POST", url, params=gifts_params) 

# append new data to json file
with open("shopping_search.json", "a") as f:
    f.write(json.dumps(res_shopping.json()))
    f.write('\n')
    f.write(json.dumps(res_market.json()))
    f.write('\n')
    f.write(json.dumps(res_apparel.json()))
    f.write('\n')
    f.write(json.dumps(res_gifts.json()))

f.close()
