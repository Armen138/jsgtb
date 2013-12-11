var Events = require("./events");

var GameState = function() {
    var gameState = {};
    Events.attach(gameState);
    return gameState;
};

