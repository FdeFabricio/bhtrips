import pandas as pd
import numpy as np


class Trip:
    def __init__(self, trip_id, start, first_stop):
        self.id = trip_id
        self.start = convert_timestamp(start)
        self.end = None
        self.stops = [first_stop]
    
    def __str__(self):
        return str(self.__class__) + ": " + str(self.__dict__)
    
    def add_stop(self, stop_id, timestamp):
        self.stops.append(stop_id)
        if not pd.isna(timestamp):
            self.end = convert_timestamp(timestamp)


def convert_timestamp(timestamp):
    if len(timestamp) != 8:
        raise ValueError("Invalid timestamp: '{}'".format(timestamp))
    hour, minute = timestamp[:2], timestamp[3:5]
    try:
        hour, minute = int(hour), int(minute)
    except ValueError:
        raise ValueError("Invalid timestamp: '{}'".format(timestamp))
    
    return minute + 60 * hour


def interpolate(start, end, count):
    return np.interp(range(count), [0, count-1], [start, end])
