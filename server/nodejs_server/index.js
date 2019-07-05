const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {origins: '*:*'});
const fs = require('fs');

app.get('/', function(req, res) {
  res.send('<h1>Server Started</h1>');
});

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

const loadData = (path) => {
  try {
    return fs.readFileSync(path, 'utf8')
  } catch (err) {
    console.error(err)
    return false
  }
}

const STATUS_PATH = './status.json'

io.on('connection', function(socket) {
  console.log('a user connected', socket.id);

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });

  socket.on('client: start cams', function(msg) {
    console.log('received from server' + msg);
    io.emit('server: start cams')
  });
  
  socket.on('client: stop cams', function(msg) {
    console.log('received from server' + msg);
    io.emit('server: stop cams');
  });

  socket.on('client: start testing', function(data) {
    console.log('received from server' + data.name, data.sentence_index);
    storeData(data, STATUS_PATH);
  });

  socket.on('client: update sentence_index', function(data) {
    let status = JSON.parse(loadData(STATUS_PATH));
    let newStatus = {
      name: status.name,
      sentence_index: data
    }
    storeData(newStatus, STATUS_PATH);
  })

  socket.on('client: save data', function(data) {
    let status = JSON.parse(loadData(STATUS_PATH));
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
  })
});

http.listen(5000, function() {
  console.log('listening on *:5000');
});
