from urllib2 import urlopen
import urllib2,cookielib
import json

class UberPricer:
    def fetchUberPrices(self,startLatitude, startLongitude, endLatitude, endLongitude, uberKey):
        site= "https://api.uber.com/v1/estimates/price?start_latitude="+str(startLatitude)+"&start_longitude="+str(startLongitude)+"&end_latitude="+str(endLatitude)+"&end_longitude="+str(endLongitude)+"&server_token="+uberKey
        print site, '---------'
        req = urllib2.Request(site)
        try:
            page = urllib2.urlopen(req)
        except urllib2.HTTPError, e:
            print 'jiayi'
            print e.fp.read()
        content = page.read()

        wjdata = json.loads(content)
        print wjdata, 'content'
        uberPrices = []
        uberPricesAll = {}
        for data in wjdata["prices"]:
            if data["localized_display_name"] == "UberX":
                print 'oivia'
                uberPricesAll["UberX"] = data["estimate"]
                uberPrices.append(data["localized_display_name"]+" "+data["estimate"])
            if data["localized_display_name"] == "UberXL":
                uberPricesAll["UberXL"] = data["estimate"]
            if data["localized_display_name"] == "Black":
                uberPricesAll["Black"] = data["estimate"]
            if data["localized_display_name"] == "UberPool":
                uberPricesAll["UberPool"] = data["estimate"]
                print 'type', type(data["estimate"])
        print uberPrices, uberPricesAll
        return uberPrices, uberPricesAll

    def fetchUberTime(self, startLatitude, startLongitude, uberKey):
        site = "https://api.uber.com/v1/estimates/time?start_latitude=" + str(
            startLatitude) + "&start_longitude=" + str(startLongitude) + "&server_token=" + uberKey
        print site, 'time---------'
        req = urllib2.Request(site)
        try:
            page = urllib2.urlopen(req)
        except urllib2.HTTPError, e:
            print 'jiayi'
            print e.fp.read()
        content = page.read()

        wjdata = json.loads(content)
        print wjdata, 'content'
        uberTimesAll = {}
        for data in wjdata["times"]:
            if data["localized_display_name"] == "UberX":
                uberTimesAll["UberX"] = data["estimate"] / 60
            if data["localized_display_name"] == "UberXL":
                uberTimesAll["UberXL"] = data["estimate"] / 60
            if data["localized_display_name"] == "Black":
                uberTimesAll["Black"] = data["estimate"] / 60
            if data["localized_display_name"] == "UberPool":
                uberTimesAll["UberPool"] = data["estimate"] / 60
                print 'type', type(data["estimate"])
        return uberTimesAll
