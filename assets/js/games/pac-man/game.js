(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');

  const map = [
    '####################',
    '#........##........#',
    '#.####.#.##.#.####.#',
    '#o#....#....#....#o#',
    '#.####.######.####.#',
    '#..................#',
    '####.###.##.###.####',
    '#......#....#......#',
    '#.######.##.######.#',
    '#........##........#',
    '####################'
  ].map(r => r.split(''));

  const cell = Math.floor(canvas.width / map[0].length);
  let pac = { x: 1, y: 1, dir: { x: 1, y: 0 }, next: { x: 1, y: 0 } };
  let ghosts = [{ x: 18, y: 9, color: '#fb7185' }, { x: 18, y: 1, color: '#60a5fa' }];
  let score = 0;
  let lives = 3;

  const isWall = (x, y) => map[y]?.[x] === '#';
  const canMove = (x, y) => !isWall(x, y);

  window.addEventListener('keydown', e => {
    const d = { ArrowLeft: [-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1] }[e.key];
    if (d) pac.next = { x: d[0], y: d[1] };
    if (e.key.toLowerCase() === 'r') location.reload();
  });

  function resetPositions() {
    pac.x = 1; pac.y = 1; pac.dir = { x: 1, y: 0 }; pac.next = { x: 1, y: 0 };
    ghosts = [{ x: 18, y: 9, color: '#fb7185' }, { x: 18, y: 1, color: '#60a5fa' }];
  }

  function step() {
    if (canMove(pac.x + pac.next.x, pac.y + pac.next.y)) pac.dir = pac.next;
    if (canMove(pac.x + pac.dir.x, pac.y + pac.dir.y)) {
      pac.x += pac.dir.x; pac.y += pac.dir.y;
    }

    const tile = map[pac.y][pac.x];
    if (tile === '.') { score += 10; map[pac.y][pac.x] = ' '; }
    if (tile === 'o') { score += 50; map[pac.y][pac.x] = ' '; }

    ghosts.forEach(g => {
      const opts = [[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy]) => canMove(g.x + dx, g.y + dy));
      opts.sort((a,b) => (Math.abs((g.x+a[0])-pac.x)+Math.abs((g.y+a[1])-pac.y)) - (Math.abs((g.x+b[0])-pac.x)+Math.abs((g.y+b[1])-pac.y)));
      const [dx,dy] = Math.random() < 0.75 ? opts[0] : opts[Math.floor(Math.random()*opts.length)];
      g.x += dx; g.y += dy;
      if (g.x === pac.x && g.y === pac.y) {
        lives -= 1;
        resetPositions();
      }
    });
  }

  setInterval(step, 170);

  (function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    map.forEach((row, y) => row.forEach((ch, x) => {
      const px = x * cell, py = y * cell;
      if (ch === '#') { ctx.fillStyle = '#1d4ed8'; ctx.fillRect(px, py, cell, cell); }
      if (ch === '.') { ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(px + cell/2, py + cell/2, 2, 0, 7); ctx.fill(); }
      if (ch === 'o') { ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(px + cell/2, py + cell/2, 5, 0, 7); ctx.fill(); }
    }));

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(pac.x * cell + cell/2, pac.y * cell + cell/2, cell * 0.4, 0.25, Math.PI * 1.75);
    ctx.lineTo(pac.x * cell + cell/2, pac.y * cell + cell/2);
    ctx.fill();

    ghosts.forEach(g => {
      ctx.fillStyle = g.color;
      ctx.beginPath();
      ctx.arc(g.x * cell + cell/2, g.y * cell + cell/2, cell * 0.38, Math.PI, 0);
      ctx.lineTo(g.x * cell + cell*0.88, g.y * cell + cell*0.88);
      ctx.lineTo(g.x * cell + cell*0.12, g.y * cell + cell*0.88);
      ctx.closePath();
      ctx.fill();
    });

    ctx.fillStyle = '#fff';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Score: ${score}  Lives: ${lives}`, 10, canvas.height - 12);
    if (lives <= 0) ctx.fillText('Game Over (refresh to restart)', 10, 20);
    requestAnimationFrame(draw);
  })();
})();
