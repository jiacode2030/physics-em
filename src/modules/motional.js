(function motional(){
  const cv=$('#mo-canvas');const s={B:.5,L:.4,R:.5,m:.2,F:0,v0:4};let t=0,run=false;
  const P=()=>{const k=s.B*s.B*s.L*s.L/s.R,tau=s.m/k,vT=s.F/k;return {k,tau,vT};};
  const vAt=tt=>{const {tau,vT}=P();return vT+(s.v0-vT)*Math.exp(-tt/tau);};
  const xAt=tt=>{const {tau,vT}=P();return vT*tt+(s.v0-vT)*tau*(1-Math.exp(-tt/tau));};
  function draw(dt){const w=cv.clientWidth;if(!w)return;const h=w<560?640:600;const c=prep(cv,h);if(!c)return;const {ctx}=c;if(run)t+=dt;
    const {tau,vT,k}=P(),v=vAt(t),x=xAt(t),emf=s.B*s.L*v,I=emf/s.R,Fm=s.B*I*s.L;
    const x0=84,pxm=(w-x0-120)/1.4,yT=56,yB=170,xr0=x0+50,xs=Math.min(x,1.2),xr=xr0+xs*pxm;
    ctx.fillStyle=alpha(T.cv,.07);ctx.fillRect(x0,yT,xr-x0,yB-yT);
    ctx.strokeStyle=T.ink;ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,yT);ctx.lineTo(w-34,yT);ctx.moveTo(x0,yB);ctx.lineTo(w-34,yB);ctx.moveTo(x0,yT);ctx.lineTo(x0,yT+26);ctx.moveTo(x0,yB);ctx.lineTo(x0,yB-26);ctx.stroke();
    ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,yT+26);for(let i=0;i<8;i++)ctx.lineTo(x0+(i%2?-8:8),yT+26+(yB-yT-52)*(i+.5)/8);ctx.lineTo(x0,yB-26);ctx.stroke();label(ctx,'R',x0-14,(yT+yB)/2,T.ink,'right','middle',LABEL);
    const off=x>1.2?((x-1.2)*pxm)%38:0;for(let i=-1;i<Math.ceil((w-x0)/38)+1;i++)for(let j=0;j<3;j++){const px=x0+30+i*38-off,py=yT+20+j*(yB-yT-40)/2;if(px>x0+8&&px<w-40)label(ctx,'×',px,py,alpha(T.ca,.6),'center','middle','600 15px "IBM Plex Sans", system-ui, sans-serif');}
    ctx.strokeStyle=T.cx;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(xr,yT-6);ctx.lineTo(xr,yB+6);ctx.stroke();
    const vl=clamp(10+11*v,0,90);if(v>.02)arrow(ctx,xr+10,(yT+yB)/2,xr+10+vl,(yT+yB)/2,T.cv,3);label(ctx,'v = '+fmt(v,2)+' m/s',xr+14,(yT+yB)/2-14,T.cv,'left','middle',MONO);
    const fl=clamp(100*Fm,0,90);if(Fm>.002)arrow(ctx,xr-12,yT+22,xr-12-fl,yT+22,T.hot,3);label(ctx,'F_mag',xr-14-fl,yT+10,T.hot,'right','middle',MONO);
    if(s.F>0){const fa=clamp(40*s.F,8,90);arrow(ctx,xr+12,yB-24,xr+12+fa,yB-24,T.ink,3);label(ctx,'F',xr+16+fa,yB-24,T.ink,'left','middle',MONO);}
    if(I>.005){const ax=x0+((xr-x0)*.5);ctx.save();ctx.strokeStyle=T.cv;ctx.fillStyle=T.cv;ctx.lineWidth=2;arrow(ctx,xr-4,yB-40,xr-4,yT+40,T.cv,2.4);label(ctx,'I ↑',xr-14,(yT+yB)/2+30,T.cv,'right','middle',MONO);ctx.restore();}
    label(ctx,'B into the page (×)',x0+8,yT-14,T.ca,'left','middle',MONO);
    // graphs: predicted full curves, with progress
    const tm=Math.max(6*tau,t*1.05),g=(h-230)/2,gx=56,gw=w-76;
    const P1=panel(ctx,{x:gx,y:208,w:gw,h:g},[0,tm],[0,Math.max(s.v0,vT,1)*1.1],{ylabel:'speed v (m/s)',color:T.cv,yn:3,xn:6});
    const P2=panel(ctx,{x:gx,y:208+g+40,w:gw,h:g},[0,tm],[0,Math.max(s.B*s.L*Math.max(s.v0,vT)/s.R,.5)*1.1],{ylabel:'current I (A)',color:T.hot,xlabel:'t (s)',yn:3,xn:6});
    curve(ctx,P1,vAt,0,tm,alpha(T.cv,.35),2,200,[5,4]);curve(ctx,P2,q=>s.B*s.L*vAt(q)/s.R,0,tm,alpha(T.hot,.35),2,200,[5,4]);
    curve(ctx,P1,vAt,0,Math.min(t,tm),T.cv,2.8,200);curve(ctx,P2,q=>s.B*s.L*vAt(q)/s.R,0,Math.min(t,tm),T.hot,2.8,200);dot(ctx,P1.X(t),P1.Y(v),5,T.cv,T.surface);dot(ctx,P2.X(t),P2.Y(I),5,T.hot,T.surface);
    if(vT>0)line(ctx,P1,0,vT,tm,vT,alpha(T.muted,.7),1,[3,4]);if(vT>0)label(ctx,'terminal speed',P1.X(tm)-4,P1.Y(vT)-8,T.muted,'right','middle',MONO);
    setText('mo-emf',sf(emf,'V'));setText('mo-I',sf(I,'A'));setText('mo-Fm',sf(Fm,'N'));setText('mo-P',sf(I*I*s.R,'W'));setText('mo-vT',s.F>0?sf(vT,'m/s'):'none (F = 0)');}
  drawers.motional=()=>draw(0);ticker('motional',dt=>draw(Math.min(dt,.05)));
  $('#mo-go').addEventListener('click',()=>{t=0;run=!REDUCE;if(REDUCE)t=P().tau;draw(0);});$('#mo-rst').addEventListener('click',()=>{t=0;run=false;draw(0);});
  const ch=()=>{t=0;run=false;draw(0);};bindRange('mo-B',x=>fmt(x,2)+' T',x=>{s.B=x;ch();});bindRange('mo-L',x=>fmt(x,2)+' m',x=>{s.L=x;ch();});bindRange('mo-R',x=>fmt(x,1)+' Ω',x=>{s.R=x;ch();});bindRange('mo-mass',x=>fmt(x,2)+' kg',x=>{s.m=x;ch();});bindRange('mo-F',x=>fmt(x,1)+' N',x=>{s.F=x;ch();});bindRange('mo-v0',x=>fmt(x,1)+' m/s',x=>{s.v0=x;ch();});
})();
Object.assign(TIPS,{"mo-B":"A stronger field means a bigger EMF (∝ B) and a bigger magnetic force per amp (∝ B), so the braking force goes as B². The rod stops much sooner.","mo-L":"A longer rod cuts more field lines per second, so the EMF grows with L, and the force on the current grows with L again: braking ∝ L².","mo-R":"A bigger resistance means less current for the same EMF, so less braking, a longer coast, and less heating power.","mo-mass":"A heavier rod has more inertia: the same magnetic force slows it down less, so the time constant mR/(B²L²) grows.","mo-F":"A pushing force sets the terminal speed FR/(B²L²). With no force the rod coasts to a stop.","mo-v0":"A faster launch means a bigger initial EMF and current. The decay shape and the time constant don't depend on v₀, but the distance traveled does."});
Object.assign(KEYS,{"mo-canvas":["Set the numbers and press Launch.",[["cx","the rod"],["cv","velocity and current"],["hot","magnetic force (braking)"],["ca","magnetic field"]]]});
Object.assign(TT,{motional:"Two descriptions, one answer: EMF = BLv from the magnetic force on the charges, or EMF = B dA/dt from Faraday's law. And the energy check: Fv = I²R."});
PROBS.push(
 {id:'mEMF',topic:'motional',title:'EMF of a moving rod',gen(){const B=pick([.2,.5,.8,1.2]),L=pick([.2,.4,.5,.8]),v=pick([2,4,6,10]),ans=B*L*v;
   return {q:`A ${num(L)} m rod moves at ${v} m/s perpendicular to a uniform ${num(B)} T magnetic field (and to the rod). What is the EMF induced across its ends?`,ans,unit:'V',hint:'ε = BLv.',sol:`<span class="m">ε = <i class="bf">B</i><i>L</i><i class="cur">v</i> = (${num(B)})(${num(L)})(${v}) = <b>${fmt(ans,3)} V</b></span>.`};}},
 {id:'mforce',topic:'motional',title:'Force to keep it moving',gen(){const B=pick([.2,.5,.8]),L=pick([.2,.4,.5]),R=pick([.5,1,2,5]),v=pick([2,4,6]),ans=B*B*L*L*v/R;
   return {q:`A rod of length ${num(L)} m slides at a constant ${v} m/s on rails connected by a ${num(R)} Ω resistor, in a ${num(B)} T field. What force must be applied to keep it moving at constant speed?`,ans,unit:'N',hint:'Find I = BLv/R, then F = ILB.',sol:`<span class="m"><i class="cur">I</i> = <i class="bf">B</i><i>L</i><i class="cur">v</i>/<i>R</i> = ${fmt(B*L*v/R,3)} A</span>, so <span class="m"><i>F</i> = <i class="cur">I</i><i>L</i><i class="bf">B</i> = <b>${sf(ans,'N')}</b></span>.`};}},
 {id:'mterm',topic:'motional',title:'Terminal speed',gen(){const B=pick([.2,.5,.8]),L=pick([.2,.4,.5]),R=pick([.5,1,2]),F=pick([.1,.2,.5,1]),ans=F*R/(B*B*L*L);
   return {q:`A rod of length ${num(L)} m is pulled with a constant ${num(F)} N force along frictionless rails with a ${num(R)} Ω resistor in a ${num(B)} T field. What terminal speed does it reach?`,ans,unit:'m/s',hint:'At terminal speed the magnetic force equals the applied force: B²L²v/R = F.',sol:`<span class="m"><i>v</i><sub>T</sub> = <i>FR</i>/(<i class="bf">B</i>²<i>L</i>²) = (${num(F)})(${num(R)})/((${num(B)})²(${num(L)})²) = <b>${fmt(ans,3)} m/s</b></span>.`};}},
 {id:'mtau',topic:'motional',calc:1,title:'How long it coasts',gen(){const B=pick([.5,.8,1]),L=pick([.3,.4,.5]),R=pick([1,2,4]),m=pick([.1,.2,.5]),ans=m*R/(B*B*L*L);
   return {q:`A ${num(m)} kg rod of length ${num(L)} m slides on rails with a ${num(R)} Ω resistor in a ${num(B)} T field, with no applied force. Its speed decays as v₀e^(−t/τ). What is τ?`,ans,unit:'s',hint:'m dv/dt = −B²L²v/R, so τ = mR/(B²L²).',sol:`<span class="m">τ = <i>mR</i>/(<i class="bf">B</i>²<i>L</i>²) = (${num(m)})(${num(R)})/((${num(B)})²(${num(L)})²) = <b>${fmt(ans,3)} s</b></span>.`};}}
);
