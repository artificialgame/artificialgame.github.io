(() => {
  const canvas = document.getElementById('flappyCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');
  const state = {
    birdY: canvas.height / 2,
    birdV: 0,
    pipes: [],
    score: 0,
    running: true
  };
  const gravity = 0.35;
  const flap = -6.3;
  const pipeGap = 150;

  const reset = () => {
    state.birdY = canvas.height / 2;
    state.birdV = 0;
    state.score = 0;
    state.running = true;
    state.pipes = [{ x: canvas.width + 120, top: 120 }];
  };

  const jump = () => { if (state.running) state.birdV = flap; else reset(); };
  window.addEventListener('keydown', e => (e.code === 'Space' || e.code === 'ArrowUp') && jump());
  canvas.addEventListener('pointerdown', jump);
  document.getElementById('flappyStart')?.addEventListener('click', jump);

  const addPipe = () => {
    const top = 60 + Math.random() * (canvas.height - pipeGap - 120);
    state.pipes.push({ x: canvas.width + 60, top, passed: false });
  };

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#70d6ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (state.running) {
      state.birdV += gravity;
      state.birdY += state.birdV;
      if (state.pipes.length < 3) addPipe();

      state.pipes.forEach(pipe => {
        pipe.x -= 2.6;
        if (!pipe.passed && pipe.x < 80) {
          pipe.passed = true;
          state.score += 1;
        }
      });
      state.pipes = state.pipes.filter(p => p.x > -80);
    }

    state.pipes.forEach(pipe => {
      ctx.fillStyle = '#06d6a0';
      ctx.fillRect(pipe.x, 0, 50, pipe.top);
      ctx.fillRect(pipe.x, pipe.top + pipeGap, 50, canvas.height);
      const hitX = 90 > pipe.x && 70 < pipe.x + 50;
      const hitY = state.birdY < pipe.top || state.birdY + 22 > pipe.top + pipeGap;
      if (state.running && hitX && hitY) state.running = false;
    });

    if (state.birdY > canvas.height || state.birdY < 0) state.running = false;

    ctx.fillStyle = '#fefefe';
    ctx.beginPath();
    ctx.arc(80, state.birdY, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0b1220';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`Score: ${state.score}`, 20, 32);
    if (!state.running) ctx.fillText('Game Over - Tap/Space to restart', 110, canvas.height / 2);

    requestAnimationFrame(loop);
  };

  reset();
  loop();
})();
