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

// game board
const board = {
    colour: "lightgrey",
    width:  600,
    height: 500,
}

// paddle
const paddle = {
    colour: "grey",
    width: 100,
    height: 15,
    position: {x: (board.width - 100) / 2, y: board.height - (2 * 15)},
    leftMotion: false,
    rightMotion: false,
    speed: 7,
}

// ball
const ball = {
    colour: "red",
    position: {x: (board.width - 24) / 2, y: board.height - 24 * 4},
    radius: 12,
    movement: {x: 5, y: 5},
}

// brick information
const brickTemplate = {
    position: {x: 0, y: 0},
    width: 75,
    height: 15,
    status: "active",
    colour: "#FF6B2B",
}
const brickPadding = 25;
const rows = 4;
const columns = board.width / (brickTemplate.width + brickPadding);


// create bricks and set position
const bricks = createBricks(brickTemplate, rows, columns);

//
// Functions
//


var start_again = false;

function checkForRestart(brick) {
    if (brick.status === "active") {
        start_again = false;
    }
}

function resetBrick(brick) {
    brick.status = "active";
}

function continuePlay() {
    start_again = true;
    foreachBrick(bricks, rows, columns, checkForRestart)
    if (start_again) {
        foreachBrick(bricks, rows, columns, resetBrick)
        ball.movement.x *= 3/2;
        ball.movement.y *= 3/2;
        paddle.movement *= 3/2;
    }
}


function ballBrickCollision(brick) {
    if (brick.status == "active" && rectangleCircleCollision(ball, brick)) {
        brick.status = "hit";
        game.score += 1;
        ball.movement.y *= -1;
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
    if (ball.movement.y > 0 && rectangleCircleCollision(ball, paddle)) {
        if (ball.movement.x > 0 && ball.position.x < paddle.position.x + paddle.width/2 ||
            ball.movement.x < 0 && ball.position.x > paddle.position.x + paddle.width/2)
            ball.movement.x *= -1;
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
        foreachBrick(bricks, rows, columns, ballBrickCollision);
        ballPaddleCollision();
        continuePlay();
        movePaddle();
        moveBall();
    }
}

function drawBrick(brick) {
    if (brick.status == "active") {
        drawRect(brick.position.x, brick.position.y, brick.width, brick.height, brick.colour);
    }
}

function draw() {
    drawBoard(board.width, board.height, board.colour);
    drawRect(paddle.position.x, paddle.position.y, paddle.width, paddle.height, paddle.colour);
    foreachBrick(bricks, rows, columns, drawBrick);
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