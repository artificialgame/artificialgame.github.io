(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');
  const size = 4;
  const cell = canvas.width / size;
  let board = Array.from({ length: size }, () => Array(size).fill(0));
  let score = 0;

  const addTile = () => {
    const empty = [];
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!board[r][c]) empty.push([r, c]);
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  };

  const slideLine = line => {
    const values = line.filter(Boolean);
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] === values[i + 1]) {
        values[i] *= 2;
        score += values[i];
        values.splice(i + 1, 1);
      }
    }
    while (values.length < size) values.push(0);
    return values;
  };

  const move = dir => {
    const before = JSON.stringify(board);
    if (dir === 'left') board = board.map(row => slideLine(row));
    if (dir === 'right') board = board.map(row => slideLine([...row].reverse()).reverse());
    if (dir === 'up') {
      for (let c = 0; c < size; c++) {
        const col = slideLine(board.map(row => row[c]));
        for (let r = 0; r < size; r++) board[r][c] = col[r];
      }
    }
    if (dir === 'down') {
      for (let c = 0; c < size; c++) {
        const col = slideLine(board.map(row => row[c]).reverse()).reverse();
        for (let r = 0; r < size; r++) board[r][c] = col[r];
      }
    }
    if (JSON.stringify(board) !== before) addTile();
  };

  const colors = { 0: '#111827', 2: '#f8fafc', 4: '#fde68a', 8: '#fca5a5', 16: '#fb7185', 32: '#f97316', 64: '#facc15', 128: '#a3e635', 256: '#34d399', 512: '#22d3ee', 1024: '#60a5fa', 2048: '#a78bfa' };

  window.addEventListener('keydown', e => {
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    if (map[e.key]) {
      e.preventDefault();
      move(map[e.key]);
    }
  });

  let touchStart;
  canvas.addEventListener('pointerdown', e => {
    touchStart = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener('pointerup', e => {
    if (!touchStart) return;
    const dx = e.clientX - touchStart.x;
    const dy = e.clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
    else move(dy > 0 ? 'down' : 'up');
    touchStart = null;
  });

  addTile();
  addTile();

  (function draw() {
    ctx.fillStyle = '#0b1023';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const value = board[r][c];
        ctx.fillStyle = colors[value] || '#e879f9';
        ctx.fillRect(c * cell + 6, r * cell + 6, cell - 12, cell - 12);
        if (value) {
          ctx.fillStyle = value <= 4 ? '#0f172a' : '#fff';
          ctx.font = 'bold 30px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(value), c * cell + cell / 2, r * cell + cell / 2);
        }
      }
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Score: ${score}`, 12, canvas.height - 14);
    requestAnimationFrame(draw);
  })();
})();
