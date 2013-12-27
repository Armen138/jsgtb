var Events = require("./events");
var GameObject = require("./gameobject");
var GameState = function() {
    var gameState = new GameObject();
    gameState(new Events());
    return gameState;
};

module.exports = GameState;
