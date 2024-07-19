import joblib
import pandas as pd
import json
import numpy as np
import sys
import os


current_file_path = os.path.abspath(__file__)
current_directory = os.path.dirname(current_file_path)

# Construct the path to the joblib file
joblib_file_path = os.path.join(current_directory, 'lgbm_model_fare.joblib')

# Load the model
model = joblib.load(joblib_file_path)

data_received = sys.argv[1]

try:
    parameters = json.loads(data_received)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
    print(f"Received data: {data_received}")
    sys.exit(1)

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