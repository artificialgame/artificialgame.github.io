(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  let deck = [];
  let hand = [];
  let held = [false, false, false, false, false];
  let phase = 'deal';
  let message = 'Deal a hand';

  const makeDeck = () => suits.flatMap(s => ranks.map(r => ({ suit: s, rank: r }))).sort(() => Math.random() - 0.5);
  const rankValue = r => ranks.indexOf(r);

  function scoreHand(cards) {
    const counts = {};
    const bySuit = {};
    const vals = cards.map(c => rankValue(c.rank)).sort((a, b) => a - b);
    cards.forEach(c => { counts[c.rank] = (counts[c.rank] || 0) + 1; bySuit[c.suit] = (bySuit[c.suit] || 0) + 1; });
    const groups = Object.values(counts).sort((a, b) => b - a);
    const flush = Object.values(bySuit).some(v => v === 5);
    const straight = vals.every((v, i) => i === 0 || v === vals[i - 1] + 1) || JSON.stringify(vals) === JSON.stringify([0, 1, 2, 3, 12]);
    if (straight && flush) return 'Straight Flush';
    if (groups[0] === 4) return 'Four of a Kind';
    if (groups[0] === 3 && groups[1] === 2) return 'Full House';
    if (flush) return 'Flush';
    if (straight) return 'Straight';
    if (groups[0] === 3) return 'Three of a Kind';
    if (groups[0] === 2 && groups[1] === 2) return 'Two Pair';
    if (groups[0] === 2) return 'One Pair';
    return 'High Card';
  }

  function newHand() {
    deck = makeDeck();
    hand = Array.from({ length: 5 }, () => deck.pop());
    held = [false, false, false, false, false];
    phase = 'draw';
    message = 'Select cards to hold, then press D';
  }

  function drawPhase() {
    hand = hand.map((c, i) => (held[i] ? c : deck.pop()));
    phase = 'deal';
    message = `Result: ${scoreHand(hand)} (Press D for new hand)`;
  }

  function cardAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    for (let i = 0; i < 5; i++) {
      const cx = 24 + i * 132;
      if (x >= cx && x <= cx + 108 && y >= 100 && y <= 260) return i;
    }
    return -1;
  }

  window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'd') {
      if (phase === 'deal') newHand();
      else drawPhase();
    }
    const n = Number(e.key);
    if (phase === 'draw' && n >= 1 && n <= 5) held[n - 1] = !held[n - 1];
  });

  canvas.addEventListener('pointerdown', e => {
    if (phase !== 'draw') return;
    const idx = cardAt(e.clientX, e.clientY);
    if (idx >= 0) held[idx] = !held[idx];
  });

  const drawCard = (card, x, y, isHeld) => {
    ctx.fillStyle = isHeld ? '#fef08a' : '#f8fafc';
    ctx.fillRect(x, y, 108, 160);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 108, 160);
    ctx.fillStyle = ['♥', '♦'].includes(card.suit) ? '#dc2626' : '#111827';
    ctx.font = '28px sans-serif';
    ctx.fillText(card.rank, x + 14, y + 36);
    ctx.font = '34px sans-serif';
    ctx.fillText(card.suit, x + 58, y + 90);
    if (isHeld) {
      ctx.fillStyle = '#854d0e';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('HELD', x + 24, y + 146);
    }
  };

  (function loop() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '20px sans-serif';
    ctx.fillText('Poker Draw — D: Deal/Draw, 1-5: Hold', 18, 30);
    ctx.font = '18px sans-serif';
    ctx.fillText(message, 18, 58);

    hand.forEach((c, i) => drawCard(c, 24 + i * 132, 100, held[i] && phase === 'draw'));
    requestAnimationFrame(loop);
  })();
})();
