#!/usr/bin/env python
# coding: utf-8

# load model

# In[1]:


import pandas as pd
import joblib
import xgboost as xgb
import sys

params = sys.argv[1:]

# turn the value from string to float
substrings = params[0].split(',')
pickup_hour = [float(hour) for hour in substrings]
substrings = params[1].split(',')
PULocationID = [float(location_id) for location_id in substrings]
substrings = params[2].split(',')
DOLocationID = [float(location_id) for location_id in substrings]

# Load the models from a file
fare_model = joblib.load('services/fare_model/best_fare_model.pkl')
distance_model = xgb.Booster()
distance_model.load_model('services/fare_model/distance_model.model')

# data
new_data = pd.DataFrame({
    'pickup_hour': pickup_hour,
    'PULocationID': PULocationID,
    'DOLocationID': DOLocationID
})

# Make predictions
fare_predictions = fare_model.predict(new_data)
distance_predictions = distance_model.predict(xgb.DMatrix(new_data))

# Print predictions
print('Fare predictions:', fare_predictions)
print('Distance predictions:', distance_predictions)


