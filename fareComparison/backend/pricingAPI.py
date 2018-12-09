# coding=utf-8
from flask import Blueprint
from flask import request
from pricing import PriceDetails

pricingAPI = Blueprint('pricingAPI', __name__)

@pricingAPI.route('/fetchPrices', methods=['POST'])
def fetchPriceDetails():
    
    request_data = request.get_json(force=True)
    origin = request_data[0]["origin"]
    destination = request_data[0]["destination"]
    waypoints = request_data[0]["waypoints"]
    priceDetails = PriceDetails()
    return priceDetails.getPriceDetails(origin, destination, waypoints)