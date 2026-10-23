(function gauss(){
  const cv=$('#gs-canvas');const s={mode:'flux',R:7,q:[3,-2,2],obj:'solid',pR:5,pQ:5,pr:8};
  const P=[{x:16,y:13},{x:24,y:15},{x:33,y:8}],CEN={x:20,y:13};let geo=null;
  const C=()=>P.map((p,i)=>({x:p.x,y:p.y,q:s.q[i]}));
  function measured(){const R=s.R*.01,ch=C(),nt=48,np=96;let sum=0;
    for(let i=0;i<nt;i++){const th=(i+.5)/nt*Math.PI,st=Math.sin(th),ct=Math.cos(th);
      for(let j=0;j<np;j++){const ph=(j+.5)/np*2*Math.PI,nx=st*Math.cos(ph),ny=st*Math.sin(ph),nz=ct,px=CEN.x*.01+R*nx,py=CEN.y*.01+R*ny,pz=R*nz;let ex=0,ey=0,ez=0;
        ch.forEach(c=>{if(!c.q)return;const dx=px-c.x*.01,dy=py-c.y*.01,d2=dx*dx+dy*dy+pz*pz,k=KC*c.q*1e-9/(d2*Math.sqrt(d2));ex+=k*dx;ey+=k*dy;ez+=k*pz;});
        sum+=(ex*nx+ey*ny+ez*nz)*R*R*st*(Math.PI/nt)*(2*Math.PI/np);}}return sum;}
  const prof=r=>{const Q=s.pQ*1e-9,R=s.pR*.01,x=r*.01;
    if(s.obj==='solid')return x<R?KC*Q*x/R**3:KC*Q/(x*x);
    if(s.obj==='shell')return x<R?0:KC*Q/(x*x);
    return x<R?2*KC*Q*x/(R*R):2*KC*Q/x;};
  function drawFlux(ctx,w,h){const sc=Math.min(w/42,h/28),ox=w/2,oy=h/2,X=x=>ox+(x-20)*sc,Y=y=>oy-(y-13)*sc;geo={sc,ox,oy,w,h};
    ctx.strokeStyle=T.grid;ctx.lineWidth=1;for(let g=0;g<=40;g+=4){ctx.beginPath();ctx.moveTo(Math.round(X(g))+.5,Y(26));ctx.lineTo(Math.round(X(g))+.5,Y(0));ctx.stroke();}for(let g=0;g<=26;g+=4){ctx.beginPath();ctx.moveTo(X(0),Math.round(Y(g))+.5);ctx.lineTo(X(40),Math.round(Y(g))+.5);ctx.stroke();}
    const ch=C();strokeLines(ctx,fieldLines(ch,{per:3,step:.35,r0:.9,stop:1,bounds:[-2,-2,42,28]}),X,Y,T.cx);
    ctx.save();ctx.fillStyle=alpha(T.hot,.08);ctx.strokeStyle=T.hot;ctx.lineWidth=2.5;ctx.setLineDash([8,5]);ctx.beginPath();ctx.arc(X(CEN.x),Y(CEN.y),s.R*sc,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    label(ctx,'Gaussian sphere (cross-section)',X(CEN.x),Y(CEN.y)-s.R*sc-10,T.hot,'center','middle',MONO);
    let enc=0,near=false;ch.forEach((c,i)=>{const d=Math.hypot(c.x-CEN.x,c.y-CEN.y);if(c.q&&Math.abs(d-s.R)<1.3)near=true;const inside=d<s.R;if(inside)enc+=c.q;
      chargeDot(ctx,X(c.x),Y(c.y),c.q,13);label(ctx,(c.q>0?'+':c.q<0?'−':'')+Math.abs(c.q)+' nC',X(c.x),Y(c.y)+25,c.q>0?T.pos:c.q<0?T.neg:T.muted,'center','middle',MONO);if(c.q)label(ctx,inside?'inside':'outside',X(c.x),Y(c.y)-22,inside?T.hot:T.muted,'center','middle',MONO);});
    const pred=enc*1e-9/EPS0;setText('gs-r1',(enc>0?'+':enc<0?'−':'')+Math.abs(enc)+' nC enclosed');setText('gs-r2',sf(pred,'N·m²/C'));
    if(near){setText('gs-r3','— (a charge sits on the surface)');setText('gs-r4','Move the surface off the charge');}
    else{const m=measured();setText('gs-r3',sf(m,'N·m²/C'));setText('gs-r4',Math.abs(m-pred)<=.01*Math.abs(pred)+.5?'✓ they match':'check numerics');}}
  function drawProf(ctx,w,h){let Emax=0;for(let r=.2;r<=30;r+=.2)Emax=Math.max(Emax,prof(r));
    const P2=panel(ctx,{x:56,y:16,w:w-76,h:h-52},[0,30],[0,Emax*1.2||1],{ylabel:'E (N/C)',color:T.cx,xlabel:'r (cm)',yn:4,xn:6});
    line(ctx,P2,s.pR,0,s.pR,Emax*1.2,alpha(T.muted,.7),1.2,[4,4]);label(ctx,'R',P2.X(s.pR)+4,P2.Y(Emax*1.1),T.muted,'left','middle',MONO);
    curve(ctx,P2,prof,.2,30,T.cx,2.75,300);const E=prof(s.pr);line(ctx,P2,s.pr,0,s.pr,E,T.hot,1.5,[2,3]);dot(ctx,P2.X(s.pr),P2.Y(E),6,T.hot,T.surface);
    const inside=s.pr<s.pR;let frac;if(s.obj==='solid')frac=inside?(s.pr/s.pR)**3:1;else if(s.obj==='shell')frac=inside?0:1;else frac=inside?(s.pr/s.pR)**2:1;
    setText('gs-r1',sf(E,'N/C'));setText('gs-r2',s.obj==='rod'?'E · (2πrℓ) over a cylinder':'E · 4πr² = '+sf(E*4*Math.PI*(s.pr*.01)**2,'N·m²/C'));
    setText('gs-r3',(s.obj==='rod'?'λ_enc = ':'q_enc = ')+fmt(frac*s.pQ,2)+(s.obj==='rod'?' nC/m':' nC')+' ('+fmt(frac*100,0)+'% of the total)');setText('gs-r4',inside?'inside the object (r < R)':'outside (r > R)');}
  function draw(){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.58,300,440));const c=prep(cv,h);if(!c)return;
    if(s.mode==='flux')drawFlux(c.ctx,w,h);else drawProf(c.ctx,w,h);}
  function relabel(){const f=s.mode==='flux',l=(id,t)=>{$('#'+id).previousElementSibling.textContent=t;};
    if(f){l('gs-r1','Enclosed charge');l('gs-r2','Predicted flux q_enc/ε₀');l('gs-r3','Measured flux ∮E·n̂ dA');l('gs-r4','Result');}
    else{l('gs-r1','E at r');l('gs-r2','E × area of the Gaussian surface');l('gs-r3','Charge enclosed at r');l('gs-r4','Where you are');}}
  drawers.gauss=()=>{draw();v3&&v3.render();};
  dragPoints(cv,()=>geo&&s.mode==='flux'?P.map(p=>[geo.ox+(p.x-20)*geo.sc,geo.oy-(p.y-13)*geo.sc]):[],(k,x,y,ph)=>{if(ph!=='move'||!geo)return;P[k]={x:clamp((x-geo.ox)/geo.sc+20,1.5,38.5),y:clamp(13-(y-geo.oy)/geo.sc,1.5,24.5)};draw();});
  segBind('gs-mode','k',k=>{s.mode=k;$('#gs-flux-ctl').hidden=k!=='flux';$('#gs-prof-ctl').hidden=k==='flux';relabel();draw();});
  segBind('gs-obj','k',k=>{s.obj=k;$('#gs-pQ-lbl').textContent=k==='rod'?'Charge per length λ':'Total charge Q';draw();});
  const qf=x=>(x>0?'+':x<0?'−':'')+Math.abs(x)+' nC';
  bindRange('gs-R',x=>fmt(x,1)+' cm',x=>{s.R=x;draw();});[1,2,3].forEach(k=>bindRange('gs-q'+k,qf,x=>{s.q[k-1]=x;draw();}));
  bindRange('gs-prad',x=>fmt(x,1)+' cm',x=>{s.pR=x;draw();});bindRange('gs-pQ',x=>x+(s.obj==='rod'?' nC/m':' nC'),x=>{s.pQ=x;draw();});bindRange('gs-pr',x=>fmt(x,1)+' cm',x=>{s.pr=x;draw();});
  relabel();  let v3=null;
  v3=view3d($('#gs3-canvas'),{yaw:-.8,pitch:.45,dist:5.8,target:[0,0,0],min:3,max:20,height:w=>clamp(w*.5,280,430),scene:S=>{
    const k=.2,C=P.map((p,i)=>({x:(p.x-CEN.x)*k,y:(p.y-CEN.y)*k,q:s.q[i]})),R=s.R*k;S.grid(-5,5,-4,4,1);
    for(let a=0;a<6;a++){const th=a/6*Math.PI,pts=[];for(let i=0;i<=48;i++){const f=i/48*2*Math.PI;pts.push([R*Math.cos(f)*Math.cos(th),R*Math.cos(f)*Math.sin(th),R*Math.sin(f)]);}S.path(pts,alpha(T.hot,.5),1.2);}
    for(let b=-2;b<=2;b++){const z=b*R/3,rr=Math.sqrt(Math.max(0,R*R-z*z)),pts=[];for(let i=0;i<=48;i++){const f=i/48*2*Math.PI;pts.push([rr*Math.cos(f),rr*Math.sin(f),z]);}S.path(pts,alpha(T.hot,.35),1);}
    const E3=(x,y,z)=>{let ex=0,ey=0,ez=0;C.forEach(c=>{if(!c.q)return;const dx=x-c.x,dy=y-c.y,dz=z,r2=dx*dx+dy*dy+dz*dz+1e-4,kk=c.q/(r2*Math.sqrt(r2));ex+=kk*dx;ey+=kk*dy;ez+=kk*dz;});return [ex,ey,ez];};
    const n=44,pts=[];let mx=1e-9;for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*2.399963,nv=[r*Math.cos(a),r*Math.sin(a),y],p=V3.mul(nv,R),e=E3(p[0],p[1],p[2]);mx=Math.max(mx,Math.log10(1+Math.hypot(e[0],e[1],e[2])*30));pts.push({p,nv,e});}
    pts.forEach(o=>{const m=Math.hypot(o.e[0],o.e[1],o.e[2]);if(m<1e-6)return;const en=V3.dot(o.e,o.nv),L=.25+.6*Math.log10(1+m*30)/mx;S.arrow(o.p,V3.add(o.p,V3.mul(o.e,L/m)),en>0?T.hot:T.ca,2.2);});
    C.forEach(c=>{if(!c.q)return;S.ball([c.x,c.y,0],.14,c.q>0?T.pos:T.neg,1,true);});}});


})();
Object.assign(TIPS,{"gs-R":"Growing the sphere swallows more charges. Watch the enclosed charge and the flux jump each time a charge crosses the surface, and change by nothing in between.","gs-q1":"Changing a charge inside changes the flux. Changing a charge outside never does.","gs-q2":"Set this charge to the opposite of charge 1 with both inside: the flux becomes zero.","gs-q3":"Charge 3 starts outside the sphere. Its field lines pass in one side and out the other, adding nothing to the net flux.","gs-pr":"Move r across R. Inside a solid sphere E grows with r; outside it falls as 1/r². Inside a thin shell E is zero.","gs-pQ":"The whole curve scales with the charge.","gs-prad":"A bigger object with the same charge has a weaker field at its surface."});
Object.assign(KEYS,{"gs-canvas":["Drag the charges, or change the sphere radius. Switch modes to see the symmetric cases.",[["hot","Gaussian surface"],["cx","field lines"],["pos","positive charge"],["neg","negative charge"]]]});
Object.assign(TT,{gauss:"Choose the Gaussian surface first: it must be closed, pass through the point you want, and match the symmetry so that E is constant (or zero) on every piece of it."});
PROBS.push(
 {id:'gflux',topic:'gauss',title:'Flux through a closed surface',gen(){const a=pick([2,4,6,8]),b=pick([1,3,5]),c=pick([2,5,9]),ans=(a-b)*1e-9/EPS0;
   return {q:`A closed surface encloses a +${a} nC charge and a −${b} nC charge. A third charge of +${c} nC lies outside it. What is the net electric flux through the surface? (Use ε₀ = 8.85 × 10⁻¹² C²/(N·m²).)`,ans,unit:'N·m²/C',hint:'Only enclosed charge counts: Φ = q_enc/ε₀.',
   sol:`<span class="m">Φ = (${a} − ${b}) × 10⁻⁹/(8.85 × 10⁻¹²) = <b>${sf(ans,'N·m²/C')}</b></span>. The outside charge contributes nothing to the net flux.`};}},
 {id:'gsph',topic:'gauss',calc:1,title:'Inside a uniformly charged sphere',gen(){const Q=pick([4,8,12,20]),R=pick([4,5,8,10]),f=pick([.3,.4,.5,.6,.8]),r=R*f,ans=KC*Q*1e-9*(r*.01)/Math.pow(R*.01,3);
   return {q:`A solid insulating sphere of radius ${R} cm carries a uniformly distributed charge of ${Q} nC. What is the electric field at ${num(r)} cm from the center?`,ans,unit:'N/C',hint:'Only the charge inside radius r counts, and it is Q(r/R)³. Then E = kq_enc/r².',
   sol:`<span class="m"><i class="ef">E</i> = <i>kQr</i>/<i>R</i>³ = (8.99 × 10⁹)(${Q} × 10⁻⁹)(${num(r/100)})/(${num(R/100)})³ = <b>${sf(ans,'N/C')}</b></span>, pointing outward.`};}},
 {id:'gout',topic:'gauss',title:'Outside a charged sphere',gen(){const Q=pick([4,8,12,20]),R=pick([2,4,5]),r=pick([10,15,20,30]),ans=KC*Q*1e-9/Math.pow(r*.01,2);
   return {q:`A conducting sphere of radius ${R} cm carries a total charge of +${Q} nC. What is the electric field ${r} cm from its center?`,ans,unit:'N/C',hint:'Outside a spherical charge the field is the same as for a point charge at the center.',
   sol:`<span class="m"><i class="ef">E</i> = <i>kQ</i>/<i>r</i>² = (8.99 × 10⁹)(${Q} × 10⁻⁹)/(${num(r/100)})² = <b>${sf(ans,'N/C')}</b></span>.`};}},
 {id:'gline',topic:'gauss',title:'Field of a long line of charge',gen(){const lam=pick([2,4,6,10,20]),r=pick([2,5,10,20]),ans=2*KC*lam*1e-9/(r*.01);
   return {q:`A very long straight wire carries a uniform charge of +${lam} nC per meter. What is the field ${r} cm from the wire (far from its ends)?`,ans,unit:'N/C',hint:'Use a coaxial cylinder: E(2πrℓ) = λℓ/ε₀, so E = λ/(2πε₀r) = 2kλ/r.',
   sol:`<span class="m"><i class="ef">E</i> = 2<i>kλ</i>/<i>r</i> = 2(8.99 × 10⁹)(${lam} × 10⁻⁹)/(${num(r/100)}) = <b>${sf(ans,'N/C')}</b></span>, pointing away from the wire.`};}}
);
