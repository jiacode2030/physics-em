(function wireforce(){
  const cv=$('#wf-canvas');const s={mode:'wire',I:5,L:.5,th:90,N:10,ph:90,B:.4,spin:false,comm:false},A_=.10,B_=.15;let psi=Math.PI/2,lastT=null;
  const rad=d=>d*Math.PI/180;
  const sideHome={wire:{yaw:-.7,pitch:.38,dist:6.2,target:[0,0,.2]},loop:{yaw:-.5,pitch:.3,dist:6.2,target:[0,0,.2]}};
  const v3=view3d(cv,{...sideHome.wire,min:4,max:20,height:w=>clamp(w*.6,320,460),scene:(S,tt)=>{
    S.grid(-3,3,-3,3,1);for(let i=-2;i<=2;i+=1)for(let j=-2;j<=2;j+=1)S.arrow([i*1.1,j*1.1,-1.1],[i*1.1,j*1.1,-.2],alpha(T.ca,.35),1.4);
    S.arrow([2.8,2.2,-1],[2.8,2.2,.4],T.ca,3,'B');
    if(s.mode==='wire'){const th=rad(s.th),d=[Math.sin(th),0,Math.cos(th)],Ls=s.L*3.2,a=V3.mul(d,-Ls/2),b=V3.mul(d,Ls/2);S.line(a,b,T.ink,6);
      for(let k=0;k<6;k++){const u=((k/6)+(tt==null?0:tt*.25))%1;S.ball(V3.add(a,V3.mul(d,u*Ls)),.07,T.cv,1,false);}
      S.arrow(V3.mul(d,Ls/2-.2),V3.mul(d,Ls/2+.7),T.cv,3,'I');
      const F=s.I*s.L*s.B*Math.sin(th),Fm=10*1*1;if(F>1e-6)S.arrow([0,0,0],[0,-.6-2*F/Fm*1.5,0],T.hot,3.5,'F');S.text([0,0,-1.5],'F = I L × B',T.hot);}
    else{const ps=psi,n=[Math.sin(ps),0,Math.cos(ps)],t=[Math.cos(ps),0,-Math.sin(ps)],y=[0,1,0],a=1.0,b=1.5,sgn=(s.comm&&Math.sin(ps)<0)?-1:1;
      const cor=[[1,1],[-1,1],[-1,-1],[1,-1]].map(([i,j])=>V3.add(V3.mul(t,i*b/2),V3.mul(y,j*a/2)));if(sgn<0)cor.reverse();
      for(let k=0;k<4;k++){const p0=cor[k],p1=cor[(k+1)%4];S.line(p0,p1,T.cv,2+Math.min(5,s.N/4));S.arrow(V3.add(p0,V3.mul(V3.sub(p1,p0),.3)),V3.add(p0,V3.mul(V3.sub(p1,p0),.6)),T.cv,2.2);}
      S.poly(cor,alpha(T.cv,.1),null);S.arrow([0,0,0],V3.mul(n,sgn*1.6),T.ink,3,'μ');
      const Ftot=s.N*s.I*A_*s.B,tau=s.N*s.I*A_*B_*s.B*Math.sin(ps)*sgn,Fm=20*10*A_*1,len=.5+1.1*Ftot/Fm;
      [[1,1],[-1,-1]].forEach(([i])=>{const pos=V3.mul(t,i*b/2);const dir=[sgn*i*(sgn>0?1:1),0,0];S.arrow(pos,V3.add(pos,V3.mul([i*sgn,0,0],len)),T.hot,3.2,'F');});
      if(Math.abs(tau)>1e-6)S.arrow([0,0,0],[0,-.8*Math.sign(tau)*(1+Math.min(1,Math.abs(tau)/3)),0],T.ink,2.5,'τ');}}});
  function update(){const th=rad(s.th),relab=(id,t)=>{const e=$('#'+id);if(e)e.previousElementSibling.textContent=t;},show=(id,on)=>{const e=$('#'+id);if(e)e.parentElement.hidden=!on;};
    if(s.mode==='wire'){const F=s.I*s.L*s.B*Math.sin(th);relab('wf-r1','Force on the wire  F = ILB sin θ');relab('wf-r2','Direction');relab('wf-r3','Largest possible force (θ = 90°)');show('wf-r4',false);show('wf-r5',false);
      setText('wf-r1',sf(F,'N'));setText('wf-r2',Math.abs(Math.sin(th))<.02?'none (wire ∥ B)':'⊥ to wire and B');setText('wf-r3',sf(s.I*s.L*s.B,'N'));}
    else{const ps=s.spin?psi:rad(s.ph),sgn=(s.comm&&Math.sin(ps)<0)?-1:1,mu=s.N*s.I*A_*B_,F=s.N*s.I*A_*s.B,tau=mu*s.B*Math.sin(ps)*sgn;
      relab('wf-r1','Torque  τ = NIAB sin φ');relab('wf-r2','Magnetic moment  μ = NIA');relab('wf-r3','Force on each active side N·I·a·B');relab('wf-r4','Largest possible torque');relab('wf-r5','Energy  U = −μ·B');show('wf-r4',true);show('wf-r5',true);
      setText('wf-r1',sf(tau,'N·m'));setText('wf-r2',sf(mu,'A·m²'));setText('wf-r3',sf(F,'N'));setText('wf-r4',sf(mu*s.B,'N·m'));const U=-mu*s.B*Math.cos(ps)*sgn;setText('wf-r5',Math.abs(U)<1e-9?'0 J':sf(U,'J'));}
    v3.render();}
  drawers.wireforce=update;
  ticker('wireforce',dt=>{if(s.mode==='loop'&&s.spin){psi=(psi+dt*2.2)%(2*Math.PI);update();}else if(s.mode==='wire'){}});
  segBind('wf-mode','k',k=>{s.mode=k;s.spin=false;$('#wf-spin').textContent='Spin the loop';$('#wf-w-ctl').hidden=k!=='wire';$('#wf-l-ctl').hidden=k==='wire';v3.setHome(sideHome[k]);psi=rad(s.ph);update();});
  $('#wf-spin').addEventListener('click',()=>{s.spin=!s.spin;$('#wf-spin').textContent=s.spin?'Stop':'Spin the loop';if(!s.spin)psi=rad(s.ph);update();});
  $('#wf-comm').addEventListener('change',e=>{s.comm=e.target.checked;update();});
  bindRange('wf-I',x=>x+' A',x=>{s.I=x;update();});bindRange('wf-L',x=>fmt(x,2)+' m',x=>{s.L=x;update();});bindRange('wf-th',x=>x+'°',x=>{s.th=x;update();});
  bindRange('wf-N',x=>x+' turns',x=>{s.N=x;update();});bindRange('wf-ph',x=>x+'°',x=>{s.ph=x;psi=rad(x);update();});bindRange('wf-B',x=>fmt(x,2)+' T',x=>{s.B=x;update();});
  update();
})();
Object.assign(TIPS,{"wf-I":"Force is proportional to current: more charge flowing means more charge feeling the push.","wf-L":"A longer wire in the field has more moving charge in it, so the force grows in proportion to the length.","wf-th":"Only the part of the wire perpendicular to B counts: F = ILB sin θ. Parallel to B (0° or 180°) gives zero.","wf-N":"A coil of N turns has N times the force and N times the torque of a single loop.","wf-ph":"Torque is proportional to sin φ: zero when the loop faces the field squarely (φ = 0), greatest when the normal is perpendicular to B.","wf-B":"Force and torque both scale with the field strength."});
Object.assign(KEYS,{"wf-canvas":["Drag to rotate the picture. Switch between a wire and a loop. Move the sliders.",[["ca","magnetic field B"],["cv","current"],["hot","force"],["ink","μ and torque"]]]});
Object.assign(TT,{wireforce:"For the force on a wire use the angle between the wire and B. For the torque on a loop use the angle between the loop's normal and B. Mixing them up is the most common error."});
PROBS.push(
 {id:'wforce',topic:'wireforce',title:'Force on a current-carrying wire',gen(){const I=pick([2,4,6,8,10]),L=pick([.2,.5,.8,1.2]),B=pick([.1,.2,.4,.5]),th=pick([30,45,60,90]),ans=I*L*B*Math.sin(th*Math.PI/180);
   return {q:`A straight wire ${num(L)} m long carries ${I} A in a uniform ${num(B)} T magnetic field. The wire makes an angle of ${th}° with the field. What is the magnitude of the magnetic force on the wire?`,ans,unit:'N',hint:'F = ILB sin θ.',sol:`<span class="m"><i>F</i> = (${I})(${num(L)})(${num(B)}) sin ${th}° = <b>${sf(ans,'N')}</b></span>.`};}},
 {id:'wtorque',topic:'wireforce',title:'Torque on a coil',gen(){const N=pick([10,20,50,100]),I=pick([.5,1,2]),a=pick([4,5,8]),b=pick([5,6,10]),B=pick([.1,.2,.5]),ans=N*I*(a*b*1e-4)*B;
   return {q:`A rectangular coil of ${N} turns and size ${a} cm × ${b} cm carries ${num(I)} A in a uniform ${num(B)} T field. What is the maximum torque on the coil (the plane parallel to the field)?`,ans,unit:'N·m',hint:'τ_max = NIAB, with A in m².',
   sol:`<span class="m">τ = <i>NIAB</i> = (${N})(${num(I)})(${sf(a*b*1e-4,'',3)})(${num(B)}) = <b>${sf(ans,'N·m')}</b></span>.`};}},
 {id:'wmoment',topic:'wireforce',title:'Magnetic moment of a loop',gen(){const N=pick([5,10,25,40]),I=pick([1,2,3,5]),r=pick([2,3,5,8]),ans=N*I*Math.PI*r*r*1e-4;
   return {q:`A circular coil of ${N} turns and radius ${r} cm carries ${I} A. What is its magnetic moment?`,ans,unit:'A·m²',hint:'μ = NIA with A = πr².',sol:`<span class="m">μ = <i>NIA</i> = (${N})(${I})π(${num(r/100)})² = <b>${sf(ans,'A·m²')}</b></span>.`};}}
);
