(function inductance(){
  const cv=$('#lr-canvas');const s={L:200,R:50,E:12};let i=0,t=0,mode='idle',hist=[[0,0,0,0]],ph=0;
  const tau=()=>s.L*1e-3/s.R;
  function step(dt){const ta=tau(),dts=dt*ta/1.5,Imax=s.E/s.R;
    if(mode==='on')i=Imax+(i-Imax)*Math.exp(-dts/ta);else if(mode==='off')i*=Math.exp(-dts/ta);
    if(mode==='on'||mode==='off'){t+=dts;const vr=i*s.R,vl=mode==='on'?s.E-vr:-vr;hist.push([t,i,vr,vl]);if(hist.length>3000)hist.splice(1,200);if(t>7*ta)mode='hold';}}
  function draw(dt){const w=cv.clientWidth;if(!w)return;const h=w<560?600:560;const c=prep(cv,h);if(!c)return;const {ctx}=c;step(dt);
    const ta=tau(),Imax=s.E/s.R,vr=i*s.R,vl=mode==='on'?s.E-vr:mode==='off'?-vr:(mode==='hold'?(hist[hist.length-1]||[0,0,0,0])[3]:0);
    const xl=60,xr=Math.min(w-100,xl+340),yt=36,yb=140,Lp=2*(xr-xl+yb-yt);const batt=mode!=='off';
    ctx.lineCap='round';ctx.lineWidth=2;ctx.strokeStyle=T.ink;ctx.beginPath();ctx.moveTo(xl,yt);ctx.lineTo(xr,yt);ctx.lineTo(xr,yt+34);ctx.moveTo(xr,yb-34);ctx.lineTo(xr,yb);ctx.lineTo(xl,yb);ctx.lineTo(xl,yb-30);ctx.moveTo(xl,yt+30);ctx.lineTo(xl,yt);ctx.stroke();
    ctx.save();ctx.globalAlpha=batt?1:.3;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(xl-14,yt+30);ctx.lineTo(xl+14,yt+30);ctx.moveTo(xl-7,yt+40);ctx.lineTo(xl+7,yt+40);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xl,yt+40);ctx.lineTo(xl,yb-30);ctx.stroke();ctx.restore();label(ctx,s.E+' V',xl-20,yt+36,batt?T.ink:T.muted,'right','middle',MONO);
    if(!batt){ctx.strokeStyle=T.cx;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xl,yt);ctx.lineTo(xl+22,yt+22);ctx.lineTo(xl+22,yb-22);ctx.lineTo(xl,yb);ctx.stroke();label(ctx,'battery bypassed',xl+30,(yt+yb)/2,T.cx,'left','middle',MONO);}
    const rx0=xl+(xr-xl)*.35,rx1=xl+(xr-xl)*.65;ctx.fillStyle=T.surface;ctx.fillRect(rx0-2,yt-8,rx1-rx0+4,16);ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(rx0,yt);for(let k=0;k<8;k++)ctx.lineTo(rx0+(rx1-rx0)*(k+.5)/8,yt+(k%2?-8:8));ctx.lineTo(rx1,yt);ctx.stroke();label(ctx,'R = '+s.R+' Ω',(rx0+rx1)/2,yt-18,T.ink,'center','middle',MONO);
    const cy=(yt+yb)/2,cs=(yb-yt-68)/4;ctx.strokeStyle=T.ink;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(xr,yt+34);for(let k=0;k<4;k++)ctx.arc(xr,yt+34+cs*(k+.5),cs/2,-Math.PI/2,Math.PI/2,false);ctx.stroke();label(ctx,'L = '+s.L+' mH',xr+22,cy,T.ink,'left','middle',MONO);
    if(i>.003*Imax){ph=(ph+(8+90*i/Imax)*dt)%30;const loop=[[xl,yb],[xl,yt],[xr,yt],[xr,yb],[xl,yb]],segs=loop.slice(1).map((p,k)=>{const q=loop[k];return {a:q,b:p,l:Math.hypot(p[0]-q[0],p[1]-q[1])};}),tot=segs.reduce((a,b)=>a+b.l,0);
      for(let d=ph;d<tot;d+=30){let acc=0;for(const sg of segs){if(d<=acc+sg.l){const f=(d-acc)/sg.l;dot(ctx,sg.a[0]+(sg.b[0]-sg.a[0])*f,sg.a[1]+(sg.b[1]-sg.a[1])*f,3.2,T.cv);break;}acc+=sg.l;}}}
    label(ctx,mode==='on'?'switch closed: current rising':mode==='off'?'battery removed: the inductor keeps the current going':mode==='hold'?'settled (about 7τ). Press a button again.':'press Close the switch to begin',xl,yb+26,T.muted,'left','middle',MONO);
    // graph in ms
    const tm=Math.max(6*ta,t*1.06)*1e3,P=panel(ctx,{x:56,y:196,w:w-76,h:h-196-46},[0,tm],[-s.E*1.1,s.E*1.1],{ylabel:'voltage (V)',color:T.ink,xlabel:'t (ms)',yn:4,xn:6});
    for(let k=1;k<=6;k++){const tx=k*ta*1e3;if(tx>tm)break;line(ctx,P,tx,-s.E*1.1,tx,s.E*1.1,alpha(T.grid,.9),1,[2,4]);label(ctx,k+'τ',P.X(tx),P.Y(0)+12,T.muted,'center','middle',MONO);}
    const dr=(f,col)=>{ctx.save();clip(ctx,P);ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.beginPath();hist.forEach((p,k)=>{const x=P.X(p[0]*1e3),y=P.Y(f(p));k?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();ctx.restore();};
    dr(p=>p[2],T.cv);dr(p=>p[3],T.hot);const lp=hist[hist.length-1];dot(ctx,P.X(lp[0]*1e3),P.Y(lp[2]),5,T.cv,T.surface);dot(ctx,P.X(lp[0]*1e3),P.Y(lp[3]),5,T.hot,T.surface);
    label(ctx,'V across R (= I·R: the current)',P.X(tm*.35),P.Y(s.E*.45),T.cv,'left','middle',LABEL);label(ctx,'V across L (back-EMF)',P.X(tm*.12),P.Y(s.E*.92),T.hot,'left','middle',LABEL);
    setText('lr-i',sf(i*1e3,'mA'));setText('lr-vl',sf(vl,'V'));setText('lr-vr',sf(vr,'V'));setText('lr-u',sf(.5*s.L*1e-3*i*i*1e3,'mJ'));setText('lr-t',fmt(ta*1e3,1)+' | '+fmt(t*1e3,1)+' ms');}
  const reset=keep=>{if(!keep)i=0;t=0;hist=[[0,i,i*s.R,0]];};
  drawers.inductance=()=>draw(0);ticker('inductance',dt=>draw(Math.min(dt,.05)));
  $('#lr-on').addEventListener('click',()=>{if(mode!=='on'){reset(true);mode='on';}});$('#lr-off').addEventListener('click',()=>{if(mode!=='off'){reset(true);mode='off';}});$('#lr-rst').addEventListener('click',()=>{i=0;mode='idle';reset(false);});
  const ch=()=>{i=Math.min(i,s.E/s.R);reset(true);};bindRange('lr-L',x=>x+' mH',x=>{s.L=x;ch();});bindRange('lr-R',x=>x+' Ω',x=>{s.R=x;ch();});bindRange('lr-E',x=>x+' V',x=>{s.E=x;ch();});
})();
Object.assign(TIPS,{"lr-L":"A bigger inductance means more opposition to changes in current, so the current rises (and falls) more slowly: τ = L/R grows. The final current ε/R doesn't depend on L.","lr-R":"A bigger resistance means a quicker settle (smaller τ = L/R) but a smaller final current ε/R.","lr-E":"The battery voltage sets the final current ε/R and the initial rate of rise ε/L. The time constant doesn't depend on ε."});
Object.assign(KEYS,{"lr-canvas":["Press Close the switch, then Open it. Change L and R and compare time constants.",[["cv","voltage across R (∝ current)"],["hot","voltage across L (back-EMF)"]]]});
Object.assign(TT,{inductance:"Two limits: at t = 0 an inductor acts like an open switch (current can't jump); after a long time it acts like a plain wire. An RL circuit's curve is an exponential with τ = L/R."});
PROBS.push(
 {id:'lrtau',topic:'inductance',title:'Time constant of an LR circuit',gen(){const L=pick([20,50,100,200,500]),R=pick([10,20,50,100]),ans=L/R;
   return {q:`A ${L} mH inductor is in series with a ${R} Ω resistor. What is the time constant of the circuit, in ms?`,ans,unit:'ms',hint:'τ = L/R. With L in mH and R in Ω the answer is in ms.',sol:`<span class="m">τ = <i>L</i>/<i>R</i> = ${L} mH/${R} Ω = <b>${fmt(ans,3)} ms</b></span>.`};}},
 {id:'lrI',topic:'inductance',calc:1,title:'Current in an LR circuit',gen(){const E=pick([6,12,24]),R=pick([10,20,50]),L=pick([100,200,500]),tau=L/R,k=pick([1,2,3]),ans=E/R*(1-Math.exp(-k))*1000;
   return {q:`A ${E} V battery is connected through a switch to a ${R} Ω resistor in series with a ${L} mH inductor. What is the current ${fmt(k*tau,3)} ms after the switch is closed, in mA?`,ans,unit:'mA',hint:'I = (ε/R)(1 − e^(−t/τ)). Here t = kτ.',sol:`<span class="m">τ = ${fmt(tau,3)} ms</span>, <span class="m"><i>t</i>/τ = ${k}</span>, so <span class="m"><i class="cur">I</i> = (${fmt(E/R*1000,3)} mA)(1 − <i>e</i><sup>−${k}</sup>) = <b>${fmt(ans,3)} mA</b></span>.`};}},
 {id:'lrU',topic:'inductance',title:'Energy in an inductor',gen(){const L=pick([.1,.2,.5,1,2]),I=pick([.5,1,2,4]),ans=.5*L*I*I;
   return {q:`An inductor of ${num(L)} H carries a steady current of ${num(I)} A. How much energy is stored in its magnetic field?`,ans,unit:'J',hint:'U = ½LI².',sol:`<span class="m"><i>U</i> = ½<i>L</i><i class="cur">I</i>² = ½(${num(L)})(${num(I)})² = <b>${sf(ans,'J')}</b></span>.`};}},
 {id:'lrEMF',topic:'inductance',calc:1,title:'Back-EMF',gen(){const L=pick([.05,.1,.2,.5]),dI=pick([2,5,10,20]),dt=pick([.01,.02,.05,.1]),ans=L*dI/dt;
   return {q:`The current in a ${num(L)} H inductor increases uniformly by ${dI} A in ${num(dt)} s. What is the magnitude of the induced EMF across the inductor?`,ans,unit:'V',hint:'|ε| = L dI/dt.',sol:`<span class="m">|ε| = <i>L</i>(Δ<i class="cur">I</i>/Δ<i>t</i>) = (${num(L)})(${dI}/${num(dt)}) = <b>${fmt(ans,3)} V</b></span>.`};}}
);
PROBS.push(
 {id:'lrspike',topic:'inductance',title:'Voltage spike when a circuit is opened',gen(){const I=pick([.5,1,2]),R=pick([100,500,1000]),ans=I*R;
   return {q:`An inductor carries a steady ${num(I)} A. A switch suddenly forces that current through a ${R} Ω resistor connected across the inductor. What is the voltage across the resistor immediately afterwards?`,ans,unit:'V',hint:'The inductor keeps its current at the instant of the change, so the resistor carries the same current: V = IR.',
   sol:`<span class="m"><i>V</i> = <i class="cur">I</i><i>R</i> = (${num(I)})(${R}) = <b>${fmt(ans,3)} V</b></span>: opening a switch in an inductive circuit can make a big voltage.`};}},
 {id:'lrsolen',topic:'inductance',title:'Inductance of a solenoid',gen(){const N=pick([200,500,1000]),A=pick([2,5,10]),l=pick([10,20,40]),ans=MU0*N*N*A*1e-4/(l*.01)*1e3;
   return {q:`A solenoid has ${N} turns, cross-sectional area ${A} cm² and length ${l} cm. What is its inductance, in mH?`,ans,unit:'mH',hint:'L = μ₀N²A/ℓ.',sol:`<span class="m"><i>L</i> = μ<sub>0</sub><i>N</i>²<i>A</i>/ℓ = (4π × 10⁻⁷)(${N})²(${sciv(A*1e-4)} m²)/(${num(l/100)} m) = <b>${fmt(ans,4)} mH</b></span>.`};}}
);
