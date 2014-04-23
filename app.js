var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

Tabletop.init({ 
  key: '__SPREADSHEET_KEY_HERE__',
  callback: 'run_server',
  simpleSheet: true 
});

function run_server (data, tabletop) {
  server.listen(80);

  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
  });

  io.sockets.on('connection', function (socket) {
    
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });

}

