#!/usr/bin/env bash
# coding=utf-8
from flask import Blueprint
from flask import request
from pricing import PriceDetails

timingAPI = Blueprint('timingAPI', __name__)


@timingAPI.route('/fetchTimes', methods=['POST'])
def fetchTimeDetails():
    request_data = request.get_json(force=True)
    origin = request_data[0]["origin"]
    destination = request_data[0]["destination"]
    waypoints = request_data[0]["waypoints"]
    timeDetails = PriceDetails()
    return timeDetails.getTimeDetails(origin, destination, waypoints)