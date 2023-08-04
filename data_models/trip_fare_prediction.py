import joblib
import pandas as pd
import json
import numpy as np
import sys



model = joblib.load('../data_models/lgbm_model_fare.joblib')

data_received = sys.argv[1]

parameters = json.loads(data_received)

trip_distance = parameters['trip_distance']
pickup_zone = parameters['pickup_zone']
dropoff_zone = parameters['dropoff_zone']
temperature = parameters['temp']
pickup_hour = parameters['pickup_hour']
pickup_weekday = parameters['pickup_weekday_num']
weather_description = parameters['weather_description']

input_data = np.array([[trip_distance, pickup_zone, dropoff_zone, temperature, pickup_hour, pickup_weekday, weather_description]])
    
prediction = model.predict(input_data)
print(prediction[0])