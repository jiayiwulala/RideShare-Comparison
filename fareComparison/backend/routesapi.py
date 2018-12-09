from flask import request
from flask import Blueprint
import simplejson as json

routesapi = Blueprint('routesapi', __name__)

g_mongo_handle = None
def set_mongo_handle(mongo_handle):
    global g_mongo_handle
    g_mongo_handle = mongo_handle

@routesapi.route('/trips', methods=['POST'])
def add_trip():
  global g_mongo_handle
  trip = g_mongo_handle.db.trips
  startlocation = request.json['startlocation']
  endlocation = request.json['endlocation']
  vialocation = request.json['vialocation']


  best_route = vialocation
  providers = [
        {
            "name" : "Uber",
            "total_costs_by_cheapest_car_type" : 132,
            "currency_code": "USD",
            "total_duration" : 223,
            "duration_unit": "minute",
            "total_distance" : 11,
            "distance_unit": "mile"
        },
        {
            "name" : "Lyft",
            "total_costs_by_cheapest_car_type" : 92,
            "currency_code": "USD",
            "total_duration" : 209,
            "duration_unit": "minute",
            "total_distance" : 21.2,
            "distance_unit": "mile"
        }
    ]

  trip_id = trip.insert({'startlocation': startlocation, 'bestroute':best_route,
  'providers':providers, 'endlocation': endlocation})

  new_trip = trip.find_one({'_id': trip_id })

  output = {'id':str(trip_id), 'start' : new_trip['startlocation'], 'bestroute':new_trip['bestroute'],
  'providers':new_trip['providers'], 'end': new_trip['endlocation']}
  return json.dumps(output)
