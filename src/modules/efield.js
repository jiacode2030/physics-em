(function efield(){
  const cv=$('#ef-canvas');const s={q1:2,q2:0,q3:0,show:'lines'};
  let Q=[{x:0,y:0},{x:.16,y:0},{x:0,y:.14}],probe={x:.12,y:.07},geo=null;
  const charges=()=>[[Q[0],s.q1],[Q[1],s.q2],[Q[2],s.q3]].map(([p,q])=>({x:p.x,y:p.y,q}));
  function E(x,y){let ex=0,ey=0;charges().forEach(c=>{if(!c.q)return;const dx=x-c.x,dy=y-c.y,r2=dx*dx+dy*dy;if(r2<1e-8)return;const r=Math.sqrt(r2),k=KC*c.q*1e-9/(r2*r);ex+=k*dx;ey+=k*dy;});return [ex,ey];}
  function lines(){const out=[],C=charges(),pos=C.filter(c=>c.q>0),neg=C.filter(c=>c.q<0),src=pos.length?pos:neg,dir=pos.length?1:-1,stopAt=pos.length?neg:[];
    src.forEach(c=>{const n=6*Math.abs(c.q);for(let i=0;i<n;i++){const a=(i+.5)/n*Math.PI*2+.13;let x=c.x+.012*Math.cos(a),y=c.y+.012*Math.sin(a);const pts=[[x,y]];
      for(let st=0;st<700;st++){const [ex,ey]=E(x,y),m=Math.hypot(ex,ey);if(!m)break;x+=dir*.003*ex/m;y+=dir*.003*ey/m;pts.push([x,y]);
        if(stopAt.some(o=>Math.hypot(x-o.x,y-o.y)<.011))break;if(Math.abs(x)>.4||Math.abs(y)>.3)break;}out.push(dir>0?pts:pts.reverse());}});return out;}
  function draw(){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.62,300,460));const c=prep(cv,h);if(!c)return;const {ctx}=c;
    const sc=Math.min(w/.6,h/.4),ox=w/2,oy=h/2,X=x=>ox+x*sc,Y=y=>oy-y*sc;geo={sc,ox,oy,w,h};
    ctx.strokeStyle=T.grid;ctx.lineWidth=1;for(let g=-.4;g<=.4001;g+=.05){ctx.beginPath();ctx.moveTo(Math.round(X(g))+.5,0);ctx.lineTo(Math.round(X(g))+.5,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,Math.round(Y(g))+.5);ctx.lineTo(w,Math.round(Y(g))+.5);ctx.stroke();}
    const C=charges();
    if(s.show==='lines'){ctx.lineWidth=1.5;lines().forEach(pts=>{ctx.strokeStyle=alpha(T.cx,.6);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(X(p[0]),Y(p[1])):ctx.moveTo(X(p[0]),Y(p[1])));ctx.stroke();
      const m=Math.floor(pts.length*.45);if(pts.length>12){const a=pts[m],b=pts[m+2];const ax=X(a[0]),ay=Y(a[1]),dx=X(b[0])-ax,dy=Y(b[1])-ay,L=Math.hypot(dx,dy)||1;arrow(ctx,ax-dx/L*4,ay-dy/L*4,ax+dx/L*5,ay+dy/L*5,alpha(T.cx,.85),1.5);}});}
    else{for(let gx=-.375;gx<.4;gx+=.025)for(let gy=-.275;gy<.3;gy+=.025){if(X(gx)<4||X(gx)>w-4||Y(gy)<4||Y(gy)>h-4)continue;if(C.some(q=>q.q&&Math.hypot(gx-q.x,gy-q.y)<.03))continue;
        const [ex,ey]=E(gx,gy),m=Math.hypot(ex,ey);if(m<1)continue;const f=clamp(Math.log10(m/50)/3,0,1),L=5+9*f,px=X(gx),py=Y(gy);arrow(ctx,px-ex/m*L/2,py+ey/m*L/2,px+ex/m*L/2,py-ey/m*L/2,alpha(T.cx,.3+.6*f),1.4);}}
    C.forEach((q,i)=>{if(i===2&&!q.q)return;chargeDot(ctx,X(q.x),Y(q.y),q.q,14);label(ctx,(q.q>0?'+':q.q<0?'−':'')+Math.abs(q.q)+' nC',X(q.x),Y(q.y)+26,q.q>0?T.pos:q.q<0?T.neg:T.muted,'center','middle',MONO);});
    const [ex,ey]=E(probe.x,probe.y),m=Math.hypot(ex,ey),px=X(probe.x),py=Y(probe.y);
    if(m>.5){const L=18+28*clamp(Math.log10(m/50)/3,0,1);arrow(ctx,px,py,px+ex/m*L,py-ey/m*L,T.cx,3);label(ctx,'E',px+ex/m*(L+10),py-ey/m*(L+10),T.cx,'center','middle');}
    dot(ctx,px,py,7,T.surface,T.ink);dot(ctx,px,py,2,T.ink);label(ctx,'probe',px+10,py+14,T.muted,'left','middle',MONO);
    setText('ef-E',sf(m,'N/C'));setText('ef-dir',m>.5?'θ = '+fmt((Math.atan2(ey,ex)*180/Math.PI+360)%360,0)+'° from +x':'none (E = 0)');
    setText('ef-F',sf(m*1e-9,'N'));setText('ef-Fe',sf(m*QE,'N')+(m>.5?', opposite E':''));}
  drawers.efield=()=>{draw();v3&&v3.render();};
  dragPoints(cv,()=>{if(!geo)return [];const {sc,ox,oy}=geo;return [...charges().map((q,i)=>i===2&&!q.q?[-1e4,-1e4]:[ox+q.x*sc,oy-q.y*sc]),[ox+probe.x*sc,oy-probe.y*sc]];},(k,x,y,ph)=>{if(ph!=='move'||!geo)return;const {sc,ox,oy,w,h}=geo;
    const p={x:clamp((x-ox)/sc,(-ox+14)/sc,(w-ox-14)/sc),y:clamp((oy-y)/sc,(oy-h+14)/sc,(oy-14)/sc)};if(k===3)probe=p;else Q[k]=p;draw();});
  const setQ=(id,v)=>{const el=$('#'+id);el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
  segBind('ef-preset','k',k=>{const P={one:[[0,0],[.16,0],0,[.12,.07],2,0],dipole:[[-.1,0],[.1,0],0,[0,0],2,-2],like:[[-.1,0],[.1,0],0,[0,0],2,2],three:[[-.13,-.07],[.13,-.07],2,[0,.02],2,-2]}[k];
    Q[0]={x:P[0][0],y:P[0][1]};Q[1]={x:P[1][0],y:P[1][1]};Q[2]={x:0,y:.13};s.q3=P[2];probe={x:P[3][0],y:P[3][1]};setQ('ef-q1',P[4]);setQ('ef-q2',P[5]);draw();});
  segBind('ef-show','k',k=>{s.show=k;draw();});
  const qf=x=>(x>0?'+':x<0?'−':'')+Math.abs(x)+' nC';
  bindRange('ef-q1',qf,x=>{s.q1=x;draw();});bindRange('ef-q2',qf,x=>{s.q2=x;draw();});  let v3=null;
  v3=view3d($('#ef3-canvas'),{yaw:-.8,pitch:.4,dist:6.2,target:[0,0,0],min:3,max:18,height:w=>clamp(w*.5,280,420),scene:S=>{
    const ch=[{p:[-1.3,0,0],q:s.q1},{p:[1.3,0,0],q:s.q2}].filter(c=>c.q);
    const E3=(x,y,z)=>{let ex=0,ey=0,ez=0;ch.forEach(c=>{const dx=x-c.p[0],dy=y-c.p[1],dz=z-c.p[2],r2=dx*dx+dy*dy+dz*dz+1e-6,k=c.q/(r2*Math.sqrt(r2));ex+=k*dx;ey+=k*dy;ez+=k*dz;});return [ex,ey,ez];};
    S.grid(-5,5,-4,4,1);
    const pos=ch.filter(c=>c.q>0),neg=ch.filter(c=>c.q<0),src=pos.length?pos:neg,dir=pos.length?1:-1;
    src.forEach(c=>{const n=Math.round(10*Math.abs(c.q));for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*2.399963;let p=[c.p[0]+.2*y,c.p[1]+.2*r*Math.cos(a),c.p[2]+.2*r*Math.sin(a)];const pts=[p];
      for(let k=0;k<170;k++){const e=E3(p[0],p[1],p[2]),m=Math.hypot(e[0],e[1],e[2]);if(!m)break;p=[p[0]+dir*.08*e[0]/m,p[1]+dir*.08*e[1]/m,p[2]+dir*.08*e[2]/m];pts.push(p);
        if(ch.some(o=>o.q*c.q<0&&Math.hypot(p[0]-o.p[0],p[1]-o.p[1],p[2]-o.p[2])<.22)||Math.hypot(p[0],p[1],p[2])>4.2)break;}
      S.path(pts,alpha(T.cx,.55),1.4);}});
    ch.forEach(c=>{S.ball(c.p,.22,c.q>0?T.pos:T.neg,1,true);S.text(V3.add(c.p,[0,0,.55]),(c.q>0?'+':'−')+Math.abs(c.q)+' nC',c.q>0?T.pos:T.neg);});}});


})();
Object.assign(TIPS,{"ef-q1":"Charge 1's field scales with its charge: double q and every arrow it contributes doubles. Make it negative and its arrows turn around to point at it.","ef-q2":"Set charge 2 to zero to see one charge alone. Opposite signs make a dipole; equal signs push the lines apart and create a zero-field point between them."});
Object.assign(KEYS,{"ef-canvas":["Drag the charges or the probe. Switch arrangements with the buttons.",[["pos","positive charge"],["neg","negative charge"],["cx","field lines and E at the probe"]]]});
Object.assign(TT,{efield:"Draw each charge's arrow at the point before you calculate anything. The picture gives the direction; kq/r² only gives the size."});
PROBS.push(
 {id:'epoint',topic:'efield',title:'Field of a point charge',gen(){const q=pick([1.5,2,3,4.5,6,8]),r=pick([.05,.08,.1,.12,.15,.2,.25]),ans=KC*q*1e-9/(r*r);
   return {q:`What is the size of the electric field ${num(r*100)} cm from a ${num(q)} nC point charge?`,ans,unit:'N/C',hint:'Use E = k|q|/r² with q in coulombs and r in meters.',
   sol:`<span class="m"><i class="ef">E</i> = (8.99 × 10⁹)(${num(q)} × 10⁻⁹)/(${num(r)})² = <b>${sf(ans,'N/C')}</b></span>.`};}},
 {id:'enull',topic:'efield',title:'Where the field cancels',gen(){const q1=pick([1,2,3]),q2=q1*pick([4,9,2.25]),d=pick([.2,.3,.4,.5]),ans=d/(1+Math.sqrt(q2/q1));
   return {q:`A +${num(q1)} nC charge and a +${num(q2)} nC charge are ${num(d*100)} cm apart. How far from the ${num(q1)} nC charge, on the line between them, is the electric field zero? Give your answer in meters.`,ans,unit:'m',hint:'Set the two field sizes equal: kq₁/x² = kq₂/(d − x)². Take square roots before solving.',
   sol:`<span class="m"><i>q</i><sub>1</sub>/<i>x</i>² = <i>q</i><sub>2</sub>/(<i>d</i> − <i>x</i>)²</span> gives <span class="m">(<i>d</i> − <i>x</i>)/<i>x</i> = √(${num(q2)}/${num(q1)}) = ${num(Math.sqrt(q2/q1))}</span>, so <span class="m"><i>x</i> = <i>d</i>/(1 + ${num(Math.sqrt(q2/q1))}) = <b>${fmt(ans,3)} m</b></span>. It is closer to the smaller charge.`};}},
 {id:'eaccel',topic:'efield',title:'Electron in a uniform field',gen(){const E=pick([200,500,800,1200,2500,4000]),ans=QE*E/ME;
   return {q:`An electron is in a uniform electric field of ${E} N/C. What is the size of its acceleration? (Electron: m = 9.11 × 10⁻³¹ kg, e = 1.6 × 10⁻¹⁹ C. Type large numbers like 3.5e14.)`,ans,unit:'m/s²',hint:'F = eE, then a = F/m. Gravity is tiny by comparison, so ignore it.',
   sol:`<span class="m"><i>a</i> = <i>eE</i>/<i>m</i> = (1.6 × 10⁻¹⁹)(${E})/(9.11 × 10⁻³¹) = <b>${sf(ans,'m/s²')}</b></span>, about ${sf(ans/9.8)} times g. It points opposite to E.`};}}
);
