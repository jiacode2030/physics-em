(function ampere(){
  const cv=$('#am-canvas');const s={mode:'wire',I:12,R:2,n:500,r:3};
  const Rs=()=>s.mode==='tor'?{a:s.R,b:s.R+4}:{a:s.R,b:s.R};
  const B=(rc)=>{const r=rc*.01,R=s.R*.01;if(s.mode==='wire')return rc<s.R?MU0*s.I*r/(2*Math.PI*R*R):MU0*s.I/(2*Math.PI*r);
    if(s.mode==='sole')return rc<s.R?MU0*s.n*s.I:0;const a=s.R,b=s.R+4;return (rc>a&&rc<b)?MU0*s.n*s.I/(2*Math.PI*r):0;};   // for the toroid, n holds the total number of turns N
  function draw(){const w=cv.clientWidth;if(!w)return;const side=w>=640,h=side?Math.round(clamp(w*.46,300,420)):620;const c=prep(cv,h);if(!c)return;const {ctx}=c;
    const sz=side?Math.min(h-20,w*.4):Math.min(w-20,300),ox=side?10:(w-sz)/2,oy=side?(h-sz)/2:6,cx=ox+sz/2,cy=oy+sz/2;
    const rr=Math.max(1.15*s.r,s.mode==='tor'?(s.R+4)*1.2:1.6*s.R,3),k=(sz/2-12)/rr,Rr=s.R*k,rp=s.r*k;
    ctx.fillStyle=T.sunk;ctx.fillRect(ox,oy,sz,sz);ctx.strokeStyle=T.line;ctx.strokeRect(ox+.5,oy+.5,sz-1,sz-1);
    const Bm=(()=>{let m=0;for(let r=.2;r<=16;r+=.2)m=Math.max(m,B(r)*1e3);return m;})();const Bmt=r=>B(r)*1e3;
    if(s.mode==='wire'){ctx.fillStyle=alpha(T.cv,.14);ctx.strokeStyle=T.cv;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,Rr,0,7);ctx.fill();ctx.stroke();
      const nd=Math.max(6,Math.round(18*Rr/30));for(let i=0;i<nd*3;i++){const a=i*2.399963,rad=Rr*Math.sqrt((i+.5)/(nd*3))*.92;dot(ctx,cx+rad*Math.cos(a),cy+rad*Math.sin(a),2.2,T.cv);}
      label(ctx,'current out of the page',ox+8,oy+sz-10,T.cv,'left','middle',MONO);}
    else if(s.mode==='sole'){const nc=9,topY=cy-Rr,botY=cy+Rr;ctx.strokeStyle=alpha(T.cv,.6);ctx.lineWidth=2;ctx.strokeRect(ox+10,topY,sz-20,2*Rr);
      for(let i=0;i<nc;i++){const x=ox+22+(sz-44)*i/(nc-1);dot(ctx,x,topY,4,T.cv);label(ctx,'×',x,botY,T.cv,'center','middle','700 16px "IBM Plex Sans", system-ui, sans-serif');}
      for(let i=1;i<4;i++){const y=cy-Rr+2*Rr*i/4;arrow(ctx,ox+30,y,ox+sz-30,y,alpha(T.ca,.8),2.2);}label(ctx,'B inside →',cx,cy-6,T.ca,'center','middle',MONO);
      label(ctx,'axis',ox+14,cy+14,T.muted,'left','middle',MONO);ctx.save();ctx.setLineDash([2,4]);ctx.strokeStyle=T.muted;ctx.beginPath();ctx.moveTo(ox+8,cy);ctx.lineTo(ox+sz-8,cy);ctx.stroke();ctx.restore();}
    else{const a=s.R*k,b=(s.R+4)*k;ctx.fillStyle=alpha(T.cv,.12);ctx.beginPath();ctx.arc(cx,cy,b,0,7);ctx.arc(cx,cy,a,0,7,true);ctx.fill();ctx.strokeStyle=T.cv;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,a,0,7);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,b,0,7);ctx.stroke();
      for(let i=0;i<28;i++){const t=i/28*Math.PI*2;ctx.strokeStyle=alpha(T.cv,.7);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx+(a-4)*Math.cos(t),cy+(a-4)*Math.sin(t));ctx.lineTo(cx+(b+4)*Math.cos(t),cy+(b+4)*Math.sin(t));ctx.stroke();}label(ctx,'N turns on a doughnut',ox+8,oy+sz-10,T.cv,'left','middle',MONO);}
    // Amperian loop and B arrows
    if(s.mode!=='sole'){ctx.save();ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.beginPath();ctx.arc(cx,cy,rp,0,7);ctx.stroke();ctx.restore();
      const Br=B(s.r);if(Br>0){for(let i=0;i<8;i++){const t=i/8*Math.PI*2+.2,px=cx+rp*Math.cos(t),py=cy-rp*Math.sin(t),tx=-Math.sin(t),ty=-Math.cos(t),L=10+22*clamp(Br*1e3/Bm,0,1);arrow(ctx,px-tx*L/2,py-ty*L/2,px+tx*L/2,py+ty*L/2,T.ca,2.6);}}label(ctx,'Amperian loop r = '+fmt(s.r,1)+' cm',cx,cy-rp-10,T.ink,'center','middle',MONO);}
    else{const py=cy-s.r*k;if(Math.abs(py-cy)<sz/2-6){dot(ctx,cx,py,6,T.surface,T.ink);label(ctx,'probe r = '+fmt(s.r,1)+' cm',cx+10,py-12,T.ink,'left','middle',MONO);}}
    // graph
    const gx=side?ox+sz+60:30,gy=side?18:oy+sz+24,gw=side?w-gx-18:w-gx-16,gh=side?h-gy-46:h-gy-46;
    const P=panel(ctx,{x:gx,y:gy,w:gw,h:gh},[0,16],[0,Bm*1.2||1],{ylabel:'B (mT)',color:T.ca,xlabel:'r (cm)',yn:4,xn:8});
    curve(ctx,P,Bmt,.1,16,T.ca,2.75,320);const Bp=B(s.r);line(ctx,P,s.r,0,s.r,Bp*1e3,T.hot,1.5,[2,3]);dot(ctx,P.X(s.r),P.Y(Bp*1e3),6,T.hot,T.surface);
    const edges=s.mode==='tor'?[s.R,s.R+4]:[s.R];edges.forEach(e=>line(ctx,P,e,0,e,Bm*1.2,alpha(T.muted,.6),1,[4,4]));
    // readouts
    const l=(id,t)=>{$('#'+id).previousElementSibling.textContent=t;};
    if(s.mode==='wire'){const Ie=s.r<s.R?s.I*(s.r/s.R)**2:s.I;l('am-r1','B at the loop');l('am-r2','Current enclosed I_enc');l('am-r3','∮B·dl = B(2πr)');l('am-r4','μ₀·I_enc (check)');
      setText('am-r1',sf(Bp,'T'));setText('am-r2',sf(Ie,'A'));setText('am-r3',sf(Bp*2*Math.PI*s.r*.01,'T·m'));setText('am-r4',sf(MU0*Ie,'T·m'));}
    else if(s.mode==='sole'){l('am-r1','B at distance r');l('am-r2','μ₀nI inside');l('am-r3','Probe is…');l('am-r4','Energy density B²/2μ₀');
      setText('am-r1',sf(Bp,'T'));setText('am-r2',sf(MU0*s.n*s.I,'T'));setText('am-r3',s.r<s.R?'inside the coil':'outside the coil');setText('am-r4',sf(Bp*Bp/(2*MU0),'J/m³'));}
    else{l('am-r1','B at r');l('am-r2','μ₀NI/(2πr)');l('am-r3','Probe is…');l('am-r4','Doughnut spans');
      setText('am-r1',sf(Bp,'T'));setText('am-r2',sf(MU0*s.n*s.I/(2*Math.PI*s.r*.01),'T'));setText('am-r3',(s.r>s.R&&s.r<s.R+4)?'inside the doughnut':'outside (B = 0)');setText('am-r4',fmt(s.R,1)+' to '+fmt(s.R+4,1)+' cm');}}
  drawers.ampere=()=>{draw();v3&&v3.render();};
  segBind('am-mode','k',k=>{s.mode=k;$('#am-n-ctl').hidden=k==='wire';$('#am-rad-lbl').textContent=k==='wire'?'Wire radius R':k==='sole'?'Solenoid radius R':'Inner radius a';$('#am-n-lbl').textContent=k==='sole'?'Turns per meter n':'Total turns N';
    if(k==='sole'){$('#am-n').min=100;$('#am-n').max=2000;$('#am-n').step=100;$('#am-n').value=500;s.n=500;}if(k==='tor'){$('#am-n').min=50;$('#am-n').max=1000;$('#am-n').step=50;$('#am-n').value=200;s.n=200;}
    $('#am-n').dispatchEvent(new Event('input'));draw();});
  bindRange('am-I',x=>x+' A',x=>{s.I=x;draw();});bindRange('am-rad',x=>fmt(x,1)+' cm',x=>{s.R=x;draw();});bindRange('am-n',x=>String(x),x=>{s.n=x;draw();});bindRange('am-r',x=>fmt(x,1)+' cm',x=>{s.r=x;draw();});  let v3=null;
  v3=view3d($('#am3-canvas'),{yaw:-.8,pitch:.4,dist:5.8,target:[0,0,0],min:3,max:18,height:w=>clamp(w*.5,280,420),scene:S=>{
    const kk=.15,ring=(r,z,col,lw,dash)=>{const pts=[];for(let i=0;i<=56;i++){const a=i/56*2*Math.PI;pts.push([r*Math.cos(a),r*Math.sin(a),z]);}S.path(pts,col,lw,dash);};
    S.grid(-4,4,-4,4,1);const Bp=B(s.r),Bm=(()=>{let m=0;for(let r=.2;r<=16;r+=.2)m=Math.max(m,B(r));return m||1;})();
    const tan=(r,z,col,lw)=>{for(let i=0;i<8;i++){const a=i/8*2*Math.PI+.3,p=[r*Math.cos(a),r*Math.sin(a),z],t=[-Math.sin(a),Math.cos(a),0];S.arrow(p,V3.add(p,V3.mul(t,.25+.5*clamp(Bp/Bm,0,1))),col,lw);}};
    if(s.mode==='wire'){const R=s.R*kk;S.tube([0,0,-1.7],[0,0,1.7],Math.max(.06,R*.5),T.cv);S.arrow([0,0,1.3],[0,0,2.2],T.cv,3.5,'I');
      [1,2,3].forEach(m=>ring(m*.7,-1.2,alpha(T.ca,.25),1));ring(s.r*kk,0,T.ink,2,[6,5]);if(Bp>0)tan(s.r*kk,0,T.ca,2.6);S.text([s.r*kk+.5,0,.4],'B',T.ca);}
    else if(s.mode==='sole'){const R=s.R*kk,pts=[];for(let i=0;i<=220;i++){const f=i/220,a=f*2*Math.PI*10;pts.push([R*Math.cos(a),R*Math.sin(a),-2+4*f]);}S.path(pts,T.cv,2.4);
      for(let i=-1;i<=1;i++)S.arrow([i*R*.45,0,-1.6],[i*R*.45,0,1.6],T.ca,2.6);S.text([0,0,2.4],'B inside, along the axis',T.ca);
      const px=s.r*kk;S.ball([px,0,0],.09,s.r<s.R?T.ca:T.muted,1,false);S.text([px,0,.4],s.r<s.R?'inside':'outside (B ≈ 0)',T.ink);}
    else{const a0=s.R*kk,c=(s.R+2)*kk,mr=2*kk;for(let k=0;k<26;k++){const f=k/26*2*Math.PI,pts=[];for(let i=0;i<=16;i++){const g=i/16*2*Math.PI;pts.push([(c+mr*Math.cos(g))*Math.cos(f),(c+mr*Math.cos(g))*Math.sin(f),mr*Math.sin(g)]);}S.path(pts,alpha(T.cv,.7),1.6);}
      const inside=s.r>s.R&&s.r<s.R+4;ring(s.r*kk,0,inside?T.ca:T.muted,2.2,[6,5]);if(inside)tan(s.r*kk,0,T.ca,2.6);S.text([0,0,mr+.6],inside?'B stays inside the doughnut':'outside: B = 0',T.ink);}}});


})();
Object.assign(TIPS,{"am-I":"The field is proportional to the enclosed current everywhere, so doubling I doubles the whole B(r) curve.","am-rad":"A bigger wire spreads the same current over more area. Outside the wire nothing changes; inside the field rises more slowly. For the solenoid, R only moves where the field drops to zero.","am-n":"More turns per meter packs more current around each length: the field inside the solenoid is μ₀nI. For the toroid, N is the total number of turns.","am-r":"Move the Amperian loop. In the thick wire, only the current inside the loop counts. Watch I_enc grow until the loop reaches the surface."});
Object.assign(KEYS,{"am-canvas":["Choose an arrangement, then move the loop radius r.",[["cv","current"],["ca","magnetic field B"],["ink","Amperian loop"],["hot","your point on the graph"]]]});
Object.assign(TT,{ampere:"Pick the loop so that B is constant and tangent along it (or zero). If you can't, use Biot–Savart. And count only the current that passes through your loop."});
PROBS.push(
 {id:'awire',topic:'ampere',title:'Field outside a long wire',gen(){const I=pick([5,10,20,50]),r=pick([2,5,10,20]),ans=MU0*I/(2*Math.PI*r*.01);
   return {q:`A long straight wire carries ${I} A. What is the magnetic field ${r} cm from it?`,ans,unit:'T',hint:'B = μ₀I/(2πr).',sol:`<span class="m"><i class="bf">B</i> = (4π × 10⁻⁷)(${I})/(2π × ${num(r/100)}) = <b>${sf(ans,'T')}</b></span>.`};}},
 {id:'ain',topic:'ampere',calc:1,title:'Inside a thick wire',gen(){const I=pick([8,12,20,30]),R=pick([2,3,4]),f=pick([.25,.5,.75]),r=R*f,ans=MU0*I*(r*.01)/(2*Math.PI*Math.pow(R*.01,2));
   return {q:`A long straight wire of radius ${R} cm carries ${I} A spread uniformly over its cross-section. What is the magnetic field at ${num(r)} cm from the axis (inside the wire)?`,ans,unit:'T',hint:'Enclosed current is I(r/R)². Then B = μ₀I_enc/(2πr), which simplifies to μ₀Ir/(2πR²).',sol:`<span class="m"><i class="bf">B</i> = μ<sub>0</sub><i class="cur">I</i><i>r</i>/(2π<i>R</i>²) = (4π × 10⁻⁷)(${I})(${sf(r/100,'',3)})/(2π(${num(R/100)})²) = <b>${sf(ans,'T')}</b></span>.`};}},
 {id:'asol',topic:'ampere',title:'Field inside a solenoid',gen(){const n=pick([200,500,1000,2000]),I=pick([.5,1,2,5]),ans=MU0*n*I;
   return {q:`A long solenoid has ${n} turns per meter and carries ${num(I)} A. What is the magnetic field inside it, far from the ends?`,ans,unit:'T',hint:'B = μ₀nI, where n is turns per meter.',sol:`<span class="m"><i class="bf">B</i> = μ<sub>0</sub><i>nI</i> = (4π × 10⁻⁷)(${n})(${num(I)}) = <b>${sf(ans,'T')}</b></span>.`};}},
 {id:'atoroid',topic:'ampere',title:'Field inside a toroid',gen(){const N=pick([200,500,800,1000]),I=pick([.5,1,2]),r=pick([4,6,8,10]),ans=MU0*N*I/(2*Math.PI*r*.01);
   return {q:`A toroid has ${N} turns and carries ${num(I)} A. What is the magnetic field inside it at a distance of ${r} cm from the center of the doughnut's hole?`,ans,unit:'T',hint:'B = μ₀NI/(2πr).',sol:`<span class="m"><i class="bf">B</i> = μ<sub>0</sub><i>NI</i>/(2π<i>r</i>) = (4π × 10⁻⁷)(${N})(${num(I)})/(2π × ${num(r/100)}) = <b>${sf(ans,'T')}</b></span>.`};}}
);
