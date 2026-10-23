(function faraday(){
  const cv=$('#fa-canvas');const s={mode:'auto',m:5,N:100,f:.8},RC=.06,AM=.14;let lastEmf=0,t=0,z=-AM*0,zp=0,vz=0,hist=[],geo=null,emax=1e-3;
  const Phi=zz=>MU0*s.m*RC*RC/(2*Math.pow(RC*RC+zz*zz,1.5));
  const dPhidz=zz=>-3*MU0*s.m*RC*RC*zz/(2*Math.pow(RC*RC+zz*zz,2.5));
  function step(dt){if(s.mode==='auto'){t+=dt;z=AM*Math.sin(2*Math.PI*s.f*t);vz=AM*2*Math.PI*s.f*Math.cos(2*Math.PI*s.f*t);}
    else{t+=dt;if(dt>0)vz=vz*.6+.4*(z-zp)/dt;zp=z;if(Math.abs(vz)<1e-3)vz=0;}
    const ph=Phi(z),dph=dPhidz(z)*vz,emf=-s.N*dph;hist.push([t,ph,emf]);while(hist.length&&hist[0][0]<t-5.2)hist.shift();return {ph,dph,emf};}
  function draw(dt){const w=cv.clientWidth;if(!w)return;const h=w<560?560:520;const c=prep(cv,h);if(!c)return;const {ctx}=c;const o=step(dt);lastEmf=o.emf;
    const xc=w*.42,pxm=(w*.7)/.5,ty=104;geo={xc,pxm,ty};
    ctx.strokeStyle=T.line;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xc-.25*pxm,ty+24);ctx.lineTo(xc+.25*pxm,ty+24);ctx.stroke();
    // coil
    const turns=7,cw=34;for(let k=0;k<turns;k++){const x=xc-cw/2+cw*k/(turns-1);ctx.strokeStyle=alpha(T.cv,.35+.65*Math.min(1,s.N/150));ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,ty,5,38,0,0,Math.PI*2);ctx.stroke();}
    label(ctx,'coil, N = '+s.N,xc,ty-50,T.cv,'center','middle',MONO);
    // magnet
    const Lm=.09*pxm,mx=xc+z*pxm;ctx.fillStyle=alpha(T.neg,.85);ctx.fillRect(mx-Lm/2,ty-13,Lm/2,26);ctx.fillStyle=alpha(T.pos,.9);ctx.fillRect(mx,ty-13,Lm/2,26);ctx.strokeStyle=T.ink;ctx.lineWidth=1.5;ctx.strokeRect(mx-Lm/2+.5,ty-12.5,Lm-1,25);
    label(ctx,'S',mx-Lm/4,ty,'#fff','center','middle','700 14px "IBM Plex Sans", system-ui, sans-serif');label(ctx,'N',mx+Lm/4,ty,'#fff','center','middle','700 14px "IBM Plex Sans", system-ui, sans-serif');
    if(Math.abs(vz)>.02){const L=clamp(Math.abs(vz)*60,8,70)*Math.sign(vz);arrow(ctx,mx,ty+42,mx+L,ty+42,T.cv,2.6);label(ctx,'v',mx+L+(vz>0?9:-9),ty+42,T.cv,'center','middle');}
    if(s.mode==='drag')label(ctx,'drag the magnet ↔',xc,ty+60,T.muted,'center','middle',MONO);
    // galvanometer
    const gx=w-72,gy=82,gr=42;ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.beginPath();ctx.arc(gx,gy,gr,Math.PI*1.1,Math.PI*1.9);ctx.stroke();for(let k=-2;k<=2;k++){const a=-Math.PI/2+k*.5;ctx.beginPath();ctx.moveTo(gx+Math.cos(a)*(gr-6),gy+Math.sin(a)*(gr-6));ctx.lineTo(gx+Math.cos(a)*gr,gy+Math.sin(a)*gr);ctx.stroke();}
    emax=Math.max(emax*.995,Math.abs(o.emf),1e-4);const ang=-Math.PI/2+Math.tanh(o.emf/(.6*emax))*.95,ng=Math.abs(o.emf)>.02*emax?(o.emf>0?T.pos:T.neg):T.muted;ctx.strokeStyle=ng;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx,gy+8);ctx.lineTo(gx+Math.cos(ang)*(gr-8),gy+Math.sin(ang)*(gr-8));ctx.stroke();dot(ctx,gx,gy+8,4,T.ink);
    label(ctx,'EMF meter',gx,gy+34,T.muted,'center','middle',MONO);
    ctx.strokeStyle=T.line;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(xc+cw/2,ty-38);ctx.lineTo(gx-30,ty-38);ctx.lineTo(gx-30,gy+4);ctx.stroke();
    // graphs
    const x0=Math.max(0,t-5),xr=[x0,x0+5];const gh=(h-210-70)/2;
    const P1=panel(ctx,{x:56,y:200,w:w-76,h:gh},xr,[0,Phi(0)*1.1*1e6],{ylabel:'flux Φ (μWb)',color:T.cx,yn:3,xn:5});
    const P2=panel(ctx,{x:56,y:200+gh+38,w:w-76,h:gh},xr,[-emax*1.15*1e3,emax*1.15*1e3],{ylabel:'EMF (mV)',color:T.hot,xlabel:'t (s)',yn:4,xn:5});
    const trace=(P,f,col)=>{ctx.save();clip(ctx,P);ctx.strokeStyle=col;ctx.lineWidth=2.2;ctx.beginPath();hist.forEach((p,i)=>{const x=P.X(p[0]),y=P.Y(f(p));i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();ctx.restore();};
    trace(P1,p=>p[1]*1e6,T.cx);trace(P2,p=>p[2]*1e3,T.hot);const lh=hist[hist.length-1];dot(ctx,P1.X(lh[0]),P1.Y(lh[1]*1e6),5,T.cx,T.surface);dot(ctx,P2.X(lh[0]),P2.Y(lh[2]*1e3),5,T.hot,T.surface);
    setText('fa-phi',sf(o.ph*1e6,'μWb'));setText('fa-dphi',sf(o.dph*1e3,'mWb/s'));setText('fa-emf',Math.abs(o.emf)<1e-6?'0 mV':sf(o.emf*1e3,'mV'));setText('fa-dir',Math.abs(o.emf)<.01*emax?'none':o.emf<0?'clockwise':'counterclockwise');}
  drawers.faraday=()=>{draw(0);v3&&v3.render();};ticker('faraday',dt=>draw(Math.min(dt,.05)));
  dragPoints(cv,()=>geo&&s.mode==='drag'?[[geo.xc+z*geo.pxm,geo.ty]]:[],(k,x,y,ph)=>{if(ph!=='move'||!geo)return;z=clamp((x-geo.xc)/geo.pxm,-.22,.22);});
  segBind('fa-mode','k',k=>{s.mode=k;if(k==='auto'){t=Math.asin(clamp(z/AM,-1,1))/(2*Math.PI*s.f);}zp=z;vz=0;hist=[];});
  bindRange('fa-m',x=>x+' A·m²',x=>{s.m=x;hist=[];emax=1e-3;});bindRange('fa-N',x=>x+' turns',x=>{s.N=x;hist=[];emax=1e-3;});bindRange('fa-f',x=>fmt(x,1)+' Hz',x=>{const ph=2*Math.PI*s.f*t;s.f=x;t=ph/(2*Math.PI*x);hist=[];});  let v3=null;
  v3=view3d($('#fa3-canvas'),{yaw:-.9,pitch:.3,dist:5.2,target:[0,0,0],min:3,max:14,height:w=>clamp(w*.46,260,400),scene:S=>{
    S.grid(-4,4,-3,3,1);const X=z*8;
    for(let k=0;k<7;k++){const x=(k-3)*.1,pts=[];for(let i=0;i<=40;i++){const a=i/40*2*Math.PI;pts.push([x,Math.cos(a)*1.05,Math.sin(a)*1.05]);}S.path(pts,alpha(T.cv,.35+.65*Math.min(1,s.N/150)),2);}
    const big=Math.tanh(Math.abs(lastEmf)/(emax*.6+1e-9)),sg=lastEmf>=0?1:-1;
    if(big>.08)for(let k=0;k<6;k++){const a=k/6*2*Math.PI,p=[0,Math.cos(a)*1.05,Math.sin(a)*1.05],tg=[0,-Math.sin(a)*sg,Math.cos(a)*sg];S.arrow(p,V3.add(p,V3.mul(tg,.35+.5*big)),T.cv,3);}
    S.box([X-.35,0,0],[.7,.44,.44],0,T.neg);S.box([X+.35,0,0],[.7,.44,.44],0,T.pos);S.text([X-.35,0,.5],'S',T.neg);S.text([X+.35,0,.5],'N',T.pos);
    S.text([0,0,1.55],'coil',T.cv);}});


})();
Object.assign(TIPS,{"fa-m":"A stronger magnet puts more flux through the coil and changes it by more as it moves: both the flux curve and the EMF scale with the strength.","fa-N":"Each turn of the coil gets the same EMF and they add in series, so the EMF is proportional to N. The flux through each turn stays the same.","fa-f":"A faster swing changes the flux faster. The flux curve is the same but squeezed in time, so the EMF is larger."});
Object.assign(KEYS,{"fa-canvas":["Let the magnet swing, or switch to dragging it. Watch the EMF graph.",[["pos","north pole"],["neg","south pole"],["cx","flux"],["hot","induced EMF"]]]});
Object.assign(TT,{faraday:"Draw the flux against time first. The EMF is minus the slope of that graph (times N). Zero slope means zero EMF, however big the flux."});
PROBS.push(
 {id:'fEMF',topic:'faraday',title:'EMF from a changing field',gen(){const N=pick([50,100,200,400]),r=pick([2,3,4,5]),dB=pick([.2,.5,.8,1.2]),dt=pick([.05,.1,.2,.5]),ans=N*Math.PI*Math.pow(r*.01,2)*dB/dt;
   return {q:`A coil of ${N} turns and radius ${r} cm has its plane perpendicular to a uniform magnetic field. The field changes uniformly by ${num(dB)} T in ${num(dt)} s. What is the magnitude of the average induced EMF?`,ans,unit:'V',hint:'ε = NAΔB/Δt, with A = πr².',sol:`<span class="m">ε = <i>N</i>π<i>r</i>²Δ<i class="bf">B</i>/Δ<i>t</i> = (${N})π(${num(r/100)})²(${num(dB)})/${num(dt)} = <b>${sf(ans,'V')}</b></span>.`};}},
 {id:'fI',topic:'faraday',title:'Induced current',gen(){const A=pick([20,50,100]),dB=pick([.1,.2,.5]),dt=pick([.01,.02,.05]),R=pick([2,5,10]),ans=A*1e-4*dB/dt/R;
   return {q:`A single square loop of area ${A} cm² and resistance ${R} Ω is perpendicular to a field that changes by ${num(dB)} T in ${num(dt)} s. What average current flows in the loop?`,ans,unit:'A',hint:'ε = AΔB/Δt, then I = ε/R.',sol:`<span class="m">ε = (${num(A*1e-4)})(${num(dB)})/${num(dt)} = ${sf(A*1e-4*dB/dt,'V')}</span>, so <span class="m"><i class="cur">I</i> = ε/<i>R</i> = <b>${sf(ans,'A')}</b></span>.`};}},
 {id:'fgen',topic:'faraday',title:'Peak EMF of a generator',gen(){const N=pick([50,100,200]),B=pick([.1,.2,.5]),A=pick([.01,.02,.05]),f=pick([50,60]),ans=N*B*A*2*Math.PI*f;
   return {q:`A generator coil of ${N} turns and area ${num(A*1e4)} cm² rotates at ${f} Hz in a ${num(B)} T field. What is the peak EMF?`,ans,unit:'V',hint:'ε_peak = NBAω, with ω = 2πf.',sol:`<span class="m">ε<sub>max</sub> = <i>NBA</i>(2π<i>f</i>) = (${N})(${num(B)})(${num(A)})(2π × ${f}) = <b>${sf(ans,'V')}</b></span>.`};}},
 {id:'fcalc',topic:'faraday',calc:1,title:'EMF from a flux function',gen(){const N=pick([10,20,50]),a=pick([2,3,5]),b=pick([4,6,10]),t=pick([1,2,3]),ans=-N*(2*a*t-b)*1e-3;
   return {q:`The magnetic flux through each turn of a ${N}-turn coil is Φ(t) = (${a}t² − ${b}t) mWb, with t in seconds. What is the induced EMF at t = ${t} s? (Include the sign, in volts.)`,ans,unit:'V',hint:'ε = −N dΦ/dt. Differentiate first. Remember the milli.',sol:`<span class="m">dΦ/d<i>t</i> = (${2*a}<i>t</i> − ${b}) mWb/s = ${2*a*t-b} mWb/s</span> at <i>t</i> = ${t} s, so <span class="m">ε = −(${N})(${2*a*t-b} × 10⁻³) = <b>${fmt(ans,3)} V</b></span>.`};}}
);
