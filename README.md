# unnamedChatApp
A chat app built with express, socket.io, node.js and keeping my eyes open too long
## It's aliiiiive
The web app is currently being hosted on heroku, but it's got issues (why wouldn't it? It's jank as hell): https://unnamed-chat-app.herokuapp.com/
## I am aware it has problems
- The jank (I use this word a lot) method I'm currently using to get user name and room info through the url string is very bad security risk
- The CSS from Bulma is nice for quick fixing from the raw state but it's not the best looking thing and I know it could be better
  - The send button's positioning is bothering me
  - The message area looks horrible on fullscreen desktop (Mobile first tho amirite)
  - I haven't added in current users section or a way to change rooms
- It seems to be crashing on heroku when more than 2 users are on it. I haven't looked into exactly why yet
## But this is for practice.
- Uses multiple node modules 
  - express (for hosting and general node framework malarkey)
  - socket.io (without which none of these sockets things would've been possible)
  - nodemon (for making me much less frustrated. Imagine if I had to restart the server manually *every* time. Yeesh.)
- Forms (It's not very exciting but I didn't do anything with this in the previous one)
- Precursor to something bigger. (I know, ominous)
- CSS framework(?) - Bulma
- Firebase stores messages!
## Next Up
- Room Extras
  - Create Rooms
  - Delete Rooms
  - Direct messages
- Saving users and proper auth
- Dice roller