const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/post');
const chatRoutes = require('./routes/chat');
const repairRoutes = require('./routes/repair');
const db = require('./database')
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
let users = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public')); 
app.use('/images',express.static(path.join(__dirname,'images')));

/* routes */
app.use('/', indexRoutes);
app.use('/posts', postRoutes);
app.use('/repair', repairRoutes);
app.use('/chat', chatRoutes);

app.use(function (error, req, res, next) {
  console.log(error);
  res.status(500).render('500');
});

app.use(function (error, req, res, next) {
  console.log(error);
  res.status(404).render('404');
});

db.connectToDatabase().then(function(){
  app.listen(3000,()=>{
    const dir = './images';
    if (!fs.existsSync(dir)) {fs.mkdirSync(dir);}
  });
});



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

