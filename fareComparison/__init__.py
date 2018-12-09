from flask import Flask

from fareComparison.backend import pricingAPI, routesapi, routes, timingAPI
from .backend.routes import routes
from .backend.oauth import oauth
from .backend.routesapi import routesapi
from .backend.routesapi import set_mongo_handle
from .backend.locationapi import locationapi
from .backend.locationapi import set_mongo_handler
from .backend.pricingAPI import pricingAPI
from .backend.timingAPI import timingAPI
from flask_pymongo import PyMongo


app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'myDatabase'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/myDatabase'
app.config.from_object('config')
mongo = PyMongo()
mongo.init_app(app)

app.register_blueprint(routes)
app.register_blueprint(oauth)
app.register_blueprint(routesapi)
app.register_blueprint(locationapi)
app.register_blueprint(pricingAPI)
app.register_blueprint(timingAPI)

set_mongo_handle(mongo)
set_mongo_handler(mongo)
