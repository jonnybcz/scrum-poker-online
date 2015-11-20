"use strict";

class Players {
    constructor() {
        this._players = [];
    }

    /**
     * @return {[{}]}
     */
    getPlayers() {
        return this._players;
    }

    /**
     * @param {String} name
     * @param {String} id   ... socketId
     */
    add(name, id) {
        this._players.push({name, id, number: undefined, selected: false});
    }

    /**
     * @param  {String} id   ... socketId
     */
    remove(id) {
        this._players = this._players.filter(player => { return player.id != id; });
    }

    /**
     * Set selected card on player
     * @param {String} name
     * @param {String} id   ... socketId
     */
    changed(data, id) {
        let player = this._players.filter(player => { return player.id == id; })[0];

        player.selected = data.selected;
        player.number = data.number;
    }
}

module.exports = Players;
