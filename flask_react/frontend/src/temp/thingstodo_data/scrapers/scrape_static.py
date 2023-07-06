import json

input_file = "forecast_results.json"
output_file = "output.json"
static_data = []

with open(input_file, "r") as file:
    data = file.read()
    objects = json.loads(data)
print(objects[0])