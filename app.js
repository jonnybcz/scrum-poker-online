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
        {action: "/error.html", contentType: "text/html", type: "text"}
    ];

    // prida Hrace do hry
    if (request.path.match(/^\/player\//)) {
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

var players = {};
var tvs = [];

function addPlayer(socket, player) {
    players[player.name] = player;
    console.log("######");
    console.log(players);
    socket.broadcast.emit("dataChanged", players);
}

function addTV(tv) {
    console.log("######");
    console.log(arguments);
}



io.sockets.on("connection", function (socket) {
    socket.on("addPlayer", addPlayer.bind(this, socket));
    socket.on("addTV", addTV);
});
