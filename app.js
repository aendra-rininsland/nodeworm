var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , crypto = require('crypto')
  , pg = require('pg')
  , moment = require('moment')
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

app.get('/live', function (req, res) {
  res.sendfile(__dirname + '/client/graph.html');
});

// Graph output connection
var graph = io.of('/live').on('connection', function (socket) {
  pg.connect(process.env.DATABASE_URL || "postgres://postgres:test123@localhost/postgres", function(err, pgClient) {
    socket.on('livechart_begin_collection', function(clientInfo){
      var ts = moment(clientInfo);
      // Poll every n seconds
      setInterval(function(){
        // Get current timestamp.
        pgClient.query({
          name: 'nodeworm_livechart_polling',
          text: "SELECT * FROM nodeworm WHERE ts > $1 AND type = 'pull'",
          values: [ts.format("YYYY-MM-DD HH:mm:ss")]
        }, function(err, res){
          if (err) {
            return console.error('Error running query', err);
          }
          var avg = 0;
          res.rows.forEach(function(v){
            avg += v.value;
          });
          socket.emit('send_livechart_data', {worm: avg / res.rows.length});
          ts = moment();
        });
      },  2000);
    });
  });
}); //end /live

// Client connections
var client = io.of('/client');
client.on('connection', function (socket) {
  pg.connect(process.env.DATABASE_URL || "postgres://postgres:test123@localhost/postgres", function(err, pgClient) {
    socket.on('dial_state_send', function (dial) {
      pgClient.query({
        name: 'nodeworm_client_submission',
        text: 'INSERT INTO nodeworm("clientid", "ts", "value", "type") VALUES ($1, $2, $3, $4)',
        values: [socket.id, moment().format("YYYY-MM-DD HH:mm:ss"), dial.value, dial.type]
      });
    });
  });
}); //end /client

// Poll every n seconds
setInterval(function(){
  client.emit('dial_state_request');
}, 1000);
