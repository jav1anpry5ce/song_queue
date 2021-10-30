const { createServer } = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const {
  addToQueue,
  getQueue,
  removeFromQueue,
  existingRequests,
} = require("./queue");

const { login } = require("./Admin");
const router = require("./router");

const app = express();
app.use(cors());
app.use(router);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connect", (socket) => {
  console.log(process.env.USERNAME || process.env.USER);
  socket.on("request", (data, callback) => {
    try {
      if (!existingRequests(data.id)) {
        addToQueue(data);
        socket.emit("success");
        socket.broadcast.emit("Queue updated");
        socket.emit("Queue updated");
      } else {
        socket.emit("error", {
          message: "You already have a pending request.",
        });
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("getQueue", () => {
    try {
      socket.emit("sending queue", { queue: getQueue() });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("remove", (token, id) => {
    try {
      if (token === process.env.TOKEN) {
        removeFromQueue(id);
        socket.broadcast.emit("Queue updated");
        socket.emit("Queue updated");
      } else {
        socket.emit("error", {
          message: "You are not authorized to make this request.",
        });
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("login", ({ username, password }) => {
    if (login(username, password)) {
      socket.emit("auth", { message: "Success", token: process.env.TOKEN });
    } else {
      socket.emit("auth", { message: "Invalid username and/or password" });
    }
  });
});

server.listen(process.env.PORT, process.env.IP, () =>
  console.log("Server is listening")
);
