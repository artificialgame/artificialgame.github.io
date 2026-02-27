(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const size = 8;
  const cell = Math.floor(canvas.width / size);
  const gems = ['#f43f5e', '#22d3ee', '#f59e0b', '#84cc16', '#a78bfa'];
  let grid = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.floor(Math.random() * gems.length)));
  let selected = null;
  let score = 0;

  const inside = (r, c) => r >= 0 && r < size && c >= 0 && c < size;
  const adjacent = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;

  function findMatches() {
    const out = new Set();
    for (let r = 0; r < size; r++) {
      let run = 1;
      for (let c = 1; c <= size; c++) {
        if (c < size && grid[r][c] === grid[r][c - 1]) run++;
        else {
          if (run >= 3) for (let k = 0; k < run; k++) out.add(`${r},${c - 1 - k}`);
          run = 1;
        }
      }
    }
    for (let c = 0; c < size; c++) {
      let run = 1;
      for (let r = 1; r <= size; r++) {
        if (r < size && grid[r][c] === grid[r - 1][c]) run++;
        else {
          if (run >= 3) for (let k = 0; k < run; k++) out.add(`${r - 1 - k},${c}`);
          run = 1;
        }
      }
    }
    return [...out].map(s => s.split(',').map(Number));
  }

  function collapse(matches) {
    matches.forEach(([r, c]) => { grid[r][c] = -1; score += 10; });
    for (let c = 0; c < size; c++) {
      const col = [];
      for (let r = size - 1; r >= 0; r--) if (grid[r][c] !== -1) col.push(grid[r][c]);
      while (col.length < size) col.push(Math.floor(Math.random() * gems.length));
      for (let r = size - 1; r >= 0; r--) grid[r][c] = col[size - 1 - r];
    }
  }

  function resolveBoard() {
    let m = findMatches();
    while (m.length) { collapse(m); m = findMatches(); }
  }

  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor(((e.clientX - rect.left) * (canvas.width / rect.width)) / cell);
    const r = Math.floor(((e.clientY - rect.top) * (canvas.height / rect.height)) / cell);
    if (!inside(r, c)) return;

    if (!selected) return void (selected = [r, c]);
    if (!adjacent(selected, [r, c])) return void (selected = [r, c]);

    const [r1, c1] = selected;
    [grid[r1][c1], grid[r][c]] = [grid[r][c], grid[r1][c1]];
    const matched = findMatches();
    if (!matched.length) [grid[r1][c1], grid[r][c]] = [grid[r][c], grid[r1][c1]];
    else resolveBoard();
    selected = null;
  });

  resolveBoard();

  (function draw() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
      ctx.fillStyle = gems[grid[r][c]];
      ctx.fillRect(c * cell + 4, r * cell + 4, cell - 8, cell - 8);
    }

    if (selected) {
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 3;
      ctx.strokeRect(selected[1] * cell + 3, selected[0] * cell + 3, cell - 6, cell - 6);
    }

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Matching Puzzle (match-3) — Score: ${score}`, 10, canvas.height - 12);
    requestAnimationFrame(draw);
  })();
})();
