(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const cols = 8, rows = 6;
  const cell = Math.min(canvas.width / cols, canvas.height / rows);
  let board = [];
  let turn = 1;
  let points = { 1: 0, 2: 0 };
  let message = 'Capture neutral territory and flank enemies';

  function reset() {
    board = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => ({
      owner: (r === 0 && c === 0) ? 1 : (r === rows - 1 && c === cols - 1) ? 2 : 0,
      p: (r === 0 && c === 0) || (r === rows - 1 && c === cols - 1) ? 3 : (Math.random() < 0.2 ? 2 : 1)
    })));
    turn = 1;
    points = { 1: 0, 2: 0 };
    message = 'Capture neutral territory and flank enemies';
  }

  const inside = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols;

  function play(r, c) {
    const tile = board[r][c];
    if (tile.owner === turn) return;

    const adj = [[1,0],[-1,0],[0,1],[0,-1]].some(([dr,dc]) => {
      const nr = r + dr, nc = c + dc;
      return inside(nr,nc) && board[nr][nc].owner === turn;
    });
    if (!adj) return;

    tile.owner = turn;
    points[turn] += tile.p;

    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc]) => {
      const nr = r + dr, nc = c + dc;
      if (inside(nr,nc) && board[nr][nc].owner && board[nr][nc].owner !== turn) {
        board[nr][nc].owner = turn;
        points[turn] += 1;
      }
    });

    turn = turn === 1 ? 2 : 1;
    const remaining = board.flat().filter(t => t.owner === 0).length;
    if (!remaining) {
      message = points[1] === points[2] ? 'Draw game. Press R' : `Player ${points[1] > points[2] ? 1 : 2} wins! Press R`;
    }
  }

  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor(((e.clientX - rect.left) * (canvas.width / rect.width)) / cell);
    const r = Math.floor(((e.clientY - rect.top) * (canvas.height / rect.height)) / cell);
    if (inside(r, c)) play(r, c);
  });

  window.addEventListener('keydown', e => { if (e.key.toLowerCase() === 'r') reset(); });
  reset();

  (function draw() {
    ctx.fillStyle = '#0b1023';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const t = board[r][c];
      const x = c * cell, y = r * cell;
      ctx.fillStyle = t.owner === 1 ? '#2563eb' : t.owner === 2 ? '#dc2626' : '#334155';
      ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(String(t.p), x + cell / 2 - 6, y + cell / 2 + 6);
    }

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Strategy Board — Turn: P${turn} | P1:${points[1]} P2:${points[2]}`, 10, canvas.height - 34);
    ctx.fillText(`${message} (R reset)`, 10, canvas.height - 12);
    requestAnimationFrame(draw);
  })();
})();
