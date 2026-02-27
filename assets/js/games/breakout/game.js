(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const state = {
    paddleX: canvas.width / 2 - 55,
    paddleW: 110,
    ballX: canvas.width / 2,
    ballY: canvas.height - 80,
    vx: 4,
    vy: -4,
    score: 0,
    lives: 3,
    bricks: []
  };

  const rows = 5;
  const cols = 9;
  const bw = 68;
  const bh = 22;
  const gap = 8;
  const ox = (canvas.width - cols * (bw + gap) + gap) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      state.bricks.push({ x: ox + c * (bw + gap), y: 50 + r * (bh + gap), alive: true });
    }
  }

  function resetBall() {
    state.ballX = canvas.width / 2;
    state.ballY = canvas.height - 80;
    state.vx = 3.5 * (Math.random() > 0.5 ? 1 : -1);
    state.vy = -4;
  }

  function movePaddle(clientX) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    state.paddleX = Math.max(0, Math.min(canvas.width - state.paddleW, x - state.paddleW / 2));
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') state.paddleX -= 30;
    if (e.key === 'ArrowRight') state.paddleX += 30;
    state.paddleX = Math.max(0, Math.min(canvas.width - state.paddleW, state.paddleX));
  });
  canvas.addEventListener('pointermove', e => movePaddle(e.clientX));

  function update() {
    state.ballX += state.vx;
    state.ballY += state.vy;

    if (state.ballX < 8 || state.ballX > canvas.width - 8) state.vx *= -1;
    if (state.ballY < 8) state.vy *= -1;

    if (
      state.ballY > canvas.height - 30 &&
      state.ballX >= state.paddleX &&
      state.ballX <= state.paddleX + state.paddleW
    ) {
      const hit = (state.ballX - (state.paddleX + state.paddleW / 2)) / (state.paddleW / 2);
      state.vx = 5 * hit;
      state.vy = -Math.abs(state.vy);
    }

    for (const brick of state.bricks) {
      if (!brick.alive) continue;
      if (
        state.ballX > brick.x &&
        state.ballX < brick.x + bw &&
        state.ballY > brick.y &&
        state.ballY < brick.y + bh
      ) {
        brick.alive = false;
        state.vy *= -1;
        state.score += 10;
        break;
      }
    }

    if (state.ballY > canvas.height + 12) {
      state.lives -= 1;
      resetBall();
      if (state.lives <= 0) {
        state.score = 0;
        state.lives = 3;
        state.bricks.forEach(b => (b.alive = true));
      }
    }

    if (state.bricks.every(b => !b.alive)) {
      state.bricks.forEach(b => (b.alive = true));
      resetBall();
    }
  }

  function draw() {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    state.bricks.forEach((brick, i) => {
      if (!brick.alive) return;
      ctx.fillStyle = `hsl(${(i * 13) % 360} 85% 58%)`;
      ctx.fillRect(brick.x, brick.y, bw, bh);
    });

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(state.paddleX, canvas.height - 20, state.paddleW, 10);
    ctx.beginPath();
    ctx.arc(state.ballX, state.ballY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#a5b4fc';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Score: ${state.score}  Lives: ${state.lives}`, 16, 28);
  }

  (function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  })();
})();
