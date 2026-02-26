(() => {
  const canvas = document.getElementById('tetrisCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');
  const COLS = 10, ROWS = 20, SIZE = 28;
  canvas.width = COLS * SIZE;
  canvas.height = ROWS * SIZE;

  const shapes = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[1,1,0],[0,1,1]],
    [[0,1,1],[1,1,0]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]]
  ];
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  let dropCounter = 0, lastTime = 0, score = 0;
  let piece = spawn();

  function spawn() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)].map(r => [...r]);
    return { shape, x: 3, y: 0, color: `hsl(${Math.random()*360},80%,60%)` };
  }
  function rotate(mat){ return mat[0].map((_,i)=>mat.map(r=>r[i]).reverse()); }
  function collide(p){
    return p.shape.some((row,y)=>row.some((v,x)=> v && (board[y+p.y]?.[x+p.x] !== 0)));
  }
  function merge(){ piece.shape.forEach((r,y)=>r.forEach((v,x)=>{ if(v) board[y+piece.y][x+piece.x]=piece.color;})); }
  function clearLines(){
    for(let y=ROWS-1;y>=0;y--){
      if(board[y].every(Boolean)){ board.splice(y,1); board.unshift(Array(COLS).fill(0)); score+=100; y++; }
    }
  }
  function drawCell(x,y,color){ ctx.fillStyle=color; ctx.fillRect(x*SIZE,y*SIZE,SIZE-1,SIZE-1); }
  function update(time=0){
    const delta=time-lastTime; lastTime=time; dropCounter+=delta;
    if(dropCounter>500){ piece.y++; if(collide(piece)){ piece.y--; merge(); clearLines(); piece=spawn(); if(collide(piece)) board.forEach(r=>r.fill(0)); } dropCounter=0; }
    ctx.fillStyle='#05060d'; ctx.fillRect(0,0,canvas.width,canvas.height);
    board.forEach((r,y)=>r.forEach((v,x)=>v && drawCell(x,y,v)));
    piece.shape.forEach((r,y)=>r.forEach((v,x)=>v && drawCell(x+piece.x,y+piece.y,piece.color)));
    ctx.fillStyle='#fff'; ctx.font='bold 16px sans-serif'; ctx.fillText(`Score ${score}`, 8, 20);
    requestAnimationFrame(update);
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { piece.x--; if(collide(piece)) piece.x++; }
    if (e.key === 'ArrowRight') { piece.x++; if(collide(piece)) piece.x--; }
    if (e.key === 'ArrowDown') { piece.y++; if(collide(piece)) piece.y--; }
    if (e.key.toLowerCase() === 'z' || e.key === 'ArrowUp') {
      const rot = rotate(piece.shape); const prev = piece.shape; piece.shape = rot; if(collide(piece)) piece.shape = prev;
    }
  });

  canvas.addEventListener('pointerdown', e => {
    const x = e.offsetX / canvas.clientWidth;
    if (x < 0.33) { piece.x--; if(collide(piece)) piece.x++; }
    else if (x > 0.66) { piece.x++; if(collide(piece)) piece.x--; }
    else { piece.shape = rotate(piece.shape); if(collide(piece)) piece.shape = rotate(rotate(rotate(piece.shape))); }
  });
  update();
})();
