import googlemaps
import responses
import json
from googlemaps import convert

class MapRoute:
    def directions(self, client, origin, destination,waypoints):
        params = {
            "origin": convert.latlng(origin),
            "destination": convert.latlng(destination)
        }
        waypoints = convert.location_list(waypoints)
        optimize_waypoints = True
        if optimize_waypoints:
            waypoints = "optimize:true|" + waypoints
        params["waypoints"] = waypoints
        return client._get("/maps/api/directions/json", params)["routes"][0]["waypoint_order"]

    def getWaypoints(self, start, destination, waypoint):
        key = 'AIzaSyDuz2qxmknVSmlLdfsvZIrOpc9LSElTAfo'
        client = googlemaps.Client(key)
        responses.add(responses.GET,
                        'https://maps.googleapis.com/maps/api/directions/json',
                        body='{"status":"OK","routes":[]}',
                        status=200,
                        content_type='application/json')
        routes = self.directions(client, start, destination, waypoints=waypoint)
        locations=[]
        locations.append(start)
        for place in routes:
            locations.append(waypoint[place])
        locations.append(destination)
        return locations

