const { createServer } = require("https");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const { instrument } = require("@socket.io/admin-ui");

const {
  addToQueue,
  getQueue,
  removeFromQueue,
  existingRequests,
} = require("./queue");

const { login } = require("./Admin");

const server = createServer({
  key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
});

const io = new Server(server, {
  cors: {
    origin: [
      "https://javaughnpryce.live:9090",
      "https://admin.socket.io",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("request", (data) => {
    try {
      if (!existingRequests(data.id)) {
        addToQueue(data);
        socket.emit("success");
        io.emit("Queue updated");
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
        io.emit("Queue updated");
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

instrument(io, {
  auth: {
    type: "basic",
    username: "admin",
    password: "$2a$12$JTt3LfCNhfkXe4yoRrY/5eE33fqDfpRDHNjYPtK5ClY9/HaU7bU3y",
  },
});

server.listen(process.env.PORT, process.env.IP, () =>
  console.log("Server is listening")
);
