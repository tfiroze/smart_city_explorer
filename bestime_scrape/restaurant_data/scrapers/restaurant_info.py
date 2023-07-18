import requests
import json

url = "https://besttime.app/api/v1/venues/progress?job_id=fdb9562b-1299-49b5-874d-60d3cf8cc1d3&collection_id=col_b5033b84c88844ec85b9f1f1933145cc&format=raw"

response = requests.get(url)

save_file = open("restaurant_results.json", "w")
json.dump(response.json(), save_file, indent=6)
save_file.close()
