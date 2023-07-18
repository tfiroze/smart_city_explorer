import requests
import json

url = "https://besttime.app/api/v1/forecasts"

with open("thingstodo.json", "r") as file:
    data = json.load(file)

api_key_private = "pri_63646948d949435098d9a58a14ff7c8c"

results = []  # List to store the forecast results

for venue in data["venues"]:
    venue_id = venue["venue_id"]
    params = {
        "api_key_private": api_key_private,
        "venue_id": venue_id
    }

    response = requests.post(url, params=params)
    forecast_data = response.json()

    results.append(forecast_data)  # Add the forecast data to the results list

# Save the results to the JSON file
with open("forecast_results.json", "w") as save_file:
    json.dump(results, save_file, indent=4)

print("Data saved successfully.")
