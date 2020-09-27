var express = require("express");
const { request } = require("http");
const { get } = require("https");
var app = express();
var morgan = require('morgan');

var clients = [];
var port = process.env.PORT || 3000;

//set up socket for server
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use("/assets", express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(morgan("dev"));

// check user status
function getUserList() {
    var userList = [];
    for(let i = 0; i < clients.length; i++){
        userList[i] = clients[i].name;
    }
    return userList;
}
function setUserTyping(index) {
    var usersList = [];
    for (var i = 0; i < clients.length; i++){
      usersList[i] = clients[i].name; 
    }
    usersList[index] = clients[index].name + " 💬";                 // ballon icons can be found at: https://emojipedia.org
    return usersList;   
}
function setUserPause(index) {
    var usersList = [];
    for (var i = 0; i < clients.length; i++){
      usersList[i] = clients[i].name; 
    }
    usersList[index] = clients[index].name + " 🤐";                 // ballon icons can be found at: https://emojipedia.org
    return usersList;
}

app.get("/", (req, res) => {
    res.render("index");                                            // ejs tu dong nhan file html trong folder views
});

//creat connection between client and server
io.on('connection', (socket) => {
    clients.push(socket);
    // console.log(clients.length);
    // io.emit("user connect");            // io.emit will send msg to all the client incl sender.
    
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    // set up user
    clients[clients.indexOf(socket)].name = "Anonymous guest " + (clients.indexOf(socket) + 1);
    io.emit('users list', getUserList());

    socket.on('set user', (user) => {
        io.emit('info', "New User: " + user);
        clients[clients.indexOf(socket)].name = user;
        io.emit('users list', getUserList());
    });

    socket.on('disconnect', () => {
        if(clients[clients.indexOf(socket)].name == null){
            // do nothing
        }
        else {
            io.emit("info", clients[clients.indexOf(socket)].name + " has been disconnected!!");
        }
        clients.splice(clients.indexOf(socket), 1);
        io.emit('user list', getUserList());
        delete clients[clients.indexOf(socket)];
    });

    // check if user is typing
    socket.on("typing", () => {
        io.emit("typing flag", setUserTyping(clients.indexOf(socket)));
    });
    
    socket.on("not typing", () => {
        io.emit("typing flag", getUserList());
    });

    socket.on("pause", () => {
        io.emit("typing flag", setUserPause(clients.indexOf(socket)));
    });
});


http.listen(port, () => {
    console.log("Listening on port: " + port);
});