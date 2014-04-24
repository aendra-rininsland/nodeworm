var express = require('express')
  ,  app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , Tabletop = require('tabletop')
  //, redis = require('redis-url').connect(process.env.REDISTOGO_URL)
  ;


Tabletop.init({ 
  key: '0Aqqh1cRUSxC-dHVFZi1LdWUzckcwd21TOUdFUXpaaGc',
  simpleSheet: false,
  callback: function (sheet, tabletop) {
    server.listen(5544);

    app.use('/client', express.static(__dirname + '/client'));

    app.get('/', function (req, res) {
      res.sendfile(__dirname + '/client/index.html');
    });

    // Poll every n seconds
    setInterval(function(){
      io.sockets.emit('dial_state_request');
    },  process.env.NODEWORM_POLLING_DELAY || 5000);
    

    // Client connections
    io.sockets.on('connection', function (client) {
      client.on('dial_state_send', function (dial) {
        //if (Date.now() > new Date(sheet.conf.elements[0].eventStart) && Date.now() < new Date(sheet.conf.elements[0].eventEnd)) {
          //redis.set(client.id + '_' + Date.now(), dial.value);
          console.dir([client.id,  Date.now(), dial.value]);
        //}
      });
    });

  }
});


