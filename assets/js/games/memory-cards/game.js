(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const cols = 4;
  const rows = 3;
  const pad = 14;
  const cw = (canvas.width - pad * (cols + 1)) / cols;
  const ch = (canvas.height - pad * (rows + 1)) / rows;

  const values = ['🍎', '🍌', '🍇', '🍒', '🍋', '🍍'];
  const deck = [...values, ...values].sort(() => Math.random() - 0.5).map((emoji, i) => ({
    emoji,
    open: false,
    solved: false,
    index: i
  }));

  let picks = [];
  let turns = 0;

  function cardAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const cx = pad + c * (cw + pad);
        const cy = pad + r * (ch + pad);
        if (x >= cx && x <= cx + cw && y >= cy && y <= cy + ch) return deck[i];
      }
    }
    return null;
  }

  canvas.addEventListener('pointerdown', e => {
    if (picks.length === 2) return;
    const card = cardAt(e.clientX, e.clientY);
    if (!card || card.open || card.solved) return;
    card.open = true;
    picks.push(card);

    if (picks.length === 2) {
      turns += 1;
      const [a, b] = picks;
      setTimeout(() => {
        if (a.emoji === b.emoji) {
          a.solved = true;
          b.solved = true;
        } else {
          a.open = false;
          b.open = false;
        }
        picks = [];
      }, 550);
    }
  });

  (function draw() {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const card = deck[i];
        const x = pad + c * (cw + pad);
        const y = pad + r * (ch + pad);
        ctx.fillStyle = card.open || card.solved ? '#1e293b' : '#4338ca';
        ctx.fillRect(x, y, cw, ch);
        if (card.open || card.solved) {
          ctx.font = '38px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#f8fafc';
          ctx.fillText(card.emoji, x + cw / 2, y + ch / 2 + 2);
        }
      }
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px sans-serif';
    const solved = deck.filter(c => c.solved).length / 2;
    ctx.fillText(`Pairs: ${solved}/6  Turns: ${turns}`, 16, canvas.height - 14);
    requestAnimationFrame(draw);
  })();
})();
