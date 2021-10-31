/*-----Importing stuff we need */
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const moment = require('moment');

/*-----Initializing and Teeing up the stuff we just imported */
// Initialize express, which is framework to handle our node magic on a server
const app = express();

// Setup the server to handle socket.io
const server = http.createServer(app);

// Initialize socket.io by feeding it the server we created with express 
const sock = socket(server);

// Set up static folder so everything can be referenced from here
app.use(express.static('public'));

/*-----Server Handling */
// This runs when a client connects 
sock.on('connection', socket => {

    /*-----Server Semd */
    // Emit - Send to single client that connected / triggered this
    socket.emit('message', messageWrap('Admin', 'Holy smokes, you connected!'));

    // Broadcast - Emits to everyone except the user that connected / triggered this
    socket.broadcast.emit('message', messageWrap('Admin','User732472 has joined the party'));

    /* This runs when a user disconnects.
     * I know it's a little weird to have it inside the connect event...
     * But think of the connect even like an onload wrapper. 
     * Everything is neatly encapsulated in it!
     */
    socket.on('disconnect', () => { 
        // Server.emit - Send to everyone
        sock.emit('message', messageWrap('Admin','User732472 fell from a really high place')); 
    });

    /*-----Server Listen */
    // Listening for chat message 
    socket.on('chatMessage', (message) => { 
        sock.emit('message', messageWrap('User',message)); 
    });
})

// Start server on port 3000 or another port if 3000 is unavailable
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*-----Utility */
function messageWrap(username, message)
{
    return {
        username: username,
        text: message,
        time: moment().format('h:mm a')
    }
}