from soco import SoCo
from flask import Flask, send_from_directory, url_for, render_template, make_response, render_template_string, request, Response, jsonify
from threading import Thread
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
from soco.discovery import by_name, discover
import os
import json
import requests
app = Flask(__name__)


def createResp(data):
  resp = Response(data)
  resp.headers['Access-Control-Allow-Origin'] = '*'
  return resp

@app.route("/")
def hello():
  return "Flask server running"

@app.route("/check_recording_status", methods=["GET"])
def getStartState():
  # with open('state.json') as json_file:
  #   data = json.load(json_file)
  resp = make_response(render_template('state.json'))
  resp.headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type' : 'application/json'
  }
  # print(render_template_string)
  # print(jsonify(state))
  print(resp)
  return resp
  # return createResp(str(state))


@app.route("/start_recording")
def startRecording():
  data = {"recording": 'true'}
  with open('state.json', 'w') as outfile:
    json.dump(data, outfile)
  return createResp("started!")

@app.route("/stop_recording")
def stopRecording():
  data = {"recording": 'false'}
  with open('state.json', 'w') as outfile:
    json.dump(data, outfile)
  return createResp("started!")



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
