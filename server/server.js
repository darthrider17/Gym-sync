const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for extension/web app access
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', ({ username }) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms.set(roomId, {
      id: roomId,
      users: [{ id: socket.id, name: username, isHost: true }],
      queue: [],
      currentSong: null,
      isPlaying: false,
      startTime: 0
    });
    
    socket.join(roomId);
    socket.emit('room_created', { roomId, state: rooms.get(roomId) });
  });

  socket.on('join_room', ({ roomId, username }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.users.push({ id: socket.id, name: username, isHost: false });
      
      socket.join(roomId);
      socket.emit('room_joined', { state: room });
      io.to(roomId).emit('user_joined', { username });
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('add_song', ({ roomId, song }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.queue.push(song);
      io.to(roomId).emit('queue_updated', room.queue);
    }
  });

  socket.on('play_pause', ({ roomId }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.isPlaying = !room.isPlaying;
      // Soft sync timestamp
      room.startTime = Date.now(); 
      io.to(roomId).emit('playback_changed', { 
        isPlaying: room.isPlaying, 
        timestamp: room.startTime 
      });
    }
  });

  socket.on('disconnect', () => {
    // Cleanup logic would go here
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Gym Sync Server running on port ${PORT}`);
});