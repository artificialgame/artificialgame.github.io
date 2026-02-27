(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7'];
  let deck = [];
  let waste = [];
  let foundations = { '♠': 0, '♥': 0, '♦': 0, '♣': 0 };
  let message = 'Draw cards and build each suit from A to 7';

  const rankValue = r => ranks.indexOf(r) + 1;

  const reset = () => {
    deck = suits.flatMap(s => ranks.map(r => ({ suit: s, rank: r }))).sort(() => Math.random() - 0.5);
    waste = [];
    foundations = { '♠': 0, '♥': 0, '♦': 0, '♣': 0 };
    message = 'Draw cards and build each suit from A to 7';
  };

  const drawCard = () => {
    if (!deck.length) deck = waste.reverse(), waste = [];
    if (deck.length) waste.push(deck.pop());
  };

  const tryPlace = suit => {
    const top = waste[waste.length - 1];
    if (!top || top.suit !== suit) return;
    if (rankValue(top.rank) === foundations[suit] + 1) {
      foundations[suit] += 1;
      waste.pop();
      if (Object.values(foundations).every(v => v === 7)) message = 'You won! Press R to restart.';
    }
  };

  window.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'r') reset();
    if (k === 'd') drawCard();
    if (k === '1') tryPlace('♠');
    if (k === '2') tryPlace('♥');
    if (k === '3') tryPlace('♦');
    if (k === '4') tryPlace('♣');
  });

  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    if (x >= 20 && x <= 110 && y >= 80 && y <= 210) return drawCard();
    const idx = Math.floor((x - 320) / 95);
    if (y >= 80 && y <= 210 && idx >= 0 && idx < 4) tryPlace(suits[idx]);
  });

  const renderCard = (card, x, y, back = false) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x, y, 90, 130);
    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(x, y, 90, 130);
    if (back) {
      ctx.fillStyle = '#4338ca';
      ctx.fillRect(x + 8, y + 8, 74, 114);
      return;
    }
    if (!card) return;
    ctx.fillStyle = ['♥', '♦'].includes(card.suit) ? '#ef4444' : '#111827';
    ctx.font = '24px sans-serif';
    ctx.fillText(card.rank, x + 12, y + 32);
    ctx.fillText(card.suit, x + 48, y + 32);
  };

  reset();

  (function loop() {
    ctx.fillStyle = '#14532d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#dcfce7';
    ctx.font = '20px sans-serif';
    ctx.fillText('Solitaire Lite — D: draw, 1-4 place by suit, R: reset', 16, 30);

    renderCard({}, 20, 80, true);
    ctx.fillStyle = '#dcfce7';
    ctx.fillText(`${deck.length} cards`, 24, 228);
    renderCard(waste[waste.length - 1], 130, 80);

    suits.forEach((s, i) => {
      const x = 320 + i * 95;
      ctx.strokeStyle = '#bbf7d0';
      ctx.strokeRect(x, 80, 90, 130);
      const val = foundations[s];
      if (val > 0) renderCard({ suit: s, rank: ranks[val - 1] }, x, 80);
      ctx.fillStyle = '#dcfce7';
      ctx.fillText(`${i + 1}`, x + 38, 228);
    });

    ctx.fillText(message, 16, canvas.height - 18);
    requestAnimationFrame(loop);
  })();
})();
