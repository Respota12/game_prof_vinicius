const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let athleteX = 50;
let athleteY = 300;
let velocity = 0;
let energy = 100;

const athleteImage = new Image();
athleteImage.src = 'athlete.png'; // Coloque a imagem na mesma pasta

function updateStatus() {
  document.getElementById('velocidade').textContent = `${velocity} km/h`;
  document.getElementById('energia').textContent = `${energy}%`;
}

function drawAthlete() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(athleteImage, athleteX, athleteY, 50, 50);
}

function gameLoop() {
  velocity = Math.min(20, velocity + 0.1);
  athleteX += velocity * 0.5;
  if (athleteX > canvas.width) athleteX = -50;
  updateStatus();
  drawAthlete();
  requestAnimationFrame(gameLoop);
}

athleteImage.onload = function () {
  gameLoop();
};