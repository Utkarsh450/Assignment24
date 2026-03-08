import { Server} from "socket.io";
function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173" },
  });
  let rooms = {};

 io.on("connection", (socket) => {
  console.log("User connected:", socket.id);  
  socket.on("create_room", ({ lobbyId, username }) => {

  if (!rooms[lobbyId]) {
    rooms[lobbyId] = {
      host: socket.id,
      participants: {}
    }
  }

  rooms[lobbyId].participants[socket.id] = {
    username: username,
    role: "host"
  }

  socket.join(lobbyId)
  socket.emit("room_created_successfully");
  io.to(lobbyId).emit(
    "participants_list",
    Object.values(rooms[lobbyId].participants)
  )

})

socket.on("join_room", ({code, username})=>{
  console.log("join room is working");
  
    // console.log("rooms", rooms);
  
  if (!rooms[code]) {
        console.log("room does not exist", rooms);
        
    socket.emit("room_error", "Room does not exist")

    return
  }
    socket.join(code)

  rooms[code].participants[socket.id] = {
    username: username,
    role: "participant"
  }
    socket.emit("room_joined", { code, username }); // 👈 important
    socket.to(code).emit("user_joined", username)
  io.to(code).emit(
    "participants_list",
    Object.values(rooms[code].participants)
  )
    
})
socket.on("get_participant",({ roomId})=>{
    if (!rooms[roomId]) {
    socket.emit("room_error", "Room does not exist")
    return
  }

  const participants = Object.values(rooms[roomId].participants)

  socket.emit("participants_list", participants)
})

  socket.on("disconnect", () => {

  for (let roomId in rooms) {

    if (rooms[roomId].participants[socket.id]) {

      delete rooms[roomId].participants[socket.id]

      io.to(roomId).emit(
        "participants_list",
        Object.values(rooms[roomId].participants)
      )

      if (Object.keys(rooms[roomId].participants).length === 0) {
        delete rooms[roomId]
      }

    }

  }

})
});

}

export default setupSocketServer;