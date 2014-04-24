var express = require('express')
  ,  app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , Tabletop = require('tabletop')
  , crypto = require('crypto')
  ;

function generate_token (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

server.listen(process.env.PORT || 5544);

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
  client.on('livechart_begin_collection', function(client){
    var polls = [];

    // Poll every n seconds
    setInterval(function(){
      var token = generate_token(10);
      polls.push({id: token, responses: []});
      io.sockets.emit('livechart_polling', {token: token});
      client.on('livechart_polling_response', function(res){

      });
    },  process.env.NODEWORM_POLLING_DELAY || 1000);
  });

  client.on('dial_state_send', function (dial) {
    //if (Date.now() > new Date(sheet.conf.elements[0].eventStart) && Date.now() < new Date(sheet.conf.elements[0].eventEnd)) {
      //redis.set(client.id + '_' + Date.now(), dial.value);
      console.dir([client.id,  Date.now(), dial.value]);
    //}
  });

}); //end on('connection')
