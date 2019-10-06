/* eslint-disable no-console */
const app = require('express')();
const fs = require('fs');
const exec = require('child_process').exec;
const colors = require('colors/safe');
const ip = require('../src/utils/ip');

// const crypto = require('crypto');
const path = require('path')
let parentDir = path.resolve(process.cwd(), '..');
exec('getParentDirectory', {
  cwd: parentDir
});
parentDir += '/webcam-recorder/server/';

// const privateKey = fs.readFileSync(parentDir +'server-key.pem').toString();
// const certificate = fs.readFileSync('server-crt.pem').toString();

// const credentials = crypto.createCredentials({
//   key: privateKey,
//   cert: certificate
// });

const options = {
  key: fs.readFileSync(parentDir + 'server-key.pem'),
  cert: fs.readFileSync(parentDir + 'server-crt.pem'),
  ca: fs.readFileSync(parentDir + 'ca-crt.pem'),
};

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'https://s3and0s.github.io/webcam-recorder/'];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
const https = require('https').createServer(options, app);
const io = require('socket.io')(https, {
  origins: '*:*'
});
const RECORDING_STATUS_PATH = parentDir + 'recording_status.json'
const PROGRESS_PATH = parentDir + 'progress.json'
const CONNECTION_STATUS_PATH = parentDir + 'connection_status.json'
const TOTAL_TIME_PATH = parentDir + 'time.json'
const START_TIME_PATH = parentDir + 'start_time.json'

let connection_status = {};
let numSaved = 0;
let online = []
let recordedStart = undefined;
const my_ip = ip.nodeGetIP();

function saveData(data, path) {
try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

function readData(path, callback) {
  fs.readFile(path, function(err, content) {
    if (err) return callback(err);
    callback(null, content);
  });
} 

function updateRecordingStatus(data, path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
  } catch (err) {
    data = {
      name: data.name, 
      sentence_index: data.sentence_index
    }
    saveData(data, path);
    return data;
  }
}

function saveConnection(socket, status) {
  connection_status.temp = socket.id; // using computer id as variable for object name
  connection_status[connection_status.temp] = status; // cameras
  delete connection_status.temp;
  saveData(connection_status, CONNECTION_STATUS_PATH);
}

function sendProgressUpdate() {
  readData(PROGRESS_PATH, function (err, content) {
    try {
      io.emit('server: response for progress', JSON.parse(content).progress);
    } catch (SyntaxErrorException) {
      saveData({}, PROGRESS_PATH)
      // console.error("file DNE at " + PROGRESS_PATH + ", so created anew.");
    }
  }); 
}

function displayOnline() {
  console.log(colors.green(colors.bold('🛫 online    : ') + online));
}

function disconnect(id) {
  var index = online.indexOf(id);
  if (index > -1) {
    online.splice(index, 1);
  }
  displayRemoved(id)
}

function clearConsole(lines) {
  for (var i = 0; i < lines; i++) {
    console.log('\r\n');
  }
}

function displayRemoved(id) {
  const comma = (online.length === 0) ? '' : ', '
  const print =
    colors.red.bold('🛬 online    : ') +
    colors.green(online.toString()) +
    comma +
    colors.red.strikethrough(id);
  clearConsole(13);
  console.log(print);
}

function getTimeRecorded() {
  const totalTimeRecorded = new Date() - recordedStart;
  const seconds = Math.floor(totalTimeRecorded / 1000);
  let milliSeconds = totalTimeRecorded - seconds * 1000;
  milliSeconds = totalTimeRecorded > 0 ? Math.round(totalTimeRecorded / 10).toString().substring(0, 2) : 0;
  console.log(colors.magenta(colors.bold('⏱  time   : ') + '00:' + ('0' + seconds).split(-2) + ':' + milliSeconds));
}

function printLine(gap, print) {
  const width = process.stdout.columns;
  for (let i = 0; i < (width - 3 - gap) / 2; i++) {
    print += '-';
  }
  return print
}

function printLineMessage(message) {
  let print = printLine(message.length, '');
  print += ' ' + message + ' '
  print += printLine(message.length, '');
  console.log(colors.white(print));
}

app.get('/', function (req, res) {
  res.send('<h1>Server Started</h1>');
});

https.listen(5000, function () {
  clearConsole(13);
  // ip.nodeGetIP();
  console.log(colors.green(colors.bold('👂🏻 listening : ') + 'localhost:5000 or ' + my_ip + ':5000'));
});




