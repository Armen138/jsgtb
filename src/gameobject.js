'use strict';
var GameObject = function(object, events) {
    var construct = (this instanceof GameObject);
    var create = function(object) {
        var eventList = {};
        var subStates = [];
        var gameObject = function(object) {
            object = object || {};
            var properties = Object.getOwnPropertyNames(object);
            for(var i = 0; i < properties.length; i++) {
                var prop = properties[i];
                var desc = Object.getOwnPropertyDescriptor(object, prop);
                Object.defineProperty(gameObject, prop, desc);
            }
            return gameObject;
        };

        gameObject({
            on: function(ev, f) {
                if(!eventList[ev]) {
                    eventList[ev] = [];
                }
                eventList[ev].push(f);
                return gameObject;
            },
            fire: function(ev, evobj, stat) {
                var i;
                stat = stat || { stop: false };
                if(eventList[ev]) {
                    for(i = 0; i < eventList[ev].length; i++) {
                        if(eventList[ev][i].call(gameObject, evobj)) {
                            stat.stop = true;
                            break;
                        }
                    }
                }
                if(subStates.length > 0 && !stat.stop) {
                    for(i = 0; i < subStates.length; i++) {
                        subStates[i].fire(ev, evobj, stat);
                        if(stat.stop) {
                            break;
                        }
                    }
                }
                return gameObject;
            },
            clearEventListeners: function() {
                eventList = {};
            },
            removeEventListener: function(ev, f) {
                if(!eventList[ev]) {
                    return;
                }
                for(var i = 0; i < eventList[ev].length; i++) {
                    if(eventList[ev][i] === f) {
                        eventList[ev].splice(i, 1);
                        break;
                    }
                }
                return gameObject;
            },
            add: function(state) {
                subStates.push(state);
                return gameObject;
            },
            remove: function(state) {
                for(var i = 0; i < subStates.length; i++) {
                    if(subStates[i] === state) {
                        subStates.splice(i, 1);
                        console.log('remove sub-state ' + i);
                        return gameObject;
                    }
                }
                return gameObject;
            }
        });
        if(events) {
            for(var key in events) {
                gameObject.on(key, events[key]);
            }
        }
        return gameObject(object);
    }
    if(construct) {
        return create(object);
    } else {
        return function(options) {
            var gameObject = create(object);
            return gameObject(options);
        }
    }
};

module.exports = GameObject;
