/*-----Get variables (I know they're constants, shut up) */
const form = document.querySelector('#chat');
const messageInput = document.querySelector('#textbox');
const messages = document.querySelector('#messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

/*-----Socket stuff */
// Initialize client side listener
const socket = io();

// read messages from server
socket.on('message', msg => {
    displayMessage(msg);

    // Scroll to newest message 
    messages.scrollTop = messages.scrollHeight;
})

// Get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
// Send to server when joining room
socket.emit('joinRoom', { username, room });

// Get room information
socket.on('usersInRoom', ({users, room}) => {
    roomInfo(users, room);
})

/*-----Event listeners */
// This triggers when the send button is clicked / The form is submitted (Enter key works too)
form.addEventListener('submit', (e) => {
    // This is to make sure the form doesn't 'submit'
    e.preventDefault();
    
    // Grabbing whatever the user typed into the text field
    const ms = messageInput.value;

    // Resetting the text field back to blank value
    messageInput.value = "";
    // Returning focus to that textbox
    messageInput.focus();

    // Now we're sending the message to the server
    socket.emit('chatMessage', ms);
})

/*-----Utility functions */
/* Pretty straightforward
 * Creates a message as a list item
 * Appends it to list
 */
function displayMessage(message)
{
    const mess = document.createElement('li');
    mess.innerHTML = `${message.username}, ${message.time}: ${message.text}`;
    messages.append(mess);
}

/**
 * Displays name of room
 * Displays users in room
 */
function roomInfo(users, room)
{
    roomName.innerHTML = room;
    
    // Clear list of users
    userList.innerHTML ="";
    // Same concept as displayMessage 
    users.forEach(x => {
        const addUser = document.createElement('li');
        addUser.innerHTML = `<h3>${x.username}</h3>`;
        userList.append(addUser);
    });
}