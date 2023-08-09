import requests
import json

shopping_url = "https://besttime.app/api/v1/venues/progress?job_id=a51e73de-0ffc-4da9-8743-36012bb98dde&collection_id=col_1f9b9dfde3c44e87a3a0aca34940a486&format=raw"

market_url = "https://besttime.app/api/v1/venues/progress?job_id=0c0a5f77-d865-4216-925c-10edcddcba6b&collection_id=col_993b816f10fa4a8381d1043ba6b5da71&format=raw"

apparel_url = "https://besttime.app/api/v1/venues/progress?job_id=c90983a4-54ba-4966-b0a8-fee3cd329241&collection_id=col_c9a7126b1b964316b24f0db01de1e757&format=raw"

gifts_url = "https://besttime.app/api/v1/venues/progress?job_id=11ca7094-0bf8-4052-b55e-dbbf5cd6fe2d&collection_id=col_590426d321b64afeb50a6b13830d0ddb&format=raw"

res_shopping = requests.get(shopping_url)
res_market = requests.get(market_url)
res_apparel = requests.get(apparel_url)
res_gifts = requests.get(gifts_url)

f = open("shopping_results.json", "a")

json.dump(res_shopping.json()["venues"],f, indent=6)
json.dump(res_market.json()["venues"],f, indent=6)
json.dump(res_apparel.json()["venues"],f, indent=6)
json.dump(res_gifts.json()["venues"],f, indent=6)

f.close()