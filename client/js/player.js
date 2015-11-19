var Player = function(socket) {
    this.socket = socket;
}

/**
 * If gamer has not name, else game him redirect
 * @return {String}
 */
Player.prototype.tryGetName = function() {
    var name = localStorage.getItem("name", name);

    if (!name) { window.location.replace("/"); }

    return name;
}

Player.prototype.addToGame = function() {
    socket.emit("addPlayer", {
        name: this.tryGetName()
    });
}
