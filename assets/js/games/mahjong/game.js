(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const symbols = ['竹', '萬', '筒', '東', '南', '西', '北', '中', '發', '白', '梅', '蘭'];
  let rows = [];
  let pick = null;
  let removed = 0;
  let message = 'Match identical free-edge tiles';

  function reset() {
    const pool = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    rows = [pool.slice(0, 8), pool.slice(8, 16), pool.slice(16, 24)].map(r => r.map(v => ({ v, gone: false })));
    pick = null;
    removed = 0;
    message = 'Match identical free-edge tiles';
  }

  const isFree = (r, c) => {
    const row = rows[r];
    if (row[c].gone) return false;
    const leftBlocked = c > 0 && !row[c - 1].gone;
    const rightBlocked = c < row.length - 1 && !row[c + 1].gone;
    return !(leftBlocked && rightBlocked);
  };

  function tileAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r].length; c++) {
      const tx = 40 + c * 78 + r * 12;
      const ty = 70 + r * 110;
      if (x >= tx && x <= tx + 68 && y >= ty && y <= ty + 92) return [r, c];
    }
    return null;
  }

  canvas.addEventListener('pointerdown', e => {
    const rc = tileAt(e.clientX, e.clientY);
    if (!rc) return;
    const [r, c] = rc;
    const t = rows[r][c];
    if (t.gone || !isFree(r, c)) return;

    if (!pick) return void (pick = [r, c]);
    const [pr, pc] = pick;
    if (pr === r && pc === c) return void (pick = null);

    const a = rows[pr][pc], b = rows[r][c];
    if (a.v === b.v) {
      a.gone = true; b.gone = true;
      removed += 2;
      message = 'Matched!';
      if (removed === 24) message = 'Board cleared! Press R';
    } else {
      message = 'No match';
    }
    pick = null;
  });

  window.addEventListener('keydown', e => { if (e.key.toLowerCase() === 'r') reset(); });
  reset();

  (function draw() {
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rows.forEach((row, r) => row.forEach((tile, c) => {
      if (tile.gone) return;
      const x = 40 + c * 78 + r * 12;
      const y = 70 + r * 110;
      ctx.fillStyle = isFree(r, c) ? '#f8fafc' : '#cbd5e1';
      ctx.fillRect(x, y, 68, 92);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(x, y, 68, 92);
      ctx.fillStyle = '#0f172a';
      ctx.font = '30px serif';
      ctx.fillText(tile.v, x + 20, y + 56);
      if (pick && pick[0] === r && pick[1] === c) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 2, y + 2, 64, 88);
      }
    }));

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '20px sans-serif';
    ctx.fillText('Mahjong Match — only free-edge tiles can be selected', 16, 30);
    ctx.font = '18px sans-serif';
    ctx.fillText(`${message} | Removed: ${removed}/24 | R: reset`, 16, canvas.height - 14);
    requestAnimationFrame(draw);
  })();
})();
