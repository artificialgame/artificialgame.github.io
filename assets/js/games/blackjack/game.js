(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  let deck = [];
  let player = [];
  let dealer = [];
  let state = 'playing';
  let message = 'Hit or Stand';

  const cardValue = rank => {
    if (rank === 'A') return 11;
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return Number(rank);
  };

  const handValue = hand => {
    let total = hand.reduce((s, c) => s + cardValue(c.rank), 0);
    let aces = hand.filter(c => c.rank === 'A').length;
    while (total > 21 && aces--) total -= 10;
    return total;
  };

  const makeDeck = () => suits.flatMap(suit => ranks.map(rank => ({ suit, rank }))).sort(() => Math.random() - 0.5);
  const deal = hand => hand.push(deck.pop());

  const reset = () => {
    deck = makeDeck();
    player = [];
    dealer = [];
    state = 'playing';
    message = 'Hit or Stand';
    deal(player); deal(dealer); deal(player); deal(dealer);
  };

  const stand = () => {
    while (handValue(dealer) < 17) deal(dealer);
    const pv = handValue(player), dv = handValue(dealer);
    state = 'round-over';
    if (dv > 21 || pv > dv) message = 'You win! (R to deal again)';
    else if (pv < dv) message = 'Dealer wins. (R to retry)';
    else message = 'Push. (R to play again)';
  };

  window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'r') reset();
    if (state !== 'playing') return;
    if (e.key.toLowerCase() === 'h') {
      deal(player);
      if (handValue(player) > 21) {
        state = 'round-over';
        message = 'Bust! Dealer wins. (R to retry)';
      }
    }
    if (e.key.toLowerCase() === 's') stand();
  });

  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    if (state !== 'playing') return reset();
    if (x < canvas.width / 2) {
      deal(player);
      if (handValue(player) > 21) {
        state = 'round-over';
        message = 'Bust! Dealer wins. (Tap to reset)';
      }
    } else stand();
  });

  const drawCard = (card, x, y, hide = false) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x, y, 64, 90);
    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(x, y, 64, 90);
    if (hide) {
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 6, y + 6, 52, 78);
      return;
    }
    ctx.fillStyle = ['♥', '♦'].includes(card.suit) ? '#ef4444' : '#111827';
    ctx.font = '18px sans-serif';
    ctx.fillText(card.rank, x + 10, y + 24);
    ctx.fillText(card.suit, x + 36, y + 24);
  };

  reset();

  (function draw() {
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '20px sans-serif';
    ctx.fillText('Blackjack — H: Hit  S: Stand  R: Reset', 14, 28);

    ctx.fillText(`Dealer: ${state === 'playing' ? '?' : handValue(dealer)}`, 20, 62);
    dealer.forEach((c, i) => drawCard(c, 20 + i * 76, 72, i === 0 && state === 'playing'));

    ctx.fillText(`Player: ${handValue(player)}`, 20, 206);
    player.forEach((c, i) => drawCard(c, 20 + i * 76, 216));

    ctx.fillStyle = '#f8fafc';
    ctx.font = '18px sans-serif';
    ctx.fillText(message, 20, canvas.height - 16);

    ctx.fillStyle = '#bbf7d0';
    ctx.fillText('Tap left = Hit, right = Stand', canvas.width - 250, canvas.height - 16);

    requestAnimationFrame(draw);
  })();
})();
