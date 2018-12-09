from flask import Blueprint
from flask import current_app, session
from flask import make_response

routes = Blueprint('routes', __name__,  static_folder='static')


@routes.route('/')
def index():
    return current_app.send_static_file('index.html')

@routes.route('/userpage')
def userpage():
    resp = make_response(current_app.send_static_file('userpages.html'))
    resp.set_cookie('useremail', session['email'])
    return resp

@routes.route('/mylocations')
def mylocations():
    return current_app.send_static_file('savelocations.html')

@routes.route('/plantrip')
def planTrip():
    return current_app.send_static_file('userpages.html')