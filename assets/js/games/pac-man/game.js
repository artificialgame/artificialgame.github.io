(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext('2d');
  const w=canvas.width,h=canvas.height;
  let player={x:w/2,y:h-40,r:14};
  let points=[]; let score=0;
  function spawn(){ points.push({x:20+Math.random()*(w-40), y:-10, good:Math.random()>0.25}); }
  window.addEventListener('keydown',e=>{ if(e.key==='ArrowLeft') player.x-=20; if(e.key==='ArrowRight') player.x+=20; player.x=Math.max(20,Math.min(w-20,player.x));});
  canvas.addEventListener('pointermove',e=>{const rect=canvas.getBoundingClientRect();player.x=(e.clientX-rect.left)*(w/rect.width);});
  setInterval(spawn,800);
  function loop(){
    ctx.fillStyle='#05060d';ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#fff';ctx.font='bold 22px sans-serif';ctx.fillText('PAC MAN '+score,20,30);
    ctx.fillStyle='#41f1d1';ctx.beginPath();ctx.arc(player.x,player.y,player.r,0,Math.PI*2);ctx.fill();
    points.forEach(p=>{ p.y+=3; ctx.fillStyle=p.good?'#22c55e':'#ef4444';ctx.fillRect(p.x-8,p.y-8,16,16);
      if (Math.abs(p.x-player.x)<18 && Math.abs(p.y-player.y)<18){ score += p.good?10:-15; p.y=h+20; }
    });
    points=points.filter(p=>p.y<h+20);
    requestAnimationFrame(loop);
  }
  loop();
})();
