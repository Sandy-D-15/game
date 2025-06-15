const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
let maze = [], player = {}, goal = {}, cellSize = 0, moves = 0;
let keyImg = new Image(), houseImg = new Image();
keyImg.src = 'key.png';
houseImg.src = 'home.png';

function generateMaze(size) {
  maze = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ n: false, s: false, e: false, w: false, visited: false }))
  );

  function carve(x, y) {
    maze[x][y].visited = true;
    const dirs = ['n', 's', 'e', 'w'].sort(() => Math.random() - 0.5);
    for (let dir of dirs) {
      const dx = dir === 'e' ? 1 : dir === 'w' ? -1 : 0;
      const dy = dir === 's' ? 1 : dir === 'n' ? -1 : 0;
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && !maze[nx][ny].visited) {
        maze[x][y][dir] = true;
        maze[nx][ny][{ n: 's', s: 'n', e: 'w', w: 'e' }[dir]] = true;
        carve(nx, ny);
      }
    }
  }
  carve(0, 0);
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cellSize = canvas.width / maze.length;
  ctx.lineWidth = 2;
  for (let x = 0; x < maze.length; x++) {
    for (let y = 0; y < maze.length; y++) {
      const c = maze[x][y];
      const px = x * cellSize;
      const py = y * cellSize;
      if (!c.n) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + cellSize, py); ctx.stroke(); }
      if (!c.s) { ctx.beginPath(); ctx.moveTo(px, py + cellSize); ctx.lineTo(px + cellSize, py + cellSize); ctx.stroke(); }
      if (!c.w) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + cellSize); ctx.stroke(); }
      if (!c.e) { ctx.beginPath(); ctx.moveTo(px + cellSize, py); ctx.lineTo(px + cellSize, py + cellSize); ctx.stroke(); }
    }
  }
}

function drawPlayerAndGoal() {
  ctx.drawImage(houseImg, goal.x * cellSize + 5, goal.y * cellSize + 5, cellSize - 10, cellSize - 10);
  ctx.drawImage(keyImg, player.x * cellSize + 5, player.y * cellSize + 5, cellSize - 10, cellSize - 10);
}

document.getElementById('startBtn').onclick = () => {
  const size = parseInt(document.getElementById('difficulty').value);
  generateMaze(size);
  player = { x: 0, y: 0 };
  goal = { x: size - 1, y: size - 1 };
  moves = 0;
  drawMaze();
  drawPlayerAndGoal();
};

document.addEventListener('keydown', e => {
  if (!maze.length) return;
  const m = maze[player.x][player.y];
  let moved = false;
  if (e.key === 'ArrowUp' && m.n) { player.y--; moved = true; }
  if (e.key === 'ArrowDown' && m.s) { player.y++; moved = true; }
  if (e.key === 'ArrowLeft' && m.w) { player.x--; moved = true; }
  if (e.key === 'ArrowRight' && m.e) { player.x++; moved = true; }
  if (moved) {
    moves++;
    drawMaze();
    drawPlayerAndGoal();
    if (player.x === goal.x && player.y === goal.y) {
      document.getElementById('steps').textContent = `You moved ${moves} steps!`;
      document.getElementById('message').style.display = 'block';
    }
  }
});
