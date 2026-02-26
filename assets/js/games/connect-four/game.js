(() => {
const c=document.getElementById('gameCanvas'); if(!c?.getContext) return; const ctx=c.getContext('2d');
const cols=7,rows=6,cell=80,b=Array.from({length:rows},()=>Array(cols).fill(0)); let p=1;
function drop(col){for(let r=rows-1;r>=0;r--)if(!b[r][col]){b[r][col]=p;p=p===1?2:1;break;}}
c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect(); const col=Math.floor((e.clientX-r.left)*(c.width/r.width)/cell); if(col>=0&&col<cols) drop(col);});
(function draw(){ctx.fillStyle='#1d4ed8';ctx.fillRect(0,0,c.width,c.height);for(let r=0;r<rows;r++)for(let col=0;col<cols;col++){ctx.fillStyle=b[r][col]===1?'#ef4444':b[r][col]===2?'#facc15':'#0f172a';ctx.beginPath();ctx.arc(col*cell+40,r*cell+40,30,0,7);ctx.fill();}ctx.fillStyle='#fff';ctx.fillText(`Turn: ${p===1?'Red':'Yellow'}`,10,c.height-10);requestAnimationFrame(draw)})();
})();