"use strict";
var app = require("http").createServer(handler);
var io = require("socket.io").listen(app);
var fs = require("fs");
var url = require("url");

app.listen(8000);

function returnFile(row, res, statusCode){
    var file = fs.readFileSync(__dirname + "/client" + (row.file || row.action));
    res.writeHead(statusCode, {"Content-Type": row.contentType });
    res.end(file, row.type);
}

function handler(req, res) {
    var request = url.parse(req.url, true);
    var action = request.pathname;
    var files = [
        {action: "/", contentType: "text/html", type: "text", file: "/index.html"},
        {action: "/js/player.js", contentType: "text/javascript", type: "text"},
        {action: "/js/tv.js", contentType: "text/javascript", type: "text"},
        {action: "/css/screen.css", contentType: "text/css", type: "text"},
        {action: "/css/fontello.css", contentType: "text/css", type: "text"},
        {action: "/css/animation.css", contentType: "text/css", type: "text"},
        {action: "/img/grass.png", contentType: "image/png", type: "text"},
        {action: "/error.html", contentType: "text/html", type: "text"},
        {action: "/font/fontello.eot", contentType: "application/vnd.ms-fontobject", type: "text"},
        {action: "/font/fontello.svg", contentType: "image/svg+xml", type: "text"},
        {action: "/font/fontello.ttf", contentType: "application/font-ttf", type: "text"},
        {action: "/font/fontello.woff", contentType: "application/font-woff", type: "text"}
    ];
    console.log(req.method);
    // prida Hrace do hry
    if (request.path.match(/^\/game/)) {
        return returnFile(
            {
                action: "/player.html",
                contentType: "text/html",
                type: "text"
            },
            res,
            200);
    }

    // prida TV do hry
    if (request.path.match(/^\/tv/)) {
        return returnFile(
            {
                action: "/tv.html",
                contentType: "text/html",
                type: "text"
            },
            res,
            200);
    }

    for (var i = 0; i < files.length; i++) {
        if (files[i].action == action) { returnFile(files[i], res, 200); break; };
        if (i == files.length - 1) { returnFile(files[i], res, 404); };
    }
}

var Players = require("./server/players");
var players = new Players();

io.sockets.on("connection", function (socket) {
    socket.on("addPlayer", (player) => {
        // add player and emit it
        players.add(player.name, socket.id);
        socket.broadcast.emit("dataChanged", players.getPlayers());
    });

    socket.on("cardChanged", (data) => {
        // player changedCard, emit it
        players.changed(data, socket.id);
        console.log(players.getPlayers());
        socket.broadcast.emit("dataChanged", players.getPlayers());
    });

    socket.on("addTV", () => {
        // send players
        socket.emit("dataChanged", players.getPlayers());
    });

    socket.on("disconnect", () => {
        // remove player and emit it
        players.remove(socket.id);
        socket.broadcast.emit("dataChanged", players.getPlayers());
    });
});
