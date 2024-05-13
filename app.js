const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// static files
app.use(express.static(`${__dirname}/public`));

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (msg) => {
    console.log("Received: " + msg);
    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// API endpoint
app.get("/api", (req, res) => {
  res.json({
    status: "success",
    code: 200,
    data: [
      {
        id: new Date().getTime().toLocaleString(),
        name: "Gaddafi",
        age: 26,
      },
    ],
  });
});

app.get("*", (req, res) => {
  res.status(404).json({ status: "404 Not Found" });
});

module.exports = server;