var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

var paddleH = 10;
var paddleW = 75;
var paddleX = (canvas.width - paddleW) / 2;

var rightPressed = false;
var leftPressed = false;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleH, paddleW, paddleH);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleW) {
            dy = -dy;
        } else {
            alert("GAME OVER");
            document.location.reload();
        }
    }

    x += dx;
    y += dy;

    if (rightPressed && paddleX < canvas.width - paddleW) {
        paddleX += 7;
    }
    if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = true;
    } else if (e.keyCode === 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = false;
    } else if (e.keyCode === 37) {
        leftPressed = false;
    }
}
setInterval(draw, 10);
