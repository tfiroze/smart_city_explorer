import json

# turn json to dictionary
with open('./shopping_data/shopping_results.json', "r") as f:
    data = json.load(f)

venues = []

for venue in data:
    venue_detail = {
        "venue_address" : venue["venue_address"],
        "venue_id" : venue["venue_id"],
        "venue_iat" : venue["venue_lat"],
        "venue_lon" : venue["venue_lon"],
        "venue_name" : venue["venue_name"]
    }
    venues.append(venue_detail)


venues_detail = {"venues" : venues}

with open("shopping_details.json", "w") as w:
    json.dump(venues_detail, w, indent=6)