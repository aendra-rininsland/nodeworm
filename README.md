# nodeworm
## a web experiment, 2014 Ændrew Rininsland (@aendrew)

### What is it?

Ever see that "worm" style of engagement tracking during political debates? 
Where a panel is given a device with a knob, and they turn it based on
how much in agreement they are with the current speaker? This is the same thing,
but instead of a physical knob, you use touch devices. 

Built for [Hackney Citizen](http://www.hackneycitizen.co.uk)'s 2014 mayoral debate.

### How does it work?

It's currently just one repo, though I may yet separate it into client and server.
The server is a NodeJS app that uses websockets to periodically poll the clients
and ask for dial state. Alternately, a user changing the dial will push the
state to the server. 

Once a state reaches the server, Postgres saves it to database for later analysis.

A D3-based series chart suitable for projection then... does something with
this data in a live setting, I'm not entirely sure how it'll do things yet.

License: GPLv3
