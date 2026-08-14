const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playerSprite = new Image();
playerSprite.src = "assets/lobito-sprites.png";
const bulldogSprite = new Image();
bulldogSprite.src = "assets/akela-sprites.png";

const player = {
  x: 80,
  y: 400,
  width: 50,
  height: 70,
  speed: 4,
  direction: "right"
};

const bulldog = {
  x: 600,
  y: 365,
  width: 65,
  height: 90,
  speed: 1.2,
  direction: "left"
};

const field = {
  top: 250,
  bottom: 520
};

const keys = {};

let roundOver = false;
let roundResult = "";
let playerWins = 0;
let bulldogWins = 0;
let roundNumber = 1;

document.addEventListener("keydown", function(event) {
  keys[event.code] = true;

  if (
    event.code === "ArrowUp" ||
    event.code === "ArrowDown" ||
    event.code === "ArrowLeft" ||
    event.code === "ArrowRight"
  ) {
    event.preventDefault();
  }
});

document.addEventListener("keyup", function(event) {
  keys[event.code] = false;
});

function movePlayer() {
  if (keys["ArrowRight"]) {
    player.x += player.speed;
    player.direction = "right";
  }

  if (keys["ArrowLeft"]) {
    player.x -= player.speed;
    player.direction = "left";
  }

  if (keys["ArrowUp"]) {
    player.y -= player.speed;
  }

  if (keys["ArrowDown"]) {
    player.y += player.speed;
  }

  if (player.x < 0) {
    player.x = 0;
  }

  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  if (player.y < field.top) {
    player.y = field.top;
  }

  if (player.y + player.height > field.bottom) {
    player.y = field.bottom - player.height;
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "bold 20px monospace";
  ctx.textAlign = "left";

  ctx.fillText(`LOBITO: ${playerWins}`, 20, 35);
  ctx.fillText(`AKELÁ: ${bulldogWins}`, 20, 65);

  ctx.textAlign = "right";
  ctx.fillText(`RONDA ${roundNumber}`, canvas.width - 20, 35);
}

function drawBulldog() {
  ctx.save();

  if (bulldog.direction === "left") {
    ctx.translate(bulldog.x + bulldog.width, bulldog.y);
    ctx.scale(-1, 1);

    ctx.drawImage(
      bulldogSprite,
      1000, 0,
      230, 270,
      0, 0,
      bulldog.width, bulldog.height
    );
  } else {
    ctx.drawImage(
      bulldogSprite,
      1000, 0,
      230, 270,
      bulldog.x, bulldog.y,
      bulldog.width, bulldog.height
    );
  }

  ctx.restore();
}

function drawPlayer() {
  ctx.drawImage(
    playerSprite,

    56, 259,
    142, 190,

    player.x,
    player.y,
    player.width,
    player.height
  );
}

function drawField() {
  // Céu
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, 180);

  // Vegetação ao fundo
  ctx.fillStyle = "#3d7a32";
  ctx.fillRect(0, 180, canvas.width, 70);

  // Campo
  ctx.fillStyle = "#69b34c";
  ctx.fillRect(0, 250, canvas.width, 290);

  // Linhas de limite do campo
  ctx.strokeStyle = "#d9e8b5";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.lineTo(canvas.width, 250);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 520);
  ctx.lineTo(canvas.width, 520);
  ctx.stroke();
}

function drawCaughtMessage() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "bold 48px monospace";
  ctx.textAlign = "center";

  ctx.fillText(
    "APANHADO!",
    canvas.width / 2,
    canvas.height / 2
  );
}

function resetRound() {
  player.x = 80;
  player.y = 400;

  bulldog.x = 600;
  bulldog.y = 365;

  roundOver = false;
  roundResult = "";
  roundNumber++;
}

function endRound(result) {
  roundOver = true;
  roundResult = result;

  if (result === "victory") {
    playerWins++;
  }

  if (result === "caught") {
    bulldogWins++;
  }

  setTimeout(resetRound, 3000);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawField();
  drawScore();

  if (!roundOver) {
    movePlayer();
    moveBulldog();

    if (checkCollision()) {
      endRound("caught");
    } else if (checkVictory()) {
      endRound("victory");
    }
  }

  drawPlayer();
  drawBulldog();

  if (roundResult === "caught") {
    drawCaughtMessage();
  }

  if (roundResult === "victory") {
    drawVictoryMessage();
  }

  requestAnimationFrame(gameLoop);
}

function moveBulldog() {
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const bulldogCenterX = bulldog.x + bulldog.width / 2;
  const bulldogCenterY = bulldog.y + bulldog.height / 2;

  if (playerCenterX < bulldogCenterX) {
    bulldog.x -= bulldog.speed;
    bulldog.direction = "left";
  }

  if (playerCenterX > bulldogCenterX) {
    bulldog.x += bulldog.speed;
    bulldog.direction = "right";
  }

  if (playerCenterY < bulldogCenterY) {
    bulldog.y -= bulldog.speed * 0.7;
  }

  if (playerCenterY > bulldogCenterY) {
    bulldog.y += bulldog.speed * 0.7;
  }

  if (bulldog.y < field.top) {
    bulldog.y = field.top;
  }

  if (bulldog.y + bulldog.height > field.bottom) {
    bulldog.y = field.bottom - bulldog.height;
  }
}

function checkCollision() {
  return (
    player.x < bulldog.x + bulldog.width &&
    player.x + player.width > bulldog.x &&
    player.y < bulldog.y + bulldog.height &&
    player.y + player.height > bulldog.y
  );
} 

function checkVictory() {
  return player.x + player.width >= canvas.width - 20;
}

function drawVictoryMessage() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "bold 48px monospace";
  ctx.textAlign = "center";

  ctx.fillText(
    "CONSEGUIU!",
    canvas.width / 2,
    canvas.height / 2
  );
}

gameLoop();