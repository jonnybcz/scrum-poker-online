var Player = function(socket, cards) {
    this.socket = socket;
    this.cards = cards;

    for (var i = 0; i < this.cards.length; i++) {
        this.cards[i].addEventListener("click", this);
    }
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

Player.prototype.unselectAll = function() {
    for (var i = 0; i < this.cards.length; i++) { this.cards[i].classList.remove("selected"); }
}

/**
 * @param  {HTMLElement} target
 */
Player.prototype.selectCard = function(target) {
    target.classList.add("selected");
}

/**
 * @param  {Boolean} target
 */
Player.prototype.isItSelectedCard = function(target) {
    return target.classList.contains("selected");
}

/**
 * @param  {Event} e
 */
Player.prototype.handleEvent = function(e) {
    var card = e.target;

    if (this.isItSelectedCard(card)) {
        this.unselectAll();
    }else {
        this.unselectAll();
        this.selectCard(card);
    }

    socket.emit("cardChanged", {selected: this.isItSelectedCard(card), number: e.target.textContent});
}
