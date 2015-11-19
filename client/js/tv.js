var TV = function(socket) {
    this.socket = socket;

    this.socket.on("dataChanged", this.dataChanged.bind(this));
}

TV.prototype.addToGame = function() {
    socket.emit("addTV");
}

TV.prototype.dataChanged = function(data) {
    console.log(data);
}
