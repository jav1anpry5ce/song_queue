const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

sslServer.listen(9090, "192.168.1.200", () =>
  console.log("Server is listening...")
);
