//
// Variables
//

// Informations about the game status
const game = {
    status: "playing",
    score: 0,
    speed: 20,
    lives: 3,
}

const board = {
    colour: "lightgrey",
    width:  600,
    height: 500,
}

const paddle = {
    colour: "grey",
    width: 100,
    height: 15,
    position: {x: (board.width - 100) / 2, y: board.height - (2 * 15)},
    leftMotion: false,
    rightMotion: false,
    speed: 7,
}

const ball = {
    colour: "red",
    position: {x: (board.width - 24) / 2, y: board.height - 24 * 4},
    radius: 12,
    movement: {x: 5, y: 5},
}

const brick = {
    position: {x: 0, y: 0},
    width: 75,
    height: 15,
    status: "active",
    colour: "#FF6B2B",
}

var brickPadding = 25;
var rows = 4;
var columns = board.width / (brick.width + brickPadding);

var bricks = []

for (var column=0; column < columns; column++) {
    bricks[column] = [];
    for(var row = 0; row < rows; row++) {
        bricks[column][row] = copyObject(brick);
        bricks[column][row].position.x = column * (brick.width + brickPadding) + brickPadding / 2;
        bricks[column][row].position.y = row * (brick.height + brickPadding) + brickPadding / 2;
    }
}

//
// Functions
//

function continuePlay() {
    var start_again = true;
    for (var column=0; column < columns; column++) {
        for(var row = 0; row < rows; row++) {
            if (bricks[column][row].status === "active") {
                start_again = false;
            }
        }
    }
    if (start_again) {
        for (var column=0; column < columns; column++) {
            for(var row = 0; row < rows; row++)
                bricks[column][row].status = "active";
        }
        ball.movement.x *= 3/2;
        ball.movement.y *= 3/2;
        paddle.movement *= 3/2;
    }
}

function ballBrickCollision() {
    for (var column=0; column < columns; column++) {
        for(var row = 0; row < rows; row++) {
            if (bricks[column][row].status == "active" &&
                ball.position.y > bricks[column][row].position.y &&
                ball.position.y < bricks[column][row].position.y + bricks[column][row].height &&
                ball.position.x > bricks[column][row].position.x &&
                ball.position.x < bricks[column][row].position.x + bricks[column][row].width) {
                bricks[column][row].status = "hit";
                game.score += 1;
                ball.movement.y *= -1;
            }
        }
    }
}

function movePaddle() {
    if (paddle.leftMotion == true && paddle.position.x > 0) {
        paddle.position.x -= paddle.speed;
    } else if (paddle.rightMotion == true && paddle.position.x + paddle.width < board.width) {
        paddle.position.x += paddle.speed;
    }
}

function ballPaddleCollision() {
    if (ball.movement.y > 0 &&
        ball.position.y + ball.movement.y + ball.radius > paddle.position.y &&
        ball.position.y + ball.movement.y + ball.radius < paddle.position.y + ball.movement.y &&
        ball.position.x + ball.movement.x + ball.radius > paddle.position.x &&
        ball.position.x + ball.movement.x - ball.radius < paddle.position.x + paddle.width) {
        ball.movement.y *= -1;
    }
}

function moveBall() {
    if (ball.position.x  - ball.radius < 0 || ball.position.x + ball.radius > board.width)
        ball.movement.x *= -1;
    if (ball.position.y - ball.radius < 0)
        ball.movement.y*= -1;
    ball.position.x += ball.movement.x;
    ball.position.y += ball.movement.y;
}

function gameOver() {
    if (ball.position.y > board.height) {
        if (game.lives > 1) {
            game.lives -= 1;
            ball.position.x = (board.width - 24) / 2;
            ball.position.y = board.height - 24 * 4;
            ball.movement.x = 5;
            ball.movement.y = 5;
            paddle.position.x = (board.width - 100) / 2; 
            paddle.position.y = board.height - (2 * 15);
        } else {
            game.status = "gameOver";
            showGameOver();
        }
    }
}

function loop() {
    if (game.status == "playing") {
        gameOver();
        ballBrickCollision();
        ballPaddleCollision();
        continuePlay();
        movePaddle();
        moveBall();
    }
}

function drawBricks() {
    for (var column=0; column < columns; column++) {
        for(var row = 0; row < rows; row++) {
            if (bricks[column][row].status == "active") {
                drawRect(bricks[column][row].position.x, bricks[column][row].position.y, bricks[column][row].width, bricks[column][row].height, bricks[column][row].colour);
            }
        }
    }
}

function draw() {
    drawBoard(board.width, board.height, board.colour);
    drawRect(paddle.position.x, paddle.position.y, paddle.width, paddle.height, paddle.colour);
    drawBricks();
    drawCircle(ball.position.x, ball.position.y, ball.radius, ball.colour);
    drawLives(game.lives);
    drawScore(game.score);
}

function onKeyDown(keyCode) {
    if (keyCode == ARROW_LEFT) {
        paddle.leftMotion = true;
    } else if (keyCode == ARROW_RIGHT) {
        paddle.rightMotion = true;
    }
}

function onKeyUp(keyCode) {
    if (keyCode == ARROW_LEFT) {
        paddle.leftMotion = false;
    } else if (keyCode == ARROW_RIGHT) {
        paddle.rightMotion = false;
    }
}