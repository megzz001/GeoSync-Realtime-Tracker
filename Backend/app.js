const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const path = require('path');


const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.set(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});