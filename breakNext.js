// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Claim the global name
// One of the main issues with the tutorial was the excessive use of global
// variables. Here I am setting the variable name that will encompass most of
// this project.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var BREAK_APP = BREAK_APP || {};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Top level variables
// Access to the canvas and ctx APIs will be common through all projects. Also,
// defining a settings object for commonly used values (colours, fonts) can
// improve project cohesion. Also, collecting all entities and messaging into
// arrays or objects makes drawing cycles easier.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
BREAK_APP.canvas = document.getElementById("myCanvas");
BREAK_APP.ctx = BREAK_APP.canvas.getContext("2d");

BREAK_APP.settings = {
    font: "16px Arial",
    color: "#0095DD"
};

BREAK_APP.entities = [];
BREAK_APP.messages = {};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// The brickField is a game specific list of settings.
// Abstraction Opportunity: could make the field more dynamic by setting brick
// width and height off of row and column counts in relation to the size of the
// canvas. This way the field can grow or shrink in number of bricks to match
// the canvas.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
BREAK_APP.brickField = {
    rowCount: 3,
    columnCount: 5,
    bricks: [],
    // Create a brick object in each column of each row in a 2D array
    fill: function() {
        for (let c = 0; c < this.columnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.rowCount; r++) {
                this.bricks[c][r] = new Brick(c, r);
            }
        }
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Game Initialization
// Create game players/actors/entities and place them into appropriate varia-
// bles for drawing/updating iteration.
// Game Design Consideration: should the init be written in such a way that it
// is appropriate to use as a soft reset as well?
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
BREAK_APP.init = function() {
    this.entities.push(new Ball()); 
    this.entities.push(new Paddle());

    this.brickField.fill();
    this.entities.push(this.brickField.bricks);

    // Location: score.update is in Ball.update brick collision check
    this.messages.score = new TextBox(8, 20, "counterInc", "Score: ", 0);

    // Location: lives.update is in Ball.update screen boundary check
    this.messages.lives = new TextBox(this.utils.CW - 65, 20, "counterDec",
            "Lives: ", 3);
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Update & Draw
// These functions will be called every frame. The contents of each could be
// instead placed into the main loop to save a function call if this is not an
// acceptably efficient method. As it is, the main loop is fairly clean.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
BREAK_APP.update = function () {
    // update entities
    BREAK_APP.utils.each(BREAK_APP.entities, function(entity) {
        entity.update();
    });
};

BREAK_APP.draw = function() {
    // wipe the last draw
    this.utils.clear();

    // draw entities
    BREAK_APP.utils.each(BREAK_APP.entities, function(entity) {
        entity.draw(BREAK_APP.ctx);
    });

    // draw messages
    for (let msg in this.messages) {
        this.messages[msg].draw(this.ctx);
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Utilities
// These are functions that help other functions to do their jobs or streamline
// common calls. Collision detection is found here though for more robust CD
// systems, a separate top level property of BREAK_APP may be dedicated to it.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
BREAK_APP.utils = {
    // Commonly used values stored to save lookups/verbosity
    CW: BREAK_APP.canvas.width,
    CH: BREAK_APP.canvas.height
};

// Wipes canvas for each redraw. Could take args if smaller redraws are
// desirable.
BREAK_APP.utils.clear = function() {
    BREAK_APP.ctx.clearRect(0, 0, this.CW, this.CH);
};

// Each helps to apply the draw and update functions to each element of a deep
// array of arrays. This is necessary because the brick field is a 2D array
// within the entities array.
BREAK_APP.utils.each = function(arr, f) {
    arr.forEach(function(ent) {
        if (ent.length && typeof ent === "object") {
            return BREAK_APP.utils.each(ent, f);
        }
        f(ent);
    });
};

// Next styled CD solution w/radius subbed in for circle tests
BREAK_APP.utils.collision = function(entity, that) {
    return that.x - that.r < entity.x + entity.w &&
        that.x + that.r > entity.x &&
        that.y - that.r < entity.y + entity.h &&
        that.y + that.r > entity.y;
};

BREAK_APP.utils.winCheck = function() {
    if (BREAK_APP.messages.score.val === 15) {
        alert("YOU WIN, CONGRATULATIONS!!");
        document.location.reload();
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// User Input
// The only user input for this game is using the left and right arrows to
// move the paddle. This current control scheme is ripped from the Next system.
// Perhaps calling the "delete" method of the object prototype is heavier than
// needed.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
BREAK_APP.inputs = {
    keysDown: {},

    init: function() {

        document.addEventListener("keydown", function(e) {
            this.keysDown[e.keyCode] = true;
        }.bind(this), false);

        document.addEventListener("keyup", function(e) {
            delete this.keysDown[e.keyCode];
        }.bind(this), false);
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Constructors
// I understand these are all hitting the global object. Will consider refac-
// toring them into properties of a top level "constructors" object.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
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

                BREAK_APP.utils.winCheck();
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
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Keyboard Input Legend
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Key          Keycode     Action
    // ===          =======     ======
    // left         37          Move Paddle left
    // right        39          Move Paddle right
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    if (39 in BREAK_APP.inputs.keysDown && this.x < this.xMax) {
        this.x += this.dx;
    }
    if (37 in BREAK_APP.inputs.keysDown && this.x > 0) {
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

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Main Loop
// This main loop is clean. Request animation, schedule the draw, update state.
// Until there is a need to offload certain processes to a webworker this will
// be my preferred pattern.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

(function () {
    "use strict";
    BREAK_APP.init();
    function main() {
        BREAK_APP.stopMain = window.requestAnimationFrame(main);
        
        BREAK_APP.draw();

        BREAK_APP.update();
    } 

    BREAK_APP.inputs.init();

    main();
})();
