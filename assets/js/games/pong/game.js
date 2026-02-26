(() => {
 const c=document.getElementById('gameCanvas'); if(!c?.getContext) return; const x=c.getContext('2d');
 let py=c.height/2, ay=c.height/2, bx=c.width/2, by=c.height/2, vx=4, vy=3, s=0, ai=0;
 window.addEventListener('keydown',e=>{if(e.key==='ArrowUp')py-=30;if(e.key==='ArrowDown')py+=30;}); c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(); py=(e.clientY-r.top)*(c.height/r.height);});
 function loop(){x.fillStyle='#020617';x.fillRect(0,0,c.width,c.height); ay += ((by)-ay)*0.08; x.fillStyle='#fff';x.fillRect(20,py-40,10,80);x.fillRect(c.width-30,ay-40,10,80); bx+=vx;by+=vy; if(by<0||by>c.height)vy*=-1; if(bx<30&&Math.abs(by-py)<45)vx=Math.abs(vx); if(bx>c.width-30&&Math.abs(by-ay)<45)vx=-Math.abs(vx); if(bx<0){ai++;bx=c.width/2;by=c.height/2;} if(bx>c.width){s++;bx=c.width/2;by=c.height/2;} x.beginPath();x.arc(bx,by,8,0,7);x.fill(); x.fillText(`${s} : ${ai}`,c.width/2-20,30); requestAnimationFrame(loop);} loop();
})();