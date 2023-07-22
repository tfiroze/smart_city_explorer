import requests
import json

url = "https://besttime.app/api/v1/forecasts"

with open("restaurant_output.json", "r") as file:
    data = json.load(file)

api_key_private = "pri_1755de7c68d746cfbedfcea7603b7088"

for venue in data["venues"]:
    venue_id = venue["venue_id"]
    params = {
        "api_key_private": api_key_private,
        "venue_id": venue_id
    }

    response = requests.post(url, params=params)

    with open("restaurant_forecast_results.json", "a") as save_file:
        json.dump(response.json(), save_file, indent=6)
        save_file.write("\n")

print("Data saved successfully.")
