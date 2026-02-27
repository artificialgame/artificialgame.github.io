(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const cols = 12, rows = 10, mines = 16;
  const cell = Math.floor(Math.min(canvas.width / cols, canvas.height / rows));
  let board = [];
  let gameOver = false;
  let won = false;

  function reset() {
    board = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ mine: false, open: false, flag: false, n: 0 })));
    gameOver = false; won = false;
    let placed = 0;
    while (placed < mines) {
      const r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols);
      if (!board[r][c].mine) { board[r][c].mine = true; placed++; }
    }
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      board[r][c].n = count(r, c);
    }
  }

  const inside = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols;
  const count = (r, c) => {
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (dr || dc) {
      const nr = r + dr, nc = c + dc;
      if (inside(nr, nc) && board[nr][nc].mine) n++;
    }
    return n;
  };

  function flood(r, c) {
    const stack = [[r, c]];
    while (stack.length) {
      const [cr, cc] = stack.pop();
      const cell = board[cr][cc];
      if (cell.open || cell.flag) continue;
      cell.open = true;
      if (cell.n === 0 && !cell.mine) {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          const nr = cr + dr, nc = cc + dc;
          if (inside(nr, nc) && !board[nr][nc].open) stack.push([nr, nc]);
        }
      }
    }
  }

  function revealAll() { for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) board[r][c].open = true; }
  function checkWin() {
    const closedSafe = board.flat().filter(c => !c.mine && !c.open).length;
    if (!closedSafe && !gameOver) { won = true; gameOver = true; }
  }

  function click(clientX, clientY, right) {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor(((clientX - rect.left) * (canvas.width / rect.width)) / cell);
    const r = Math.floor(((clientY - rect.top) * (canvas.height / rect.height)) / cell);
    if (!inside(r, c)) return;
    const tile = board[r][c];
    if (right) { if (!tile.open) tile.flag = !tile.flag; return; }
    if (tile.flag || tile.open) return;
    if (tile.mine) { gameOver = true; revealAll(); return; }
    flood(r, c);
    checkWin();
  }

  canvas.addEventListener('pointerdown', e => click(e.clientX, e.clientY, e.button === 2));
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('keydown', e => { if (e.key.toLowerCase() === 'r') reset(); });

  reset();

  (function loop() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const t = board[r][c], x = c * cell, y = r * cell;
      ctx.fillStyle = t.open ? '#e2e8f0' : '#334155';
      ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
      if (t.flag && !t.open) { ctx.fillStyle = '#ef4444'; ctx.fillText('⚑', x + cell / 2 - 6, y + cell / 2 + 6); }
      if (t.open && t.mine) { ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(x + cell/2, y + cell/2, cell*0.22, 0, Math.PI*2); ctx.fill(); }
      if (t.open && !t.mine && t.n) {
        ctx.fillStyle = '#1d4ed8';
        ctx.font = `${Math.floor(cell * 0.45)}px sans-serif`;
        ctx.fillText(String(t.n), x + cell / 2 - 5, y + cell / 2 + 6);
      }
    }

    ctx.fillStyle = '#f8fafc';
    ctx.font = '18px sans-serif';
    const flags = board.flat().filter(t => t.flag).length;
    ctx.fillText(`Minesweeper — Flags: ${flags}/${mines}  R: reset`, 10, canvas.height - 12);
    if (gameOver) ctx.fillText(won ? 'You cleared the field!' : 'Boom! Try again (R)', 10, 22);
    requestAnimationFrame(loop);
  })();
})();
