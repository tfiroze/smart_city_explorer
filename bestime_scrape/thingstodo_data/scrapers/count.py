import json

input_file = "output.json"

with open(input_file, "r") as file:
    data = json.load(file)

venues = data["venues"]

dictionary_count = len(venues)

print("Number of dictionaries in 'venues':", dictionary_count)
