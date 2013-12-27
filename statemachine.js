var GameObject = require("./gameobject");
var StateMachine = function() {
    var stateMachine = new GameObject();
    stateMachine({
        run: function() {
            var now = Date.now();
            var frameTime = now - before;
            if(game.state) {
                game.state.fire("update", { now:  now, frameTime: frameTime });
                game.state.fire("draw", { canvas: Canvas, now: now, frameTime: frameTime });
            }
            before = now;
            raf.call(window, game.run);
        },
        state: null
    });
    Object.defineProperty(stateMachine, "state", {
        get: function() {
            return state;
        },
        set: function(newstate) {
            if(state) {
                state.fire("clear");
            }
            newstate.fire("init");
            state = newstate;
        }
    });
    return stateMachine;
};

module.exports = StateMachine;
