/*jshint node:true */
'use strict';
var raf = require('jsgtb/raf');
var Events = require('jsgtb/events');

var buttonStates = [];
var axisStates = [];
var lastPad = null;
var padID = null;
var lastAngle = 0;
var gamepad = {
    deadzone: 0.5,
    poll: function() {
        var i;
        var pad = navigator.webkitGetGamepads && navigator.webkitGetGamepads()[0];
        if(pad) {
            if(!padID) {
                padID = pad.id;
                //console.log('gamepad: ' + padID);
            }
            for(i = 0; i < pad.buttons.length; i++) {
                if(pad.buttons[i] !== 0) {
                    if(!buttonStates[i]) {
                        gamepad.fire('button', { which: i, action: 'down'});
                        buttonStates[i] = true;
                    }
                } else {
                    if(buttonStates[i]) {
                        gamepad.fire('button', { which: i, action: 'up'});
                        buttonStates[i] = false;
                    }
                }
            }
            for(i = 0; i < pad.axes.length; i++) {
                if(Math.abs(pad.axes[0]) > gamepad.deadzone ||
                    Math.abs(pad.axes[1]) > gamepad.deadzone) {
                    //calc axis and fire event
                    var angle = Math.atan2(pad.axes[1], pad.axes[0]);
                    var a = Math.abs(pad.axes[0]);
                    var b = Math.abs(pad.axes[1]);

                    var strength = Math.sqrt(a * a + b * b);
                    gamepad.fire('angle', { value: angle, strength: strength });
                    lastAngle = angle;
                } else {
                    if(lastAngle !== 0) {
                        gamepad.fire('angle', { value: 0, strength: 0 });
                        lastAngle = 0;
                    }
                }
                if(Math.abs(pad.axes[i]) > gamepad.deadzone) {
                    gamepad.fire('axis', { which: i, value: pad.axes[i], action: 'engage' });
                } else {
                    if(Math.abs(axisStates[i]) > gamepad.deadzone) {
                        gamepad.fire('axis', {which: i, value: pad.axes[i], action: 'release'});
                    }
                }
                axisStates[i] = pad.axes[i];
            }
            lastPad = pad;
        }
        raf.call(window, gamepad.poll);
    },
    A: 0,
    B: 1,
    X: 2,
    Y: 3
};

Events.attach(gamepad);
gamepad.poll();

module.exports = gamepad;
