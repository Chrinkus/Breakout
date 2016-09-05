var BREAK_APP = BREAK_APP || {};

BREAK_APP.canvas = document.getElementById("myCanvas");
BREAK_APP.ctx = BREAK_APP.canvas.getContext("2d");

BREAK_APP.entities = [];
BREAK_APP.init = function() {
    this.entities.push(new Ball()); 
    this.entities.push(new Paddle());
};

BREAK_APP.update = function () {
    // update entities
    function updater(entity) {
        entity.update();
    }
    BREAK_APP.utils.each(BREAK_APP.entities, updater);
};

BREAK_APP.draw = function() {
    this.utils.clear();
    // draw entities
    function drawer(entity) {
        entity.draw(BREAK_APP.ctx);
    }
    BREAK_APP.utils.each(BREAK_APP.entities, drawer);
};

BREAK_APP.utils = {
    CW: BREAK_APP.canvas.width,
    CH: BREAK_APP.canvas.height
};

BREAK_APP.utils.clear = function() {
    BREAK_APP.ctx.clearRect(0, 0, this.CW, this.CH);
};

BREAK_APP.utils.each = function(arr, f) {
    arr.forEach(function(ent) {
        if (ent.length && typeof ent === "object") {
            return BREAK_APP.utils.each(ent);
        }
        f(ent);
    });
};

BREAK_APP.inputs = {
    rightPressed: false,
    leftPressed: false
};

function Ball(x, y, r, v) {
    "use strict";
    var that = this;
    this.x = x || BREAK_APP.canvas.width / 2;
    this.y = y || BREAK_APP.canvas.height - 30;
    this.r = r || 10;
    this.dx = v || 3;
    this.dy = -v || -3;
    this.color = "#0095DD";
    // Path2D use: I initially wanted to use an IIFE thinking that it would be
    // updated each frame but instead it became a static ball. By calling it
    // each frame now w/x & y arguments I'm creating a new ball everytime. This
    // was something I had hoped to avoid using Path2D. In this case, the only
    // benefit is NOT having to pass ctx in to construct the ball.
    this.path = function(x, y) {
        var path = new Path2D();
        path.arc(x, y, that.r, 0, Math.PI * 2);
        path.closePath();
        return path;
    };
}

Ball.prototype.update = function() {
    // is this actually DRY or just DUMB?
    var newX = this.x + this.dx;
    var newY = this.y + this.dy;
    if (newX > BREAK_APP.canvas.width || newX < 0) {
        this.dx = -this.dx;
    }
    if (newY > BREAK_APP.canvas.height || newY < 0) {
        this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
};

Ball.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fill(this.path(this.x, this.y));
};

function Paddle(x, y, h, w, v) {
    "use strict";
    var that = this;
    this.x = x || (BREAK_APP.utils.CW - (w || 75)) / 2;
    this.y = y || (BREAK_APP.utils.CH - (h || 10));
    this.w = w || 75;
    this.h = h || 10;
    this.dx = v || 9;
    this.xMax = BREAK_APP.utils.CW - (w || 75);
    this.color = "#0095DD";
    this.path = function(x, y) {
        var path = new Path2D();
        path.rect(x, y, that.w, that.h);
        path.closePath();
        return path;
    };
}

Paddle.prototype.update = function() {
    // input
    if (BREAK_APP.inputs.rightPressed && this.x < this.xMax) {
        this.x += this.dx;
    }
    if (BREAK_APP.inputs.leftPressed && this.x > 0) {
        this.x -= this.dx;
    }
};

Paddle.prototype.draw = function(ctx) {
    Ball.prototype.draw.call(this, ctx);
    //ctx.fillStyle = this.color;
    //ctx.fill(this.path(this.x, this.y));
};

(function () {
    BREAK_APP.init();
    function main(tStamp) {
        BREAK_APP.stopMain = window.requestAnimationFrame(main);
        
        BREAK_APP.draw();

        BREAK_APP.update(tStamp);
    } 

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode === 39) {
            BREAK_APP.inputs.rightPressed = true;
        } else if (e.keyCode === 37) {
            BREAK_APP.inputs.leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode === 39) {
            BREAK_APP.inputs.rightPressed = false;
        } else if (e.keyCode === 37) {
            BREAK_APP.inputs.leftPressed = false;
        }
    }

    main();
})();
