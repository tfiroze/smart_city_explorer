import requests

# API endpoint
url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'

# API key (replace with your own)
api_key = 'AIzaSyBr65gL1NPBtgWkAkTD7bIypA3q6bqsQCY'

# Place information
input_text = 'Han Dynasty Upper West Side'
latitude = 40.7875
longitude = -73.9764
address = '1095 6th Ave New York, NY 10036 United States'

# Parameters for the API request
params = {
    'input': input_text,
    'inputtype': 'textquery',
    'locationbias': f'point:{latitude},{longitude}',
    'fields': 'rating,price_level',
    'key': api_key
}

# Send the API request
response = requests.get(url, params=params)
data = response.json()
print(data)
# Extract the place details from the response
if 'candidates' in data and len(data['candidates']) > 0:
    place = data['candidates'][0]
    rating = place.get('rating')
    price_level = place.get('price_level')
    
    print(f'Rating: {rating}')
    print(f'Price Level: {price_level}')
else:
    print('Place not found or no data available')
