var TV = function(socket, place) {
    this.socket = socket;
    this.place = place;
    this.data = [];
    /*this.data = [
    {name: "tomas", number: undefined, selected: true},
    {name: "honza", number: undefined, selected: false},
    {name: "michal", number: 8, selected: true},
    {name: "michal", number: undefined, selected: false},
    {name: "dan", number: undefined, selected: false},
    {name: "lukas", number: undefined, selected: false},
    {name: "viktor", number: undefined, selected: false}
    ];*/
    this.render();
    this.socket.on("dataChanged", this.dataChanged.bind(this));
}

TV.prototype.addToGame = function() {
    socket.emit("addTV");
}

TV.prototype.dataChanged = function(data) {
    this.data = data;
    this.render();
}

/**
 * All players has selected card
 * @return {Boolean}
 */
TV.prototype.allPlayersHasSelected = function() {
    return this.data.every(function(p) { return p.selected; });
}

/**
 * @param  {{}} player
 * @return {String}
 */
TV.prototype.renderNumber = function(player) {
    if (this.allPlayersHasSelected()) {
        return "<br/><span class=\"number selected\">" + player.number + "</span>";
    } else {
        if (player.selected) {
            return "<br/><span class=\"number selected-waiting icon-check \">C</span>";
        } else {
            return "<br/><span class=\"number choosing icon-spin6 animate-spin\"></span>";
        }
    }
}

TV.prototype.render = function() {
    console.log(this.data);
    this.place.innerHTML = "";

    for (var i = 0; i < this.data.length; i++) {
        this.place.insertAdjacentHTML("beforeend", "<div class='player'>" + this.data[i].name + this.renderNumber(this.data[i]) + "</div>");
    }
}
