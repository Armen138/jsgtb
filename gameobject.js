var GameObject = function() {
    var gameObject = function(object) {
        object = object || {};
        var properties = Object.getOwnPropertyNames(object);
        for(var i = 0; i < properties.length; i++) {
            var prop = properties[i];
            var desc = Object.getOwnPropertyDescriptor(prop, object);
            Object.defineProperty(gameObject, prop, desc);
        }
    };

    return gameObject;
};

module.exports = GameObject;
