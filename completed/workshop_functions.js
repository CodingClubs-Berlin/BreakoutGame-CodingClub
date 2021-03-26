
//
// Draw Functions
//

function drawCircle(x, y, radius, colour) {
    const gameBoard = document.getElementById("gameBoard").getContext("2d");
    gameBoard.fillStyle = colour;
    gameBoard.arc(x, y, radius, 0, 2 * Math.PI)
    gameBoard.fill();
}

function drawRect(x, y, width, height, colour) {
    const gameBoard = document.getElementById("gameBoard").getContext("2d");
    gameBoard.fillStyle = colour;
    gameBoard.fillRect(x, y, width, height);
}

function drawBoard(width, height, colour) {
    const gameBoard = document.getElementById("gameBoard").getContext("2d");

    gameBoard.canvas.width = width;
    gameBoard.canvas.height = height;
    gameBoard.fillStyle = colour;
    gameBoard.fillRect(0, 0, width, height);
}

function drawScore(score) {
    const scoreDiv = document.getElementById("score");

    scoreDiv.innerHTML = "Score " + score;
}

function drawLives(lives) {
    const scoreDiv = document.getElementById("lives");

    scoreDiv.innerHTML = "Lives " + lives;
}

function showGameOver() {
    const gameOver = document.getElementById("gameOver");
    gameOver.style.visibility = "visible";
}

//
// bricks
//

function createBricks(brick, rows, columns) {
    var bricks = [];
    for (var row=0; row < rows; row++) {
        bricks[row] = [];
        for(var column = 0; column < columns; column++) {
            bricks[row][column] = copyObject(brick);
            bricks[row][column].position.x = column * (brick.width + brickPadding) + brickPadding / 2;
            bricks[row][column].position.y = row * (brick.height + brickPadding) + brickPadding / 2;
        }
    }
    return bricks;
}

function foreachBrick(bricks, rows, columns, func) {
    for (var column=0; column < columns; column++) {
        for (var row = 0; row < rows; row++) {
            func(bricks[row][column])
        }
    }
}

//
// helper functions
//

function copyObject(object) {
    return JSON.parse(JSON.stringify(object));
}

// circle needs position.x, position.y and radius
// rectangle needs position.x, position.y, width and height
function rectangleCircleCollision(circle, rectangle) {
    if (circle.position.y + circle.radius > rectangle.position.y &&
        circle.position.y - circle.radius < rectangle.position.y + rectangle.height &&
        circle.position.x + circle.radius > rectangle.position.x &&
        circle.position.x - circle.radius < rectangle.position.x + rectangle.width)
        return true;
    else
        return false;
}

//
// game logic
//

var canvas;
var context;
var oldTimeStamp = 0;
var accumulator = 0;

window.onload = init;

function init(){
    canvas = document.getElementById('gameBoard');
    context = canvas.getContext('2d');

    // Start the first frame request
    window.requestAnimationFrame(game_loop);
    document.addEventListener("keydown", (event) => {
        event.preventDefault();
            onKeyDown(event.code);
    });
    document.addEventListener("keyup", (event) => {
        event.preventDefault();
            onKeyUp(event.code);
    });
}

function game_loop(timeStamp) {
    //Calculate the number of seconds passed
    //since the last frame
    var secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    if (secondsPassed) {
        accumulator = accumulator + (secondsPassed * 1000)
    }
    const speed = game && game.speed ? game.speed : 100;
    if (accumulator >  speed) {
        accumulator = 0;
        loop();
    }

    draw();

    // Keep requesting new frames
    window.requestAnimationFrame(game_loop);
}