const express = require("express");
const path = require("path");
const fs = require("fs");
const http = require("http");
const indexRoutes = require("./routes/index");
const postRoutes = require("./routes/post");
const chatRoutes = require("./routes/chat");
const repairRoutes = require("./routes/repair");
const db = require("./database");
const app = express();
const server = http.createServer(app);

let users = [];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "images")));

/* routes */
app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/repair", repairRoutes);
app.use("/chat", chatRoutes);

/* error 처리 */
app.use(function (error, req, res, next) {
  console.log(error);
  res.status(500).render("error-templates/500");
});

app.use(function (error, req, res, next) {
  console.log(error);
  res.status(404).render("error-templates/404");
});

/* server start */
db.connectToDatabase().then(function () {
  server.listen(3000, () => {
    const dir = "./images";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
});

/* socket.io */
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  let name = "";
  socket.on("has connected", (username) => {
    name = username;
    users.push(username);
    io.emit("has connected", { username: username, usersList: users });
  });
  socket.on("has disconnected", () => {
    users.splice(users.indexOf(name), 1);
    io.emit("has disconnected", { username: name, usersList: users });
  });

  socket.on("new message", (data) => {
    io.emit("new message", data);
  });
});
