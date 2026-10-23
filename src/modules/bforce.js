(function bforce(){
  const SP={e:{q:-1,m:ME},p:{q:1,m:1.67e-27},a:{q:2,m:6.64e-27}};const s={sp:'e',v:5,ang:60,B:2,view:'3d'};const cv=$('#bf-canvas');
  const calc=(o={})=>{const p=SP[o.sp||s.sp],v=(o.v||s.v)*1e6,th=(o.ang||s.ang)*Math.PI/180,B=(o.B||s.B)*1e-3,q=Math.abs(p.q)*QE,vp=v*Math.sin(th),vz=v*Math.cos(th);return {r:p.m*vp/(q*B),T:2*Math.PI*p.m/(q*B),pitch:vz*2*Math.PI*p.m/(q*B),F:q*vp*B,w:q*B/p.m,vz,dir:p.q>0?-1:1};};
  const ref=sp=>calc({sp,v:5,ang:60,B:2});
  const HOME={'3d':{yaw:-.9,pitch:.45,dist:8.5,target:[1.2,0,1.5]},top:{yaw:-1.5708,pitch:1.45,dist:8,target:[1.2,0,0]},side:{yaw:-1.5708,pitch:.04,dist:9,target:[1.2,0,1.5]}};
  const v3=view3d(cv,{...HOME['3d'],min:4,max:25,height:w=>clamp(w*.62,320,480),scene:(S,tt)=>{
    const c=calc(),r0=ref(s.sp),U=1.25/r0.r,R=c.r*U,TW=2.5,wv=c.w*r0.T/TW*1,vzv=c.vz*U*r0.T/TW,Tw=c.T*TW/r0.T,Tc=vzv>1e-6?Math.min(4.8/vzv,10*Tw):10*Tw,tau=tt==null?Tc*.6:(tt%Tc),dir=c.dir;
    S.grid(-3,5,-3.5,3.5,1);
    for(let i=-2;i<=3;i+=1.25)for(let j=-2.5;j<=2.6;j+=1.25){S.arrow([i,j,-.1],[i,j,.9],alpha(T.ca,.5),1.6);}
    S.arrow([4.2,2.6,0],[4.2,2.6,1.6],T.ca,3,'B');
    const pos=u=>{const th=Math.PI+dir*wv*u;return [R+R*Math.cos(th),R*Math.sin(th),vzv*u];};
    const trail=[];for(let u=Math.max(0,tau-Tw*3.2);u<=tau;u+=Tw/60)trail.push(pos(u));if(trail.length>1)S.path(trail,alpha(SP[s.sp].q>0?T.pos:T.neg,.75),2.2);
    const p=pos(tau),th=Math.PI+dir*wv*tau,vdir=V3.norm([-Math.sin(th)*dir,Math.cos(th)*dir,c.vz/Math.max(1e-9,calc().r*c.w)]),fdir=[-Math.cos(th),-Math.sin(th),0];
    S.ball(p,.14,SP[s.sp].q>0?T.pos:T.neg,1,true);
    S.arrow(p,V3.add(p,V3.mul(vdir,1.5)),T.cv,3,'v');S.arrow(p,V3.add(p,V3.mul(fdir,1.1)),T.hot,3,'F');
    S.line([R,0,0],[R,0,Math.max(.05,p[2])],alpha(T.muted,.5),1,[3,4]);}});
  const wrap=cv.closest('.v3');
  function update(){const c=calc();setText('bf-r',sf(c.r,'m'));setText('bf-T',sf(c.T,'s'));setText('bf-p',sf(Math.abs(c.pitch),'m'));setText('bf-F',sf(c.F,'N'));setText('bf-dir',c.dir>0?'counterclockwise':'clockwise');v3.render();}
  drawers.bforce=()=>{update();vs.draw();};
  segBind('bf-sp','k',k=>{s.sp=k;update();});segBind('bf-view','k',k=>{s.view=k;v3.setHome(HOME[k]);});
  bindRange('bf-v',x=>fmt(x,1)+' × 10⁶ m/s',x=>{s.v=x;update();});bindRange('bf-ang',x=>x+'°',x=>{s.ang=x;update();});bindRange('bf-B',x=>fmt(x,1)+' mT',x=>{s.B=x;update();});
  // ---------- velocity selector
  const vs={v:100,E:5,B:.05,pts:[],t0:0};
  vs.sim=function(){const q=QE,m=1.67e-27,E=vs.E*1e3,B=vs.B,v0=vs.v*1e3,f=(st)=>[st[2],st[3],(q/m)*(-B*st[3]),(q/m)*(-E+B*st[2])];let st=[0,0,v0,0];const dt=2e-9,pts=[[0,0,0]];
    for(let i=0;i<60000;i++){const k1=f(st),k2=f(st.map((x,j)=>x+k1[j]*dt/2)),k3=f(st.map((x,j)=>x+k2[j]*dt/2)),k4=f(st.map((x,j)=>x+k3[j]*dt));st=st.map((x,j)=>x+dt/6*(k1[j]+2*k2[j]+2*k3[j]+k4[j]));pts.push([st[0],st[1],(i+1)*dt]);if(st[0]>.2||Math.abs(st[1])>.05)break;}
    vs.pts=pts;vs.t0=performance.now();};
  vs.draw=function(ts){const c=$('#vs-canvas');const w=c.clientWidth;if(!w)return;const h=300,ctx=prep(c,h).ctx,sc=(w-150)/.2,x0=74,yc=h/2,X=x=>x0+x*sc,Y=y=>yc-y*sc;
    const Wd=.2*sc,Ht=.1*sc;ctx.fillStyle=alpha(T.ca,.06);ctx.fillRect(X(0),Y(.05),Wd,Ht);ctx.fillStyle=T.pos;ctx.fillRect(X(0),Y(.05)-6,Wd,6);ctx.fillStyle=T.neg;ctx.fillRect(X(0),Y(-.05),Wd,6);
    label(ctx,'+',X(.1),Y(.05)-16,T.pos,'center','middle','700 16px "IBM Plex Sans", system-ui, sans-serif');label(ctx,'−',X(.1),Y(-.05)+22,T.neg,'center','middle','700 16px "IBM Plex Sans", system-ui, sans-serif');
    for(let i=0;i<9;i++)for(let j=0;j<4;j++){label(ctx,'×',X(.012+i*.0225),Y(.037-j*.025),alpha(T.ca,.7),'center','middle','600 16px "IBM Plex Sans", system-ui, sans-serif');}
    for(let i=0;i<4;i++){const x=X(.03+i*.05);arrow(ctx,x,Y(.042),x,Y(.034)+14,alpha(T.cx,.45),1.5);}
    ctx.strokeStyle=T.line;ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(X(0),Y(0));ctx.lineTo(X(.2),Y(0));ctx.stroke();ctx.setLineDash([]);
    const P=vs.pts;ctx.strokeStyle=alpha(T.pos,.7);ctx.lineWidth=2.5;ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(X(p[0]),Y(p[1])):ctx.moveTo(X(p[0]),Y(p[1])));ctx.stroke();
    const tEnd=P[P.length-1][2],el=REDUCE?1e9:((performance.now()-vs.t0)/1000)%(2.2+1)/2.2*tEnd,k=Math.min(P.length-1,Math.max(0,P.findIndex(p=>p[2]>=el)));const pp=P[k<0?P.length-1:k];if(pp)chargeDot(ctx,X(pp[0]),Y(pp[1]),1,9);
    label(ctx,'E (down)',X(.2)+6,Y(.03),T.cx,'left','middle',MONO);label(ctx,'B in (×)',X(.2)+6,Y(0),T.ca,'left','middle',MONO);label(ctx,'proton enters',X(0)-6,Y(0)-18,T.muted,'right','middle',MONO);
    const E=vs.E*1e3,B=vs.B,v=vs.v*1e3,sel=E/B;setText('vs-sel',sf(sel/1e3,'km/s'));setText('vs-fe',sf(QE*E,'N'));setText('vs-fb',sf(QE*v*B,'N'));
    setText('vs-res',Math.abs(v-sel)<.015*sel?'goes straight ✓':v<sel?'curves down (E wins)':'curves up (B wins)');};
  ticker('bforce',()=>vs.draw());
  const re=()=>{vs.sim();vs.draw();};bindRange('vs-v',x=>x+' km/s',x=>{vs.v=x;re();});bindRange('vs-E',x=>fmt(x,1)+' kV/m',x=>{vs.E=x;re();});bindRange('vs-B',x=>fmt(x,3)+' T',x=>{vs.B=x;re();});
  vs.sim();update();
})();
Object.assign(TIPS,{"bf-v":"A faster particle (same angle) makes a bigger circle (r ∝ v), but it takes the same time per loop, since the period doesn't depend on speed.","bf-ang":"Only v sin θ circles. Lower angles mean a smaller circle and more drift along B. At 90° it is a flat circle; at 0° there is no force at all.","bf-B":"A stronger field bends the path more: the radius and the period both fall as 1/B.","vs-v":"Tune the speed to E/B and the two forces cancel. This selects one speed out of a mixture of particles.","vs-E":"A stronger electric field pushes harder, so you need a higher speed (larger magnetic force) to balance it: v = E/B.","vs-B":"A stronger magnetic field makes the selected speed E/B smaller."});
Object.assign(KEYS,{"bf-canvas":["Pick a particle and change speed, angle and field. Drag the picture to rotate it.",[["ca","magnetic field B"],["cv","velocity v"],["hot","magnetic force F"]]],"vs-canvas":["Change the speed and the two fields. Find the speed where the proton goes straight.",[["cx","electric field"],["ca","magnetic field (into the page)"],["pos","proton path"]]]});
Object.assign(TT,{bforce:"Use the right-hand rule for positive charges, then flip it for electrons. And remember the magnetic force does no work: speed stays constant, only direction changes."});
PROBS.push(
 {id:'bradius',topic:'bforce',title:'Radius of a circular path',gen(){const sp=pick([['electron',ME,'9.11 × 10⁻³¹'],['proton',1.67e-27,'1.67 × 10⁻²⁷']]),v=sp[0]==='electron'?pick([1e6,2e6,5e6,1e7]):pick([1e5,2e5,5e5,1e6]),B=pick([.001,.002,.005,.01,.05]),ans=sp[1]*v/(QE*B);
   return {q:`${sp[0]==='electron'?'An':'A'} ${sp[0]} moves at ${sf(v,'m/s',2)} perpendicular to a uniform magnetic field of ${num(B*1000)} mT. What is the radius of its circular path? (${sp[0]==='electron'?'m = 9.11 × 10⁻³¹ kg':'m = 1.67 × 10⁻²⁷ kg'}, |q| = 1.6 × 10⁻¹⁹ C.)`,ans,unit:'m',hint:'qvB = mv²/r, so r = mv/(qB). Convert mT to T.',
   sol:`<span class="m"><i>r</i> = <i>mv</i>/(<i>eB</i>) = (${sp[2]})(${sf(v,'',2)})/((1.6 × 10⁻¹⁹)(${num(B)})) = <b>${sf(ans,'m')}</b></span>.`};}},
 {id:'bforcep',topic:'bforce',title:'Magnetic force on a moving charge',gen(){const q=pick([1,2,3,5]),v=pick([2,5,10,20]),B=pick([.2,.5,1,2]),th=pick([30,45,60,90]),ans=q*1e-6*v*1e3*B*Math.sin(th*Math.PI/180);
   return {q:`A ${q} μC charge moves at ${v} km/s through a ${num(B)} T magnetic field. The angle between its velocity and the field is ${th}°. What is the magnitude of the magnetic force on it?`,ans,unit:'N',hint:'F = qvB sin θ. Convert μC to C and km/s to m/s.',
   sol:`<span class="m"><i>F</i> = (${q} × 10⁻⁶)(${v} × 10³)(${num(B)}) sin ${th}° = <b>${sf(ans,'N')}</b></span>.`};}},
 {id:'bvsel',topic:'bforce',title:'Velocity selector',gen(){const E=pick([2000,5000,10000,20000]),B=pick([.02,.05,.1,.2]),ans=E/B;
   return {q:`In a velocity selector the electric field is ${sf(E,'V/m',2)} and the magnetic field is ${num(B)} T, perpendicular to each other and to the beam. What speed do the particles that pass straight through have?`,ans,unit:'m/s',hint:'The electric and magnetic forces cancel: qE = qvB.',
   sol:`<span class="m"><i>v</i> = <i class="ef">E</i>/<i class="bf">B</i> = ${sf(E,'',2)}/${num(B)} = <b>${sf(ans,'m/s')}</b></span>, independent of the particle's charge and mass.`};}},
 {id:'bmass',topic:'bforce',title:'Mass spectrometer',gen(){const B=pick([.1,.2,.5]),v=pick([2e5,5e5,1e6]),r=pick([.05,.1,.2]),ans=QE*B*r/v;
   return {q:`Singly charged ions (q = +1.6 × 10⁻¹⁹ C) moving at ${sf(v,'m/s',2)} enter a ${num(B)} T magnetic field and move in a circle of radius ${num(r*100)} cm. What is the mass of each ion? (Give your answer in kg: use a form like 1.2e-25.)`,ans,unit:'kg',hint:'r = mv/(qB), so m = qBr/v.',
   sol:`<span class="m"><i>m</i> = <i>qBr</i>/<i>v</i> = (1.6 × 10⁻¹⁹)(${num(B)})(${num(r)})/${sf(v,'',2)} = <b>${sf(ans,'kg')}</b></span> (about ${fmt(ans/1.66e-27,1)} atomic mass units).`};}}
);
