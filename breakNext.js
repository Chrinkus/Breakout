var BREAK_APP = {
    canvas: document.getElementById("myCanvas"),
    // ctx: this.canvas.getContext("2d"),
    ctx: document.getElementById("myCanvas").getContext("2d"),
    
    entities: [],
    init: function() {
        // populate entites
        var ball = new Ball();
        this.entities.push(ball);
    },

    update: function () {
        // update entities
        var that = this;
        this.entities.forEach(function(cur) {
            cur.update();
        });
    },

    draw: function() {
        var that = this;
        this.utils.clear();
        // draw entities
        this.entities.forEach(function(cur) {
            cur.draw(that.ctx);
        });
    }
}; 

BREAK_APP.utils = {
    CW: BREAK_APP.canvas.width,
    CH: BREAK_APP.canvas.height,
    clear: function() {
        BREAK_APP.ctx.clearRect(0, 0, this.CW, this.CH);
    }
};

function Ball(x, y, r, v) {
    this.x = x || BREAK_APP.canvas.width / 2;
    this.y = y || BREAK_APP.canvas.height - 30;
    this.r = r || 10;
    this.dx = v || 3;
    this.dy = -v || -3;
    this.color = "#0095DD";
    // I'm adding the path in this manner so that it is set when a new Ball
    // object is created without needing to be manually called.
    this.path = (function() {
        var path = new Path2D();
        path.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        path.closePath();
        return path;
    })();
}

Ball.prototype.update = function() {
    var newX = this.x + this.dx;
    var newY = this.y + this.dy;
    if (newX > BREAK_APP.canvas.width || newX < 0) {
        this.dx = -this.dx;
    }
    if (newY > BREAK_APP.canvas.height || newY < 0) {
        this.dy = -this.dy;
    }
    this.x = newX;
    this.y = newY;
};

Ball.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fill(this.path);
};

(function () {
    BREAK_APP.init();
    function main(tStamp) {
        BREAK_APP.stopMain = window.requestAnimationFrame(main);
        
        BREAK_APP.draw();

        BREAK_APP.update(tStamp);
    } 

    main();
})();
