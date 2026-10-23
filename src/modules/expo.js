(function expo(){
  const cv=$('#ep-canvas');const s={mode:'up',tau:1.5,t:2};
  const f=t=>s.mode==='up'?1-Math.exp(-t/s.tau):Math.exp(-t/s.tau);
  function draw(){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.5,260,360));const c=prep(cv,h);if(!c)return;const {ctx}=c;
    const P=panel(ctx,{x:48,y:14,w:w-66,h:h-48},[0,10],[0,1.05],{ylabel:s.mode==='up'?'fraction of final value':'fraction of starting value',color:T.cx,xlabel:'t (s)',yn:5});
    const tg=s.mode==='up'?[0,0,s.tau,1]:[0,1,s.tau,0];line(ctx,P,tg[0],tg[1],tg[2]*2,tg[1]+(tg[3]-tg[1])*2,alpha(T.muted,.6),1.2,[4,4]);
    [1,2,3].forEach(k=>{const tx=k*s.tau;if(tx>10)return;const v=f(tx);line(ctx,P,tx,0,tx,v,alpha(T.muted,.6),1,[3,4]);line(ctx,P,0,v,tx,v,alpha(T.muted,.35),1,[3,4]);dot(ctx,P.X(tx),P.Y(v),3.5,T.muted);label(ctx,k+'τ: '+fmt(v*100,0)+'%',P.X(tx)+6,P.Y(v)+(s.mode==='up'?14:-12),T.muted,'left','middle',MONO);});
    curve(ctx,P,f,0,10,T.cx,2.75,300);const v=f(s.t);line(ctx,P,s.t,0,s.t,v,T.hot,1.5,[2,3]);dot(ctx,P.X(s.t),P.Y(v),6,T.hot,T.surface);
    label(ctx,'tangent at t = 0 reaches the end at t = τ',P.X(10)-4,P.Y(s.mode==='up'?.12:.9),T.muted,'right','middle',MONO);
    setText('ep-frac',fmt(v*100,1)+' %');setText('ep-ratio',fmt(s.t/s.tau,2));setText('ep-half',fmt(Math.LN2*s.tau,2)+' s (0.693 τ)');setText('ep-90',fmt(Math.LN10*s.tau,2)+' s (2.30 τ)');}
  drawers.expo=draw;
  segBind('ep-mode','k',k=>{s.mode=k;draw();});
  bindRange('ep-tau',x=>fmt(x,1)+' s',x=>{s.tau=x;draw();});bindRange('ep-t',x=>fmt(x,1)+' s',x=>{s.t=x;draw();});
})();
Object.assign(TIPS,{"ep-tau":"A larger time constant means a slower process: the whole curve stretches out in time. The shape never changes, only the time scale.","ep-t":"Slide the marker to t = τ, 2τ, 3τ and compare the readout with 63%, 86%, 95%."});
Object.assign(KEYS,{"ep-canvas":["Change τ and slide the time marker along the curve.",[["cx","the exponential"],["hot","the time you chose"],["muted","τ, 2τ, 3τ marks","dash"]]]});
Object.assign(TT,{expo:"Always read exponential problems in units of τ. After t = τ, 2τ, 3τ the answers are always 63%, 86%, 95% (fill-up) or 37%, 14%, 5% (decay), whatever the circuit."});
PROBS.push(
 {id:'expo1',topic:'expo',calc:1,title:'Voltage while charging',gen(){const e=pick([6,9,12,24]),tau=pick([.2,.5,1,2,4]),k=pick([.5,1,1.5,2,3]),t=k*tau,ans=e*(1-Math.exp(-k));
   return {q:`A capacitor charges through a resistor with time constant τ = ${num(tau)} s from a ${e} V battery. Its voltage is V(t) = ${e}(1 − e^(−t/τ)). What is V at t = ${num(t)} s?`,ans,unit:'V',hint:'Find t/τ first, then use 1 − e^(−t/τ).',
   sol:`<span class="m"><i>t</i>/τ = ${num(k)}</span>, so <span class="m"><i>V</i> = ${e}(1 − <i>e</i><sup>−${num(k)}</sup>) = <b>${fmt(ans,3)} V</b></span>.`};}},
 {id:'expot',topic:'expo',calc:1,title:'How long until…',gen(){const tau=pick([.5,1,2,5]),f=pick([.5,.8,.9,.95]),ans=-tau*Math.log(1-f);
   return {q:`A quantity follows f(t) = 1 − e^(−t/τ) with τ = ${num(tau)} s. How long does it take to reach ${f*100}% of its final value?`,ans,unit:'s',hint:'Set 1 − e^(−t/τ) = f and solve with a natural log.',
   sol:`<span class="m"><i>e</i><sup>−<i>t</i>/τ</sup> = ${num(1-f)}</span>, so <span class="m"><i>t</i> = −τ ln(${num(1-f)}) = <b>${fmt(ans,3)} s</b></span>.`};}},
 {id:'expod',topic:'expo',calc:1,title:'Decay: what is left',gen(){const Q0=pick([20,40,60,100]),tau=pick([.5,1,2,3]),k=pick([.5,1,2,3]),t=k*tau,ans=Q0*Math.exp(-k);
   return {q:`A charged capacitor discharges through a resistor: Q(t) = ${Q0} μC × e^(−t/τ), with τ = ${num(tau)} s. How much charge is left at t = ${num(t)} s, in μC?`,ans,unit:'μC',hint:'t/τ tells you how many time constants have passed.',
   sol:`<span class="m"><i>Q</i> = ${Q0} <i>e</i><sup>−${num(k)}</sup> = <b>${fmt(ans,3)} μC</b></span>.`};}}
);
