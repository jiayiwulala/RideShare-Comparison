# Run this file to start the application
# python runserver.py
# Application can be accessed at localhost:5000

from flask import Flask, render_template
from fareComparison import app

app.secret_key = "development key"
app.run(debug=True)
