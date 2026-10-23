(function capacitors(){
  const cv=$('#cp-canvas');const s={mode:'batt',A:100,d:2,V:12,Q:0};
  const Cf=()=>EPS0*s.A*1e-4/(s.d*1e-3);
  function vals(){const C=Cf();let V,Q;if(s.mode==='batt'){V=s.V;Q=C*V;}else{Q=s.Q;V=Q/C;}return {C,V,Q,E:V/(s.d*1e-3),U:.5*Q*V};}
  function draw(){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.42,250,340));const c=prep(cv,h);if(!c)return;const {ctx}=c;const v=vals();
    const Lp=clamp(18*Math.sqrt(s.A),70,w*.5),dp=10+14*s.d,cx=w*.55,yT=h/2-dp/2,yB=h/2+dp/2,x0=cx-Lp/2,x1=cx+Lp/2;
    ctx.strokeStyle=T.ink;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,yT);ctx.lineTo(x1,yT);ctx.moveTo(x0,yB);ctx.lineTo(x1,yB);ctx.stroke();
    const nq=clamp(Math.round(3+13*Math.log10(Math.max(v.Q,1e-13)/1e-12)/3.8),2,18);
    for(let k=0;k<nq;k++){const x=x0+8+(Lp-16)*(k+.5)/nq;dot(ctx,x,yT+11,4,T.pos);dot(ctx,x,yB-11,4,T.neg);}
    const ne=Math.max(4,Math.round(Lp/34)),L=clamp(dp-26,10,dp-18)*clamp(.5+.5*Math.log10(Math.max(v.E,50)/200)/2,.25,1);
    for(let k=0;k<ne;k++){const x=x0+12+(Lp-24)*(k+.5)/ne;const ym=h/2;arrow(ctx,x,ym-L/2,x,ym+L/2,alpha(T.cx,.9),2);}
    label(ctx,'+Q',x1+14,yT,T.pos,'left');label(ctx,'−Q',x1+14,yB,T.neg,'left');ctx.strokeStyle=T.muted;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0-16,yT);ctx.lineTo(x0-16,yB);ctx.stroke();label(ctx,'d',x0-24,h/2,T.muted,'right','middle',MONO);
    // battery and wires (no wires when disconnected)
    const bx=Math.max(46,x0-120),batt=s.mode==='batt';ctx.strokeStyle=T.ink;ctx.lineWidth=2;
    if(batt){ctx.beginPath();ctx.moveTo(x0,yT);ctx.lineTo(bx,yT);ctx.lineTo(bx,h/2-16);ctx.moveTo(x0,yB);ctx.lineTo(bx,yB);ctx.lineTo(bx,h/2+16);ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(bx,yT);ctx.lineTo(bx,h/2-16);ctx.moveTo(bx,yB);ctx.lineTo(bx,h/2+16);ctx.stroke();}
    ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(bx-16,h/2-16);ctx.lineTo(bx+16,h/2-16);ctx.stroke();ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(bx-8,h/2-7);ctx.lineTo(bx+8,h/2-7);ctx.stroke();
    label(ctx,s.V+' V',bx-24,h/2-12,T.ink,'right','middle',MONO);label(ctx,'+',bx+22,h/2-22,T.pos,'left','middle');
    label(ctx,batt?'battery connected':'battery disconnected',bx,yT-14,batt?T.cv:T.bad,'left','middle',MONO);
    setText('cp-C',sf(v.C*1e12,'pF'));setText('cp-Q',sf(v.Q*1e9,'nC'));setText('cp-VV',sf(v.V,'V'));setText('cp-E',sf(v.E/1000,'kV/m'));setText('cp-U',sf(v.U*1e9,'nJ'));}
  drawers.capacitors=()=>{draw();extra.cc();v3&&v3.render();};
  segBind('cp-mode','k',k=>{if(k==='iso'&&s.mode!=='iso')s.Q=Cf()*s.V;s.mode=k;$('#cp-V').closest('.ctl').hidden=k==='iso';draw();});
  bindRange('cp-A',x=>x+' cm²',x=>{s.A=x;draw();});bindRange('cp-d',x=>fmt(x,1)+' mm',x=>{s.d=x;draw();});bindRange('cp-V',x=>x+' V',x=>{s.V=x;draw();});
  // ---------- combinations
  const k={mode:'ser',V:12,C1:4,C2:2};
  extra.cc=function(){const cc=$('#cc-canvas');const w=cc.clientWidth;if(!w)return;const h=Math.round(clamp(w*.4,230,300));const c=prep(cc,h);if(!c)return;const {ctx}=c;
    const {mode,V,C1,C2}=k,ser=mode==='ser',Ce=ser?C1*C2/(C1+C2):C1+C2,Qt=Ce*V;let v1,v2,q1,q2;if(ser){q1=q2=Qt;v1=Qt/C1;v2=Qt/C2;}else{v1=v2=V;q1=C1*V;q2=C2*V;}
    const xl=70,xr=w-70,yt=44,yb=h-44;ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.lineCap='round';
    const capH=(x,y,lab,sub)=>{ctx.beginPath();ctx.moveTo(x-5,y-16);ctx.lineTo(x-5,y+16);ctx.moveTo(x+5,y-16);ctx.lineTo(x+5,y+16);ctx.stroke();label(ctx,lab,x,y-26,T.ink,'center','middle',MONO);label(ctx,sub,x,y+34,T.muted,'center','middle',MONO);};
    const capV=(x,y,lab,sub)=>{ctx.beginPath();ctx.moveTo(x-16,y-5);ctx.lineTo(x+16,y-5);ctx.moveTo(x-16,y+5);ctx.lineTo(x+16,y+5);ctx.stroke();label(ctx,lab,x+26,y-6,T.ink,'left','middle',MONO);label(ctx,sub,x+26,y+10,T.muted,'left','middle',MONO);};
    // battery on the left
    ctx.beginPath();ctx.moveTo(xl,yt);ctx.lineTo(xl,h/2-12);ctx.moveTo(xl,yb);ctx.lineTo(xl,h/2+12);ctx.stroke();ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(xl-14,h/2-12);ctx.lineTo(xl+14,h/2-12);ctx.moveTo(xl-7,h/2-4);ctx.lineTo(xl+7,h/2-4);ctx.stroke();ctx.lineWidth=2;label(ctx,V+' V',xl-22,h/2-8,T.ink,'right','middle',MONO);
    if(ser){const m1=xl+(xr-xl)*.38,m2=xl+(xr-xl)*.72;ctx.beginPath();ctx.moveTo(xl,yt);ctx.lineTo(xr,yt);ctx.lineTo(xr,yb);ctx.lineTo(xl,yb);ctx.stroke();ctx.fillStyle=T.surface;ctx.fillRect(m1-14,yt-3,28,6);ctx.fillRect(m2-14,yt-3,28,6);capH(m1,yt,'C₁ = '+C1+' μF',fmt(v1,2)+' V · '+fmt(q1,1)+' μC');capH(m2,yt,'C₂ = '+C2+' μF',fmt(v2,2)+' V · '+fmt(q2,1)+' μC');}
    else{const m1=xl+(xr-xl)*.4,m2=xl+(xr-xl)*.75;ctx.beginPath();ctx.moveTo(xl,yt);ctx.lineTo(xr,yt);ctx.moveTo(xl,yb);ctx.lineTo(xr,yb);ctx.moveTo(m1,yt);ctx.lineTo(m1,h/2-5);ctx.moveTo(m1,yb);ctx.lineTo(m1,h/2+5);ctx.moveTo(m2,yt);ctx.lineTo(m2,h/2-5);ctx.moveTo(m2,yb);ctx.lineTo(m2,h/2+5);ctx.moveTo(xr,yt);ctx.lineTo(xr,yb);ctx.stroke();capV(m1,h/2,'C₁ = '+C1+' μF',fmt(v1,2)+' V · '+fmt(q1,1)+' μC');capV(m2,h/2,'C₂ = '+C2+' μF',fmt(v2,2)+' V · '+fmt(q2,1)+' μC');}
    setText('cc-eq',fmt(Ce,3)+' μF');setText('cc-Q',fmt(Qt,2)+' μC');setText('cc-v1',fmt(v1,2)+' V');setText('cc-v2',fmt(v2,2)+' V');setText('cc-q12',fmt(q1,2)+' and '+fmt(q2,2)+' μC');};
  segBind('cc-mode','k',m=>{k.mode=m;extra.cc();});bindRange('cc-V',x=>x+' V',x=>{k.V=x;extra.cc();});bindRange('cc-C1',x=>x+' μF',x=>{k.C1=x;extra.cc();});bindRange('cc-C2',x=>x+' μF',x=>{k.C2=x;extra.cc();});
  s.Q=Cf()*s.V;  let v3=null;
  v3=view3d($('#cp3-canvas'),{yaw:-.75,pitch:.4,dist:5.4,target:[0,0,0],min:3,max:16,height:w=>clamp(w*.5,280,420),scene:S=>{
    const v=vals(),side=1.5*Math.sqrt(s.A/100)+.3,h=.35+.3*s.d,z=h/2;S.grid(-3,3,-3,3,1);
    S.box([0,0,-z],[side,side,.07],0,T.neg);
    const nq=clamp(Math.round(4+4*Math.log10(Math.max(v.Q,1e-13)/1e-12)),3,12);
    for(let i=0;i<nq;i++)for(let j=0;j<nq;j++){const x=(i+.5)/nq*side-side/2,y=(j+.5)/nq*side-side/2;S.ball([x,y,-z+.1],.03,T.neg,1,false);S.ball([x,y,z-.1],.03,T.pos,1,false);}
    const nf=4,Ef=clamp(.3+.7*Math.log10(Math.max(v.E,500)/5e3)/2.2+.3,.3,1);
    for(let i=0;i<nf;i++)for(let j=0;j<nf;j++){const x=(i+.5)/nf*side*.8-side*.4,y=(j+.5)/nf*side*.8-side*.4;S.arrow([x,y,z-.12],[x,y,z-.12-(h-.24)*Ef],T.cx,2.4);}
    S.box([0,0,z],[side,side,.07],0,T.pos);
    S.text([-side/2-.45,-side/2,z],'+Q',T.pos);S.text([-side/2-.45,-side/2,-z],'−Q',T.neg);
    S.line([side/2,0,z],[side/2+.8,0,z],T.ink,2);S.line([side/2,0,-z],[side/2+.8,0,-z],T.ink,2);
    if(s.mode==='batt'){S.line([side/2+.8,0,z],[side/2+.8,0,.12],T.ink,2);S.line([side/2+.8,0,-z],[side/2+.8,0,-.12],T.ink,2);S.text([side/2+1.35,0,0],s.V+' V',T.ink);}
    else S.text([side/2+1.1,0,0],'battery removed',T.bad);
    S.line([-side/2-.2,side/2,z],[-side/2-.2,side/2,-z],T.muted,1.2);S.text([-side/2-.7,side/2,0],'d = '+fmt(s.d,1)+' mm',T.muted);}});


})();
Object.assign(TIPS,{"cp-A":"Bigger plates mean more room for charge: C grows in proportion to A. The field E = Q/(ε₀A) shrinks if Q is fixed.","cp-d":"Closer plates mean a larger C. Pulling them apart with the battery connected makes charge flow back to the battery; with it disconnected, Q stays and the voltage rises.","cp-V":"With the battery connected the charge is Q = CΔV, so doubling the voltage doubles Q and quadruples the energy.","cc-V":"The battery voltage sets the total. In series it is shared; in parallel each capacitor gets all of it.","cc-C1":"In series the smaller capacitor takes the bigger voltage. In parallel the bigger capacitor stores more charge.","cc-C2":"Make C₂ much bigger than C₁ in series: the combination is almost just C₁."});
Object.assign(KEYS,{"cp-canvas":["Change A, d and the voltage. Compare the two connection modes.",[["pos","+Q on the top plate"],["neg","−Q on the bottom plate"],["cx","electric field"]]]});
Object.assign(TT,{capacitors:"Before touching the numbers ask: is the battery still connected? If yes, ΔV is fixed. If not, Q is fixed. Most capacitor questions turn on that one choice."});
PROBS.push(
 {id:'capC',topic:'capacitors',title:'Capacitance of parallel plates',gen(){const A=pick([50,100,200,400]),d=pick([.5,1,2,4]),ans=EPS0*A*1e-4/(d*1e-3)*1e12;
   return {q:`A parallel-plate capacitor has plates of area ${A} cm² separated by ${d} mm of air. What is its capacitance, in pF?`,ans,unit:'pF',hint:'C = ε₀A/d, with A in m² and d in m.',
   sol:`<span class="m"><i>C</i> = ε<sub>0</sub><i>A</i>/<i>d</i> = (8.85 × 10⁻¹²)(${num(A*1e-4)})/(${num(d*1e-3)}) = <b>${fmt(ans,3)} pF</b></span>.`};}},
 {id:'capU',topic:'capacitors',title:'Energy stored',gen(){const C=pick([2,5,10,22,47]),V=pick([6,12,24,50]),ans=.5*C*V*V;
   return {q:`A ${C} μF capacitor is charged to ${V} V. How much energy does it store, in μJ?`,ans,unit:'μJ',hint:'U = ½CΔV².',
   sol:`<span class="m"><i>U</i> = ½<i>C</i>Δ<i>V</i>² = ½(${C})(${V})² = <b>${fmt(ans,3)} μJ</b></span>.`};}},
 {id:'capser',topic:'capacitors',title:'Series capacitors',gen(){const a=pick([2,3,4,6,12]),b=pick([6,12,4,3]),ans=a*b/(a+b);
   return {q:`A ${a} μF and a ${b} μF capacitor are connected in series. What is their equivalent capacitance, in μF?`,ans,unit:'μF',hint:'In series the reciprocals add: 1/C = 1/C₁ + 1/C₂.',
   sol:`<span class="m">1/<i>C</i> = 1/${a} + 1/${b}</span>, so <span class="m"><i>C</i> = ${a}·${b}/(${a}+${b}) = <b>${fmt(ans,3)} μF</b></span>.`};}},
 {id:'cappull',topic:'capacitors',title:'Pulling plates apart (isolated)',gen(){const U=pick([2,4,8,12]),k=pick([2,3,4]),ans=k*U;
   return {q:`A charged parallel-plate capacitor, disconnected from its battery, stores ${U} μJ. The plates are slowly pulled apart until the separation is ${k} times as large. What is the energy stored now, in μJ?`,ans,unit:'μJ',hint:'Q is fixed, so U = Q²/2C, and C ∝ 1/d.',
   sol:`<span class="m"><i>U</i> = <i>Q</i>²/(2<i>C</i>)</span> and <span class="m"><i>C</i> → <i>C</i>/${k}</span>, so <span class="m"><i>U</i> → ${k}<i>U</i> = <b>${k*U} μJ</b></span>. The extra energy is the work you did.`};}}
);
PROBS.push(
 {id:'capsph',topic:'capacitors',calc:1,title:'Spherical capacitor',gen(){const a=pick([1,2,3]),b=a+pick([1,2,3]),ans=4*Math.PI*EPS0*(a*.01)*(b*.01)/((b-a)*.01)*1e12;
   return {q:`A spherical capacitor has an inner sphere of radius ${a} cm and a concentric outer shell of radius ${b} cm. What is its capacitance, in pF?`,ans,unit:'pF',hint:'C = 4πε₀ab/(b − a), found from Gauss\'s law and ΔV = ∫E dr.',
   sol:`<span class="m"><i>C</i> = 4πε<sub>0</sub><i>ab</i>/(<i>b</i> − <i>a</i>) = 4π(8.85 × 10⁻¹²)(${num(a/100)})(${num(b/100)})/${num((b-a)/100)} = <b>${fmt(ans,3)} pF</b></span>.`};}},
 {id:'capshare',topic:'capacitors',title:'Connecting a charged and an empty capacitor',gen(){const C1=pick([2,4,6]),C2=pick([2,3,6]),V=pick([12,20,30]),ans=C1*V/(C1+C2);
   return {q:`A ${C1} μF capacitor charged to ${V} V is disconnected from its battery and connected, with the plates joined + to + and − to −, to an uncharged ${C2} μF capacitor. What is the final voltage across the pair?`,ans,unit:'V',hint:'Charge is conserved: Q = C₁V, shared across both: V′ = Q/(C₁ + C₂).',
   sol:`<span class="m"><i>V</i>′ = <i>C</i><sub>1</sub><i>V</i>/(<i>C</i><sub>1</sub> + <i>C</i><sub>2</sub>) = ${C1}(${V})/${C1+C2} = <b>${fmt(ans,3)} V</b></span>. Some energy is lost as heat in the connecting wires.`};}}
);
