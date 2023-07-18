import requests
import json

url = "https://besttime.app/api/v1/venues/progress?job_id=65422a6d-1e17-4810-874f-8f7744e29ba0&collection_id=col_59b0866210444884b63638ffba8e4ab9&format=raw"

response = requests.get(url)

save_file = open("things_to_do_results.json", "w")
json.dump(response.json(), save_file, indent=6)
save_file.close()
