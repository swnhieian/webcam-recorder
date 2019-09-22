/* eslint-disable no-console */
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {origins: '*:*'});
const fs = require('fs');

app.get('/', function(req, res) {
  res.send('<h1>Server Started</h1>');
});

const saveData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

function readContent(path, callback) {
  fs.readFile(path, function(err, content) {
    if (err) return callback(err);
    callback(null, content);
  });
}

const updateRecordingStatus = (data, path) => {
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

const saveConnection = (socket, status) => {
  connection_status.temp = socket.id; // using computer id as variable for object name
  connection_status[connection_status.temp] = status; // cameras
  delete connection_status.temp;
  saveData(connection_status, CONNECTION_STATUS_PATH);
}

const sendProgressUpdate = () => {
  readContent(PROGRESS_PATH, function (err, content) {
    try {
      io.emit('server: response for progress', JSON.parse(content));
    } catch (SyntaxErrorException) {
      console.error(SyntaxErrorException);
    }
  }); 
}

const RECORDING_STATUS_PATH = './recording_status.json'
const PROGRESS_PATH = './progress.json'
const CONNECTION_STATUS_PATH = './connection_status.json'
let connection_status = {};
let numSaved = 0;
let numConnected = 0;

io.on('connection', function(socket) {
  console.log('computer connected at ' + socket.id);

  saveConnection(socket);
  let temp = {}
  temp[socket.id] = numConnected++
  io.emit('server: computer connected order', temp);

  socket.on('client: ask for sync id', function() {
    io.emit('server: connected sync id', socket.id);
  })
   socket.on('client: reset cams', function() {
     io.emit('server: reset cams');
   });
  

  socket.on('disconnect', function() {
    console.log('computer disconnected at ' + socket.id);
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

  socket.on('client: update recording progress', function(progress) {
    saveData(progress, PROGRESS_PATH);
    sendProgressUpdate();
    console.log('updating progress');
  });

  socket.on('client: check for progress', function() {
    sendProgressUpdate();
    console.log('check progress');
  });

  socket.on('client: ping for connection status', function() {
    readContent(CONNECTION_STATUS_PATH, function(err, content) {
      try {
        io.emit('server: response for connection status', JSON.parse(content));
        console.log('ping for connection status')
      } catch(SyntaxErrorException) {
        console.error(SyntaxErrorException);
      }
    });
  });


  socket.on('client: update recording status', function(status) {
    saveConnection(socket, status[socket.id])
    console.log('server: updated recording status', JSON.stringify(status));
  });
  

  socket.on('client: dummy vid, do not save', function() {
    console.log('removed first vid');
    io.emit('server: dummy vid, do not save');
  });

  socket.on('client: start cams', function() {
    console.log('received from server: start cams');
    io.emit('server: start cams')
  });
  
  socket.on('client: stop cams', function() {
    console.log('received from server: stop cams');
    io.emit('server: stop cams');
  });

  socket.on('client: start testing', function(data) {
    console.log('received from server: ' + data.name, data.sentence_index);
    saveData(data, RECORDING_STATUS_PATH);
  });

  socket.on('client: ask for recording status', function() {
    readContent(RECORDING_STATUS_PATH, function (err, content) {
      try {
        io.emit('server: response for recording status', JSON.parse(content));
      } catch (SyntaxErrorException) {
        console.error(SyntaxErrorException);
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

  socket.on('client: save data', function(data) {
    numSaved += 1;
    let status = updateRecordingStatus(data, RECORDING_STATUS_PATH);
    console.log(status);

    let name = status.name;
    let sentence_index = status.sentence_index;

    const camera_id = data.camera_id.substring(0, 15);
    const blob = data.blob;

    let nameDir = "./" + name;
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
      console.log('the file was saved!');
    });
    console.log("files saved: " + numSaved);
    // setTimeout(()=> {
    io.emit('server: save files successful', numSaved);
    // }, 5000)
  })
});

http.listen(5000, function() {
  console.log('listening on *:5000');
});
