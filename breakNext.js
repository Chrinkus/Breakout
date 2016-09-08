var BREAK_APP = BREAK_APP || {};

BREAK_APP.canvas = document.getElementById("myCanvas");
BREAK_APP.ctx = BREAK_APP.canvas.getContext("2d");

BREAK_APP.settings = {
    font: "16px Arial",
    color: "#0095DD"
};

BREAK_APP.entities = [];
BREAK_APP.messages = {};

BREAK_APP.brickField = {
    rowCount: 3,
    columnCount: 5,
    bricks: [],
    fill: function() {
        for (let c = 0; c < this.columnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.rowCount; r++) {
                this.bricks[c][r] = new Brick(c, r);
            }
        }
    }
};

BREAK_APP.init = function() {
    this.entities.push(new Ball()); 
    this.entities.push(new Paddle());

    this.brickField.fill();
    this.entities.push(this.brickField.bricks);

    // Location: score.update is in Ball.update brick collision check
    this.messages.score = new TextBox(8, 20, "counterInc", "Score: ", 0);

    // Display only currently
    this.messages.lives = new TextBox(this.utils.CW - 65, 20, "counterDec",
            "Lives: ", 3);
};

BREAK_APP.update = function () {
    // update entities
    function updater(entity) {
        entity.update();
    }
    BREAK_APP.utils.each(BREAK_APP.entities, updater);
};

BREAK_APP.draw = function() {
    // wipe the last draw
    this.utils.clear();

    // draw entities
    function drawer(entity) {
        entity.draw(BREAK_APP.ctx);
    }
    BREAK_APP.utils.each(BREAK_APP.entities, drawer);

    // draw messages
    for (let msg in this.messages) {
        this.messages[msg].draw(this.ctx);
    }
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
            return BREAK_APP.utils.each(ent, f);
        }
        f(ent);
    });
};

BREAK_APP.utils.collision = function(entity, that) {
    // Next styled CD solution w/radius subbed in for circle tests
    return that.x - that.r < entity.x + entity.w &&
        that.x + that.r > entity.x &&
        that.y - that.r < entity.y + entity.h &&
        that.y + that.r > entity.y;
};

BREAK_APP.inputs = {
    rightPressed: false,
    leftPressed: false
};

function Ball(x, y, r, v) {
    "use strict";
    var that = this;
    this.x = x || BREAK_APP.utils.CW / 2;
    this.y = y || BREAK_APP.utils.CH - 30;
    this.r = r || 10;
    this.dx = v || 3;
    this.dy = -v || -3;
    this.color = "#0095DD";
    this.path = function(x, y) {
        var path = new Path2D();
        path.arc(x, y, that.r, 0, Math.PI * 2);
        path.closePath();
        return path;
    };
}

Ball.prototype.reset = function() {
    this.x = BREAK_APP.utils.CW / 2;
    this.y = BREAK_APP.utils.CH - 30;
    this.dx = 3;
    this.dy = -3;
};

Ball.prototype.update = function() {
    // is this actually DRY or just DUMB?
    var that = this;
    var newX = this.x + this.dx;
    var newY = this.y + this.dy;

    if (newX > BREAK_APP.canvas.width - this.r || newX < this.r) {
        this.dx = -this.dx;
    }
    if (newY < this.r) {
        this.dy = -this.dy;
    } else if (newY > BREAK_APP.canvas.height - this.r) {
        // reduce lives
        BREAK_APP.messages.lives.update();
        
        if (!BREAK_APP.messages.lives.val) {
            // if no lives left, game over
            alert("GAME OVER");
            document.location.reload();
        } else {
            // if lives left, reset ball position
            this.reset();
        }
    }

    // Check collision with all entities in game
    // Question: is there a better way to get "this" into collision()?
    BREAK_APP.utils.each(BREAK_APP.entities, function(ent) {
        // Omit self
        if (ent === that) { return; }

        // Omit "hit" bricks
        if (!ent.statusCode) { return; }

        // Check each entity for collision with "this"
        if (BREAK_APP.utils.collision(ent, that)) {
            // If brick, disappear
            if (ent instanceof Brick) {
                ent.statusCode = 0;
                BREAK_APP.messages.score.update();
            }
            //Change direction
            that.dy = -that.dy;
        }
    });

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
    this.statusCode = 1;
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

function Brick(cVal, rVal) {
    "use strict";
    var that = this;
    this.statusCode = 1;
    this.w = 75;
    this.h = 20;
    this.padding = 10;
    this.offsetTop = 30;
    this.offsetLeft = 30;
    this.x = (cVal * (this.w + this.padding)) + this.offsetLeft;
    this.y = (rVal * (this.h + this.padding)) + this.offsetTop;
    this.color = "#0095DD";
    this.path = function() {
        var path = new Path2D();
        path.rect(that.x, that.y, that.w, that.h);
        path.closePath();
        return path;
    };
}

Brick.prototype.update = function() {
    // Nothing to update at this time
};

Brick.prototype.draw = function(ctx) {
    //Ball.prototype.draw.call(this, ctx);
    if (!this.statusCode) {
        // Don't draw missing bricks
        return;
    }
    ctx.fillStyle = this.color;
    ctx.fill(this.path());
};

function TextBox(x, y, type, msg, initVal) {
    "use strict";
    this.x = x;
    this.y = y;
    this.type = type;
    this.msg = msg;
    this.val = initVal;

    this.color = BREAK_APP.settings.color;
    this.font = BREAK_APP.settings.font;
}

TextBox.prototype.update = function() {
    // Type updates here?
    switch (this.type) {
        case "counterInc":
            this.val++;
            break;
        case "counterDec":
            this.val--;
            break;
        default:
            break;
    }
};

TextBox.prototype.draw = function(ctx) {
    // Access color & font through settings?
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(this.msg + this.val, this.x, this.y);
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
