from flask import Flask
app = Flask(__name__)

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