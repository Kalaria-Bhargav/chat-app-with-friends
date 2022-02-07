
  if(window.innerWidth < 949){
    document.getElementsByClassName('l2')[0].id = '';
    document.getElementsByClassName('l1')[0].id = 'leave-btn';
  console.log(document.getElementById('leave-btn'));
  
  document.getElementsByClassName('rname')[0].id = 'room-name';
  document.getElementsByClassName('usrs')[0].id = 'users';
  console.log(document.getElementsByClassName('rname'));
  }else{
    document.getElementsByClassName('l2')[0].id = 'leave-btn';
  }

let ctt = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const audio = new Audio('../ting.mp3');
const messageInp = document.getElementById('inp');

const url =new URL(window.location.href); 
const username = url.searchParams.get('Username');
const room = url.searchParams.get('Room');


// const e2 = ;

const socket = io(); 

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
ctt.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = messageInp.value;

 
  if (!msg) {
    return false; 
  }
audio.play();
  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  messageInp.value="";
  messageInp.focus();
});


// Add room name to DOM
function outputRoomName(room) {
  // const h2 = document.getElementById('');
 
  roomName.innerHTML = `<li>${room}</li>`;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

document.getElementById('emoji').addEventListener('click', function(e) {
  let emojiwrapper = document.getElementById('emojiWrapper');
  emojiwrapper.style.display = 'block';
  e.stopPropagation();  
}, false);

document.getElementById('emojiWrapper').addEventListener('click', function(e) {
  let target = e.target;
  if (target.nodeName.toLowerCase() == 'img') {
      // var messageInput = document.getElementById('inp');
      // messageInput.focus();
      let message= '[emoji:' + target.title + ']';
      socket.emit('chtmessage', message);
      audio.play();
  };
}, false);

document.body.addEventListener('click', function(e) {
  var emojiwrapper = document.getElementById('emojiWrapper');
  if (e.target != emojiwrapper) {
      emojiwrapper.style.display = 'none';
  };
});

// show emoji


_initialEmoji = function() {
  var emojiContainer = document.getElementById('emojiWrapper'),
      docFragment = document.createDocumentFragment();
  for (var i = 69; i > 0; i--) {
      var emojiItem = document.createElement('img');
      emojiItem.src = 'emoji/' + i + '.gif';
      emojiItem.title = i;
      docFragment.appendChild(emojiItem);
  };
  emojiContainer.appendChild(docFragment);
}
_initialEmoji()



socket.on('emj', function(message) {
  
  emojiIndex = message.text.slice(7, -1);
  // console.log(emojiIndex)
  let result = '<img class="emoji" src="emoji/' + emojiIndex + '.gif" />';//todo:fix this in chrome 

  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('div');
  para.classList.add('img');
  para.innerHTML = result;
  div.appendChild(para);
  // outer.appendChild(div);
  document.querySelector('.chat-messages').appendChild(div);
});



// Output message to DOM
function outputMessage(message) {
    
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerHTML = message.text;
  div.appendChild(para);
  
  document.querySelector('.chat-messages').appendChild(div);
}

