const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(); // attach to Express if needed
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join-room", ({ roomId, userId }) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });

  socket.on("signal", data => {
    socket.to(data.roomId).emit("signal", data);
  });
});

module.exports = { server, io };
