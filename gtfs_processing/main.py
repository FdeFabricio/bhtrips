import pandas as pd
import numpy as np
import json
import utils

WEEKDAY, SATURDAY, SUNDAY = 8, 7, 1

df_stops = pd.read_csv("gtfs/stops.txt", dtype={"stop_id": object}).set_index("stop_id")
df_stops = df_stops[["stop_lon", "stop_lat"]].rename(columns={"stop_lon": "longitude", "stop_lat": "latitude"})
df_trips = pd.read_csv("gtfs/trips.txt", dtype={"trip_id": object}).set_index("trip_id")[["service_id"]]
df_stop_times = pd.read_csv("gtfs/stop_times.txt", dtype={"trip_id": object, "stop_id": object})

trips = {}
for index, row in df_stop_times.iterrows():
    if row["trip_id"] not in trips:
        trips[row["trip_id"]] = utils.Trip(row["trip_id"], row["arrival_time"], row["stop_id"])
    else:
        trips[row["trip_id"]].add_stop(row["stop_id"], row["arrival_time"])

output_data = {WEEKDAY: [], SATURDAY: [], SUNDAY: []}
for trip_id, trip in trips.items():
    if pd.isna(trip.end):
        continue

    timestamps = utils.interpolate(trip.start, trip.end, len(trip.stops))
    segments = map(lambda (i, stop_id): np.append(
        df_stops.loc[[stop_id], ["longitude", "latitude"]].values[0], round(timestamps[i], 2)
    ).tolist(), enumerate(trip.stops))
    
    day = df_trips.loc[[trip_id], ["service_id"]].values[0][0]
    output_data[day].append({
        "vendor": 0,
        "segments": segments
    })

with open("../data/trips_weekday.json", "w") as fp:
    json.dump(output_data[WEEKDAY], fp)

with open("../data/trips_saturday.json", "w") as fp:
    json.dump(output_data[SATURDAY], fp)

with open("../data/trips_sunday.json", "w") as fp:
    json.dump(output_data[SUNDAY], fp)
