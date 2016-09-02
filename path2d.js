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
