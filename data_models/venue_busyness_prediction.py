import joblib
import pandas as pd
import json
import numpy as np
import sys


data_received = sys.argv[1]

data = json.loads(data_received)

venue_id = data['hash_ven_id']
hour = int(data['hour'])
weekday = data['weekday']
temperature_2m = data['temperature_2m']
apparent_temperature = data['apparent_temperature']
precipitation = data['precipitation']
weathercode = data['weathercode']
visibility = data['visibility']
windspeed_10m = data['windspeed_10m']

input_data = np.array([[hour, weekday, temperature_2m, apparent_temperature, precipitation, weathercode, visibility, windspeed_10m]])

model_path = f'../data_models/model_venue_busyness/bestime_{venue_id}.pkl'
model = joblib.load(model_path)

prediction = model.predict(input_data)
print(prediction[0])