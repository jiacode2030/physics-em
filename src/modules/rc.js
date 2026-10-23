(function rc(){
  const cv=$('#rc-canvas');const s={R:10,C:100,E:12,sp:1};let vc=0,t=0,mode='idle',hist=[[0,0,0]],ph=0;
  const tau=()=>s.R*1e3*s.C*1e-6;
  function step(dt){const ta=tau(),dts=dt*s.sp;if(mode==='charge')vc=s.E+(vc-s.E)*Math.exp(-dts/ta);else if(mode==='discharge')vc*=Math.exp(-dts/ta);
    if(mode==='charge'||mode==='discharge'){t+=dts;const i=mode==='charge'?(s.E-vc)/(s.R*1e3):-vc/(s.R*1e3);hist.push([t,vc,i]);if(hist.length>4000)hist.splice(1,200);if(t>7*ta){mode='hold';}}return mode==='charge'?(s.E-vc)/(s.R*1e3):mode==='discharge'?-vc/(s.R*1e3):0;}
  function draw(dt){const w=cv.clientWidth;if(!w)return;const h=w<560?600:560;const c=prep(cv,h);if(!c)return;const {ctx}=c;const I=step(dt),Imax=s.E/(s.R*1e3);
    // circuit
    const xl=60,xr=Math.min(w-90,xl+340),yt=36,yb=140;const loop=[[xl,yb],[xl,yt],[xr,yt],[xr,yb],[xl,yb]];let Lp=0;const segs=loop.slice(1).map((p,k)=>{const q=loop[k],l=Math.hypot(p[0]-q[0],p[1]-q[1]);Lp+=l;return {a:q,b:p,l};});
    ctx.lineCap='round';ctx.lineWidth=2;ctx.strokeStyle=T.ink;
    const batt=mode!=='discharge';
    ctx.beginPath();ctx.moveTo(xl,yt);ctx.lineTo(xr,yt);ctx.lineTo(xr,yt+40);ctx.moveTo(xr,yb-40);ctx.lineTo(xr,yb);ctx.lineTo(xl,yb);ctx.lineTo(xl,yb-30);ctx.moveTo(xl,yt+30);ctx.lineTo(xl,yt);ctx.stroke();
    ctx.save();ctx.globalAlpha=batt?1:.3;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(xl-14,yt+30);ctx.lineTo(xl+14,yt+30);ctx.moveTo(xl-7,yt+40);ctx.lineTo(xl+7,yt+40);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xl,yt+40);ctx.lineTo(xl,yb-30);ctx.stroke();ctx.restore();
    label(ctx,s.E+' V',xl-20,yt+36,batt?T.ink:T.muted,'right','middle',MONO);
    if(!batt){ctx.strokeStyle=T.cx;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xl,yt);ctx.lineTo(xl+22,yt+22);ctx.lineTo(xl+22,yb-22);ctx.lineTo(xl,yb);ctx.stroke();label(ctx,'battery bypassed',xl+30,(yt+yb)/2,T.cx,'left','middle',MONO);}
    // resistor on top
    const rx0=xl+(xr-xl)*.4,rx1=xl+(xr-xl)*.75;ctx.fillStyle=T.surface;ctx.fillRect(rx0-2,yt-8,rx1-rx0+4,16);ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(rx0,yt);for(let k=0;k<8;k++)ctx.lineTo(rx0+(rx1-rx0)*(k+.5)/8,yt+(k%2?-8:8));ctx.lineTo(rx1,yt);ctx.stroke();label(ctx,'R = '+s.R+' kΩ',(rx0+rx1)/2,yt-18,T.ink,'center','middle',MONO);
    // capacitor on right
    const cy=(yt+yb)/2;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(xr-18,cy-6);ctx.lineTo(xr+18,cy-6);ctx.moveTo(xr-18,cy+6);ctx.lineTo(xr+18,cy+6);ctx.stroke();label(ctx,'C = '+s.C+' μF',xr+26,cy,T.ink,'left','middle',MONO);
    const nq=Math.round(8*vc/s.E);for(let k=0;k<nq;k++){dot(ctx,xr-14+k*4,cy-14,2.4,T.pos);dot(ctx,xr-14+k*4,cy+14,2.4,T.neg);}
    // current dots
    if(Math.abs(I)>Imax*.004){const dir=I>0?1:-1;ph=(ph+dir*(10+110*Math.abs(I)/Imax)*dt)%30;if(ph<0)ph+=30;const cw=1;for(let d=ph;d<Lp;d+=30){let acc=0;for(const sg of segs){if(d<=acc+sg.l){const f=(d-acc)/sg.l;dot(ctx,sg.a[0]+(sg.b[0]-sg.a[0])*f,sg.a[1]+(sg.b[1]-sg.a[1])*f,3.2,T.cv);break;}acc+=sg.l;}}}
    label(ctx,mode==='charge'?'charging: the switch connects the battery':mode==='discharge'?'discharging: the capacitor drains through R':mode==='hold'?'settled (about 7τ has passed). Press a button again.':'press Charge or Discharge to begin',xl,yb+26,T.muted,'left','middle',MONO);
    // graph
    const ta=tau(),tmax=Math.max(6*ta,t*1.06),P=panel(ctx,{x:56,y:190,w:w-76,h:h-190-44},[0,tmax],[0,s.E*1.08],{ylabel:'voltage (V)',color:T.ink,xlabel:'t (s)',yn:4,xn:6});
    line(ctx,P,0,s.E,tmax,s.E,alpha(T.muted,.6),1,[4,4]);label(ctx,'ε',P.X(tmax)-4,P.Y(s.E)-8,T.muted,'right','middle',MONO);
    for(let k=1;k<=6;k++){const tx=k*ta;if(tx>tmax)break;line(ctx,P,tx,0,tx,s.E*1.08,alpha(T.grid,.9),1,[2,4]);label(ctx,k+'τ',P.X(tx),P.Y(0)-10,T.muted,'center','middle',MONO);}
    const drawH=(f,colr)=>{ctx.save();clip(ctx,P);ctx.strokeStyle=colr;ctx.lineWidth=2.4;ctx.beginPath();hist.forEach((p,i)=>{const x=P.X(p[0]),y=P.Y(f(p));i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();ctx.restore();};
    drawH(p=>p[1],T.cx);drawH(p=>Math.abs(p[2])*s.R*1e3,T.hot);
    const lp=hist[hist.length-1];dot(ctx,P.X(lp[0]),P.Y(lp[1]),5,T.cx,T.surface);dot(ctx,P.X(lp[0]),P.Y(Math.abs(lp[2])*s.R*1e3),5,T.hot,T.surface);
    label(ctx,'V across C',P.X(tmax*.45),P.Y(s.E)-12,T.cx,'left','middle',LABEL);label(ctx,'V across R (= I·R, so it traces the current)',P.X(tmax*.2),P.Y(s.E*.72),T.hot,'left','middle',LABEL);
    setText('rc-v',sf(vc,'V'));setText('rc-i',Math.abs(I)<1e-9?'0 μA':sf(I*1e6,'μA'));setText('rc-q',sf(vc*s.C,'μC'));setText('rc-u',sf(.5*s.C*1e-6*vc*vc*1e3,'mJ'));setText('rc-t',fmt(ta,2)+' s | '+fmt(t,2)+' s');}
  const reset=(keepV)=>{if(!keepV)vc=0;t=0;hist=[[0,vc,0]];};
  drawers.rc=()=>draw(0);ticker('rc',dt=>draw(Math.min(dt,.05)));
  $('#rc-chg').addEventListener('click',()=>{if(mode!=='charge'){reset(true);mode='charge';}});$('#rc-dis').addEventListener('click',()=>{if(mode!=='discharge'){reset(true);mode='discharge';}});
  $('#rc-rst').addEventListener('click',()=>{vc=0;mode='idle';reset(false);});
  segBind('rc-sp','k',k=>{s.sp=+k;});
  const changed=()=>{vc=Math.min(vc,s.E);t=0;hist=[[0,vc,0]];};bindRange('rc-R',x=>x+' kΩ',x=>{s.R=x;changed();});bindRange('rc-C',x=>x+' μF',x=>{s.C=x;changed();});bindRange('rc-E',x=>x+' V',x=>{s.E=x;changed();});
})();
Object.assign(TIPS,{"rc-R":"A bigger resistor limits the current, so charging and discharging both take longer: τ = RC doubles when R doubles. The final voltage doesn't change.","rc-C":"A bigger capacitor holds more charge at the same voltage, so it needs more charge flow to fill: τ grows and the stored energy ½Cε² grows too.","rc-E":"The battery voltage sets the final voltage and the starting current ε/R. The time constant doesn't depend on it."});
Object.assign(KEYS,{"rc-canvas":["Press Charge, then Discharge. Change R and C and compare the time constants.",[["cx","capacitor voltage"],["hot","voltage across the resistor (∝ current)"],["cv","moving charge (current)"]]]});
Object.assign(TT,{rc:"Remember the two limits. At t = 0 an empty capacitor acts like a wire; at t → ∞ a full one acts like a break. Everything in between is an exponential with τ = RC."});
PROBS.push(
 {id:'rctau',topic:'rc',title:'Time constant',gen(){const R=pick([2,5,10,47,100]),C=pick([1,2,10,47,100]),ans=R*C*1e-3;
   return {q:`A ${R} kΩ resistor and a ${C} μF capacitor are in series. What is the time constant of the circuit, in seconds?`,ans,unit:'s',hint:'τ = RC. Convert kΩ to Ω and μF to F.',sol:`<span class="m">τ = (${R} × 10³ Ω)(${C} × 10⁻⁶ F) = <b>${fmt(ans,4)} s</b></span>.`};}},
 {id:'rcV',topic:'rc',calc:1,title:'Voltage while charging',gen(){const E=pick([6,9,12]),R=pick([10,20,50]),C=pick([10,50,100]),tau=R*C*1e-3,k=pick([.5,1,2,3]),t=k*tau,ans=E*(1-Math.exp(-k));
   return {q:`A ${E} V battery charges an empty ${C} μF capacitor through a ${R} kΩ resistor. What is the capacitor voltage ${fmt(t,3)} s after the switch is closed?`,ans,unit:'V',hint:'τ = RC, then V = ε(1 − e^(−t/τ)).',
   sol:`<span class="m">τ = ${fmt(tau,3)} s</span>, <span class="m"><i>t</i>/τ = ${num(k)}</span>, so <span class="m"><i>V</i> = ${E}(1 − <i>e</i><sup>−${num(k)}</sup>) = <b>${fmt(ans,3)} V</b></span>.`};}},
 {id:'rcI',topic:'rc',calc:1,title:'Current during charging',gen(){const E=pick([6,12,24]),R=pick([10,20,50]),C=pick([20,50,100]),tau=R*C*1e-3,k=pick([1,2,3]),t=k*tau,ans=E/(R*1e3)*Math.exp(-k)*1e6;
   return {q:`A ${E} V battery charges an empty ${C} μF capacitor through a ${R} kΩ resistor. What is the current ${fmt(t,3)} s after closing the switch, in μA?`,ans,unit:'μA',hint:'I = (ε/R)e^(−t/τ).',
   sol:`<span class="m"><i class="cur">I</i> = (${E}/${R} kΩ)<i>e</i><sup>−${k}</sup> = (${fmt(E/R*1e3,3)} μA)(${fmt(Math.exp(-k),4)}) = <b>${fmt(ans,3)} μA</b></span>.`};}},
 {id:'rcE',topic:'rc',title:'Heat during charging',gen(){const C=pick([10,50,100,200]),E=pick([6,12,24]),ans=.5*C*E*E*1e-3;
   return {q:`A ${C} μF capacitor is charged from empty to ${E} V through a resistor. How much energy is dissipated as heat in the resistor, in mJ?`,ans,unit:'mJ',hint:'The battery supplies Cε²; half is stored, half is dissipated, whatever R is.',
   sol:`<span class="m"><i>E</i><sub>heat</sub> = ½<i>C</i>ε² = ½(${C} × 10⁻⁶)(${E})² = <b>${fmt(ans,3)} mJ</b></span>.`};}},
 {id:'rctime',topic:'rc',calc:1,title:'How long to discharge',gen(){const R=pick([10,20,50]),C=pick([10,50,100]),f=pick([.5,.25,.1]),tau=R*C*1e-3,ans=-tau*Math.log(f);
   return {q:`A charged ${C} μF capacitor is connected across a ${R} kΩ resistor. How long does it take for its voltage to fall to ${f*100}% of its starting value?`,ans,unit:'s',hint:'V = V₀e^(−t/τ), so t = −τ ln(V/V₀).',
   sol:`<span class="m">τ = ${fmt(tau,3)} s</span>, so <span class="m"><i>t</i> = −τ ln(${f}) = <b>${fmt(ans,3)} s</b></span>.`};}}
);
PROBS.push(
 {id:'rcload',topic:'rc',title:'Final voltage with a resistor in parallel',gen(){const E=pick([6,12,24]),R1=pick([10,20,40]),R2=pick([10,20,30,60]),ans=E*R2/(R1+R2);
   return {q:`A ${E} V battery is connected through a ${R1} kΩ resistor to a capacitor with a ${R2} kΩ resistor in parallel across the capacitor. After a very long time, what is the voltage across the capacitor?`,ans,unit:'V',hint:'At t → ∞ no current flows into the capacitor, so R₁ and R₂ just form a voltage divider.',
   sol:`<span class="m"><i>V</i><sub>∞</sub> = ε<i>R</i><sub>2</sub>/(<i>R</i><sub>1</sub> + <i>R</i><sub>2</sub>) = ${E}(${R2})/(${R1 + R2}) = <b>${fmt(ans,3)} V</b></span>.`};}},
 {id:'rctau2',topic:'rc',title:'Time constant with a parallel resistor',gen(){const R1=pick([10,20,40]),R2=pick([10,20,30,60]),C=pick([10,50,100]),Req=R1*R2/(R1+R2),ans=Req*C*1e-3;
   return {q:`In that circuit (R₁ = ${R1} kΩ in series with the battery, R₂ = ${R2} kΩ in parallel with the capacitor C = ${C} μF), what is the time constant for charging? Give it in seconds. (The capacitor "sees" R₁ and R₂ in parallel.)`,ans,unit:'s',hint:'Replace the battery by a wire: the capacitor is connected across R₁ and R₂ in parallel. τ = R_eq C.',
   sol:`<span class="m"><i>R</i><sub>eq</sub> = ${R1}·${R2}/(${R1}+${R2}) = ${fmt(Req,3)} kΩ</span>, so <span class="m">τ = <i>R</i><sub>eq</sub><i>C</i> = <b>${fmt(ans,4)} s</b></span>.`};}}
);
