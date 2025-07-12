const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12;
const PLAYER_X = 20;
const AI_X = canvas.width - 20 - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Middle line
    ctx.save();
    ctx.setLineDash([12, 20]);
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.restore();

    // Paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, 2 * Math.PI);
    ctx.fill();

    // Score
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText(playerScore, canvas.width / 4, 50);
    ctx.fillText(aiScore, canvas.width * 3 / 4, 50);
}

// Reset ball to center after a score
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
    ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Update game state
function update() {
    // Move ball
    ballX += ballVX;
    ballY += ballVY;

    // Wall collision (top/bottom)
    if (ballY - BALL_RADIUS < 0) {
        ballY = BALL_RADIUS;
        ballVY *= -1;
    }
    if (ballY + BALL_RADIUS > canvas.height) {
        ballY = canvas.height - BALL_RADIUS;
        ballVY *= -1;
    }

    // Player paddle collision
    if (
        ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
        ballVX *= -1;
        // Add some "spin"
        let collidePoint = (ballY - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballVY = BALL_SPEED * collidePoint;
    }

    // AI paddle collision
    if (
        ballX + BALL_RADIUS > AI_X &&
        ballY > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_RADIUS;
        ballVX *= -1;
        // Add some "spin"
        let collidePoint = (ballY - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballVY = BALL_SPEED * collidePoint;
    }

    // Score check
    if (ballX - BALL_RADIUS < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_RADIUS > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI movement (simple follow)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 10) {
        aiY += PADDLE_SPEED;
    } else if (aiCenter > ballY + 10) {
        aiY -= PADDLE_SPEED;
    }
    // Clamp AI paddle within bounds
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Mouse movement for player paddle
canvas.addEventListener('mousemove', function (evt) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp within bounds
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();