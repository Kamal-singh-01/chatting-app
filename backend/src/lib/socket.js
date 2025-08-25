import { Server } from "socket.io";

const userSocketMap = {}; // {userId: socketId}
let io; // declare io here

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function getOnlineUsers() {
  return Object.keys(userSocketMap);
}

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL || "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);

      if (userId) {
        delete userSocketMap[userId];
        console.log(`User ${userId} disconnected`);
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });

  return io;
}

// ✅ Export io so other files can import it
export { io };
