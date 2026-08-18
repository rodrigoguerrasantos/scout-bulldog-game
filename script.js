// =========================
// CONFIGURAÇÃO
// =========================

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
  direction: "right",
  frame: 0,
  frameTimer: 0,
  frameSpeed: 8,
  moving: false
};

const playerFrames = [
  { x: 56, y: 258, width: 142, height: 191 },
  { x: 216, y: 257, width: 153, height: 193 },
  { x: 394, y: 258, width: 161, height: 192 },
  { x: 584, y: 258, width: 156, height: 193 },
  { x: 784, y: 255, width: 154, height: 196 },
  { x: 975, y: 258, width: 160, height: 198 }
];

const playerIdleFrame = {
  x: 825,
  y: 0,
  width: 125,
  height: 240
};

const bulldog = {
  x: 600,
  y: 365,
  width: 65,
  height: 90,
  speed: 1.1,
  direction: "left",
  frame: 0,
  frameTimer: 0,
  frameSpeed: 10,
  moving: false
};

const bulldogFrames = [
  { x: 33,   y: 527, width: 210, height: 228 },
  { x: 252,  y: 528, width: 199, height: 240 },
  { x: 457,  y: 528, width: 201, height: 240 },
  { x: 667,  y: 536, width: 201, height: 236 },
  { x: 875,  y: 527, width: 182, height: 241 },
  { x: 1118, y: 527, width: 197, height: 241 }
];

const bulldogIdleFrame = {
  x: 1000,
  y: 0,
  width: 230,
  height: 270
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


// =========================
// CONTROLES
// =========================

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


// =========================
// MOVIMENTO
// =========================

function movePlayer() {
  player.moving = false;

  if (keys["ArrowRight"]) {
    player.x += player.speed;
    player.direction = "right";
    player.moving = true;
  }

  if (keys["ArrowLeft"]) {
    player.x -= player.speed;
    player.direction = "left";
    player.moving = true;
  }

  if (keys["ArrowUp"]) {
    player.y -= player.speed;
    player.moving = true;
  }

  if (keys["ArrowDown"]) {
    player.y += player.speed;
    player.moving = true;
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

function moveBulldog() {
  bulldog.moving = false;

  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const bulldogCenterX = bulldog.x + bulldog.width / 2;
  const bulldogCenterY = bulldog.y + bulldog.height / 2;

  const turnMargin = 20;

  // Movimento horizontal e direção visual
  if (playerCenterX < bulldogCenterX - turnMargin) {
    bulldog.direction = "left";
    bulldog.x -= bulldog.speed;
    bulldog.moving = true;
  } else if (playerCenterX > bulldogCenterX + turnMargin) {
    bulldog.direction = "right";
    bulldog.x += bulldog.speed;
    bulldog.moving = true;
  }

  // Movimento vertical
  if (playerCenterY < bulldogCenterY - 10) {
    bulldog.y -= bulldog.speed * 0.7;
    bulldog.moving = true;
  } else if (playerCenterY > bulldogCenterY + 10) {
    bulldog.y += bulldog.speed * 0.7;
    bulldog.moving = true;
  }

  // Limites verticais do campo
  if (bulldog.y < field.top) {
    bulldog.y = field.top;
  }

  if (bulldog.y + bulldog.height > field.bottom) {
    bulldog.y = field.bottom - bulldog.height;
  }

  // Limites horizontais
  if (bulldog.x < 0) {
    bulldog.x = 0;
  }

  if (bulldog.x + bulldog.width > canvas.width) {
    bulldog.x = canvas.width - bulldog.width;
  }
}


// =========================
// ANIMAÇÕES
// =========================

function updatePlayerAnimation() {
  if (!player.moving) {
    player.frameTimer = 0;
    return;
  }

  player.frameTimer++;

  if (player.frameTimer >= player.frameSpeed) {
    player.frame++;
    player.frameTimer = 0;

    if (player.frame >= playerFrames.length) {
      player.frame = 0;
    }
  }
}

function updateBulldogAnimation() {
  if (!bulldog.moving) {
    bulldog.frameTimer = 0;
    return;
  }

  bulldog.frameTimer++;

  if (bulldog.frameTimer >= bulldog.frameSpeed) {
    bulldog.frame++;
    bulldog.frameTimer = 0;

    if (bulldog.frame >= bulldogFrames.length) {
      bulldog.frame = 0;
    }
  }
}


// =========================
// COLISÕES E REGRAS
// =========================

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

  // Para as animações ao terminar a ronda
  player.moving = false;
  bulldog.moving = false;

  if (result === "victory") {
    playerWins++;
  }

  if (result === "caught") {
    bulldogWins++;
  }

  setTimeout(resetRound, 3000);
}


// =========================
// DESENHO
// =========================

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

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "bold 20px monospace";
  ctx.textAlign = "left";

  ctx.fillText(`LOBITO: ${playerWins}`, 20, 35);
  ctx.fillText(`AKELÁ: ${bulldogWins}`, 20, 65);

  ctx.textAlign = "right";
  ctx.fillText(`RONDA ${roundNumber}`, canvas.width - 20, 35);
}

function drawPlayer() {
  const frame = player.moving
    ? playerFrames[player.frame]
    : playerIdleFrame;

  ctx.save();

  if (player.direction === "left") {
    ctx.translate(player.x + player.width, player.y);
    ctx.scale(-1, 1);

    ctx.drawImage(
      playerSprite,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      0,
      0,
      player.width,
      player.height
    );
  } else {
    ctx.drawImage(
      playerSprite,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      player.x,
      player.y,
      player.width,
      player.height
    );
  }

  ctx.restore();
}

function drawBulldog() {
  const frame = bulldog.moving
    ? bulldogFrames[bulldog.frame]
    : bulldogIdleFrame;

  ctx.save();

  // O sprite original já olha para a esquerda.
  // Só espelhamos quando Akelá precisa olhar para a direita.
  if (bulldog.direction === "right") {
    ctx.translate(bulldog.x + bulldog.width, bulldog.y);
    ctx.scale(-1, 1);

    ctx.drawImage(
      bulldogSprite,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      0,
      0,
      bulldog.width,
      bulldog.height
    );
  } else {
    ctx.drawImage(
      bulldogSprite,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      bulldog.x,
      bulldog.y,
      bulldog.width,
      bulldog.height
    );
  }

  ctx.restore();
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


// =========================
// GAME LOOP
// =========================

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawField();
  drawScore();

  if (!roundOver) {
    movePlayer();
updatePlayerAnimation();

moveBulldog();
updateBulldogAnimation();

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


// =========================
// INICIAR JOGO
// =========================

gameLoop();