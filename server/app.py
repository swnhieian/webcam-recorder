from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
# todo: why need secret key here?
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
  print('index.html loaded')
  return render_template('index.html')


@socketio.on('start_cams', namespace='/tsinghua_606')
def start_recording():
  print('received from server', 'start_cams')
  emit('starting_cams', {'data': 'noice noice noice'})


@socketio.on('stop_cams', namespace='/tsinghua_606')
def stop_recording():
  print('received from server', 'stop_cams')
  emit('stopping_cams', {'data': 'noice noice noice'})

if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0')
