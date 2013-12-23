"strict mode";
var raf = require("./raf");
var Canvas = require("./canvas");
var before = 0;

var game = {
        mouse: [],
        run: function() {
            var now = Date.now();
            var frameTime = now - before;
            if(game.state) {
                game.state.fire("update", now);
                game.state.fire("draw", { canvas: Canvas, now: now, frameTime: frameTime });
            }
            before = now;
            raf.call(window, game.run);
        },
        touches: {}
    },
    state = null;

Object.defineProperty(game, "state", {
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

window.addEventListener("keyup", function(e) {
    if(game.state) {
        game.state.fire("keyup", {
            code: e.keyCode,
            ctrl: e.ctrlKey,
            alt: e.altKey,
            shift: e.shiftKey
        });
    }
});
window.addEventListener("keydown", function(e) {
    if(game.state) {
        game.state.fire("keydown", {
            code: e.keyCode,
            ctrl: e.ctrlKey,
            alt: e.altKey,
            shift: e.shiftKey
        });
    }
});

window.addEventListener("mousemove", function(e) {
    if(game.state) {
        var x = e.clientX - Canvas.position.X;
        var y = e.clientY - Canvas.position.Y;
        game.state.fire("mousemove", {X: x, Y: y});
    }
});

Canvas.element.addEventListener("mousedown", function(e) {
    game.mouse[e.button] = Date.now();
    e.preventDefault();
    if(game.state) {
        var x = e.clientX - Canvas.position.X;
        var y = e.clientY - Canvas.position.Y;
        game.state.fire("mousedown", {X: x, Y: y, button: e.button});
    }
});


Canvas.element.addEventListener("mouseup", function(e) {
    var now = Date.now();
    var x, y;
    console.log(now - game.mouse[e.button]);
    if(now - game.mouse[e.button] < 150) {
        if(game.state) {
            x = e.clientX - Canvas.position.X;
            y = e.clientY - Canvas.position.Y;
            game.state.fire("click", {X: x, Y: y, button: e.button});
        }
    }
    game.mouse[e.button] = null;
    if(game.state) {
        x = e.clientX - Canvas.position.X;
        y = e.clientY - Canvas.position.Y;
        game.state.fire("mouseup", {X: x, Y: y, button: e.button});
    }
});

window.addEventListener("touchstart", function(e) {
    console.log("touchstart");
    if(game.state && game.state.mousedown) {
        var touches = e.changedTouches;
        if(touches.length > 0) {
            var x = (touches[0].pageX | 0);// - Canvas.position.X;
            var y = (touches[0].pageY | 0);// - Canvas.position.Y;
            game.state.fire("touchstart", touches);
            game.touches[touches[0].identifier] = Date.now();
        }
    }
});


window.addEventListener("touchmove", function(e) {
    console.log("touchmove");
    if(game.state && game.state.mousemove) {
        var touches = e.changedTouches;
        if(touches.length > 0) {
            var x = (touches[0].pageX | 0);// - Canvas.position.X;
            var y = (touches[0].pageY | 0);// - Canvas.position.Y;
            game.state.fire("touchmove", touches);
        }
    }
});

window.addEventListener("touchend", function(e) {
    console.log("touchend");
    var touches = e.changedTouches;
    var x, y;
    if(game.state && game.state.mouseup) {
        if(touches.length > 0) {
            x = (touches[0].pageX | 0);// - Canvas.position.X;
            y = (touches[0].pageY | 0);// - Canvas.position.Y;
            game.state.fire("touchend", touches);

        }
    }
});
module.exports = game;

