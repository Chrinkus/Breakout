/*
var BREAK_APP = BREAK_APP || {};

// Incomplete, does nothing
(function() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    this.ball = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        r: 10,
        dx: 3,
        dy: -3,
        path: new Path2d()
    }
    this.ball.path.arc(x, y, r, 0, Math.PI * 2);
})
*/
var circle = function(x, y, r) {
    var path = new Path2D();
    path.arc(x, y, r, 0, Math.PI * 2);
    path.closePath();
    return path;
};

var square = function(x, y, s) {
    var path = new Path2D();
    path.rect(x, y, s, s);
    path.closePath();
};

var triangle = function(x, y, s) {
    var path = new Path2D();
    var h = Math.sin(60 * Math.PI / 180) * s;
    path.moveTo(x, y + h);
    path.lineTo(x + s / 2, y);
    path.lineTo(x + s, y + h);
    path.closePath();
    return path;
};

var pentagon = function(x, y, d) {
    var path = new Path2D();
    var s = d / 2 / Math.cos(54 * Math.PI / 180);
    var aH = d / 2 * Math.tan(54 * Math.PI / 180);
    path.moveTo(x + d / 2, y);
    path.lineTo(x + d, y + aH);
    path.lineTo(x + d - aH, y + d);
    path.lineTo(x + aH, y + d);
    path.lineTo(x, y + aH);
    path.closePath();
    return path;
};
