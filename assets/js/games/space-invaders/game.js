(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const player = { x: canvas.width / 2 - 22, y: canvas.height - 34, w: 44, h: 12, speed: 6 };
  const keys = new Set();
  let bullets = [];
  let invaders = [];
  let score = 0;
  let dir = 1;

  function spawnWave() {
    invaders = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 9; c++) {
        invaders.push({ x: 80 + c * 62, y: 50 + r * 42, alive: true });
      }
    }
  }

  window.addEventListener('keydown', e => {
    keys.add(e.key);
    if (e.key === ' ') bullets.push({ x: player.x + player.w / 2, y: player.y - 8 });
  });
  window.addEventListener('keyup', e => keys.delete(e.key));
  canvas.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    player.x = Math.max(0, Math.min(canvas.width - player.w, x - player.w / 2));
  });
  canvas.addEventListener('pointerdown', () => bullets.push({ x: player.x + player.w / 2, y: player.y - 8 }));

  spawnWave();

  function update() {
    if (keys.has('ArrowLeft')) player.x -= player.speed;
    if (keys.has('ArrowRight')) player.x += player.speed;
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

    bullets.forEach(b => (b.y -= 8));
    bullets = bullets.filter(b => b.y > -10);

    let edgeHit = false;
    invaders.forEach(i => {
      if (!i.alive) return;
      i.x += dir * 1.1;
      if (i.x < 20 || i.x > canvas.width - 36) edgeHit = true;
    });
    if (edgeHit) {
      dir *= -1;
      invaders.forEach(i => (i.y += 16));
    }

    bullets.forEach(b => {
      invaders.forEach(i => {
        if (!i.alive) return;
        if (b.x > i.x && b.x < i.x + 28 && b.y > i.y && b.y < i.y + 20) {
          i.alive = false;
          b.y = -20;
          score += 10;
        }
      });
    });

    if (invaders.every(i => !i.alive)) spawnWave();
  }

  function draw() {
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(player.x, player.y, player.w, player.h);

    ctx.fillStyle = '#f8fafc';
    bullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 10));

    invaders.forEach((i, idx) => {
      if (!i.alive) return;
      ctx.fillStyle = idx % 2 ? '#a3e635' : '#fb7185';
      ctx.fillRect(i.x, i.y, 28, 20);
    });

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Score: ${score}`, 16, 26);
  }

  (function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  })();
})();
