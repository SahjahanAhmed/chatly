const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);

const socketio = require("socket.io");
const io = socketio(server);

io.on("connection", (socket) => {
  //new user joined
  socket.on("new-user-joined", (userName) => {
    socket.broadcast.emit("user-joined", userName);
    socket.emit("welcome", `Wellcome ${userName}`);
    socket.on("disconnect", (user) => {
      socket.broadcast.emit("user-leave", userName);
    });
  });
  socket.on("sendMessage", (message) => {
    socket.broadcast.emit(
      "sendBackMessage",
      message.userName + " : " + message.messageText
    );
  });
  io.emit("active-users", io.engine.clientsCount);
});

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {});
