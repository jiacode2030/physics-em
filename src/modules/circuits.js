(function circuits(){
  const cv=$('#ck-canvas');const s={mode:'ser',E1:12,E2:6,R:[4,6,12]};
  function mna(nNodes,res,src){const n=nNodes-1,m=src.length,N=n+m,A=Array.from({length:N},()=>new Array(N+1).fill(0));
    res.forEach(({a,b,R})=>{const g=1/R;if(a>0)A[a-1][a-1]+=g;if(b>0)A[b-1][b-1]+=g;if(a>0&&b>0){A[a-1][b-1]-=g;A[b-1][a-1]-=g;}});
    src.forEach((q,k)=>{const r=n+k;if(q.p>0){A[q.p-1][r]+=1;A[r][q.p-1]+=1;}if(q.m>0){A[q.m-1][r]-=1;A[r][q.m-1]-=1;}A[r][N]=q.V;});
    for(let i=0;i<N;i++){let p=i;for(let r=i+1;r<N;r++)if(Math.abs(A[r][i])>Math.abs(A[p][i]))p=r;[A[i],A[p]]=[A[p],A[i]];const d=A[i][i]||1e-12;
      for(let j=i;j<=N;j++)A[i][j]/=d;for(let r=0;r<N;r++)if(r!==i){const f=A[r][i];if(f)for(let j=i;j<=N;j++)A[r][j]-=f*A[i][j];}}
    const V=[0];for(let i=0;i<n;i++)V.push(A[i][N]);return {V,Is:src.map((_,k)=>-A[n+k][N])};}   // Is: current the source pushes out of its + terminal
  function layout(w,h){const xl=Math.max(70,w*.12),xr=w-Math.max(60,w*.1),yt=64,yb=h-60,W=xr-xl,[R1,R2,R3]=s.R,E1=s.E1,E2=s.E2;let seg=[],res=[],src=[],nn=2,top=1;
    const R=(x1,y1,x2,y2,a,b,i,lab)=>{seg.push({t:'R',p:[x1,y1],q:[x2,y2],a,b,i,lab});res.push({a,b,R:s.R[i]});};
    const B=(x1,y1,x2,y2,p,m,V,lab)=>{seg.push({t:'B',p:[x1,y1],q:[x2,y2],a:m,b:p,k:src.length,lab});src.push({p,m,V});};
    const Wr=(x1,y1,x2,y2,a)=>seg.push({t:'W',p:[x1,y1],q:[x2,y2],a,b:a});
    if(s.mode==='ser'){nn=4;const xm=xl+W*.5;B(xl,yb,xl,yt,1,0,E1,'ε = '+E1+' V');R(xl,yt,xm,yt,1,2,0,'R₁');R(xm,yt,xr,yt,2,3,1,'R₂');R(xr,yt,xr,yb,3,0,2,'R₃');Wr(xr,yb,xl,yb,0);}
    else if(s.mode==='par'){nn=2;const xs=[xl+W*.3,xl+W*.6,xl+W*.9];B(xl,yb,xl,yt,1,0,E1,'ε = '+E1+' V');Wr(xl,yt,xs[2],yt,1);Wr(xs[2],yb,xl,yb,0);xs.forEach((x,i)=>R(x,yt,x,yb,1,0,i,'R'+['₁','₂','₃'][i]));}
    else if(s.mode==='mix'){nn=3;const xm=xl+W*.4,xs=[xl+W*.65,xl+W*.95];B(xl,yb,xl,yt,1,0,E1,'ε = '+E1+' V');R(xl,yt,xm,yt,1,2,0,'R₁');Wr(xm,yt,xs[1],yt,2);Wr(xs[1],yb,xl,yb,0);R(xs[0],yt,xs[0],yb,2,0,1,'R₂');R(xs[1],yt,xs[1],yb,2,0,2,'R₃');}
    else{nn=4;const x1=xl+W*.12,x2=xl+W*.5,x3=xl+W*.88,ym=(yt+yb)/2;
      B(x1,yb,x1,ym,2,0,E1,'ε₁ = '+E1+' V');R(x1,ym,x1,yt,2,1,0,'R₁');Wr(x1,yt,x3,yt,1);Wr(x3,yb,x1,yb,0);
      R(x2,yt,x2,yb,1,0,2,'R₃');B(x3,yb,x3,ym,3,0,E2,'ε₂ = '+E2+' V');R(x3,ym,x3,yt,3,1,1,'R₂');}
    return {seg,res,src,nn};}
  const col=(v,vm)=>{const t=clamp(.5+.5*v/vm,0,1),a=hexRGB(T.neg),b=hexRGB(T.pos),c=a.map((x,i)=>Math.round(x+(b[i]-x)*t));return `rgb(${c[0]},${c[1]},${c[2]})`;};
  function draw(){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.55,330,420));const c=prep(cv,h);if(!c)return;const {ctx}=c;
    const L=layout(w,h),sol=mna(L.nn,L.res,L.src),V=sol.V,vm=Math.max(.1,Math.abs(s.E1),s.mode==='kir'?Math.abs(s.E2):0,s.mode==='kir'?Math.abs(s.E1)+Math.abs(s.E2)*0:0);
    const Ires=L.res.map(r=>(V[r.a]-V[r.b])/r.R);let sumP=0;
    L.seg.forEach(sg=>{const [x1,y1]=sg.p,[x2,y2]=sg.q,dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;
      const va=V[sg.a],vb=V[sg.b],g=ctx.createLinearGradient(x1,y1,x2,y2);
      if(sg.t==='W'){g.addColorStop(0,col(va,vm));g.addColorStop(1,col(va,vm));}else{g.addColorStop(0,col(va,vm));g.addColorStop(.34,col(va,vm));g.addColorStop(.66,col(vb,vm));g.addColorStop(1,col(vb,vm));}
      ctx.strokeStyle=g;ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';
      if(sg.t==='W'){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();return;}
      const e0=.34*len,e1=.66*len,px=-uy,py=ux;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1+ux*e0,y1+uy*e0);ctx.moveTo(x1+ux*e1,y1+uy*e1);ctx.lineTo(x2,y2);ctx.stroke();
      if(sg.t==='R'){const n=7,amp=9,pts=[];for(let k=0;k<=n+2;k++){const f=k===0?0:k===n+2?1:(k)/(n+1);const along=e0+(e1-e0)*f;const off=(k===0||k===n+2)?0:(k%2?amp:-amp);pts.push([x1+ux*along+px*off,y1+uy*along+py*off]);}
        ctx.lineWidth=4;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
        const I=Ires[L.seg.indexOf(sg)===-1?0:L.res.findIndex(r=>r.a===sg.a&&r.b===sg.b&&r.R===s.R[sg.i])],Ia=I;sumP+=Ia*Ia*s.R[sg.i];
        const mx=x1+ux*len*.5,my=y1+uy*len*.5,sgn=Ia>=0?1:-1,al=16,vert=Math.abs(ux)<.5;
        if(vert){arrow(ctx,mx+28-ux*al*sgn,my-uy*al*sgn,mx+28+ux*al*sgn,my+uy*al*sgn,T.ink,2.2);label(ctx,sg.lab+' = '+s.R[sg.i]+' Ω',mx-26,my,T.ink,'right','middle',MONO);label(ctx,fmt(Math.abs(Ia),3)+' A',mx+40,my,T.muted,'left','middle',MONO);}
        else{arrow(ctx,mx-ux*al*sgn,my+28-uy*al*sgn,mx+ux*al*sgn,my+28+uy*al*sgn,T.ink,2.2);label(ctx,sg.lab+' = '+s.R[sg.i]+' Ω',mx,my-26,T.ink,'center','middle',MONO);label(ctx,fmt(Math.abs(Ia),3)+' A',mx,my+46,T.muted,'center','middle',MONO);}}
      else{ctx.lineWidth=4;ctx.strokeStyle=T.ink;const mx=x1+ux*len*.5,my=y1+uy*len*.5,vert=Math.abs(ux)<.5;[[-6,16],[6,9]].forEach(([d,hw])=>{ctx.beginPath();ctx.moveTo(mx+ux*d+px*hw,my+uy*d+py*hw);ctx.lineTo(mx+ux*d-px*hw,my+uy*d-py*hw);ctx.stroke();});
        const Io=sol.Is[sg.k],sgn=Io>=0?1:-1,al=16;
        if(vert){label(ctx,sg.lab,mx-28,my,T.ink,'right','middle',MONO);arrow(ctx,mx+32-ux*al*sgn,my-uy*al*sgn,mx+32+ux*al*sgn,my+uy*al*sgn,T.cv,2.2);}
        else{label(ctx,sg.lab,mx,my-30,T.ink,'center','middle',MONO);arrow(ctx,mx-ux*al*sgn,my+30-uy*al*sgn,mx+ux*al*sgn,my+30+uy*al*sgn,T.cv,2.2);}}});
    // ground and scale
    label(ctx,'ground (0 V)',10,h-14,T.muted,'left','middle',MONO);const gx=w-130,gy=14;for(let k=0;k<100;k+=2){ctx.fillStyle=col((k/50-1)*vm,vm);ctx.fillRect(gx+k,gy,2,8);}label(ctx,'low',gx-4,gy+4,T.neg,'right','middle',MONO);label(ctx,'high potential',gx+104,gy+4,T.pos,'left','middle',MONO);
    const E1v=L.src[0].V;
    if(s.mode==='kir'){const I1=sol.Is[0],I2=sol.Is[1],I3=V[1]/s.R[2];setText('ck-r1',sf(I1,'A'));setText('ck-r2',sf(I2,'A'));setText('ck-r3',sf(I3,'A'));setText('ck-r4','0 ✓');}
    else{const I=sol.Is[0];setText('ck-r1',sf(Math.abs(E1v/I),'Ω'));setText('ck-r2',sf(I,'A'));setText('ck-r3',sf(E1v*I,'W'));setText('ck-r4',sf(sumP,'W'));}}
  function relabel(){const l=(id,t)=>{$('#'+id).previousElementSibling.textContent=t;};
    if(s.mode==='kir'){l('ck-r1','I₁ (up through ε₁)');l('ck-r2','I₂ (up through ε₂)');l('ck-r3','I₃ (down through R₃)');l('ck-r4','Junction check: I₁ + I₂ − I₃');}
    else{l('ck-r1','Equivalent resistance');l('ck-r2','Battery current');l('ck-r3','Power from the battery');l('ck-r4','Power lost in the resistors');}
    $('#ck-E1-lbl').textContent=s.mode==='kir'?'Battery ε₁':'Battery ε';}
  drawers.circuits=draw;
  segBind('ck-mode','k',k=>{s.mode=k;$('#ck-E2-ctl').hidden=k!=='kir';relabel();draw();});
  bindRange('ck-E1',x=>x+' V',x=>{s.E1=x;draw();});bindRange('ck-E2',x=>(x>0?'+':x<0?'−':'')+Math.abs(x)+' V',x=>{s.E2=x;draw();});
  [1,2,3].forEach(k=>bindRange('ck-res'+k,x=>x+' Ω',x=>{s.R[k-1]=x;draw();}));relabel();
})();
Object.assign(TIPS,{"ck-E1":"A bigger battery raises the whole circuit's potential profile. Every current and voltage scales up in proportion (Ohm's law), and the colors get more extreme.","ck-E2":"Battery 2's sign matters. Make it negative and it works against battery 1; if battery 1 is stronger, battery 2 is being charged.","ck-res1":"In series, a bigger R₁ takes a bigger share of the battery voltage and cuts the current for everyone. In parallel, only its own branch current falls.","ck-res2":"Watch how the current divides: in parallel the current through each branch is inversely proportional to its resistance.","ck-res3":"A larger R₃ means less current through that branch. In series it slows the entire loop."});
Object.assign(KEYS,{"ck-canvas":["Pick a circuit and change the batteries and resistors. Colors show potential, arrows show current.",[["pos","high potential"],["neg","low potential"],["cv","battery current"],["ink","current in a resistor"]]]});
Object.assign(TT,{circuits:"For any circuit, label a ground, label a current direction for every branch, then write one junction rule and enough loop rules. Negative answers just mean the opposite direction."});
PROBS.push(
 {id:'Rmix',topic:'circuits',title:'Series-parallel resistance',gen(){const a=pick([2,4,6,10]),b=pick([6,12,3,4]),c=pick([6,12,3,4]),ans=a+b*c/(b+c);
   return {q:`A ${a} Ω resistor is in series with a parallel pair of ${b} Ω and ${c} Ω resistors. What is the equivalent resistance of the combination?`,ans,unit:'Ω',hint:'First combine the parallel pair, then add the series resistor.',
   sol:`<span class="m"><i>R</i><sub>p</sub> = ${b}·${c}/(${b}+${c}) = ${fmt(b*c/(b+c),3)} Ω</span>, so <span class="m"><i>R</i> = ${a} + ${fmt(b*c/(b+c),3)} = <b>${fmt(ans,3)} Ω</b></span>.`};}},
 {id:'Itot',topic:'circuits',title:'Current from the battery',gen(){const E=pick([6,12,24]),a=pick([2,4,6]),b=pick([6,12]),c=pick([6,12]),R=a+b*c/(b+c),ans=E/R;
   return {q:`A ${E} V battery (no internal resistance) drives a ${a} Ω resistor in series with a parallel pair of ${b} Ω and ${c} Ω. What current does the battery supply?`,ans,unit:'A',hint:'Find the equivalent resistance, then I = ε/R.',
   sol:`<span class="m"><i>R</i> = ${a} + ${fmt(b*c/(b+c),3)} = ${fmt(R,3)} Ω</span>, so <span class="m"><i class="cur">I</i> = ${E}/${fmt(R,3)} = <b>${fmt(ans,3)} A</b></span>.`};}},
 {id:'Vdiv',topic:'circuits',title:'Voltage divider',gen(){const E=pick([6,9,12,24]),a=pick([1,2,3,5]),b=pick([2,4,6,10]),ans=E*b/(a+b);
   return {q:`Two resistors, ${a} kΩ and ${b} kΩ, are in series across a ${E} V battery. What is the voltage across the ${b} kΩ resistor?`,ans,unit:'V',hint:'The same current flows through both: I = ε/(R₁ + R₂). Then V₂ = IR₂.',
   sol:`<span class="m"><i>V</i><sub>2</sub> = ε<i>R</i><sub>2</sub>/(<i>R</i><sub>1</sub> + <i>R</i><sub>2</sub>) = ${E}·${b}/(${a}+${b}) = <b>${fmt(ans,3)} V</b></span>.`};}},
 {id:'Kirch2',topic:'circuits',title:'Two batteries and a shared resistor',gen(){const e1=pick([6,9,12]),e2=pick([3,6]),r1=pick([2,4]),r2=pick([1,2]),r3=pick([3,6]),VT=(e1/r1+e2/r2)/(1/r1+1/r2+1/r3),ans=VT/r3;
   return {q:`Two batteries, ε₁ = ${e1} V (with R₁ = ${r1} Ω in its branch) and ε₂ = ${e2} V (with R₂ = ${r2} Ω in its branch), are wired in parallel with a shared ${r3} Ω resistor (all + terminals joined at the top, as in the worked example). What current flows through the shared resistor?`,ans,unit:'A',hint:'Let V be the top-node voltage: junction rule (ε₁ − V)/R₁ + (ε₂ − V)/R₂ = V/R₃.',
   sol:`<span class="m"><i>V</i> = (ε<sub>1</sub>/<i>R</i><sub>1</sub> + ε<sub>2</sub>/<i>R</i><sub>2</sub>)/(1/<i>R</i><sub>1</sub> + 1/<i>R</i><sub>2</sub> + 1/<i>R</i><sub>3</sub>) = ${fmt(VT,3)} V</span>, so <span class="m"><i class="cur">I</i><sub>3</sub> = <i>V</i>/<i>R</i><sub>3</sub> = <b>${fmt(ans,3)} A</b></span>.`};}}
);
PROBS.push(
 {id:'Rint',topic:'circuits',title:'Terminal voltage of a real battery',gen(){const E=pick([6,9,12]),r=pick([.2,.5,1]),R=pick([2,4,8]),ans=E*R/(R+r);
   return {q:`A battery with EMF ${E} V and internal resistance ${num(r)} Ω is connected to a ${R} Ω resistor. What is the voltage across the battery's terminals?`,ans,unit:'V',hint:'Treat r as a resistor in series: I = ε/(R + r). The terminal voltage is the voltage across R (or ε − Ir).',
   sol:`<span class="m"><i class="cur">I</i> = ${E}/(${R} + ${num(r)}) = ${fmt(E/(R+r),4)} A</span>, so <span class="m">Δ<i>V</i> = ε − <i class="cur">I</i><i>r</i> = <b>${fmt(ans,3)} V</b></span>.`};}},
 {id:'Rshort',topic:'circuits',title:'Short-circuit current',gen(){const E=pick([6,9,12]),r=pick([.1,.2,.5]),ans=E/r;
   return {q:`A battery has EMF ${E} V and internal resistance ${num(r)} Ω. What current flows if its terminals are connected by a wire of negligible resistance?`,ans,unit:'A',hint:'Only the internal resistance limits the current.',sol:`<span class="m"><i class="cur">I</i> = ε/<i>r</i> = ${E}/${num(r)} = <b>${fmt(ans,3)} A</b></span>.`};}}
);
