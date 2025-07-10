const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Settings
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;

// Paddle State
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;

// Ball State
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeed = 5;
let ballVelX = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = ballSpeed * (Math.random() * 2 - 1);

// Scores
let playerScore = 0;
let aiScore = 0;

// Mouse Control for Left Paddle
canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Clamp paddle within canvas
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

// Game Loop
function draw() {
    // Background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Net
    ctx.strokeStyle = "#444";
    ctx.beginPath();
    for (let y = 0; y < canvas.height; y += 32) {
        ctx.moveTo(canvas.width / 2, y);
        ctx.lineTo(canvas.width / 2, y + 16);
    }
    ctx.stroke();

    // Draw Paddles
    ctx.fillStyle = "#f7f7f7";
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Draw Scores
    ctx.font = "36px Arial";
    ctx.fillText(playerScore, canvas.width / 4, 50);
    ctx.fillText(aiScore, (canvas.width * 3) / 4, 50);
}

function update() {
    // Ball Movement
    ballX += ballVelX;
    ballY += ballVelY;

    // Ball Collision with Top/Bottom Walls
    if (ballY - BALL_RADIUS < 0) {
        ballY = BALL_RADIUS;
        ballVelY *= -1;
    } else if (ballY + BALL_RADIUS > canvas.height) {
        ballY = canvas.height - BALL_RADIUS;
        ballVelY *= -1;
    }

    // Ball Collision with Player Paddle
    if (
        ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
        ballVelX *= -1.1; // Slightly increase speed
        ballVelY += (ballY - (playerY + PADDLE_HEIGHT / 2)) * 0.15;
    }

    // Ball Collision with AI Paddle
    if (
        ballX + BALL_RADIUS > AI_X &&
        ballY > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_RADIUS;
        ballVelX *= -1.1;
        ballVelY += (ballY - (aiY + PADDLE_HEIGHT / 2)) * 0.15;
    }

    // Scoring
    if (ballX < 0) {
        aiScore++;
        resetBall(-1);
    } else if (ballX > canvas.width) {
        playerScore++;
        resetBall(1);
    }

    // AI Paddle Movement (simple tracking)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 10) {
        aiY += Math.min(5, ballY - aiCenter);
    } else if (aiCenter > ballY + 10) {
        aiY -= Math.min(5, aiCenter - ballY);
    }

    // Clamp AI paddle within canvas
    if (aiY < 0) aiY = 0;
    if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

function resetBall(direction) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeed = 5;
    ballVelX = ballSpeed * direction;
    ballVelY = ballSpeed * (Math.random() * 2 - 1);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();