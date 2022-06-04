const express = require('express');
const http = require('http');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
let users = [];


app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/index.html');
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


