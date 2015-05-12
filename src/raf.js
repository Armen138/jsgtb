var requestAnimationFrame = (
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(cb) { setTimeout(cb, 17); }
);
module.exports = requestAnimationFrame;

