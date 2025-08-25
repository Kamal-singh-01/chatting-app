import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// used to store online users
const userSocketMap = {}; // {userId: socketId}

// Function to get receiver's socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || "http://localhost:5173"], // for production use your deployed frontend URL
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Get userId from the handshake query
  const userId = socket.handshake.query.userId;

  if (userId) {
    // Store userId and socketId
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  }

  // Emit the online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Remove the userId and socketId from the map
    if (userId) {
      delete userSocketMap[userId];
      console.log(`User ${userId} disconnected`);
    }

    // Emit updated online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
