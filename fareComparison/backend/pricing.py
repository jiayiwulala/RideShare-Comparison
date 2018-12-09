# coding=utf-8

import json
from UberPricer import UberPricer
from LyftPricer import LyftPricer
from mapRoute import MapRoute
from collections import OrderedDict
from geoData import GeoData

class PriceDetails:
    def getOptimizedRoute(self, origin, destination, waypoints):
        optRoute = MapRoute()
        print "Inside Price Details"
        print origin
        print destination
        print waypoints
        places = optRoute.getWaypoints(origin,destination,waypoints)
        return places

    def convertLoctoLatLong(self, places):
        location = GeoData()
        latlnglis = OrderedDict()
        for place in places:
            latlng = location.getGeoCodes(place)
            latlnglis[place] = latlng
        return latlnglis
    
    def convertLoctoLatLongList(self, places):
        location = GeoData()
        latlnglis = []
        for place in places:
            latlng = location.getGeoCodes(place)
            latlnglis.append(latlng)
        return latlnglis

    def getUberData(self, places, locationLatLng):
        uberKey = "zf0yCHLRuMY83s6Fb8FzY3nauqn251frd_9MPpMP"
        uberData = UberPricer()
        uberFinalAmount = 0
        uberX, uberPool, uberXL, black = 0, 0, 0, 0
        for place in range(len(places)-1):
            startLat = locationLatLng.get(places[place])[0]
            startLong = locationLatLng.get(places[place])[1]
            endLat = locationLatLng.get(places[place+1])[0]
            endLong = locationLatLng.get(places[place+1])[1]
            prices, pricesAll = uberData.fetchUberPrices(startLat, startLong, endLat, endLong, uberKey)
            price = prices[0].split('$',1)
            pricerange = price[1].split('-')
            uberFinalAmount = uberFinalAmount+(int(pricerange[0]) + int(pricerange[1])) / 2.0

            for each in pricesAll:
                if each == 'UberX':
                    pricerange = pricesAll[each].split('$')[1].split('-')
                    uberX += (int(pricerange[0]) + int(pricerange[1])) / 2.0
                elif each == 'UberXL':
                    pricerange = pricesAll[each].split('$')[1].split('-')
                    uberXL += (int(pricerange[0]) + int(pricerange[1])) / 2.0
                elif each == 'UberPool':
                    pricerange = pricesAll[each].split('$')[1].split('-')
                    uberPool += (int(pricerange[0]) + int(pricerange[1])) / 2.0
                elif each == 'Black':
                    pricerange = pricesAll[each].split('$')[1].split('-')
                    black += (int(pricerange[0]) + int(pricerange[1])) / 2.0
            print uberFinalAmount, uberPool, uberX, uberXL, black
        startLat = locationLatLng.get(places[0])[0]
        startLong = locationLatLng.get(places[0])[1]
        pickup_time_min_all = uberData.fetchUberTime(startLat, startLong, uberKey)
        uberX_time, uberPool_time, uberXL_time, black_time = 'N/A','N/A', 'N/A', 'N/A'
        for each in pickup_time_min_all:
            if each == 'UberX':
                uberX_time = str(pickup_time_min_all[each]) + ' min'
            elif each == 'UberXL':
                uberXL_time = str(pickup_time_min_all[each]) + ' min'
            elif each == 'UberPool':
                uberPool_time = str(pickup_time_min_all[each]) + ' min'
            elif each == 'Black':
                black_time = str(pickup_time_min_all[each]) + ' min'

        print uberX_time, uberXL_time, uberPool_time, black_time
        uber_price = [int(uberPool), int(uberX), int(uberXL), int(black)]
        uber_time = [uberPool_time, uberX_time, uberXL_time, black_time]
        return int(uberFinalAmount), uber_price, uber_time

    """
        Method to get the combined Lyft prices for optmized route
    """
    def getLyftData(self, places, locationLatLng):
        lyftFinalAmount = 0
        lyft_lux, lyft_line, lyft_plus, lyft = 0, 0, 0, 0
        lyftData = LyftPricer()
        for place in range(len(places)-1):
            startLat = locationLatLng.get(places[place])[0]
            startLong = locationLatLng.get(places[place])[1]
            endLat = locationLatLng.get(places[place+1])[0]
            endLong = locationLatLng.get(places[place+1])[1]
            prices, pricesAll = lyftData.get_lyft_ride_cost(startLat,startLong,endLat,endLong)
            price = prices[0].split(' ')
            lyftFinalAmount = lyftFinalAmount+int(price[1])
            for each in pricesAll:
                if each == 'lyft_lux':
                    lyft_lux += pricesAll[each]
                elif each == 'lyft_line':
                    lyft_line += pricesAll[each]
                elif each == 'lyft':
                    lyft += pricesAll[each]
                elif each == 'lyft_plus':
                    lyft_plus += pricesAll[each]
        startLat = locationLatLng.get(places[0])[0]
        startLong = locationLatLng.get(places[0])[1]
        lyftTimeAll = lyftData.get_lyft_time(startLat, startLong)
        lyft_time = lyftTimeAll["lyft"]
        lyft_plus_time = lyftTimeAll["lyft_plus"]
        lyft_line_time = lyftTimeAll["lyft_line"]
        lyft_lux_time = lyftTimeAll["lyft_lux"]

        lyft_price_lis = [lyft_line, lyft, lyft_plus, lyft_lux]
        lyft_time_lis = [lyft_line_time, lyft_time, lyft_plus_time, lyft_lux_time]
        return lyftFinalAmount, lyft_price_lis, lyft_time_lis

    def getPriceDetails(self, origin, destination, waypoints):
        priceMap = OrderedDict()
        priceList = []
        places = self.getOptimizedRoute(origin, destination, waypoints)
        priceMap["places"] = places
        locationLatLng = self.convertLoctoLatLong(places)
        priceMap["locationLatLng"] = locationLatLng
        locationLatLngList = self.convertLoctoLatLongList(places)
        priceMap["locationLatLngList"] = locationLatLngList
        uberFinalAmount, uber_price_lis, uber_time_lis = self.getUberData(places, locationLatLng)
        uberPool, uberX, uberXL, black = uber_price_lis

        priceMap["uberPrice"] = uberFinalAmount
        priceMap["uberPool"] = uberPool
        priceMap["uberX"] = uberX
        priceMap["uberXL"] = uberXL
        priceMap["black"] = black

        lyftFinalAmount, lyft_price_lis, lyft_time_lis = self.getLyftData(places, locationLatLng)
        lyft_line, lyft, lyft_plus, lyft_lux = lyft_price_lis
        priceMap["lyftPrice"] = lyftFinalAmount
        priceMap["lyft_line"] = lyft_line
        priceMap["lyft"] = lyft
        priceMap["lyft_plus"] = lyft_plus
        priceMap["lyft_lux"] = lyft_lux

        priceList.append(priceMap)
        return json.dumps(priceList)

    def getTimeDetails(self, origin, destination, waypoints):
        timeMap = OrderedDict()
        timeList = []
        places = self.getOptimizedRoute(origin, destination, waypoints)
        locationLatLng = self.convertLoctoLatLong(places)
        uberFinalAmount, uber_price_lis, uber_time_lis = self.getUberData(places, locationLatLng)
        uberPool_time, uberX_time, uberXL_time, black_time = uber_time_lis

        timeMap["uberPool"] = uberPool_time
        timeMap["uberX"] = uberX_time
        timeMap["uberXL"] = uberXL_time
        timeMap["black"] = black_time

        lyftFinalAmount, lyft_price_lis, lyft_time_lis = self.getLyftData(places, locationLatLng)
        lyft_line_time, lyft_time, lyft_plus_time, lyft_lux_time = lyft_time_lis

        timeMap["lyft_line"] = lyft_line_time
        timeMap["lyft"] = lyft_time
        timeMap["lyft_plus"] = lyft_plus_time
        timeMap["lyft_lux"] = lyft_lux_time

        timeList.append(timeMap)
        return json.dumps(timeList)
