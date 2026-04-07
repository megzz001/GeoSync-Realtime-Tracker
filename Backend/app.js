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
    socket.on("send-location", function(data){
        io.emit("receive-location", { id: socket.id, ...data});
    });
    console.log("A user connected "); 
    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);
        console.log("A user disconnected");
    });
});

app.get('/', function (req, res) {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});