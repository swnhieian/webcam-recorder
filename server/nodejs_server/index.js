const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {origins: '*:*'});
const fs = require('fs');
const { lstatSync, readdirSync } = require ('fs');
const { join } = require('path')

app.get('/', function(req, res) {
  res.send('<h1>Server Started</h1>');
});

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

  socket.on('client: save data', function(data) {
    console.log('received from server', data);
    // const name = data.name;
    const name = "Sean Ker"
    const sentence_index = data.sentence_index;
    const camera_id = data.camera_id.substring(0, 15);
    const blob = data.blob;
    let nameDir = "./" + name
    console.log(sentence_index);
    let sentenceDir = "/" + sentence_index
    
    // if (name === 'undefined') {
    //   const isDirectory = source => lstatSync(source).isDirectory()
    //   const getDirectories = source =>
    //     readdirSync(source).map(name => join(source, name)).filter(isDirectory);

    //   let nameDirs = getDirectories('./'); 
    //   console.log(nameDirs);
    //   nameDir = "./" + nameDirs[nameDirs.length - 1]; 
    //   console.log(nameDir);
    //   let nameDirDirs = getDirectories(nameDir);
    //   sentenceDir = "/" + nameDirDirs[nameDirDirs.length - 1];
    // }

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
