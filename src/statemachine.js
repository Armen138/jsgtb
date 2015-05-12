var GameObject = require("./gameobject");
var StateMachine = function() {
    var state  = null;
    var before = 0;
    var stateMachine = new GameObject();
    stateMachine({
        run: function() {
            var now = Date.now();
            var frameTime = now - before;
            if(stateMachine.state) {
                stateMachine.state.fire("update", { now:  now, frameTime: frameTime });
                stateMachine.state.fire("draw", { canvas: Canvas, now: now, frameTime: frameTime });
            }
            before = now;
            raf.call(window, stateMachine.run);
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
