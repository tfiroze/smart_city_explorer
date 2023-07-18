import json

input_file = "things_to_do_results.json"
output_file = "output.json"

with open(input_file, "r") as file:
    data = json.load(file)

venues = data["venues"]

venue_list = []
for venue in venues:
    if venue.get("forecast"):
        if venue["forecast"]:
            venue_info = {
                "venue_address": venue["venue_address"],
                "venue_id": venue["venue_id"],
                "venue_lat": venue["venue_lat"],
                "venue_lon": venue["venue_lon"],
                "venue_name": venue["venue_name"]
            }
            venue_list.append(venue_info)

output_data = {"venues": venue_list}

with open(output_file, "w") as file:
    json.dump(output_data, file, indent=4)

print("Data extracted and saved successfully.")
