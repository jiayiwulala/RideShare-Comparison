import simplejson as json
from flask import jsonify, request
from flask import Blueprint


locationapi = Blueprint('locationapi', __name__)

g_mongo_handle = None
def set_mongo_handler(mongo_handle):
    global g_mongo_handle
    g_mongo_handle = mongo_handle

# Post location info
@locationapi.route('/locations', methods=['POST'])
def add_locations():
  global g_mongo_handle
  location = g_mongo_handle.db.locations
  email = request.json[0]['email'][1:-1]
  locationList = request.json[0]['locations']
  isFound = False
  locations = {}
  output = None

  for s in location.find({'email' : email}):
    isFound = True
    locations = s['locations']

  for index in range(len(locationList)-1):
    if index % 2 == 0:
      name = locationList[index]
      address = locationList[index+1]
      locations[name] = address

  if isFound:
    for s in location.find({'email' : email}):
      location.update({'_id':s['_id']},
        {'$set':{
        'locations':locations
        }},upsert=False,multi=False)
  else:
    location_id = location.insert({'email': email, 'locations': locations})

  for s in location.find({'email' : email}):
    output = {'id':str(s['_id']), 'email': s['email'],'locations' : s['locations']}

  return json.dumps(output)

# Get all locations with email
@locationapi.route('/locations/<email>', methods=['GET'])
def get_all_locations(email):
    global g_mongo_handle
    location = g_mongo_handle.db.locations
    output = []
    for s in location.find({'email' : email}):
        output.append({'id':str(s['_id']), 'email' : s['email'], 'locations':s['locations']})
        return json.dumps(output)
    return json.dumps(output)
'''
@locationapi.route('/locations/<email>', methods=['PUT'])
def modify_location(email):
    global g_mongo_handle
    location = g_mongo_handle.db.locations
    old_name = request.json['old_name']
    new_name = request.json['new_name']
    found = location.find_one({'$and':[{'email' : email}, {'name':old_name}]})
    if found:
      location.update({'$and':[{'email' : email}, {'name':old_name}]}, {"$set":{"name": new_name}})
      output = "Update Success"
    else:
      output = "Error: No such saved location name found!"
    return jsonify({'result' : output})
'''
@locationapi.route('/locations/<email>', methods=['DELETE'])
def delete_location():
  global g_mongo_handle
  location = g_mongo_handle.db.locations
  name = request.json[0]['name']
  mail = request.json[0]['email'][1:-1]
  print name
  output = None

  for s in location.find({'email' : mail}):
    locations = s['locations']
    loc = locations.pop(name,None)
    if loc is None:
      output = "No entry found"
    else:
      location.update({'_id':s['_id']},
        {'$set':{'locations':locations}},upsert=False,multi=False)
      output = "Success Delete "
      return jsonify({'result': output})
  return jsonify({'result' : output})
