const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "https://campus-cab.vercel.app", 
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // User joins their room
    socket.on("join", (data) => {
      const { userId, userType } = data;

      socket.join(userId);
      console.log(`User ${userType} with ID ${userId} joined room ${userId}`);
    });

    // Example: when the driver accepts a ride
    socket.on("driver-accept-ride", (rideData) => {
      const { userId, pickup, destination } = rideData;

      io.to(userId).emit("ride-accepted", { pickup, destination });
      console.log(`Sent ride-accepted to user ${userId}`);
    });

    // Example: when the driver rejects the ride
    socket.on("driver-reject-ride", (rideData) => {
      const { userId } = rideData;

      io.to(userId).emit("ride-rejected", {
        message: "Ride rejected by driver",
      });
      console.log(`Sent ride-rejected to user ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

// ✅ Add this getter
function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId, getIO };
