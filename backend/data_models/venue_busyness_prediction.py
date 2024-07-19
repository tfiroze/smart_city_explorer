
import pandas as pd
import json
import numpy as np
import sys
import os
import traceback
import pickle
import xgboost


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

#venue_id =3031
# model_path = f'data_models\model_venue_busyness\bestime_{venue_id}.pkl'
model_directory = '../data_models'
model_subdirectory = 'model_venue_busyness'
model_filename = f'bestime_{venue_id}.pkl'

model_path = os.path.join(model_directory, model_subdirectory, model_filename)
# model_path = 'c:/Users/tfiro/Desktop/Computer Science/smart_city_explorer/' + model_path
# import pdb; pdb.set_trace()
if os.path.exists(model_path):
    # If the file exists, attempt to load it
    try:
        model = pickle.load(open(model_path, 'rb'))
    except Exception as e:
        print("Error encountered:", str(e))
        print("Model path:", model_path)
        import traceback
        traceback.print_exc()
else:
    print(f"Model file {model_path} does not exist.")

prediction = model.predict(input_data)
print(prediction[0])

