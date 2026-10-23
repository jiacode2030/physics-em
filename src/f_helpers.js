function ticker(id,fn){let last=0;function loop(ts){if(current===id&&!document.hidden){const dt=last?Math.min(.05,(ts-last)/1000):0;fn(dt);}last=ts;requestAnimationFrame(loop);}requestAnimationFrame(loop);}
function playBtn(id,get,set){const b=$('#'+id);const upd=()=>b.textContent=get()?'Pause':'Play';b.addEventListener('click',()=>{set(!get());upd();});upd();}
function varrow(ctx,x,y,dx,dy,color,text,w=2.5,dash){const L=Math.hypot(dx,dy);if(L<3)return;arrow(ctx,x,y,x+dx,y+dy,color,w,dash);if(text)label(ctx,text,x+dx+dx/L*13,y+dy+dy/L*13,color,'center','middle');}
function zigzag(ctx,x1,x2,y,amp,n,color){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1.75;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x1,y);const lead=10,L=x2-x1-2*lead;ctx.lineTo(x1+lead,y);for(let i=0;i<n;i++)ctx.lineTo(x1+lead+L*(i+.5)/n,y+(i%2?amp:-amp));ctx.lineTo(x2-lead,y);ctx.lineTo(x2,y);ctx.stroke();ctx.restore();}
function segBind(id,attr,cb){const btns=$$('#'+id+' button');btns.forEach(b=>b.addEventListener('click',()=>{btns.forEach(x=>x.setAttribute('aria-pressed',x===b));cb(b.dataset[attr]);}));}
function setText(id,v){const el=$('#'+id);if(el)el.textContent=v;}
function hexRGB(c){if(!c||c[0]!=='#')return [128,128,128];let h=c.slice(1);if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255];}
const extra={};
/* Number formatting for E&M sizes: plain for ordinary numbers, a × 10ⁿ for very big or small ones. */
const SUPS={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
function sf(n,unit,d=3){if(n==null||!isFinite(n))return '—';const a=Math.abs(n);let s;
  if(a===0)s='0';else if(a>=.01&&a<1e4)s=String(+n.toPrecision(d));
  else{let e=Math.floor(Math.log10(a)),m=+(n/10**e).toPrecision(d);if(Math.abs(m)>=10){m/=10;e++;}s=String(m)+' × 10'+String(e).split('').map(c=>SUPS[c]).join('');}
  s=s.replace('-','−');return unit?s+' '+unit:s;}
function dragPoints(cv,getPts,onMove,o={}){let k=-1;const R=o.r||24;
  const pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
  cv.addEventListener('pointerdown',e=>{const [x,y]=pos(e),P=getPts();let best=-1,bd=R;P.forEach((p,i)=>{const d=Math.hypot(p[0]-x,p[1]-y);if(d<bd){bd=d;best=i;}});k=best;if(k>=0){cv.setPointerCapture(e.pointerId);e.preventDefault();onMove(k,x,y,'start');}});
  cv.addEventListener('pointermove',e=>{const [x,y]=pos(e);if(k<0){cv.style.cursor=getPts().some(p=>Math.hypot(p[0]-x,p[1]-y)<R)?'grab':'';return;}onMove(k,x,y,'move');});
  const up=()=>{if(k>=0)onMove(k,0,0,'end');k=-1;};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);}
function chargeDot(ctx,x,y,q,r=14){const col=q>0?T.pos:q<0?T.neg:T.muted;ctx.save();if(q){ctx.shadowColor=alpha(col,.5);ctx.shadowBlur=10;dot(ctx,x,y,r,col);}else dot(ctx,x,y,r,null,col);ctx.restore();
  label(ctx,q>0?'+':q<0?'−':'0',x,y+1,q?'#fff':T.muted,'center','middle','700 '+Math.round(r*1.25)+'px "IBM Plex Sans", system-ui, sans-serif');}
/* Field lines of point charges in a plane. C: [{x,y,q}] in any length unit; o: {per: lines per unit charge, step, r0, stop, bounds:[x0,y0,x1,y1]}.
   Lines start evenly around each positive charge and follow E until they reach a negative charge or leave the bounds. */
function fieldAt(C,x,y){let ex=0,ey=0;C.forEach(c=>{if(!c.q)return;const dx=x-c.x,dy=y-c.y,r2=dx*dx+dy*dy;if(r2<1e-9)return;const k=c.q/(r2*Math.sqrt(r2));ex+=k*dx;ey+=k*dy;});return [ex,ey];}
function fieldLines(C,o){const per=o.per||6,st=o.step,r0=o.r0,stop=o.stop||st*3,[bx0,by0,bx1,by1]=o.bounds,out=[];
  const pos=C.filter(c=>c.q>0),neg=C.filter(c=>c.q<0),src=pos.length?pos:neg,dir=pos.length?1:-1,sinks=pos.length?neg:[];
  src.forEach(c=>{const n=Math.max(3,Math.round(per*Math.abs(c.q)));for(let i=0;i<n;i++){const a=(i+.5)/n*Math.PI*2+.13;let x=c.x+r0*Math.cos(a),y=c.y+r0*Math.sin(a);const pts=[[x,y]];
    for(let k=0;k<900;k++){const [ex,ey]=fieldAt(C,x,y),m=Math.hypot(ex,ey);if(!m)break;x+=dir*st*ex/m;y+=dir*st*ey/m;pts.push([x,y]);
      if(sinks.some(q=>Math.hypot(x-q.x,y-q.y)<stop))break;if(x<bx0||x>bx1||y<by0||y>by1)break;}
    out.push(dir>0?pts:pts.reverse());}});return out;}
function strokeLines(ctx,lines,X,Y,col,arrows=true){ctx.lineWidth=1.5;lines.forEach(pts=>{ctx.strokeStyle=alpha(col,.6);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(X(p[0]),Y(p[1])):ctx.moveTo(X(p[0]),Y(p[1])));ctx.stroke();
  if(arrows&&pts.length>14){const m=Math.floor(pts.length*.45),a=pts[m],b=pts[m+2],ax=X(a[0]),ay=Y(a[1]),dx=X(b[0])-ax,dy=Y(b[1])-ay,L=Math.hypot(dx,dy)||1;arrow(ctx,ax-dx/L*4,ay-dy/L*4,ax+dx/L*5,ay+dy/L*5,alpha(col,.9),1.5);}});}
