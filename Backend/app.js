const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const path = require('path');


const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

io.on("connection",function(socket){
    console.log("A user connected ");  
});

app.get('/', function (req, res) {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});