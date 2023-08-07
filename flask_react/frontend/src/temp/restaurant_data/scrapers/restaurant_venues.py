import json

input_file = "restaurant_results.json"
output_file = "restaurant_output.json"

with open(input_file, "r") as file:
    data = json.load(file)

restaurants = data["venues"]

restaurant_list = []
for restaurant in restaurants:
    if restaurant.get("forecast"):
        if restaurant["forecast"]:
            restaurant_info = {
                "venue_address": restaurant["venue_address"],
                "venue_id": restaurant["venue_id"],
                "venue_lat": restaurant["venue_lat"],
                "venue_lon": restaurant["venue_lon"],
                "venue_name": restaurant["venue_name"]
            }
            restaurant_list.append(restaurant_info)

output_data = {"venues": restaurant_list}

with open(output_file, "w") as file:
    json.dump(output_data, file, indent=4)

print("Data extracted and saved successfully.")
