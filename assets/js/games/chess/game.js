(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const N = 8;
  const cell = canvas.width / N;
  const symbols = {
    wp: '♙', wr: '♖', wn: '♘', wb: '♗', wq: '♕', wk: '♔',
    bp: '♟', br: '♜', bn: '♞', bb: '♝', bq: '♛', bk: '♚'
  };

  let board = [];
  let turn = 'w';
  let selected = null;
  let legal = [];

  const inside = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

  function reset() {
    board = [
      ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
      ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
      ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];
    turn = 'w';
    selected = null;
    legal = [];
  }

  function rayMoves(r, c, dirs, color) {
    const out = [];
    dirs.forEach(([dr, dc]) => {
      let nr = r + dr, nc = c + dc;
      while (inside(nr, nc)) {
        const target = board[nr][nc];
        if (!target) out.push([nr, nc]);
        else {
          if (target[0] !== color) out.push([nr, nc]);
          break;
        }
        nr += dr; nc += dc;
      }
    });
    return out;
  }

  function movesFor(r, c) {
    const piece = board[r][c];
    if (!piece) return [];
    const color = piece[0], type = piece[1];
    const out = [];

    if (type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const start = color === 'w' ? 6 : 1;
      if (inside(r + dir, c) && !board[r + dir][c]) out.push([r + dir, c]);
      if (r === start && !board[r + dir][c] && !board[r + dir * 2][c]) out.push([r + dir * 2, c]);
      [-1, 1].forEach(dc => {
        const nr = r + dir, nc = c + dc;
        if (inside(nr, nc) && board[nr][nc] && board[nr][nc][0] !== color) out.push([nr, nc]);
      });
    }
    if (type === 'r') out.push(...rayMoves(r, c, [[1,0],[-1,0],[0,1],[0,-1]], color));
    if (type === 'b') out.push(...rayMoves(r, c, [[1,1],[1,-1],[-1,1],[-1,-1]], color));
    if (type === 'q') out.push(...rayMoves(r, c, [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]], color));
    if (type === 'n') {
      [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(([dr,dc]) => {
        const nr = r + dr, nc = c + dc;
        if (inside(nr, nc) && (!board[nr][nc] || board[nr][nc][0] !== color)) out.push([nr, nc]);
      });
    }
    if (type === 'k') {
      [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc]) => {
        const nr = r + dr, nc = c + dc;
        if (inside(nr, nc) && (!board[nr][nc] || board[nr][nc][0] !== color)) out.push([nr, nc]);
      });
    }
    return out;
  }

  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor(((e.clientX - rect.left) * (canvas.width / rect.width)) / cell);
    const r = Math.floor(((e.clientY - rect.top) * (canvas.height / rect.height)) / cell);
    if (!inside(r, c)) return;

    if (selected && legal.some(([lr, lc]) => lr === r && lc === c)) {
      const [sr, sc] = selected;
      board[r][c] = board[sr][sc];
      board[sr][sc] = '';
      turn = turn === 'w' ? 'b' : 'w';
      selected = null; legal = [];
      return;
    }

    if (board[r][c] && board[r][c][0] === turn) {
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
        ctx.fillStyle = (r + c) % 2 ? '#6b7280' : '#d1d5db';
        ctx.fillRect(c * cell, r * cell, cell, cell);
      }
    }

    legal.forEach(([r, c]) => {
      ctx.fillStyle = 'rgba(34,197,94,0.35)';
      ctx.fillRect(c * cell, r * cell, cell, cell);
    });
    if (selected) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.strokeRect(selected[1] * cell + 2, selected[0] * cell + 2, cell - 4, cell - 4);
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${cell * 0.65}px serif`;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p) ctx.fillText(symbols[p], c * cell + cell / 2, r * cell + cell / 2 + 2);
      }
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#111827';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Turn: ${turn === 'w' ? 'White' : 'Black'} (R to reset)`, 12, 24);
    requestAnimationFrame(draw);
  })();
})();
