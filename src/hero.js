/* ---------------- Overview hero ---------------- */
(function hero(){
  /* Field lines of a +q and a −q. Lines start evenly around the + charge and are traced along E until they
     reach the − charge or leave the picture. Dots flow along each line in the direction of E. Drag a charge. */
  const cv=$('#hero-canvas');let Q=null,lines=[],W=0,H=0,phase=0,last=0,drag=-1;
  function field(x,y){let ex=0,ey=0;Q.forEach(c=>{const dx=x-c.x,dy=y-c.y,r2=dx*dx+dy*dy+1e-6,r=Math.sqrt(r2),k=c.q/(r2*r);ex+=k*dx;ey+=k*dy;});return [ex,ey];}
  function trace(){lines=[];const src=Q.filter(c=>c.q>0);src.forEach(c=>{const N=16;for(let i=0;i<N;i++){const a=(i+.5)/N*Math.PI*2;let x=c.x+11*Math.cos(a),y=c.y+11*Math.sin(a);const pts=[[x,y]];
      for(let s=0;s<1400;s++){const [ex,ey]=field(x,y),m=Math.hypot(ex,ey);if(!m)break;x+=2*ex/m;y+=2*ey/m;pts.push([x,y]);
        if(Q.some(o=>o.q<0&&Math.hypot(x-o.x,y-o.y)<10))break;if(x<-40||x>W+40||y<-40||y>H+40)break;}
      let L=0;const cum=[0];for(let k=1;k<pts.length;k++){L+=Math.hypot(pts[k][0]-pts[k-1][0],pts[k][1]-pts[k-1][1]);cum.push(L);}lines.push({pts,cum,L});}});}
  function at(l,s){let lo=0,hi=l.cum.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(l.cum[m]<s)lo=m;else hi=m;}const f=(s-l.cum[lo])/((l.cum[hi]-l.cum[lo])||1);return [l.pts[lo][0]+(l.pts[hi][0]-l.pts[lo][0])*f,l.pts[lo][1]+(l.pts[hi][1]-l.pts[lo][1])*f];}
  function draw(ts){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.72,230,330));const c=prep(cv,h);if(!c)return;const {ctx}=c;
    if(!Q||W!==w||H!==h){if(!Q)Q=[{x:w*.3,y:h*.52,q:1},{x:w*.7,y:h*.48,q:-1}];else Q.forEach(o=>{o.x*=w/W;o.y*=h/H;});W=w;H=h;trace();}
    if(ts!==undefined){const dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;phase=(phase+dt*46)%34;}
    ctx.lineWidth=1.4;lines.forEach(l=>{ctx.strokeStyle=alpha(T.cx,.42);ctx.beginPath();l.pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();});
    lines.forEach(l=>{if(REDUCE){if(l.L>60){const p=at(l,l.L*.5),q=at(l,l.L*.5+6);arrow(ctx,p[0],p[1],q[0]+(q[0]-p[0])*1.2,q[1]+(q[1]-p[1])*1.2,T.cx,1.6);}return;}
      for(let s=14+phase;s<l.L-12;s+=34){const p=at(l,s);dot(ctx,p[0],p[1],2.4,T.cx);}});
    Q.forEach((o,i)=>{const col=o.q>0?T.pos:T.neg;ctx.save();ctx.shadowColor=alpha(col,.55);ctx.shadowBlur=drag===i?22:14;dot(ctx,o.x,o.y,15,col);ctx.restore();
      label(ctx,o.q>0?'+':'−',o.x,o.y+1,'#fff','center','middle','700 20px "IBM Plex Sans", system-ui, sans-serif');});
    label(ctx,'drag a charge',10,h-12,T.muted,'left','middle',MONO);}
  const pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
  cv.addEventListener('pointerdown',e=>{if(!Q)return;const [x,y]=pos(e);drag=Q.findIndex(o=>Math.hypot(o.x-x,o.y-y)<26);if(drag>=0){cv.setPointerCapture(e.pointerId);e.preventDefault();}});
  cv.addEventListener('pointermove',e=>{const [x,y]=pos(e);if(drag<0){cv.style.cursor=Q&&Q.some(o=>Math.hypot(o.x-x,o.y-y)<26)?'grab':'';return;}
    const o=Q[drag],other=Q[1-drag];let nx=clamp(x,18,W-18),ny=clamp(y,18,H-18);if(Math.hypot(nx-other.x,ny-other.y)<40)return;o.x=nx;o.y=ny;trace();if(REDUCE)draw();});
  const up=()=>{drag=-1;};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  drawers.overview=()=>draw();
  function tickLoop(ts){if(current==='overview'&&!document.hidden&&(!REDUCE||drag>=0))draw(ts);requestAnimationFrame(tickLoop);}
  requestAnimationFrame(tickLoop);
})();
