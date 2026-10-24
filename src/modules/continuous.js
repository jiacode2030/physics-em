(function continuous(){
  const cv=$('#ct-canvas');const s={mode:'ring',R:6,Q:8,z:10};
  const Ering=(Q,R,z)=>KC*Q*z/Math.pow(z*z+R*R,1.5);
  const Edisk=(Q,R,z)=>{const sg=Q/(Math.PI*R*R);return sg/(2*EPS0)*(1-z/Math.sqrt(z*z+R*R));};
  const Ef=(zc)=>{const Q=s.Q*1e-9,R=s.R*.01,z=Math.max(zc,1e-4)*.01;return s.mode==='ring'?Ering(Q,R,z):Edisk(Q,R,z);};
  function draw(){const w=cv.clientWidth;if(!w)return;const h=w<560?470:430;const c=prep(cv,h);if(!c)return;const {ctx}=c;
    const bx=56,bw=w-bx-18,sx=bw/40,top=130,cy=70,gy=top+14,gh=h-top-52;
    const pk=zc=>KC*s.Q*1e-9/Math.pow(zc*.01,2);let Emax=0;for(let z=.4;z<=40;z+=.4)Emax=Math.max(Emax,Ef(z));
    const P=panel(ctx,{x:bx,y:gy,w:bw,h:gh},[0,40],[0,Emax*1.2],{ylabel:'E on the axis (N/C)',color:T.cx,xlabel:'z (cm)',yn:4,xn:8});
    curve(ctx,P,pk,.5,40,alpha(T.muted,.8),1.5,300,[5,4]);curve(ctx,P,Ef,.05,40,T.cx,2.75,320);
    if(s.mode==='disk'){const sh=s.Q*1e-9/(Math.PI*(s.R*.01)**2)/(2*EPS0);line(ctx,P,0,sh,40,sh,alpha(T.hot,.7),1.2,[2,4]);label(ctx,'σ/2ε₀ (infinite sheet)',P.X(40)-4,P.Y(sh)-10,T.hot,'right','middle',MONO);}
    label(ctx,'dashed: point charge kQ/z²',P.X(40)-4,P.Y(Emax*.45),T.muted,'right','middle',MONO);
    // schematic, same horizontal scale as the graph
    const X=z=>bx+z*sx,Rp=8+s.R/15*46;ctx.strokeStyle=T.line;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bx-30,cy+.5);ctx.lineTo(bx+bw,cy+.5);ctx.stroke();
    if(s.mode==='ring'){ctx.strokeStyle=alpha(T.pos,.9);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(X(0),cy,7,Rp,0,0,Math.PI*2);ctx.stroke();dot(ctx,X(0),cy-Rp,5,T.pos);dot(ctx,X(0),cy+Rp,5,T.pos);}
    else{ctx.fillStyle=alpha(T.pos,.35);ctx.strokeStyle=T.pos;ctx.lineWidth=2;ctx.fillRect(X(0)-3,cy-Rp,6,2*Rp);ctx.strokeRect(X(0)-3,cy-Rp,6,2*Rp);}
    label(ctx,s.mode==='ring'?'ring (side view)':'disk (edge-on)',X(0)-24,cy-Rp-12,T.pos,'left','middle',MONO);label(ctx,'R = '+fmt(s.R,1)+' cm (height not to scale)',X(0)-24,cy+Rp+14,T.muted,'left','middle',MONO);
    const zp=Math.max(s.z,.05),E=Ef(zp),L=14+64*clamp(E/Emax,0,1);dot(ctx,X(zp),cy,5,T.ink);arrow(ctx,X(zp),cy,X(zp)+L,cy,T.cx,3.5);label(ctx,'E',X(zp)+L+8,cy,T.cx,'left');
    if(s.mode==='ring'){ctx.save();ctx.strokeStyle=alpha(T.hot,.5);ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(X(0),cy-Rp);ctx.lineTo(X(zp),cy);ctx.moveTo(X(0),cy+Rp);ctx.lineTo(X(zp),cy);ctx.stroke();ctx.restore();}
    ctx.save();ctx.strokeStyle=alpha(T.ink,.5);ctx.setLineDash([2,3]);ctx.beginPath();ctx.moveTo(X(zp),cy+8);ctx.lineTo(X(zp),gy+gh);ctx.stroke();ctx.restore();dot(ctx,X(zp),P.Y(E),5.5,T.cx,T.surface);
    const pt=KC*s.Q*1e-9/Math.pow(zp*.01,2);setText('ct-E',sf(E,'N/C'));setText('ct-pt',sf(pt,'N/C'));setText('ct-diff',fmt(100*(E-pt)/pt,1)+' % vs point charge');
    setText('ct-lim',s.mode==='ring'?(zp>4*s.R?'far: acts like a point charge':zp<.3*s.R?'near the center: E → 0':'in between'):(zp<.2*s.R?'near: E → σ/2ε₀ = '+sf(s.Q*1e-9/(Math.PI*(s.R*.01)**2)/(2*EPS0),'N/C'):zp>4*s.R?'far: acts like a point charge':'in between'));}
  drawers.continuous=draw;
  segBind('ct-mode','k',k=>{s.mode=k;draw();});
  bindRange('ct-R',x=>fmt(x,1)+' cm',x=>{s.R=x;draw();});bindRange('ct-Q',x=>x+' nC',x=>{s.Q=x;draw();});bindRange('ct-z',x=>fmt(x,1)+' cm',x=>{s.z=x;draw();});
})();
Object.assign(TIPS,{"ct-R":"A bigger ring or disk spreads the same charge over more area, so the field near it drops and the peak moves outward.","ct-Q":"Field is proportional to the total charge. Double Q and every point of the curve doubles.","ct-z":"Slide the point along the axis and compare the solid curve (the real object) with the dashed curve (a point charge)."});
Object.assign(KEYS,{"ct-canvas":["Slide the point along the axis. Pick ring or disk.",[["cx","field of the object"],["muted","point charge kQ/z²","dash"],["pos","the charged ring or disk"]]]});
Object.assign(TT,{continuous:"Before integrating, ask which parts of dE cancel. For a ring or disk, only the part along the axis survives, so add up just that part."});
PROBS.push(
 {id:'ringE',topic:'continuous',calc:1,title:'Field on the axis of a ring',gen(){const Q=pick([4,6,8,12]),R=pick([.05,.1,.15]),z=pick([.1,.2,.3]),ans=KC*Q*1e-9*z/Math.pow(z*z+R*R,1.5);
   return {q:`A ring of radius ${num(R)} m carries a total charge of +${num(Q)} nC spread uniformly. What is the electric field on the axis, ${num(z)} m from the center of the ring?`,ans,unit:'N/C',hint:'Only the component along the axis survives: E = kQz/(z² + R²)^(3/2).',
   sol:`<span class="m"><i class="ef">E</i> = (8.99 × 10⁹)(${num(Q)} × 10⁻⁹)(${num(z)})/(${num(z)}² + ${num(R)}²)<sup>3/2</sup> = <b>${sf(ans,'N/C')}</b></span>, along the axis, away from the ring.`};}},
 {id:'ringmax',topic:'continuous',calc:1,title:'Where the ring field peaks',gen(){const R=pick([3,4,6,8,10,12]),ans=R/Math.sqrt(2);
   return {q:`A uniformly charged ring has radius ${num(R)} cm. At what distance from its center along the axis is the field strongest, in cm?`,ans,unit:'cm',hint:'Set dE/dz = 0 for E = kQz/(z² + R²)^(3/2). The peak is at z = R/√2.',
   sol:`<span class="m">d<i>E</i>/d<i>z</i> = 0</span> gives <span class="m"><i>z</i><sup>2</sup> = <i>R</i><sup>2</sup>/2</span>, so <span class="m"><i>z</i> = <i>R</i>/√2 = <b>${fmt(ans,3)} cm</b></span>.`};}},
 {id:'diskE',topic:'continuous',calc:1,title:'Field on the axis of a disk',gen(){const sg=pick([1,2,3,5]),R=pick([.05,.1,.2]),z=pick([.05,.1,.2]),ans=sg*1e-6/(2*EPS0)*(1-z/Math.sqrt(z*z+R*R));
   return {q:`A disk of radius ${num(R)} m carries a uniform surface charge density σ = +${num(sg)} μC/m². What is the electric field on the axis, ${num(z)} m from the disk?`,ans,unit:'N/C',hint:'E = (σ/2ε₀)[1 − z/√(z² + R²)], with ε₀ = 8.85 × 10⁻¹² C²/(N·m²).',
   sol:`<span class="m"><i class="ef">E</i> = (${num(sg)} × 10⁻⁶/(2 × 8.85 × 10⁻¹²))[1 − ${num(z)}/√(${num(z)}² + ${num(R)}²)] = <b>${sf(ans,'N/C')}</b></span>.`};}},
 {id:'sheetE',topic:'continuous',title:'Field of an infinite sheet',gen(){const sg=pick([2,4,6,8,10]),ans=sg*1e-9/(2*EPS0);
   return {q:`A very large flat sheet carries a uniform surface charge density of +${num(sg)} nC/m². What is the field strength 2 cm from it (far from the edges)?`,ans,unit:'N/C',hint:'For an infinite sheet E = σ/2ε₀, at any distance.',
   sol:`<span class="m"><i class="ef">E</i> = σ/(2ε<sub>0</sub>) = ${num(sg)} × 10⁻⁹/(2 × 8.85 × 10⁻¹²) = <b>${sf(ans,'N/C')}</b></span>, whatever the distance.`};}}
);
