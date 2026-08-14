const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const bulldogSprite = new Image();
bulldogSprite.src = "assets/bulldog-sprites.png";

const player = {
  x: 80,
  y: 400,
  width: 32,
  height: 48,
  speed: 4
};

const bulldog = {
  x: 600,
  y: 350,
  width: 85,
  height: 115
};

const keys = {};

document.addEventListener("keydown", function(event) {
  keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
  keys[event.key] = false;
});

function movePlayer() {
  if (keys["ArrowRight"]) {
    player.x += player.speed;
  }

  if (keys["ArrowLeft"]) {
    player.x -= player.speed;
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

  if (player.y < 0) {
    player.y = 0;
  }

  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
  }
}

function drawPlayer() {
  ctx.fillStyle = "navy";
  ctx.fillRect(
    player.x,
    player.y,
    player.width,
    player.height
  );
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  drawPlayer();
  drawBulldog();

  requestAnimationFrame(gameLoop);
}

function drawBulldog() {
  ctx.drawImage(
    bulldogSprite,

    270, 0,
    170, 220,

    bulldog.x,
    bulldog.y,
    bulldog.width,
    bulldog.height
  );
}

gameLoop();