io.on('connection', function(socket) {
  online.push(socket.id)
  displayOnline();

  saveConnection(socket);
  // let temp = {}
  // temp[socket.id] = numConnected++
  // io.emit('server: computer connected order', temp);
  io.to(socket.id).emit('server: connected', socket.id);

  socket.on('client: check server connection', function() {
    setTimeout(() => {
      console.log('server online')
      io.emit('server: online')
    }, 3000);
  });

  socket.on('client: ask for sync id', function() {
    io.emit('server: connected sync id', socket.id);
  })

  socket.on('client: reset cams', function() {
    io.emit('server: reset cams');
  });

  socket.on('client: save total start time', startTime => {
    saveData({ startTime }, START_TIME_PATH);
  });

  socket.on('client: ask for start time', function() {
    readData(START_TIME_PATH, function(err, content) {
      try {
        io.emit(
          'server: response for start time',
          JSON.parse(content).startTime
        );
      } catch (FileDNEError) {
        const startTime = new Date();
        saveData({ startTime }, START_TIME_PATH);
        io.emit('server: response for start time', startTime);
      }
    });
  });
  
  socket.on('client: get total time', function() {
    readData(TOTAL_TIME_PATH, function(err, content) {
      try {
        io.emit('server: response for total time', JSON.parse(content).time);
      } catch (FileDNEError) {
        saveData({time: [0, 0, 0]}, TOTAL_TIME_PATH);
        io.emit('server: response for total time', [0,0,0]);
      }
    })
  });

  socket.on('client: delete total time', function() {
    fs.unlinkSync(TOTAL_TIME_PATH, err => {
      if (err) throw err;
    });
  });

  socket.on('disconnect', function() {
    io.to(socket.id).emit('server: you disconnected'); // when would this ever show up??
    disconnect(socket.id);
    const socketid = socket.id
    delete connection_status[socketid];
    saveData(connection_status, CONNECTION_STATUS_PATH);
  });

  socket.on('client: ping for progress', function() {
    sendProgressUpdate();
  })

  socket.on('client: ping for numFilesSaved', function() {
    try {
      io.emit('server: response for numFilesSaved', numSaved);
    } catch (SyntaxErrorException) {
      console.error(SyntaxErrorException);
    }
  })

  socket.on('client: refresh all', function() {
    io.emit('server: refresh all');
  });

  socket.on('client: reset total files', function() {
    numSaved = 0;
  });

  socket.on('client: update recording progress', function(progress) {
    saveData({progress}, PROGRESS_PATH);
    sendProgressUpdate();
  });

  socket.on('client: check for progress', function() {
    sendProgressUpdate();
  });

  socket.on('client: ping for connection status', function() {
    readData(CONNECTION_STATUS_PATH, function(err, content) {
      try {
        io.emit('server: response for connection status', JSON.parse(content));
      } catch(SyntaxErrorException) {
        saveData({}, CONNECTION_STATUS_PATH)
        // console.error(SyntaxErrorException);
      }
    });
  });


  socket.on('client: update recording status', function(status) {
    saveConnection(socket, status[socket.id])
  });
  
  socket.on('client: dummy vid, do not save', function() {
    io.emit('server: dummy vid, do not save');
  });

  socket.on('client: start cams', function() {
    console.log(colors.yellow(colors.bold('✨ cmd    : ') + 'start cams'));
    recordedStart = new Date();
    io.emit('server: start cams')
  });
  
  socket.on('client: stop cams', function() {
    console.log(colors.yellow(colors.bold('✨ cmd    : ') + 'stop cams'));
    getTimeRecorded();
    io.emit('server: stop cams');
  });

  socket.on('client: start testing', function(data) {
    console.log(colors.green.bold('👩🏻‍💻 user      : ') + colors.white(data.name));
    printLineMessage('starting recording process');
    saveData(data, RECORDING_STATUS_PATH);
  });

  socket.on('client: ask for recording status', function() {
    readData(RECORDING_STATUS_PATH, function (err, content) {
      try {
        io.emit('server: response for recording status', JSON.parse(content));
      } catch (SyntaxErrorException) {
        saveData({}, RECORDING_STATUS_PATH);
      }
    });
  });

  socket.on('client: update sentence_index', function(data) {
    let newStatus = {
      name: data.name,
      sentence_index: data.curr_sentence_index
    }
    saveData(newStatus, RECORDING_STATUS_PATH);
  });

  let resetTime = false;
  socket.on('client: save total time', function(time) {
    if (resetTime) {
      saveData({ time: [0, 0, 0]}, TOTAL_TIME_PATH);
      resetTime = false;
    } else {
      time = {time}
      saveData(time, TOTAL_TIME_PATH);
    }
    if (time === 'reset') {
      resetTime = true;
    } 
  });

  socket.on('client: save data', function(data) {
    numSaved += 1;
    let status = updateRecordingStatus(data, RECORDING_STATUS_PATH);

    let name = status.name;
    let sentence_index = status.sentence_index;

    const camera_id = data.camera_id.substring(0, 15);
    const blob = data.blob;

    let nameDir = parentDir + name;
    let sentenceDir = "/" + sentence_index
    const fileName = "/" + camera_id + ".webm"

    if (!fs.existsSync(nameDir)) {
      fs.mkdirSync(nameDir)
    }
    
    if (!fs.existsSync(nameDir + sentenceDir)) {
      fs.mkdirSync(nameDir + sentenceDir)
    }

    const fullPath = nameDir + sentenceDir + fileName
    fs.writeFile(fullPath, blob, function(err) {
      if (err) {
        return console.log(err)
      }
      console.log(colors.magenta( 
        colors.bold('📂 file   : /') + fullPath.substring(1)
      ));
    });

    io.emit('server: save files successful', numSaved);
  });

  
});


process.on('SIGINT', function () {
  console.log("\nCaught interrupt signal");
  io.emit('server: disconnected');
  process.exit();
});
