import joblib
import pandas as pd
import json

# Load the model
def load_model(model_path):
    model = joblib.load(model_path)
    return model

lgbm_model_fare = load_model('lgbm_model_fare.joblib')

# Define function that takes in parameters, uses the model to make a prediction, and returns the output
def predict_with_model(model, parameters):
    # assuming parameters is a dictionary, we convert it to DataFrame as it's usually the input type for ML models
    df = pd.DataFrame([parameters])

    # using model to predict based on parameters
    prediction = model.predict(df)
    
    return prediction

# Load parameters from JSON
def load_parameters(json_file):
    with open(json_file) as file:
        parameters = json.load(file)
    return parameters

# Ask for JSON file path
json_file = 'test.json'
parameters = load_parameters(json_file)

# Print prediction
print(predict_with_model(lgbm_model_fare, parameters))
