import joblib
import pandas as pd
import json

# Load the model
def load_model(model_path):
    model = joblib.load(model_path)
    return model

# Define function that takes in parameters, uses the model to make a prediction, and returns the output
def predict_with_model(model, parameters):
    # assuming parameters is a dictionary, we convert it to DataFrame as it's usually the input type for ML models
    df = pd.DataFrame([parameters])

    # using model to predict based on parameters
    prediction = model.predict(df)
    
    return prediction[0]

# Load parameters from JSON
def load_parameters(json_file):
    with open(json_file) as file:
        parameters = json.load(file)
    return parameters

# Ask for JSON file path
json_file = input("Enter the path to the JSON file: ")
parameters = load_parameters(json_file)

# Load the model based on venue_id from parameters
venue_id = parameters.pop('venue_id', None) # Remove the 'venue_id' from the parameters for model prediction
model_path = f'model_venue_busyness/bestime_{venue_id}.pkl'
model = load_model(model_path)

# Print prediction
print(predict_with_model(model, parameters))
