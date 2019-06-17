from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
# todo: why need secret key here?
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
  return render_template('index.html')


@socketio.on('FIREEEEE (cams)', namespace='/tsinghua_606')
def start_recording():
  emit('start cams bois!', {'data': 'noice noice noice'})


@socketio.on('STAHPPPPPP (cams)', namespace='/tsinghua_606')
def stop_recording():
  emit('OK STAHPING', {'data': 'noice noice noice'})

if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0')
