# import joblib
# import pandas as pd
# import json

# # Load the model
# def load_model(model_path):
#     model = joblib.load(model_path)
#     return model

# lgbm_model_fare = load_model('data_models\lgbm_model_duration.joblib')

# # Define function that takes in parameters, uses the model to make a prediction, and returns the output
# def predict_with_model(model, parameters):
#     # assuming parameters is a dictionary, we convert it to DataFrame as it's usually the input type for ML models
#     df = pd.DataFrame([parameters])

#     # using model to predict based on parameters
#     prediction = model.predict(df)
    
#     return prediction[0]

# # Load parameters from JSON
# def load_parameters(json_file):
#     with open(json_file) as file:
#         parameters = json.load(file)
#     return parameters

# # Ask for JSON file path
# json_file = input("Enter the path to the JSON file: ")
# parameters = load_parameters(json_file)

# # Print prediction
# print(predict_with_model(lgbm_model_fare, parameters))

import joblib
import pandas as pd
import json
import numpy as np

# Load the model
def load_model(model_path):
    model = joblib.load(model_path)
    return model

model = load_model('lgbm_model_duration.joblib')


# Load parameters from JSON
def load_parameters(json_file):
    with open(json_file) as file:
        parameters = json.load(file)

    trip_distance = parameters['trip_distance']
    pickup_zone = parameters['pickup_zone']
    dropoff_zone = parameters['dropoff_zone']
    temperature = parameters['temp']
    rain = parameters['rain_3h']
    snow = parameters['snow_3h']
    pickup_hour = parameters['pickup_hour']
    pickup_weekday = parameters['pickup_weekday_num']
    weather_description = parameters['weather_description']

    input_data = np.array([[trip_distance, pickup_zone, dropoff_zone, temperature, rain, snow, pickup_hour, pickup_weekday, weather_description]])
    
    return input_data

# Ask for JSON file path
json_file = "distance_features.json"
parameters = load_parameters(json_file)

# Print prediction
# print(predict_with_model(lgbm_model_fare, parameters))
prediction = model.predict(parameters)
print(prediction[0])