"strict mode";
var raf = require("./raf");
var Canvas = require("./canvas");

var game = {
        mouse: [],
        run: function() {
            if(game.state) {
                game.state.run();
            }
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
            state.clear(function() {
                newstate.init();
                state = newstate;
            });
        } else {
            newstate.init();
            state = newstate;
        }
    }
});

window.addEventListener("keyup", function(e) {
    if(game.state && game.state.keyup) {
        game.state.keyup(e.keyCode, {
            ctrl: e.ctrlKey,
            alt: e.altKey,
            shift: e.shiftKey
        });
    }
    if(e.keyCode === 27) {
        game.state = game.paused;
    }
});
window.addEventListener("keydown", function(e) {
    if(game.state && game.state.keydown) {
        game.state.keydown(e.keyCode, {
            ctrl: e.ctrlKey,
            alt: e.altKey,
            shift: e.shiftKey
        });
    }
});

window.addEventListener("mousemove", function(e) {
    if(game.state && game.state.mousemove) {
        var x = e.clientX - Canvas.position.X;
        var y = e.clientY - Canvas.position.Y;
        game.state.mousemove({X: x, Y: y});
    }
});

// window.addEventListener("contextmenu", function(e) {
//     if(game.state && game.state.click) {
//         var x = e.clientX - Canvas.position.X;
//         var y = e.clientY - Canvas.position.Y;
//         game.state.click({X: x, Y: y, button: 2});
//     }
// });

// window.addEventListener("click", function(e) {
//     if(game.state && game.state.click) {
//         var x = e.clientX - Canvas.position.X;
//         var y = e.clientY - Canvas.position.Y;
//         game.state.click({X: x, Y: y, button: e.button});
//     }
// });

Canvas.element.addEventListener("mousedown", function(e) {
    game.mouse[e.button] = Date.now();
    e.preventDefault();
    if(game.state && game.state.mousedown) {
        var x = e.clientX - Canvas.position.X;
        var y = e.clientY - Canvas.position.Y;
        game.state.mousedown({X: x, Y: y, button: e.button});
    }
});


Canvas.element.addEventListener("mouseup", function(e) {
    var now = Date.now();
    var x, y;
    console.log(now - game.mouse[e.button]);
    if(now - game.mouse[e.button] < 150) {
        if(game.state && game.state.click) {
            x = e.clientX - Canvas.position.X;
            y = e.clientY - Canvas.position.Y;
            game.state.click({X: x, Y: y, button: e.button});
        }
    }
    game.mouse[e.button] = null;
    if(game.state && game.state.mouseup) {
        x = e.clientX - Canvas.position.X;
        y = e.clientY - Canvas.position.Y;
        game.state.mouseup({X: x, Y: y, button: e.button});
    }
});

window.addEventListener("touchstart", function(e) {
    console.log("touchstart");
    if(game.state && game.state.mousedown) {
        var touches = e.changedTouches;
        if(touches.length > 0) {
            var x = (touches[0].pageX | 0);// - Canvas.position.X;
            var y = (touches[0].pageY | 0);// - Canvas.position.Y;
            game.state.mousedown({X: x, Y: y});
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
            game.state.mousemove({X: x, Y: y});
            //game.touches[touches[0].identifier] = Date.now();
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
            game.state.mouseup({X: x, Y: y});

            //game.touches[touches[0].identifier] = null;
        }
    }
    console.log(game.touches[touches[0].identifier]);
    console.log(Date.now() - game.touches[touches[0].identifier]);
    if(/*game.touches[touches[0].identifier] &&
        Date.now() - game.touches[touches[0].identifier] < 400 &&*/
        game.state.click) {
        //if(touches.length > 0) {
            x = (touches[0].pageX | 0);// - Canvas.position.X;
            y = (touches[0].pageY | 0);// - Canvas.position.Y;

            game.state.click({X: x, Y: y});
        //}
    }

});
module.exports = game;

