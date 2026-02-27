(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');
  const cell = canvas.width / 8;
  let board = [];
  let turn = 'r';
  let selected = null;
  let legal = [];

  const inside = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

  function reset() {
    board = Array.from({ length: 8 }, () => Array(8).fill(''));
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2) board[r][c] = 'b';
    for (let r = 5; r < 8; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2) board[r][c] = 'r';
    selected = null; legal = []; turn = 'r';
  }

  function dirs(piece) {
    if (piece === 'r') return [[-1, -1], [-1, 1]];
    if (piece === 'b') return [[1, -1], [1, 1]];
    return [[-1,-1],[-1,1],[1,-1],[1,1]];
  }

  function movesFor(r, c) {
    const piece = board[r][c];
    if (!piece) return [];
    const color = piece.toLowerCase();
    const out = [];
    dirs(piece).forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (inside(nr, nc) && !board[nr][nc]) out.push([nr, nc, null]);
      const jr = r + dr * 2, jc = c + dc * 2;
      if (inside(jr, jc) && !board[jr][jc] && board[nr]?.[nc] && board[nr][nc].toLowerCase() !== color) out.push([jr, jc, [nr, nc]]);
    });
    return out;
  }

  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor(((e.clientX - rect.left) * (canvas.width / rect.width)) / cell);
    const r = Math.floor(((e.clientY - rect.top) * (canvas.height / rect.height)) / cell);
    if (!inside(r, c)) return;

    const chosen = legal.find(([lr, lc]) => lr === r && lc === c);
    if (selected && chosen) {
      const [sr, sc] = selected;
      const piece = board[sr][sc];
      board[r][c] = piece;
      board[sr][sc] = '';
      if (chosen[2]) board[chosen[2][0]][chosen[2][1]] = '';
      if (piece === 'r' && r === 0) board[r][c] = 'R';
      if (piece === 'b' && r === 7) board[r][c] = 'B';
      turn = turn === 'r' ? 'b' : 'r';
      selected = null; legal = [];
      return;
    }

    if (board[r][c] && board[r][c].toLowerCase() === turn) {
      selected = [r, c];
      legal = movesFor(r, c);
    } else {
      selected = null; legal = [];
    }
  });

  window.addEventListener('keydown', e => { if (e.key.toLowerCase() === 'r') reset(); });
  reset();

  (function draw() {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        ctx.fillStyle = (r + c) % 2 ? '#7c2d12' : '#fef3c7';
        ctx.fillRect(c * cell, r * cell, cell, cell);
      }
    }

    legal.forEach(([r, c]) => {
      ctx.fillStyle = 'rgba(16,185,129,0.35)';
      ctx.fillRect(c * cell, r * cell, cell, cell);
    });

    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      ctx.fillStyle = p.toLowerCase() === 'r' ? '#dc2626' : '#111827';
      ctx.beginPath();
      ctx.arc(c * cell + cell / 2, r * cell + cell / 2, cell * 0.35, 0, Math.PI * 2);
      ctx.fill();
      if (p === 'R' || p === 'B') {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('K', c * cell + cell / 2 - 8, r * cell + cell / 2 + 8);
      }
    }

    ctx.fillStyle = '#111827';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Turn: ${turn === 'r' ? 'Red' : 'Black'} (R reset)`, 12, 24);
    requestAnimationFrame(draw);
  })();
})();
