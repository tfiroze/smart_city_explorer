I have a json file which is in this format.
{
    "status": "OK",
    "epoch_analysis": "1688671302",
    "venue_info": {
      "venue_id": "ven_303749644b67576e694b55526b6f7759685f4a445761324a496843",
      "venue_name": "Strawberry Fields",
      "venue_address": "Q2GG+83 New York, NY 10019 United States",
      "venue_address_list": [
        "Q2GG+83",
        "New York, NY 10019",
        "United States"
      ],
      "venue_timezone": "America/New_York",
      "venue_dwell_time_min": 0,
      "venue_dwell_time_max": 45,
      "venue_dwell_time_avg": 22,
      "venue_type": "TOURIST_DESTINATION",
      "venue_types": [
        "tourist_attraction",
        "historical_landmark",
        "scenic_spot"
      ],
      "venue_lat": 40.7757544,
      "venue_lon": -73.97520759999999
    },
    "analysis": [
      {
        "day_info": {
          "day_int": 0,
          "day_text": "Monday",
          "venue_open": 6,
          "venue_closed": 1,
          "day_rank_mean": 4,
          "day_rank_max": 4,
          "day_mean": 24,
          "day_max": 53
        },
      },
      {
        "day_info": {
          "day_int": 1,
          "day_text": "Tuesday",
          "venue_open": 6,
          "venue_closed": 1,
          "day_rank_mean": 7,
          "day_rank_max": 6,
          "day_mean": 19,
          "day_max": 42
        },
      },
      {
        "day_info": {
          "day_int": 2,
          "day_text": "Wednesday",
          "venue_open": 6,
          "venue_closed": 1,
          "day_rank_mean": 7,
          "day_rank_max": 7,
          "day_mean": 19,
          "day_max": 39
        },
      },
      {
        "day_info": {
          "day_int": 3,
          "day_text": "Thursday",
          "venue_open": 6,
          "venue_closed": 1,
          "day_rank_mean": 5,
          "day_rank_max": 5,
          "day_mean": 22,
          "day_max": 49
        },
      },
      {
        "day_info": {
          "day_int": 4,
          "day_text": "Friday",
          "venue_open": 6,
          "venue_closed": 1,
          "day_rank_mean": 3,
          "day_rank_max": 3,
          "day_mean": 27,
          "day_max": 60
        },
      },
      {
        "day_info": {
          "day_int": 5,
          "day_text": "Saturday",
          "venue_open": 6,
          "venue_closed": 1,
          "day_rank_mean": 2,
          "day_rank_max": 2,
          "day_mean": 35,
          "day_max": 83
        },
      },
      {
        "day_info": {
          "day_int": 6,
          "day_text": "Sunday",
          "venue_open": 6,
          "venue_closed": 1,
          "day_rank_mean": 1,
          "day_rank_max": 1,
          "day_mean": 43,
          "day_max": 100
        }
      }
    ],
    "api_key_private": "pri_6c1d4e452d0c4ddf9549c622ec99804c"
  },
I also have a table with IDs
I want to create a new table venue timings. 
The venue timings should only contain venues from json file if the ID is in the table of IDS.
If venue is closed put as -1.
I want python code and table is Mysql