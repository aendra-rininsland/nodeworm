# nodeworm
## a web experiment, 2014 Ændrew Rininsland (@aendrew)

### What is it?

Ever see that "worm" style of engagement tracking during political debates? 
Where a panel is given a device with a knob, and they turn it based on
how much in agreement they are with the current speaker? This is the same thing,
but instead of a physical knob, you use touch devices. 

Built for [Hackney Citizen](http://www.hackneycitizen.co.uk)'s 2014 mayoral debate.

### But how does it work?!

The server is a NodeJS app that uses websockets to periodically poll the clients
and ask for dial state. Alternately, a user changing the dial will push the
state to the server (though pushes are at present ignored in order to prevent
somebody from just continuously tapping the dial and skewing the average. Very
open to ideas how to make that work better.).

Once a state reaches the server, it's saved to a Postgres database. A d3-based
visualisation (via the lovely Rickshaw library) then charts it as a time series,
polling the database every 2 or so seconds. I'm still tweaking this.

License: MIT
