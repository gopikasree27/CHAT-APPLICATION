const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new-user', (username) => {
        socket.username = username;
        console.log(`${username} connected`);
        socket.broadcast.emit('chat message', `👋 ${username} joined the chat`);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', `${socket.username}: ${msg}`);
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('chat message', `❌ ${socket.username} left the chat`);
        }
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
