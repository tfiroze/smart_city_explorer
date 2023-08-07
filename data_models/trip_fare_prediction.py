import joblib
import pandas as pd
import json
import numpy as np

# Load the model
def load_model(model_path):
    model = joblib.load(model_path)
    return model

model = load_model('data_models/lgbm_model_fare.joblib')


# Load parameters from JSON
def load_parameters(json_file):
    with open(json_file) as file:
        parameters = json.load(file)

    trip_distance = parameters['trip_distance']
    pickup_zone = parameters['pickup_zone']
    dropoff_zone = parameters['dropoff_zone']
    temperature = parameters['temp']
    pickup_hour = parameters['pickup_hour']
    pickup_weekday = parameters['pickup_weekday_num']
    weather_description = parameters['weather_description']

    input_data = np.array([[trip_distance, pickup_zone, dropoff_zone, temperature, pickup_hour, pickup_weekday, weather_description]])
    
    return input_data

# Ask for JSON file path
json_file = "data_models/input_data/fare_features.json"
parameters = load_parameters(json_file)

# Print prediction
# print(predict_with_model(lgbm_model_fare, parameters))
prediction = model.predict(parameters)
print(prediction[0])