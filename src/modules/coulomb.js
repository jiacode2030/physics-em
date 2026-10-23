(function coulomb(){
  const cv=$('#cb-canvas');const s={mode:'two',q:[3,-2,2]};
  const P=[{x:12,y:13},{x:28,y:13},{x:20,y:5}];let geo=null;
  const n=()=>s.mode==='two'?2:3;
  function Fon(i,j){const dx=(P[i].x-P[j].x)*.01,dy=(P[i].y-P[j].y)*.01,r2=dx*dx+dy*dy,r=Math.sqrt(r2),f=KC*s.q[i]*s.q[j]*1e-12/r2;return {x:f*dx/r,y:f*dy/r,f,r};}
  const len=f=>16+66*clamp(Math.log10(Math.abs(f)/1e-3)/4,0,1);
  function draw(){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.52,280,420));const c=prep(cv,h);if(!c)return;const {ctx}=c;
    const sc=Math.min(w/42,h/28),ox=w/2,oy=h/2,X=x=>ox+(x-20)*sc,Y=y=>oy-(y-13)*sc;geo={sc,ox,oy,w,h};
    ctx.strokeStyle=T.grid;ctx.lineWidth=1;for(let g=0;g<=40;g+=4){ctx.beginPath();ctx.moveTo(Math.round(X(g))+.5,Y(26));ctx.lineTo(Math.round(X(g))+.5,Y(0));ctx.stroke();}for(let g=0;g<=26;g+=4){ctx.beginPath();ctx.moveTo(X(0),Math.round(Y(g))+.5);ctx.lineTo(X(40),Math.round(Y(g))+.5);ctx.stroke();}
    const N=n();ctx.save();ctx.strokeStyle=T.muted;ctx.setLineDash([4,5]);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(X(P[0].x),Y(P[0].y));ctx.lineTo(X(P[1].x),Y(P[1].y));ctx.stroke();ctx.restore();
    const r12=Fon(0,1);label(ctx,fmt(r12.r*100,1)+' cm',X((P[0].x+P[1].x)/2),Y((P[0].y+P[1].y)/2)-12,T.muted,'center','middle',MONO);
    if(N===2){[[0,1],[1,0]].forEach(([i,j])=>{const F=Fon(i,j),m=Math.hypot(F.x,F.y)||1,L=len(F.f);varrow(ctx,X(P[i].x),Y(P[i].y),F.x/m*L,-F.y/m*L,T.hot,'F',3);});}
    else{const A=Fon(0,1),B=Fon(0,2),nx=A.x+B.x,ny=A.y+B.y,nm=Math.hypot(nx,ny),x0=X(P[0].x),y0=Y(P[0].y);
      const mx=Math.max(Math.hypot(A.x,A.y),Math.hypot(B.x,B.y),nm,1e-9),lin=v=>Math.max(8,100*v/mx);
      [[A,'F₂'],[B,'F₃']].forEach(([F,t])=>{const m=Math.hypot(F.x,F.y)||1,L=lin(m);if(m>1e-9)varrow(ctx,x0,y0,F.x/m*L,-F.y/m*L,alpha(T.hot,.6),t,2,[5,4]);});
      if(nm>1e-4*mx){varrow(ctx,x0,y0,nx/nm*lin(nm),-ny/nm*lin(nm),T.hot,'net',3.5);}
      ctx.save();ctx.setLineDash([2,4]);ctx.strokeStyle=T.line;ctx.beginPath();ctx.moveTo(X(P[0].x),Y(P[0].y));ctx.lineTo(X(P[2].x),Y(P[2].y));ctx.stroke();ctx.restore();}
    for(let i=0;i<N;i++){chargeDot(ctx,X(P[i].x),Y(P[i].y),s.q[i],14);label(ctx,(s.q[i]>0?'+':s.q[i]<0?'−':'')+Math.abs(s.q[i])+' μC',X(P[i].x),Y(P[i].y)+27,s.q[i]>0?T.pos:s.q[i]<0?T.neg:T.muted,'center','middle',MONO);}
    setText('cb-r',fmt(r12.r*100,1)+' cm');setText('cb-F',sf(Math.abs(r12.f),'N'));setText('cb-type',!s.q[0]||!s.q[1]?'no force (a charge is 0)':r12.f>0?'repel':'attract');setText('cb-r2',sf(Math.abs(r12.f)/4,'N'));
    if(N===3){const A=Fon(0,1),B=Fon(0,2),nx=A.x+B.x,ny=A.y+B.y,nm=Math.hypot(nx,ny);setText('cb-net',nm<1e-6?'0 N (they cancel)':sf(nm,'N')+', '+fmt((Math.atan2(ny,nx)*180/Math.PI+360)%360,0)+'°');}else setText('cb-net','equal and opposite pair');}
  drawers.coulomb=draw;
  dragPoints(cv,()=>geo?P.slice(0,n()).map(p=>[geo.ox+(p.x-20)*geo.sc,geo.oy-(p.y-13)*geo.sc]):[],(k,x,y,ph)=>{if(ph!=='move'||!geo)return;const nx=clamp((x-geo.ox)/geo.sc+20,1.5,38.5),ny=clamp(13-(y-geo.oy)/geo.sc,1.5,24.5);
    for(let j=0;j<n();j++)if(j!==k&&Math.hypot(nx-P[j].x,ny-P[j].y)<3.2)return;P[k]={x:nx,y:ny};draw();});
  segBind('cb-mode','k',k=>{s.mode=k;$('#cb-q3-ctl').hidden=k==='two';draw();});
  const qf=x=>(x>0?'+':x<0?'−':'')+Math.abs(x)+' μC';
  bindRange('cb-q1',qf,x=>{s.q[0]=x;draw();});bindRange('cb-q2',qf,x=>{s.q[1]=x;draw();});bindRange('cb-q3',qf,x=>{s.q[2]=x;draw();});
})();
Object.assign(TIPS,{"cb-q1":"Force is proportional to the product q₁q₂, so doubling charge 1 doubles the force on both charges. The sign decides attract or repel.","cb-q2":"Make charge 2 the opposite sign and the arrows swing around to point at each other. Set it to 0 and the force disappears.","cb-q3":"Charge 3 adds its own pull or push on charge 1. The thick arrow is the vector sum of the two dashed ones."});
Object.assign(KEYS,{"cb-canvas":["Drag the charges around. Watch the force arrows and the readouts.",[["pos","positive charge"],["neg","negative charge"],["hot","force on a charge"]]]});
Object.assign(TT,{coulomb:"Always sketch the force arrows on the charge you care about before using the formula. The formula gives the size; the sketch gives the direction."});
PROBS.push(
 {id:'coul2',topic:'coulomb',title:'Force between two charges',gen(){const a=pick([1,2,3,4,5]),b=pick([1.5,2.5,3,6,8]),r=pick([5,8,10,15,20,30]),ans=KC*a*b*1e-12/(r*r*1e-4);
   return {q:`Two point charges, +${num(a)} μC and +${num(b)} μC, are ${num(r)} cm apart. What is the size of the electric force on each?`,ans,unit:'N',hint:'Convert μC to C (× 10⁻⁶) and cm to m (× 10⁻²) before using F = k|q₁q₂|/r².',
   sol:`<span class="m"><i class="frc">F</i> = (8.99 × 10⁹)(${num(a)} × 10⁻⁶)(${num(b)} × 10⁻⁶)/(${num(r/100)})² = <b>${sf(ans,'N')}</b></span>. The force is repulsive and equal on both charges.`};}},
 {id:'couls',topic:'coulomb',title:'How the force scales',gen(){const F0=pick([.24,.6,1.2,3.6,8]),k=pick([2,3,4,5]),ans=F0/(k*k);
   return {q:`Two charges repel each other with a force of ${num(F0)} N. The same two charges are moved to ${k} times the original distance. What is the new force?`,ans,unit:'N',hint:'The force goes as 1/r², so multiplying r by k divides F by k².',
   sol:`<span class="m"><i class="frc">F</i>′ = <i class="frc">F</i>/<i>k</i>² = ${num(F0)}/${k*k} = <b>${sf(ans,'N')}</b></span>.`};}},
 {id:'coul3',topic:'coulomb',title:'Net force on the middle charge',gen(){const q1=pick([1,2,3]),q3=q1+pick([1,2,3]),q2=pick([2,3,4]),d=pick([.1,.15,.2,.3]),ans=KC*q2*(q3-q1)*1e-12/(d*d);
   return {q:`A +${num(q1)} μC, a −${num(q2)} μC and a +${num(q3)} μC charge sit in a line, with equal spacing of ${num(d*100)} cm between neighbors. What is the size of the net force on the middle (−${num(q2)} μC) charge?`,ans,unit:'N',hint:'Both outer charges attract the middle one, in opposite directions. Find each force, then subtract.',
   sol:`<span class="m"><i>F</i><sub>1</sub> = k(${num(q1)} × 10⁻⁶)(${num(q2)} × 10⁻⁶)/${num(d)}² = ${sf(KC*q1*q2*1e-12/(d*d),'N')}</span> toward the +${num(q1)} μC charge, and <span class="m"><i>F</i><sub>3</sub> = ${sf(KC*q3*q2*1e-12/(d*d),'N')}</span> the other way. Net = difference = <b>${sf(ans,'N')}</b>, toward the bigger charge.`};}}
);
