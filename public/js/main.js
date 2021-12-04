/*-----Get variables (I know they're constants, shut up) */
const form = document.querySelector('#chat');

const messageInput = document.querySelector('#textbox');
const messages = document.querySelector('#messages');
const messagebox = document.querySelector('#message-display');

const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

/*-----Socket stuff */
// Initialize client side listener
const socket = io();

// read messages from server
socket.on('message', msg => {
    displayMessage(msg);

    // Scroll to newest message 
    messagebox.scrollTop = messages.scrollHeight;
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
    
    /* Creating DOM elements using DOM methods 
    *  Who thought html strings was a good idea? Not me
    *  Commented code is what its supposed to look like put together
    */
   
   /*newMsgDiv.innerHTML = `
   <article class="message is-small is-primary">
   <div class="message-header">
   <p>${message.username}</p>
   <p>${message.time}</p>
   </div>
   <div class="message-body"> ${message.text} </div>
   </article>
   `;*/
   
   /* Change message looks based on who sent them 
   *  Admin - Yello
   *  Message you sent - Primary colors (and displayed name is 'You' instead of usernam)
   *  Other person sent message - Dark colors? (TODO: secondary color for this)
   */
    const msgArticle = document.createElement('article');
    if(message.username === 'Admin')
    { msgArticle.className = 'message is-small is-warning'; }
    else if(message.username === username)
    { 
            msgArticle.className = 'message is-small is-primary'; 
            message.username = 'You';
    }
    else
    { msgArticle.className = 'message is-small is-dark'; }
    
    const msgHeaderLeft = document.createElement('p');
    msgHeaderLeft.innerHTML = message.username;
    const msgHeaderRight = document.createElement('p');
    msgHeaderRight.innerHTML = message.time;
    const msgHeader = document.createElement('div');
    msgHeader.className = 'message-header';
    /* Append username and time to message header */
    msgHeader.appendChild(msgHeaderLeft);
    msgHeader.appendChild(msgHeaderRight);
    
    const msgBody = document.createElement('div');
    msgBody.className = 'message-body';
    msgBody.innerHTML = message.text;
    
    /* Append header and body to message */
    msgArticle.appendChild(msgHeader);
    msgArticle.appendChild(msgBody);
    
    /* Append message to div */
    const newMsgDiv = document.createElement('div');
    newMsgDiv.appendChild(msgArticle);
    
    /* Append new message to the messages field */
    messages.appendChild(newMsgDiv);
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