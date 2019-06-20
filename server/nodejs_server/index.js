const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {origins: '*:*'});
const fs = require ('fs');

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
    const name = data.name;
    const sentence_index = data.sentence_index;
    const camera_id = data.camera_id.substring(0, 15);
    const blob = data.blob;
    // const date = new Date().toString();

    // const fileDir = __dirname + "/" + name + "/" + sentence_index + "/"
    // const fileName = camera_id + ".webm"
    // if (!fs.existsSync(fileDir)) {
    //   fs.mkdirSync(fileDir)
    // }

    const tmp = camera_id;
    fs.writeFile(camera_id, blob, function(err) {
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
