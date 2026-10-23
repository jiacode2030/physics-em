(function current(){
  const cv=$('#cu-canvas');const s={mat:'cu',I:5,D:2,L:10};
  const MAT={cu:{rho:1.68e-8,n:8.5e28,name:'copper'},al:{rho:2.65e-8,n:6.0e28,name:'aluminum'},ni:{rho:1.1e-6,n:9e28,name:'nichrome'}};
  const N=70;let e=null;let dim='';
  function vals(){const m=MAT[s.mat],A=Math.PI*Math.pow(s.D*1e-3/2,2),R=m.rho*s.L/A,vd=s.I/(m.n*QE*A);return {A,R,V:s.I*R,P:s.I*s.I*R,J:s.I/A,vd};}
  function init(w,h,wh){e=Array.from({length:N},()=>({x:Math.random()*w,y:(Math.random()-.5)*wh*.84,vx:0,vy:0}));dim=w+'x'+h;}
  function draw(dt){const w=cv.clientWidth;if(!w)return;const h=300;const c=prep(cv,h);if(!c)return;const {ctx}=c;const v=vals();
    const wh=34+28*s.D,x0=34,x1=w-34,yc=h/2+6;if(!e||dim!==w+'x'+h)init(x1-x0,h,wh);
    const glow=clamp(Math.log10(v.P+1)/3.2,0,.55);
    ctx.fillStyle=alpha(T.cv,.1);ctx.strokeStyle=T.cv;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect?ctx.roundRect(x0,yc-wh/2,x1-x0,wh,10):ctx.rect(x0,yc-wh/2,x1-x0,wh);ctx.fill();ctx.stroke();
    if(glow>.02){ctx.fillStyle=alpha(T.hot,glow);ctx.beginPath();ctx.roundRect?ctx.roundRect(x0,yc-wh/2,x1-x0,wh,10):ctx.rect(x0,yc-wh/2,x1-x0,wh);ctx.fill();}
    const vis=clamp(34*Math.sqrt(v.vd/1.2e-4),5,160);
    ctx.save();ctx.beginPath();ctx.rect(x0,yc-wh/2,x1-x0,wh);ctx.clip();
    e.forEach(p=>{if(!REDUCE){p.x-=vis*dt;p.vx+=(Math.random()-.5)*260*dt;p.vy+=(Math.random()-.5)*260*dt;p.vx*=.88;p.vy*=.88;p.x+=p.vx*dt*4;p.y+=p.vy*dt*4;}
      if(p.x<0)p.x+=x1-x0;if(p.x>x1-x0)p.x-=x1-x0;const lim=wh*.42;if(p.y>lim){p.y=lim;p.vy=-Math.abs(p.vy);}if(p.y<-lim){p.y=-lim;p.vy=Math.abs(p.vy);}
      dot(ctx,x0+p.x,yc+p.y,3.3,T.neg);});ctx.restore();
    arrow(ctx,x0+10,yc-wh/2-22,x0+110,yc-wh/2-22,T.cv,3);label(ctx,'current I (conventional) →',x0+120,yc-wh/2-22,T.cv,'left','middle',MONO);
    arrow(ctx,x1-10,yc+wh/2+22,x1-110,yc+wh/2+22,T.neg,3);label(ctx,'electrons drift ←',x1-120,yc+wh/2+22,T.neg,'right','middle',MONO);
    label(ctx,MAT[s.mat].name+' wire, d = '+fmt(s.D,1)+' mm, L = '+s.L+' m',w/2,h-12,T.muted,'center','middle',MONO);
    setText('cu-R',sf(v.R,'Ω'));setText('cu-V',sf(v.V,'V'));setText('cu-P',sf(v.P,'W'));setText('cu-J',sf(v.J,'A/m²'));setText('cu-vd',sf(v.vd*1000,'mm/s'));}
  drawers.current=()=>draw(0);
  ticker('current',dt=>{draw(Math.min(dt,.05));});
  segBind('cu-mat','k',k=>{s.mat=k;draw(0);});bindRange('cu-I',x=>fmt(x,1)+' A',x=>{s.I=x;});bindRange('cu-D',x=>fmt(x,1)+' mm',x=>{s.D=x;e=null;});bindRange('cu-L',x=>x+' m',x=>{s.L=x;});
})();
Object.assign(TIPS,{"cu-I":"More current means more charge passes each second. The drift speed, the voltage drop, the heat and the glow all grow with I (heat as I²).","cu-D":"A fatter wire gives the electrons more room. The current density J = I/A and the drift speed drop, the resistance drops, and the wire runs cooler.","cu-L":"A longer wire adds resistance in proportion to its length (R ∝ L). Current density and drift speed don't change, because they depend only on I and the cross-section."});
Object.assign(KEYS,{"cu-canvas":["Change the current, thickness, length and material. Watch the readouts and the glow.",[["neg","electrons (drifting left)"],["cv","conventional current →"],["hot","heating (glow)"]]]});
Object.assign(TT,{current:"Resistance depends on the wire (ρ, L, A), not on how much current flows. Voltage and current are linked by Ohm's law; resistance is the constant of proportionality."});
PROBS.push(
 {id:'Iq',topic:'current',title:'Charge and current',gen(){const I=pick([.5,1.5,2,5,10]),t=pick([2,5,10,60]),ans=I*t;
   return {q:`A current of ${num(I)} A flows for ${t} s. How much charge passes through the wire, in C?`,ans,unit:'C',hint:'I = Q/t.',sol:`<span class="m"><i>Q</i> = <i class="cur">I</i><i>t</i> = (${num(I)})(${t}) = <b>${fmt(ans,3)} C</b></span>.`};}},
 {id:'Rwire',topic:'current',title:'Resistance of a wire',gen(){const d=pick([.5,1,1.5,2]),L=pick([2,5,10,20]),ans=1.68e-8*L/(Math.PI*Math.pow(d*5e-4,2));
   return {q:`What is the resistance of a copper wire of diameter ${num(d)} mm and length ${L} m? (ρ = 1.68 × 10⁻⁸ Ω·m.)`,ans,unit:'Ω',hint:'R = ρL/A, with A = π(d/2)². Convert mm to m.',
   sol:`<span class="m"><i>A</i> = π(${num(d/2)} × 10⁻³)² = ${sf(Math.PI*Math.pow(d*5e-4,2),'m²')}</span>, so <span class="m"><i>R</i> = (1.68 × 10⁻⁸)(${L})/<i>A</i> = <b>${sf(ans,'Ω')}</b></span>.`};}},
 {id:'vdrift',topic:'current',title:'Drift speed',gen(){const I=pick([1,2,5,10]),d=pick([1,1.5,2,3]),A=Math.PI*Math.pow(d*5e-4,2),ans=I/(8.5e28*QE*A)*1000;
   return {q:`A copper wire of diameter ${num(d)} mm carries ${I} A. Copper has 8.5 × 10²⁸ free electrons per m³. What is the electrons' drift speed, in mm/s?`,ans,unit:'mm/s',hint:'I = nqv_dA, so v_d = I/(nqA).',
   sol:`<span class="m"><i>v</i><sub>d</sub> = <i class="cur">I</i>/(<i>neA</i>) = ${I}/((8.5 × 10²⁸)(1.6 × 10⁻¹⁹)(${sf(A,'m²')})) = <b>${fmt(ans,4)} mm/s</b></span>.`};}},
 {id:'Ppow',topic:'current',title:'Electric power',gen(){const V=pick([6,12,24,120]),R=pick([2,4,10,24]),ans=V*V/R;
   return {q:`A ${V} V supply is connected across a ${R} Ω heating element. How much power does the element dissipate?`,ans,unit:'W',hint:'P = V²/R.',sol:`<span class="m"><i>P</i> = Δ<i>V</i>²/<i>R</i> = ${V}²/${R} = <b>${fmt(ans,3)} W</b></span>.`};}},
 {id:'Rstretch',topic:'current',title:'Stretching a wire',gen(){const k=pick([2,3,4]),R0=pick([1,2,5]),ans=R0*k*k;
   return {q:`A wire has resistance ${R0} Ω. It is drawn out, with its volume unchanged, to ${k} times its original length. What is its new resistance?`,ans,unit:'Ω',hint:'Constant volume: if L grows by k, A shrinks by k. R = ρL/A goes up by k².',
   sol:`<span class="m"><i>R</i>′ = ρ(<i>kL</i>)/(<i>A</i>/<i>k</i>) = <i>k</i>²<i>R</i> = ${k*k} × ${R0} = <b>${R0*k*k} Ω</b></span>.`};}}
);
