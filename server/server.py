from flask import Flask, send_from_directory, url_for
from threading import Thread
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
from soco.discovery import by_name, discover
import os
app = Flask(__name__)
from soco import SoCo

start_state = False

@app.route("/")
def hello():
  return "Hello World!"

@app.route("/get_start_state")
def getStartState():
  return start_state

@app.route("/start_testing")
def startingTest():
  start_state = True
  return "starting test"

@app.route('/<filename>')
def files(filename):
    directory = os.getcwd()
    return app.send_static_file(filename)
    
@app.route('/play')
def play():
    sonos = SoCo('192.168.0.103')
    uri = 'http://192.168.0.100:5000/out_sine.wav'
    sonos.play_uri(uri)
    return 'play'
