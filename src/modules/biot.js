(function biot(){
  const cv=$('#bs-canvas');const s={mode:'loop',I:10,R:5,z:6,arc:360,L:20,a:6,n:12},U=.05;   // scene unit = 5 cm
  const MU=MU0;
  const HOME={loop:{yaw:-.8,pitch:.42,dist:5.6,target:[0,0,1.0]},wire:{yaw:-.6,pitch:.3,dist:8.5,target:[.9,0,0]}};
  function loopData(){const Rm=s.R*.01,zm=s.z*.01,al=s.arc*Math.PI/180,n=s.n,sl=[];let Bx=0,By=0,Bz=0;const r=Math.hypot(Rm,zm),dl=Rm*al/n;
    for(let k=0;k<n;k++){const ph=(k+.5)/n*al,c=Math.cos(ph),sn=Math.sin(ph),f=MU*s.I/(4*Math.PI)*dl/(r*r*r);Bx+=f*zm*c;By+=f*zm*sn;Bz+=f*Rm;sl.push({ph,c,sn});}
    return {sl,Bx,By,Bz,r,exact:MU*s.I*Rm*Rm/(2*Math.pow(r,3)),center:MU*s.I/(2*Rm)};}
  function wireData(){const L=s.L*.01,a=s.a*.01,n=s.n,sl=[];let B=0;const dz=L/n;for(let k=0;k<n;k++){const zp=-L/2+(k+.5)*dz,r=Math.hypot(a,zp),d=MU*s.I/(4*Math.PI)*dz*a/(r*r*r);B+=d;sl.push({zp,d});}
    return {sl,B,exact:MU*s.I*L/(4*Math.PI*a*Math.sqrt(L*L/4+a*a)),inf:MU*s.I/(2*Math.PI*a)};}
  const v3=view3d(cv,{...HOME.loop,min:4,max:24,height:w=>clamp(w*.62,330,480),scene:S=>{
    S.grid(-4,4,-4,4,1);
    if(s.mode==='loop'){const D=loopData(),R=s.R*U,z=s.z*U,P=[0,0,z],al=s.arc*Math.PI/180;
      const ring=[];for(let i=0;i<=72;i++){const a=i/72*Math.PI*2;ring.push([R*Math.cos(a),R*Math.sin(a),0]);}S.path(ring,alpha(T.muted,.5),1.2,[4,4]);
      const arc=[];for(let i=0;i<=72;i++){const a=i/72*al;arc.push([R*Math.cos(a),R*Math.sin(a),0]);}S.path(arc,T.cv,5);
      D.sl.forEach((q,k)=>{const sp=[R*q.c,R*q.sn,0];S.line(sp,P,alpha(T.muted,.35),1,[2,3]);const dir=V3.norm([z*q.c,z*q.sn,R]);if(s.n<=24||k%2===0)S.arrow(P,V3.add(P,V3.mul(dir,.85)),alpha(T.ca,.55),1.8);});
      if(al>.01){const m=al*.5,sp=[R*Math.cos(m+.0),R*Math.sin(m),0],tg=[-Math.sin(m),Math.cos(m),0];S.arrow(V3.add(sp,V3.mul(tg,-.3)),V3.add(sp,V3.mul(tg,.3)),T.cv,3,'I');}
      S.ball(P,.1,T.ink,1,false);S.text(V3.add(P,[0,0,.3]),'P',T.ink);
      const Bt=[D.Bx,D.By,D.Bz],bm=Math.hypot(...Bt),L=.6+2*bm/Math.max(1e-12,D.center);S.arrow(P,V3.add(P,V3.mul(Bt,L/bm)),T.ca,4,'B (sum)');
      S.line([0,0,-.2],[0,0,z+.2],alpha(T.muted,.6),1);}
    else{const D=wireData(),L=s.L*U,a=s.a*U,P=[a,0,0];S.line([0,0,-L/2],[0,0,L/2],alpha(T.ink,.7),6);
      const nA=s.n,dz=L/nA;for(let k=0;k<nA;k++){const z0=-L/2+k*dz;S.line([0,0,z0+dz*.1],[0,0,z0+dz*.9],k%2?T.cv:alpha(T.cv,.6),7);}
      S.arrow([0,0,L/2-.5],[0,0,L/2+.6],T.cv,3,'I');
      D.sl.forEach(q=>S.line([0,0,q.zp*100*U],P,alpha(T.muted,.35),1,[2,3]));
      const scale=2.6/D.inf;let acc=0;D.sl.forEach((q,k)=>{const y0=acc*scale,y1=(acc+q.d)*scale;S.arrow([a,y0,0],[a,y1,0],k%2?T.ca:alpha(T.ca,.6),2.4);acc+=q.d;});
      S.ball(P,.1,T.ink,1,false);S.text([a,0,.35],'P',T.ink);S.text([a,acc*scale+.35,0],'B',T.ca);}}});
  function update(){const l=(id,t)=>{$('#'+id).previousElementSibling.textContent=t;};
    if(s.mode==='loop'){const D=loopData();l('bs-r1','Axial field B_z (sum of slices)');l('bs-r2','Sideways field B_⊥ (sum of slices)');l('bs-r3','Exact full-loop field at P');l('bs-r4','Field at the center of the loop');
      setText('bs-r1',sf(D.Bz,'T'));setText('bs-r2',Math.hypot(D.Bx,D.By)<1e-3*D.Bz?'0 (cancels)':sf(Math.hypot(D.Bx,D.By),'T'));setText('bs-r3',sf(D.exact,'T'));setText('bs-r4',sf(D.center,'T'));}
    else{const D=wireData();l('bs-r1','Sum of the slices');l('bs-r2','Exact for this finite wire');l('bs-r3','Infinite wire μ₀I/(2πa)');l('bs-r4','Finite ÷ infinite');
      setText('bs-r1',sf(D.B,'T'));setText('bs-r2',sf(D.exact,'T'));setText('bs-r3',sf(D.inf,'T'));setText('bs-r4',fmt(100*D.exact/D.inf,1)+' %');}
    v3.render();}
  drawers.biot=update;
  segBind('bs-mode','k',k=>{s.mode=k;$('#bs-l-ctl').hidden=k!=='loop';$('#bs-w-ctl').hidden=k==='loop';v3.setHome(HOME[k]);update();});
  bindRange('bs-I',x=>x+' A',x=>{s.I=x;update();});bindRange('bs-n',x=>String(x),x=>{s.n=x;update();});
  bindRange('bs-R',x=>fmt(x,1)+' cm',x=>{s.R=x;update();});bindRange('bs-z',x=>fmt(x,1)+' cm',x=>{s.z=x;update();});bindRange('bs-arc',x=>x+'°',x=>{s.arc=x;update();});
  bindRange('bs-L',x=>x+' cm',x=>{s.L=x;update();});bindRange('bs-a',x=>x+' cm',x=>{s.a=x;update();});
  update();
})();
Object.assign(TIPS,{"bs-I":"The field is proportional to the current. Every dB doubles when I doubles.","bs-n":"More slices means each one is closer to a true infinitesimal piece. For the loop the axial sum is exact for any number of slices (they are all the same distance from P); for the wire the sum converges to the integral.","bs-R":"A larger loop spreads the same current over a longer path, so the field at the center drops as 1/R.","bs-z":"Move P away from the loop along the axis. The field falls off, eventually as 1/z³ like a magnetic dipole.","bs-arc":"Fewer slices around the loop means less cancellation of the sideways components, so the field tilts. Symmetry made the full-loop answer easy.","bs-L":"A long wire's field levels off at the infinite-wire value μ₀I/2πa, because distant pieces contribute very little.","bs-a":"Close to the wire, the field is close to that of an infinite wire; far away, the wire looks like a short segment and the field falls faster."});
Object.assign(KEYS,{"bs-canvas":["Pick a loop or a wire. Drag the picture to rotate it. Change the sliders.",[["cv","current"],["ca","field made by each slice"],["ink","the point P"]]]});
Object.assign(TT,{biot:"Biot–Savart is the always-works method; Ampère's law is the symmetric shortcut. If the current has no obvious symmetry, slice it and use dB = (μ₀/4π) I dl × r̂/r²."});
PROBS.push(
 {id:'bcenter',topic:'biot',title:'Field at the center of a coil',gen(){const N=pick([1,5,10,20]),I=pick([1,2,5,10]),R=pick([2,5,8,10]),ans=MU0*N*I/(2*R*.01);
   return {q:`A circular coil of ${N} turn${N>1?'s':''} and radius ${R} cm carries ${I} A. What is the magnetic field at its center?`,ans,unit:'T',hint:'B = μ₀NI/(2R). Convert cm to m.',sol:`<span class="m"><i class="bf">B</i> = μ<sub>0</sub><i>NI</i>/(2<i>R</i>) = (4π × 10⁻⁷)(${N})(${I})/(2 × ${num(R/100)}) = <b>${sf(ans,'T')}</b></span>.`};}},
 {id:'baxis',topic:'biot',calc:1,title:'Field on the axis of a loop',gen(){const I=pick([2,5,10]),R=pick([3,5,8]),z=pick([4,6,10,12]),ans=MU0*I*Math.pow(R*.01,2)/(2*Math.pow(Math.pow(R*.01,2)+Math.pow(z*.01,2),1.5));
   return {q:`A single circular loop of radius ${R} cm carries ${I} A. What is the magnetic field on its axis, ${z} cm from the center?`,ans,unit:'T',hint:'B = μ₀IR²/(2(R² + z²)^(3/2)).',sol:`<span class="m"><i class="bf">B</i> = (4π × 10⁻⁷)(${I})(${num(R/100)})²/(2(${sf((R*R+z*z)/1e4,'',3)})<sup>3/2</sup>) = <b>${sf(ans,'T')}</b></span>.`};}},
 {id:'barc',topic:'biot',title:'Field at the center of an arc',gen(){const th=pick([60,90,120,180,270]),I=pick([2,5,10]),R=pick([4,6,10]),ans=MU0*I*(th*Math.PI/180)/(4*Math.PI*R*.01);
   return {q:`A wire is bent into a circular arc of radius ${R} cm that spans ${th}°, and carries ${I} A. What is the magnetic field at the center of the arc? (The straight lead wires are along radial lines and make no contribution.)`,ans,unit:'T',hint:'B = μ₀Iθ/(4πR), with θ in radians. A full circle (2π) gives μ₀I/2R.',sol:`<span class="m"><i class="bf">B</i> = μ<sub>0</sub><i class="cur">I</i>θ/(4π<i>R</i>) = (10⁻⁷)(${I})(${fmt(th*Math.PI/180,4)})/${num(R/100)} = <b>${sf(ans,'T')}</b></span>.`};}},
 {id:'bparallel',topic:'biot',title:'Force between parallel wires',gen(){const I1=pick([5,10,20,50]),I2=pick([5,10,30]),d=pick([2,5,10]),ans=MU0*I1*I2/(2*Math.PI*d*.01);
   return {q:`Two long parallel wires ${d} cm apart carry ${I1} A and ${I2} A in the same direction. What is the magnitude of the force per meter of length between them?`,ans,unit:'N/m',hint:'F/L = μ₀I₁I₂/(2πd).',sol:`<span class="m"><i>F</i>/<i>L</i> = (4π × 10⁻⁷)(${I1})(${I2})/(2π × ${num(d/100)}) = <b>${sf(ans,'N/m')}</b></span>; same-direction currents attract.`};}}
);
PROBS.push(
 {id:'bmoving',topic:'biot',title:'Field of a moving charge',gen(){const q=pick([1,2,5]),v=pick([1e5,1e6,3e6]),r=pick([.01,.02,.05]),ans=1e-7*q*1e-6*v/(r*r);
   return {q:`A ${q} μC point charge moves at ${sf(v,'m/s',2)}. What is the magnitude of the magnetic field it makes at a point ${num(r*100)} cm away, in the direction perpendicular to its velocity?`,ans,unit:'T',hint:'B = (μ₀/4π) q v sin θ / r², with sin θ = 1 for a point on the perpendicular. μ₀/4π = 10⁻⁷ T·m/A.',
   sol:`<span class="m"><i class="bf">B</i> = (10⁻⁷)(${q} × 10⁻⁶)(${sf(v,'',2)})/(${num(r)})² = <b>${sf(ans,'T')}</b></span>.`};}}
);
