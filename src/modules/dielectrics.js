(function dielectrics(){
  const cv=$('#dl-canvas');const s={mode:'iso',k:4,f:0};const C0=EPS0*1e-2/1e-3,V0=100,Q0=C0*V0,d=1e-3;
  function vals(){const C=C0*((1-s.f)+s.k*s.f);let V,Q;if(s.mode==='batt'){V=V0;Q=C*V;}else{Q=Q0;V=Q/C;}return {C,V,Q,E:V/d,U:.5*Q*V};}
  function draw(){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.42,260,340));const c=prep(cv,h);if(!c)return;const {ctx}=c;const v=vals();
    const L=Math.min(w*.5,420),x0=w*.1,x1=x0+L,yT=h*.28,yB=h*.72,gap=yB-yT,sw=L*s.f;
    ctx.strokeStyle=T.ink;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,yT);ctx.lineTo(x1,yT);ctx.moveTo(x0,yB);ctx.lineTo(x1,yB);ctx.stroke();
    const left=x1-sw+6*(1-s.f);                    // fraction f of the plate is covered; fully out it rests just to the right
    ctx.fillStyle=alpha(T.cx,.14);ctx.strokeStyle=alpha(T.cx,.9);ctx.lineWidth=1.5;ctx.fillRect(left,yT+4,L,gap-8);ctx.strokeRect(left+.5,yT+4.5,L-1,gap-9);
    label(ctx,'κ = '+num(s.k),Math.min(left+L*.5,x1+60),h/2,T.cx,'center','middle',LABEL);
    const inside=x=>x>=left&&x<=left+L,nq=14;
    for(let i=0;i<nq;i++){const x=x0+10+(L-20)*(i+.5)/nq,ins=inside(x),mult=ins?s.k:1;const n=ins?Math.min(2,Math.ceil(s.k/3)):1;for(let j=0;j<n;j++){dot(ctx,x+j*3,yT+12+j*5,3.6,T.pos);dot(ctx,x+j*3,yB-12-j*5,3.6,T.neg);}
      if(ins&&s.k>1){const b=(1-1/s.k);const r=2+2.4*b;dot(ctx,x,yT+gap*.2,r,T.neg);dot(ctx,x,yB-gap*.2,r,T.pos);}}
    const ne=7,Ef=clamp(.35+.65*Math.log10(Math.max(v.E,500)/5e3)/2.2+.3,.25,1);
    for(let i=0;i<ne;i++){const x=x0+16+(L-32)*(i+.5)/ne;arrow(ctx,x,yT+gap*.25,x,yT+gap*(.25+.5*Ef),alpha(T.cx,.9),2);}
    label(ctx,'E = ΔV/d everywhere between the plates',x0,yT-16,T.cx,'left','middle',MONO);
    label(ctx,'+',x0-14,yT,T.pos,'right','middle',LABEL);label(ctx,'−',x0-14,yB,T.neg,'right','middle',LABEL);
    label(ctx,s.mode==='batt'?'battery connected: ΔV = 100 V':'battery disconnected: Q = '+fmt(Q0*1e9,2)+' nC',w/2,h-12,s.mode==='batt'?T.cv:T.bad,'center','middle',MONO);
    setText('dl-C',sf(v.C*1e12,'pF'));setText('dl-Q',sf(v.Q*1e9,'nC'));setText('dl-V',sf(v.V,'V'));setText('dl-E',sf(v.E/1000,'kV/m'));setText('dl-U',sf(v.U*1e6,'μJ'));}
  drawers.dielectrics=draw;
  segBind('dl-mode','k',k=>{s.mode=k;draw();});bindRange('dl-k',x=>fmt(x,1),x=>{s.k=x;draw();});bindRange('dl-f',x=>Math.round(x*100)+' %',x=>{s.f=x;draw();});
})();
Object.assign(TIPS,{"dl-k":"A larger κ means the slab polarizes more, so more bound charge cancels more of the field. C rises by κ, but with the battery off, V and E fall by κ.","dl-f":"Slide the slab in and watch the quantity that changes. Isolated: V and U fall. Battery on: Q and U rise."});
Object.assign(KEYS,{"dl-canvas":["Slide the dielectric in; try both connection modes.",[["pos","free charge on the plates, top +"],["neg","bound charge on the slab faces"],["cx","electric field"]]]});
Object.assign(TT,{dielectrics:"Remember the sequence: slab in → C up by κ. Then decide what stays fixed (Q if isolated, ΔV if connected) and everything else follows from Q = CΔV."});
PROBS.push(
 {id:'dielV',topic:'dielectrics',title:'Insert a dielectric (isolated)',gen(){const V0=pick([100,200,300,600]),k=pick([2,3,4,5]),ans=V0/k;
   return {q:`An air capacitor is charged to ${V0} V and then disconnected from the battery. A dielectric with κ = ${k} is inserted to fill the gap. What is the voltage across it now?`,ans,unit:'V',hint:'Q is fixed. C increases by κ, so V = Q/C decreases by κ.',
   sol:`<span class="m">Δ<i>V</i> = Δ<i>V</i><sub>0</sub>/κ = ${V0}/${k} = <b>${fmt(ans,3)} V</b></span>.`};}},
 {id:'dielQ',topic:'dielectrics',title:'Insert a dielectric (battery on)',gen(){const C=pick([20,50,100]),V=pick([6,12,24]),k=pick([2,3,4,6]),ans=k*C*V*1e-3;
   return {q:`An air capacitor of ${C} pF is connected to a ${V} V battery and stays connected. A dielectric with κ = ${k} is inserted to fill the gap. What is the charge on the plates afterwards, in nC?`,ans,unit:'nC',hint:'The battery holds ΔV fixed, and C becomes κC₀, so Q = κC₀ΔV.',
   sol:`<span class="m"><i>Q</i> = κ<i>C</i><sub>0</sub>Δ<i>V</i> = ${k} × ${C} pF × ${V} V = <b>${fmt(ans,3)} nC</b></span>.`};}},
 {id:'dielU',topic:'dielectrics',title:'Energy after inserting a dielectric',gen(){const U=pick([4,8,12,20]),k=pick([2,3,4,5]),ans=U/k;
   return {q:`An isolated charged capacitor stores ${U} μJ. A dielectric (κ = ${k}) is slid in to fill the gap. What is the energy stored afterwards, in μJ?`,ans,unit:'μJ',hint:'With Q fixed, U = Q²/2C and C goes up by κ.',
   sol:`<span class="m"><i>U</i> = <i>Q</i>²/(2κ<i>C</i><sub>0</sub>) = <i>U</i><sub>0</sub>/κ = ${U}/${k} = <b>${fmt(ans,3)} μJ</b></span>. The missing energy is the work the field did pulling the slab in.`};}}
);
