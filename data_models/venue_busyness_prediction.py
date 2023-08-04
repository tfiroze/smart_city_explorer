import joblib
import pandas as pd
import json
import numpy as np


data = {
    "hour": 11,
    "weekday": 0,
    "temperature_2m": 23.8,
    "apparent_temperature": 24.9,
    "precipitation":0,
    "weathercode": 3,
    "visibility": 12000,
    "windspeed_10m": 6.0
}

hour = data['hour']
weekday = data['weekday']
temperature_2m = data['temperature_2m']
apparent_temperature = data['apparent_temperature']
precipitation = data['precipitation']
weathercode = data['weathercode']
visibility = data['visibility']
windspeed_10m = data['windspeed_10m']

input_data = np.array([[hour, weekday, temperature_2m, apparent_temperature, precipitation, weathercode, visibility, windspeed_10m]])

# 3031 => {venue_id}
model_path = f'data_models/model_venue_busyness/bestime_3031.pkl'
model = joblib.load(model_path)

prediction = model.predict(input_data)
print(prediction[0])