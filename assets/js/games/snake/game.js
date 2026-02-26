(() => {
  const canvas=document.getElementById('gameCanvas'); if(!canvas?.getContext) return; const ctx=canvas.getContext('2d');
  const g=20, cols=Math.floor(canvas.width/g), rows=Math.floor(canvas.height/g);
  let snake=[{x:8,y:8}], dir={x:1,y:0}, food={x:12,y:10}, score=0;
  const turn=(x,y)=>{ if(x!==-dir.x||y!==-dir.y) dir={x,y};};
  window.addEventListener('keydown',e=>({ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key]&&turn(...{ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key])));
  canvas.addEventListener('pointerdown',e=>{const r=canvas.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;if(Math.abs(x-r.width/2)>Math.abs(y-r.height/2))turn(x<r.width/2?-1:1,0);else turn(0,y<r.height/2?-1:1)});
  setInterval(()=>{const h={x:(snake[0].x+dir.x+cols)%cols,y:(snake[0].y+dir.y+rows)%rows}; if(snake.some(s=>s.x===h.x&&s.y===h.y)){snake=[{x:8,y:8}];dir={x:1,y:0};score=0;} snake.unshift(h); if(h.x===food.x&&h.y===food.y){score++;food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)}} else snake.pop();},120);
  (function draw(){ctx.fillStyle='#020617';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#22d3ee';snake.forEach(s=>ctx.fillRect(s.x*g,s.y*g,g-1,g-1));ctx.fillStyle='#f97316';ctx.fillRect(food.x*g,food.y*g,g-1,g-1);ctx.fillStyle='#fff';ctx.fillText('Score '+score,10,18);requestAnimationFrame(draw);})();
})();