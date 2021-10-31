/* Get variables */
const form = document.querySelector('#chat');
const messageInput = document.querySelector('#textbox');
const messages = document.querySelector('#messages');

/* Socket stuff */
// Initialize client side listener
const socket = io();
// read shit from server
socket.on('message', msg => {
    //.console.log(msg);
    displayMessage(msg);

    messages.scrollTop = messages.scrollHeight;
})

/* Event listeners */
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

/* Functions */
function displayMessage(message)
{
    const mess = document.createElement('li');
    mess.innerHTML = `${message.username}, ${message.time}: ${message.text}`;
    messages.append(mess);
}