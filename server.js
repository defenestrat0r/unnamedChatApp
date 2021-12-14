/*-----Importing stuff we need */
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

/*-----Initializing and Teeing up the stuff we just imported */
// Initialize express, which is framework to handle our node magic on a server
const app = express();

// Setup the server to handle socket.io
const server = createServer(app);

// Initialize socket.io by feeding it the server we created with express 
const io = new Server(server);

// Set up static folder so everything can be referenced from here
app.use(express.static('public'));

/*-----Firebase stuff */
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCGsLf6NOphDxLbQ_yNtYJlm0bthgxSgOc",
    authDomain: "chatot-e4673.firebaseapp.com",
    databaseURL: "https://chatot-e4673-default-rtdb.firebaseio.com",
    projectId: "chatot-e4673",
    storageBucket: "chatot-e4673.appspot.com",
    messagingSenderId: "829197495353",
    appId: "1:829197495353:web:0a8ca81bec90c69511b1e8",
    measurementId: "G-LR4RW8J81R"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  
  // Get database reference
  const db = getDatabase(firebaseApp);

/*-----Server Handling */
// This runs when a client connects 
io.on('connection', socket => {

    // Listening for chat message 
    socket.on('chatMessage', (message) => { 

        // Since we use the socket ID as user ID, we can find the user this way
        const user = getUser(socket.id);

        /* Send the message object to client side
         * And we're going to make sure the messages only go to the specific room 
         */
        const chatObj = messageWrap(user.username, message);
        
        // Write to database
        writeMsgData(chatObj, socket.id);
        
        // Alert the room that a message has been sent
        io.to(user.room).emit('message',chatObj); 
    });

    /* This runs when a user joins a room 
     * We get room and user info from client-side emit
     * We use the socket's ID as user ID 
     */
    socket.on('joinRoom', ({username, room}) => {
        
        // Creates a user object
        const user = userJoin(socket.id, username, room);

        /* Using the join function, we get the socket to subscribe to a specific channel
         * This puts the socket in the room name that the user picked! 
         */
        socket.join(user.room);

        /* Emit - Send to single client that connected / triggered this
         * This is specific to the user that joined, just to let them know they've connected successfully 
         */ 
        let joinObj = messageWrap('Admin', `Holy smokes, ${user.username}! You connected!`);
        socket.emit('message', joinObj);

        /* Broadcast - Emits to everyone except the user that connected / triggered this
         * Tells the channel someone has joined 
         * We need to broadcast specific to a room and not to the whole server
         * So instead of regular broadcast, we broadcast *to* a room
         * I know this is not how I usually type functions, but it's for better readability
         * Shut up 
         */
        joinObj = messageWrap('Admin',`${user.username} has joined the party`);
        socket
        .broadcast
        .to(user.room)
        .emit(
            'message',
            joinObj
            );

        // Sending users in room info
        io.to(user.room).emit('usersInRoom', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
    })

    /* This runs when a user disconnects.
     * I know it's a little weird to have it inside the connect event...
     * But think of the connect even like an onload wrapper. 
     * Everything is neatly encapsulated in it!
     */
    socket.on('disconnect', () => { 
        const user = userLeave(socket.id);
        if(user)
        {
            /* Server.emit - Send to everyone
             * We only want this to send in the specific room the user disconnected in
             * Hence the to(user.room) thing
             */
            const disconnectObj = messageWrap('Admin',`${user.username} fell from a really high place`);
            io.to(user.room).emit('message', disconnectObj);

            // Sending users in room info
            io.to(user.room).emit('usersInRoom', {
                users: getUsersInRoom(user.room),
                room: user.room
            });
        }
         
    });
})

// Server starts according to app/whatever we deploy it on, and port 3000 on local
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*-----Utility stuff*/
// Turns message into an object
function messageWrap(username, message)
{
    // All this because Moment isn't ES6 compatible 
    let dateTime = new Date();
    let hours = dateTime.getHours();
    let mins= dateTime.getMinutes(); 
    let sex = dateTime.getSeconds();
    let timestamp = hours + " : " + mins + " : " + sex;

    return {
        username: username,
        text: message,
        time: timestamp
    }
}

// User array 
let users = [];

// Make a user object and put it into the user array 
function userJoin(id, username, room)
{
    const user = { id, username, room };
    users.push(user);
    return user;
}

function userLeave(id) 
{
    // Find the index of the user that's leaving
    const index = users.findIndex(user => user.id === id);
    /* Return users array that has the user at the index removed
     * Essentially, users = users - users[index]
     */
    if(index !== -1) { return users.splice(index, 1)[0]; }
}

// Simple get function to get user based on id
function getUser(id) { return users.find(user => user.id === id); }

// Simple get function to get users in the specified room 
function getUsersInRoom(room) { return users.filter(user => user.room === room); }

function writeMsgData(msgObj, socketID) {
    const db = getDatabase();
    set(ref(db, 'msg/' + socketID), {
      username: msgObj.username,
      content: msgObj.text,
      time: msgObj.time
    });
  }