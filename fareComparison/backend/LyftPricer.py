import requests
from requests.auth import HTTPBasicAuth

class LyftPricer:
    def __init__(self):
        self.client_id = 'W-XE01ki38yS'
        self.client_secret = '0npaF_58jW5IMPxZC1P6fq5KDSYgnVZQ'


        self.token = self.__generate_token__()
        token_val = 'Bearer '+self.token
        self.headers = {'Authorization':token_val}

    def __generate_token__(self):
        """
        generate access token.
        """
        url = 'https://api.lyft.com/oauth/token'
        payload = {"Content-Type": "application/json", "grant_type": "client_credentials","scope": "public"}
        auth_header = HTTPBasicAuth(self.client_id, self.client_secret)
        res = requests.post(url=url, data = payload, auth = auth_header)
        token = res.json()['access_token']
        return token

    def get_lyft_ride_cost(self, startLatitude, startLongitude, endLatitude, endLongitude):
        """
         get the prices
        """
        url = 'https://api.lyft.com/v1/cost?start_lat='+str(startLatitude)+'&start_lng='+str(startLongitude)+'&end_lat='+str(endLatitude)+'&end_lng='+str(endLongitude)
        print url
        ride_cost = requests.get(url,headers=self.headers).json()['cost_estimates']
        lyftPrices = []
        lyftPricesAll = {}
        for data in ride_cost:
            if data["ride_type"] == "lyft":
                lyftPrices.append(data["ride_type"]+" "+str(data["estimated_cost_cents_min"]/100))
                lyftPricesAll["lyft"] = data["estimated_cost_cents_min"]/100
            if data["ride_type"] == "lyft_plus":
                lyftPricesAll["lyft_plus"] = data["estimated_cost_cents_min"]/100
            if data["ride_type"] == "lyft_lux":
                lyftPricesAll["lyft_lux"] = data["estimated_cost_cents_min"]/100
            if data["ride_type"] == "lyft_luxsuv":
                lyftPricesAll["lyft_luxsuv"] = data["estimated_cost_cents_min"]/100
            if data["ride_type"] == "lyft_line":
                lyftPricesAll["lyft_line"] = data["estimated_cost_cents_min"]/100
        print lyftPricesAll
        return lyftPrices, lyftPricesAll

    def get_lyft_time(self, startLatitude, startLongitude):
        """
         get the time
        """
        url = 'https://api.lyft.com/v1/eta?lat='+str(startLatitude)+'&lng='+str(startLongitude)
        print url
        ride_pick_time = requests.get(url, headers=self.headers).json()['eta_estimates']
        lyftTimeAll = {}
        for data in ride_pick_time:
            if data["ride_type"] == "lyft":
                lyftTimeAll["lyft"] = (str(data["eta_seconds"]/60) + ' min') if data["eta_seconds"] else 'N/A'
            if data["ride_type"] == "lyft_plus":
                lyftTimeAll["lyft_plus"] = (str(data["eta_seconds"]/60) + ' min') if data["eta_seconds"] else 'N/A'
            if data["ride_type"] == "lyft_lux":
                lyftTimeAll["lyft_lux"] = (str(data["eta_seconds"]/60) + ' min') if data["eta_seconds"] else 'N/A'
            if data["ride_type"] == "lyft_luxsuv":
                lyftTimeAll["lyft_luxsuv"] = (str(data["eta_seconds"]/60) + ' min') if data["eta_seconds"] else 'N/A'
            if data["ride_type"] == "lyft_line":
                lyftTimeAll["lyft_line"] = (str(data["eta_seconds"]/60) + ' min') if data["eta_seconds"] else 'N/A'
        print lyftTimeAll
        return lyftTimeAll
