(function lc(){
  const cv=$('#lc-canvas');const s={L:50,C:20,z:0},V0=10;let q=0,i=0,t=0,run=true,hist=[],ph=0;
  const Lh=()=>s.L*1e-3,Cf=()=>s.C*1e-6,w0=()=>1/Math.sqrt(Lh()*Cf()),Rr=()=>2*s.z*Math.sqrt(Lh()/Cf()),Q0=()=>Cf()*V0;
  const init=()=>{q=Q0();i=0;t=0;hist=[[0,1,0]];};
  function step(dt){const T0=2*Math.PI/w0(),dts=dt*T0/2.2,n=40,h=dts/n,L=Lh(),C=Cf(),R=Rr();
    const f=(a,b)=>[b,-(R*b+a/C)/L];for(let k=0;k<n;k++){const k1=f(q,i),k2=f(q+h/2*k1[0],i+h/2*k1[1]),k3=f(q+h/2*k2[0],i+h/2*k2[1]),k4=f(q+h*k3[0],i+h*k3[1]);q+=h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]);i+=h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]);}
    t+=dts;hist.push([t,q/Q0(),i/(w0()*Q0())]);if(hist.length>3500)hist.splice(1,300);}
  function draw(dt){const w=cv.clientWidth;if(!w)return;const h=w<560?600:560;const c=prep(cv,h);if(!c)return;const {ctx}=c;if(run)step(dt);
    const T0=2*Math.PI/w0(),Imx=w0()*Q0(),UE=q*q/(2*Cf()),UB=.5*Lh()*i*i,U0=Q0()*Q0()/(2*Cf());
    const xl=118,xr=Math.min(w-230,xl+300),yt=40,yb=146;ctx.lineCap='round';ctx.lineWidth=2;ctx.strokeStyle=T.ink;
    ctx.beginPath();ctx.moveTo(xl,yt);ctx.lineTo(xr,yt);ctx.lineTo(xr,yt+34);ctx.moveTo(xr,yb-34);ctx.lineTo(xr,yb);ctx.lineTo(xl,yb);ctx.lineTo(xl,yb-44);ctx.moveTo(xl,yt+44);ctx.lineTo(xl,yt);ctx.stroke();
    const cy=(yt+yb)/2;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(xl-18,cy-6);ctx.lineTo(xl+18,cy-6);ctx.moveTo(xl-18,cy+6);ctx.lineTo(xl+18,cy+6);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xl,yt+44);ctx.lineTo(xl,cy-6);ctx.moveTo(xl,cy+6);ctx.lineTo(xl,yb-44);ctx.stroke();
    const nq=Math.round(7*Math.abs(q)/Q0());for(let k=0;k<nq;k++){dot(ctx,xl-14+k*4.6,cy-15,2.4,q>0?T.pos:T.neg);dot(ctx,xl-14+k*4.6,cy+15,2.4,q>0?T.neg:T.pos);}
    label(ctx,'C = '+s.C+' μF',xl-26,cy,T.ink,'right','middle',MONO);
    const cs=(yb-yt-68)/4;ctx.strokeStyle=T.ink;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(xr,yt+34);for(let k=0;k<4;k++)ctx.arc(xr,yt+34+cs*(k+.5),cs/2,-Math.PI/2,Math.PI/2,false);ctx.stroke();label(ctx,'L = '+s.L+' mH',xr+22,cy,T.ink,'left','middle',MONO);
    if(Math.abs(i)>.02*Imx){ph=(ph+(i>0?-1:1)*(10+110*Math.abs(i)/Imx)*dt)%30;if(ph<0)ph+=30;const loop=[[xl,yb],[xl,yt],[xr,yt],[xr,yb],[xl,yb]],segs=loop.slice(1).map((p,k)=>{const q0=loop[k];return {a:q0,b:p,l:Math.hypot(p[0]-q0[0],p[1]-q0[1])};}),tot=segs.reduce((a,b)=>a+b.l,0);
      for(let d=ph;d<tot;d+=30){let acc=0;for(const sg of segs){if(d<=acc+sg.l){const f=(d-acc)/sg.l;dot(ctx,sg.a[0]+(sg.b[0]-sg.a[0])*f,sg.a[1]+(sg.b[1]-sg.a[1])*f,3.2,T.cv);break;}acc+=sg.l;}}}
    if(Rr()>0.01)label(ctx,'R = '+fmt(Rr(),1)+' Ω (in the wire)',(xl+xr)/2,yb+18,T.muted,'center','middle',MONO);
    // energy bars
    const bx=xr+130,by=30,bh=104;[[UE/U0,'U_E',T.cx],[UB/U0,'U_B',T.hot],[(UE+UB)/U0,'total',T.muted]].forEach(([f,l,col],k)=>{const x=bx+k*32;ctx.fillStyle=T.sunk;ctx.fillRect(x,by,20,bh);ctx.fillStyle=col;const hh=bh*clamp(f,0,1);ctx.fillRect(x,by+bh-hh,20,hh);label(ctx,l,x+10,by+bh+14,col,'center','middle',MONO);});
    // graph
    const win=3.2*T0,x0=Math.max(0,t-win),P=panel(ctx,{x:56,y:200,w:w-76,h:h-200-46},[x0*1e3,(x0+win)*1e3],[-1.1,1.1],{ylabel:'q/Q₀  and  I/I_max',color:T.ink,xlabel:'t (ms)',yn:4,xn:6});
    const dr=(f,col)=>{ctx.save();clip(ctx,P);ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.beginPath();hist.forEach((p,k)=>{const x=P.X(p[0]*1e3),y=P.Y(f(p));k?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();ctx.restore();};
    dr(p=>p[1],T.cx);dr(p=>p[2],T.cv);const lp=hist[hist.length-1];dot(ctx,P.X(lp[0]*1e3),P.Y(lp[1]),5,T.cx,T.surface);dot(ctx,P.X(lp[0]*1e3),P.Y(lp[2]),5,T.cv,T.surface);
    label(ctx,'— charge q',70,184,T.cx,'left','middle',LABEL);label(ctx,'— current I',190,184,T.cv,'left','middle',LABEL);
    setText('lc-w',fmt(w0(),0)+' rad/s');setText('lc-f',sf(w0()/(2*Math.PI),'Hz'));setText('lc-T',sf(T0*1e3,'ms'));setText('lc-R',Rr()<.01?'0 Ω':sf(Rr(),'Ω')+(s.z>=1?(s.z===1?' (critical)':' (overdamped)'):''));setText('lc-I',sf(Imx,'A'));}
  init();drawers.lc=()=>draw(0);ticker('lc',dt=>draw(Math.min(dt,.05)));
  $('#lc-play').addEventListener('click',()=>{run=!run;$('#lc-play').textContent=run?'Pause':'Play';});$('#lc-rs').addEventListener('click',()=>{init();run=true;$('#lc-play').textContent='Pause';draw(0);});
  const ch=()=>{init();};bindRange('lc-L',x=>x+' mH',x=>{s.L=x;ch();});bindRange('lc-C',x=>x+' μF',x=>{s.C=x;ch();});bindRange('lc-z',x=>fmt(x,2),x=>{s.z=x;ch();});
})();
Object.assign(TIPS,{"lc-L":"A bigger inductance (more electrical inertia) slows the oscillation: ω₀ = 1/√(LC). It also changes how much current flows for the same charge.","lc-C":"A bigger capacitor is a softer spring: it takes longer to charge and discharge, so the oscillation slows and the stored energy for the same voltage is larger.","lc-z":"Damping represents resistance. Small values let the circuit ring for many cycles, losing energy slowly; at 1.0 (critical damping) it doesn't oscillate at all; above that it creeps back slowly."});
Object.assign(KEYS,{"lc-canvas":["Watch the charge and current take turns. Add damping to see it fade.",[["cx","charge on the capacitor"],["cv","current"],["hot","magnetic energy"]]]});
Object.assign(TT,{lc:"Match each LC quantity to its spring-mass twin: q ↔ x, I ↔ v, L ↔ m, 1/C ↔ k. Then every oscillation fact you know from Mechanics carries over."});
PROBS.push(
 {id:'lcw',topic:'lc',title:'Resonant frequency',gen(){const L=pick([10,25,50,100]),C=pick([1,5,10,20,100]),ans=1/(2*Math.PI*Math.sqrt(L*1e-3*C*1e-6));
   return {q:`What is the oscillation frequency of an LC circuit with L = ${L} mH and C = ${C} μF?`,ans,unit:'Hz',hint:'f = 1/(2π√(LC)).',sol:`<span class="m"><i>f</i> = 1/(2π√((${L} × 10⁻³)(${C} × 10⁻⁶))) = <b>${fmt(ans,3)} Hz</b></span>.`};}},
 {id:'lcI',topic:'lc',title:'Peak current',gen(){const L=pick([20,50,100]),C=pick([10,20,50]),V=pick([5,10,20]),ans=V*Math.sqrt(C*1e-6/(L*1e-3));
   return {q:`A ${C} μF capacitor charged to ${V} V is connected across a ${L} mH inductor. What is the maximum current in the circuit?`,ans,unit:'A',hint:'Energy conservation: ½CV² = ½LI²max.',sol:`<span class="m"><i class="cur">I</i><sub>max</sub> = <i>V</i>√(<i>C</i>/<i>L</i>) = ${V}√((${C} × 10⁻⁶)/(${L} × 10⁻³)) = <b>${fmt(ans,4)} A</b></span>.`};}},
 {id:'lcE',topic:'lc',title:'Energy split',gen(){const C=pick([10,20,50]),V=pick([6,10,20]),fr=pick([.5,.6,.8]),ans=.5*C*1e-6*V*V*(1-fr*fr)*1e3;
   return {q:`A ${C} μF capacitor charged to ${V} V starts oscillating with an inductor. At an instant when the capacitor's charge is ${fr*100}% of its maximum, how much energy is in the inductor, in mJ?`,ans,unit:'mJ',hint:'U_E = U_total × (q/Q₀)². The rest is in the inductor.',sol:`<span class="m"><i>U</i><sub>total</sub> = ½<i>CV</i>² = ${fmt(.5*C*1e-6*V*V*1e3,3)} mJ</span>, and <span class="m"><i>U</i><sub>B</sub> = <i>U</i>(1 − ${fr}²) = <b>${fmt(ans,3)} mJ</b></span>.`};}},
 {id:'lcC',topic:'lc',title:'Tuning a radio',gen(){const f=pick([530,1000,1600]),L=pick([100,200,300]),ans=1/(Math.pow(2*Math.PI*f*1e3,2)*L*1e-6)*1e12;
   return {q:`A radio's tuner uses an LC circuit with L = ${L} μH. What capacitance tunes it to ${f} kHz? Give your answer in pF.`,ans,unit:'pF',hint:'C = 1/(4π²f²L). Convert kHz to Hz and μH to H.',sol:`<span class="m"><i>C</i> = 1/((2π × ${f} × 10³)²(${L} × 10⁻⁶)) = <b>${fmt(ans,3)} pF</b></span>.`};}}
);
