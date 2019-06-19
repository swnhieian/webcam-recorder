const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {origins: '*:*'});

app.get('/', function(req, res) {
  res.send('<h1>Server Started</h1>');
});

io.on('connection', function(socket) {
  console.log('a user connected', socket.id);

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });

  socket.on('start cams', function(msg) {
    console.log('received from server' + msg);
    io.emit('server: start cams')
  });
  
  socket.on('stop cams', function(msg) {
    console.log('received from server' + msg);
    io.emit('server: stop cams');
  });
});

http.listen(5000, function() {
  console.log('listening on *:5000');
});
