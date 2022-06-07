const express = require('express');
const path = require('path');
const http = require('http');
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/post');
const chatRoutes = require('./routes/chat');
const db = require('./database')
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
let users = [];
// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static('public')); // Serve static files (e.g. CSS files)

app.use('/', indexRoutes);
app.use('/posts', postRoutes);
app.use('/chat', chatRoutes);

app.use(function (error, req, res, next) {
  // Default error handling function
  // Will become active whenever any route / middleware crashes
  console.log(error);
  res.status(500).render('500');
});


/* webSoket code */
db.connectToDatabase().then(function(){
  app.listen(3000);
}); //db가 있을 때만 서버가 켜지게끔 조절



io.on("connection",(socket)=>{
  let name = "";
  socket.on("has connected", (username)=>{  //event : has connected
      name = username;
      users.push(username);
      io.emit("has connected",{username:username, usersList:users})
  });
  socket.on("has disconnected",()=>{   //event : has disconnected
      users.splice(users.indexOf(name),1); // 사용자가 접속을 끊으면 users리스트에서 splice함수를 통해 나간 사용자를 제거한다.
      io.emit("has disconnected", {username : name, usersList : users})
  });

  socket.on("new message", (data)=>{  //event : new message
      io.emit("new message", data);   //io.emit(event, message) :  모든 소켓에 메세지를 보냄
  });
});

