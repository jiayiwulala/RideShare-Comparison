import googlemaps
import responses
import json
from googlemaps import convert

class GeoData:
    def geodata(self, client, address):
        parameters = {}
        parameters["address"] = address
        return client._get("/maps/api/geocode/json", parameters)["results"]

    def getGeoCodes(self, address):
        latlng = []
        key = 'AIzaSyDuz2qxmknVSmlLdfsvZIrOpc9LSElTAfo'
        client = googlemaps.Client(key)
        responses.add(responses.GET,
                      'https://maps.googleapis.com/maps/api/geocode/json',
                      body='{"status":"OK","results":[]}',
                      status=200,
                      content_type='application/json')
        results = self.geodata(client, address)
        geometry = results[0]["geometry"]
        latlng.append(geometry["location"]["lat"])
        latlng.append(geometry["location"]["lng"])
        return latlng