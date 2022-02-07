const path = require('path');
const http = require('http');
const express = require('express');

const formatMessage = require('./utils/message');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
const { emitKeypressEvents } = require('readline');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
// const socketio = ;
// Set static folder
app.use(express.static(path.join(__dirname, './public')));  
// console.log(express.static(path.join(__dirname,'./public')));
// console.log(path.join(__dirname,'./public'))
const botName = 'Chat Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage( '','Welcome to Chatapp!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    
    io.to(user.room).emit('message', formatMessage(user.username + " ", msg));
  });

  socket.on('chtmessage', msg => {
    const user = getCurrentUser(socket.id);
    
    io.to(user.room).emit('emj', formatMessage(user.username + " ", msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


check = (msg)=>{
  const  reg = /\[emoji:\d+\]/g;

  // console.log(msg.match(reg));
  if(reg.exec(msg) == null)
  return true;
  return false;
  


}