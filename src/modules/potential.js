(function potential(){
  const cv=$('#pt-canvas');const s={view:'map',lines:'on',q:[2,-2,0]};
  const P=[{x:12,y:13},{x:28,y:13},{x:20,y:5}],A={x:15,y:19},B={x:26,y:8};let geo=null;
  const Vat=(x,y)=>{let v=0;for(let i=0;i<3;i++){if(!s.q[i])continue;const r=Math.max(.4,Math.hypot(x-P[i].x,y-P[i].y))*.01;v+=KC*s.q[i]*1e-9/r;}return v;};
  const Cw=()=>P.map((p,i)=>({x:p.x,y:p.y,q:s.q[i]}));
  const LV=[];for(let k=0;k<9;k++)LV.push(20*2**k);
  function contour(ctx,V,nx,ny,x0,y0,d,lv,col,lw){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();
    const ip=(a,b,pa,pb)=>a===b?.5:(lv-a)/(b-a);
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=V[j*(nx+1)+i],b=V[j*(nx+1)+i+1],c=V[(j+1)*(nx+1)+i+1],dd=V[(j+1)*(nx+1)+i];
      const idx=(a>lv?8:0)|(b>lv?4:0)|(c>lv?2:0)|(dd>lv?1:0);if(idx===0||idx===15)continue;
      const X=x0+i*d,Y=y0+j*d,T_=[X+ip(a,b)*d,Y],R_=[X+d,Y+ip(b,c)*d],B_=[X+ip(dd,c)*d,Y+d],L_=[X,Y+ip(a,dd)*d];
      const seg=(p,q)=>{ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);};
      switch(idx){case 1:case 14:seg(L_,B_);break;case 2:case 13:seg(B_,R_);break;case 3:case 12:seg(L_,R_);break;case 4:case 11:seg(T_,R_);break;case 5:seg(T_,L_);seg(B_,R_);break;case 6:case 9:seg(T_,B_);break;case 7:case 8:seg(T_,L_);break;case 10:seg(T_,R_);seg(L_,B_);break;}}
    ctx.stroke();}
  function draw(){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.58,300,440));const c=prep(cv,h);if(!c)return;const {ctx}=c;
    const sc=Math.min(w/42,h/28),ox=w/2,oy=h/2,X=x=>ox+(x-20)*sc,Y=y=>oy-(y-13)*sc,xc=px=>(px-ox)/sc+20,yc=py=>13-(py-oy)/sc;geo={sc,ox,oy,w,h};
    const d=6,nx=Math.ceil(w/d),ny=Math.ceil(h/d),V=new Float32Array((nx+1)*(ny+1));
    for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++)V[j*(nx+1)+i]=Vat(xc(i*d),yc(j*d));
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const v=V[j*(nx+1)+i];if(!v)continue;const a=Math.min(.5,Math.log10(1+Math.abs(v)/20)/5.5);ctx.fillStyle=alpha(v>0?T.pos:T.neg,a);ctx.fillRect(i*d,j*d,d,d);}
    LV.forEach(l=>{contour(ctx,V,nx,ny,0,0,d,l,alpha(T.pos,.85),1.2);contour(ctx,V,nx,ny,0,0,d,-l,alpha(T.neg,.9),1.2);});contour(ctx,V,nx,ny,0,0,d,0,T.ink,2);
    const C=Cw();if(s.lines==='on')strokeLines(ctx,fieldLines(C,{per:3,step:.35,r0:.9,stop:1,bounds:[-2,-2,42,28]}),X,Y,T.ink,true);
    C.forEach((q,i)=>{if(i===2&&!q.q)return;chargeDot(ctx,X(q.x),Y(q.y),q.q,12);});
    const Ea=fieldAt(C.map(q=>({x:q.x*.01,y:q.y*.01,q:q.q*1e-9*KC})),A.x*.01,A.y*.01),em=Math.hypot(Ea[0],Ea[1]);
    if(em>1){const L=22+40*clamp(Math.log10(em/50)/3,0,1);arrow(ctx,X(A.x),Y(A.y),X(A.x)+Ea[0]/em*L,Y(A.y)-Ea[1]/em*L,T.cx,3);label(ctx,'E',X(A.x)+Ea[0]/em*(L+10),Y(A.y)-Ea[1]/em*(L+10),T.cx,'center','middle');}
    dot(ctx,X(A.x),Y(A.y),7,T.surface,T.ink);dot(ctx,X(A.x),Y(A.y),2,T.ink);label(ctx,'A',X(A.x)-12,Y(A.y)-12,T.ink,'center','middle');
    ctx.fillStyle=T.surface;ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.fillRect(X(B.x)-6,Y(B.y)-6,12,12);ctx.strokeRect(X(B.x)-6,Y(B.y)-6,12,12);label(ctx,'B',X(B.x)+14,Y(B.y)-10,T.ink,'center','middle');
    const va=Vat(A.x,A.y),vb=Vat(B.x,B.y);setText('pt-VA',sf(va,'V'));setText('pt-VB',sf(vb,'V'));setText('pt-dV',sf(vb-va,'V'));setText('pt-W',sf(va-vb,'nJ'));setText('pt-EA',sf(em,'N/C'));}
  // 3D hill
  const c3=document.createElement('canvas');c3.id='pt-hill';c3.setAttribute('aria-label','3D potential surface: positive charges are hills, negative charges are wells. Drag to rotate.');cv.after(c3);
  const hx=x=>20+x*10,hy=y=>13+y*10,Z=v=>clamp(v/350,-2.4,2.4);
  const v3=view3d(c3,{yaw:-.9,pitch:.5,dist:7.2,target:[0,0,0],min:3,max:14,auto:false,height:w=>clamp(w*.55,300,460),scene:(S)=>{
    const run=(pts,col)=>{let cur=[],sg=0;const flush=()=>{if(cur.length>1)S.path(cur,col(sg),1.3);};pts.forEach(p=>{const sg2=p[3];if(sg2!==sg&&cur.length){flush();cur=[cur[cur.length-1]];}sg=sg2;cur.push(p);});flush();};
    const col=sg=>sg>0?alpha(T.pos,.8):sg<0?alpha(T.neg,.85):alpha(T.muted,.7);
    for(let j=0;j<=20;j++){const y=-1.3+j*.13,pts=[];for(let i=0;i<=40;i++){const x=-2+i*.1,v=Vat(hx(x),hy(y));pts.push([x,y,Z(v),Math.sign(v)]);}run(pts.map(p=>[p[0],p[1],p[2],p[3]]),col);}
    for(let i=0;i<=20;i++){const x=-2+i*.2,pts=[];for(let j=0;j<=26;j++){const y=-1.3+j*.1,v=Vat(hx(x),hy(y));pts.push([x,y,Z(v),Math.sign(v)]);}run(pts,col);}
    Cw().forEach((q,i)=>{if(!q.q)return;const x=(q.x-20)/10,y=(q.y-13)/10,v=Vat(q.x,q.y);S.ball([x,y,Z(v)+.02],.1,q.q>0?T.pos:T.neg,1,false);});
    const ax=(A.x-20)/10,ay=(A.y-13)/10,az=Z(Vat(A.x,A.y));S.ball([ax,ay,az+.1],.09,T.ink,1,false);S.text([ax,ay,az+.4],'A (positive test charge)',T.ink);
    const e=fieldAt(Cw().map(q=>({x:q.x*.01,y:q.y*.01,q:q.q*1e-9*KC})),A.x*.01,A.y*.01),m=Math.hypot(e[0],e[1]);if(m>1){const L=.5;S.arrow([ax,ay,az+.1],[ax+e[0]/m*L,ay+e[1]/m*L,az+.1],T.cx,3,'E (downhill)');}}});
  const wrap3=c3.closest('.v3');
  function setView(){const m=s.view==='map';cv.style.display=m?'':'none';if(wrap3)wrap3.style.display=m?'none':'';draw();if(!m)v3.render();}
  drawers.potential=()=>{if(s.view==='map')draw();else v3.render();};
  dragPoints(cv,()=>geo&&s.view==='map'?[...P.map(p=>[geo.ox+(p.x-20)*geo.sc,geo.oy-(p.y-13)*geo.sc]),[geo.ox+(A.x-20)*geo.sc,geo.oy-(A.y-13)*geo.sc],[geo.ox+(B.x-20)*geo.sc,geo.oy-(B.y-13)*geo.sc]]:[],(k,x,y,ph)=>{if(ph!=='move'||!geo)return;
    const p={x:clamp((x-geo.ox)/geo.sc+20,1.5,38.5),y:clamp(13-(y-geo.oy)/geo.sc,1.5,24.5)};if(k<3)P[k]=p;else if(k===3)Object.assign(A,p);else Object.assign(B,p);draw();});
  segBind('pt-view','k',k=>{s.view=k;setView();});segBind('pt-lines','k',k=>{s.lines=k;draw();});
  const qf=x=>(x>0?'+':x<0?'−':'')+Math.abs(x)+' nC';[1,2,3].forEach(k=>bindRange('pt-q'+k,qf,x=>{s.q[k-1]=x;drawers.potential();}));
  setView();
})();
Object.assign(TIPS,{"pt-q1":"Changing a charge reshapes the whole potential map. A bigger positive charge makes a taller hill and pushes the zero contour away from it.","pt-q2":"Make charge 2 negative for a dipole: the zero contour is a straight line halfway between equal and opposite charges.","pt-q3":"Charge 3 starts at zero. Turn it on to see how potentials from three sources just add."});
Object.assign(KEYS,{"pt-canvas":["Drag the charges and the probes A and B. Try the 3D hill view.",[["pos","positive potential and contours"],["neg","negative potential and contours"],["ink","zero contour, field lines"],["cx","E at probe A"]]]});
Object.assign(TT,{potential:"Use potential when the question asks about energy, speed or work. It is one number to add, with no vectors. Take a slope only when you need the field."});
PROBS.push(
 {id:'vpt',topic:'potential',title:'Potential of a point charge',gen(){const q=pick([2,4,6,10]),r=pick([5,10,15,20,30]),sg=pick([1,-1]),ans=sg*KC*q*1e-9/(r*.01);
   return {q:`What is the electric potential ${r} cm from a ${sg>0?'+':'−'}${q} nC point charge? (Take V = 0 at infinity. Include the sign.)`,ans,unit:'V',hint:'V = kq/r, with the sign of q.',
   sol:`<span class="m"><i>V</i> = (8.99 × 10⁹)(${sg>0?'':'−'}${q} × 10⁻⁹)/${num(r/100)} = <b>${sf(ans,'V')}</b></span>.`};}},
 {id:'vsum',topic:'potential',title:'Potential at the midpoint',gen(){const a=pick([2,4,6]),b=pick([1,3,5]),d=pick([20,30,40]),ans=KC*(a-b)*1e-9/(d/200);
   return {q:`A +${a} nC charge and a −${b} nC charge are ${d} cm apart. What is the electric potential at the midpoint between them?`,ans,unit:'V',hint:'Each charge is d/2 away. Add the two potentials, with their signs: V is a scalar.',
   sol:`<span class="m"><i>V</i> = <i>k</i>(${a} − ${b}) × 10⁻⁹/${num(d/200)} = <b>${sf(ans,'V')}</b></span>.`};}},
 {id:'efromv',topic:'potential',title:'Field between plates',gen(){const V=pick([12,50,120,300,500]),d=pick([.5,1,2,4]),ans=V/(d*.01);
   return {q:`Two parallel plates ${d} cm apart have a potential difference of ${V} V. What is the strength of the (uniform) electric field between them?`,ans,unit:'V/m',hint:'For a uniform field E = ΔV/d. Convert cm to m.',
   sol:`<span class="m"><i class="ef">E</i> = Δ<i>V</i>/<i>d</i> = ${V}/${num(d/100)} = <b>${sf(ans,'V/m')}</b></span> (same as N/C).`};}},
 {id:'dvdx',topic:'potential',calc:1,title:'Field from a potential function',gen(){const a=pick([2,3,5]),b=pick([4,6,10]),x=pick([1,2,3]),ans=-(2*a*x-b);
   return {q:`In a region the electric potential is V(x) = ${a}x² − ${b}x volts (x in meters). What is E_x at x = ${x} m?`,ans,unit:'V/m',hint:'E_x = −dV/dx. Differentiate first, then plug in x.',
   sol:`<span class="m"><i class="ef">E</i><sub>x</sub> = −d<i>V</i>/d<i>x</i> = −(${2*a}<i>x</i> − ${b})</span>; at <i>x</i> = ${x} m this is <span class="m"><b>${num(ans)} V/m</b></span>.`};}}
);
PROBS.push(
 {id:'vring',topic:'potential',calc:1,title:'Potential on the axis of a ring',gen(){const Q=pick([4,8,12,20]),R=pick([.05,.1,.15]),z=pick([.1,.2,.3]),ans=KC*Q*1e-9/Math.sqrt(R*R+z*z);
   return {q:`A ring of radius ${num(R)} m carries a uniform charge of +${Q} nC. What is the electric potential on its axis, ${num(z)} m from the center? (V = 0 at infinity.)`,ans,unit:'V',hint:'Every slice of the ring is the same distance √(R² + z²) from the point, so V = kQ/√(R² + z²). No components needed.',
   sol:`<span class="m"><i>V</i> = <i>kQ</i>/√(<i>R</i>² + <i>z</i>²) = (8.99 × 10⁹)(${Q} × 10⁻⁹)/√(${num(R)}² + ${num(z)}²) = <b>${sf(ans,'V')}</b></span>.`};}},
 {id:'vshell',topic:'potential',title:'Potential inside a charged shell',gen(){const Q=pick([5,10,20]),R=pick([2,4,5,8]),r=R*pick([.25,.5,.75]),ans=KC*Q*1e-9/(R*.01);
   return {q:`A thin spherical shell of radius ${R} cm carries a uniform charge of +${Q} nC. What is the potential at ${num(r)} cm from its center (inside the shell)? (V = 0 at infinity.)`,ans,unit:'V',hint:'E = 0 inside the shell, so the potential cannot change inside: it equals the potential at the surface, kQ/R.',
   sol:`<span class="m"><i>V</i> = <i>kQ</i>/<i>R</i> = (8.99 × 10⁹)(${Q} × 10⁻⁹)/${num(R/100)} = <b>${sf(ans,'V')}</b></span>, the same everywhere inside.`};}},
 {id:'vsolid',topic:'potential',calc:1,title:'Potential at the center of a solid sphere',gen(){const Q=pick([4,8,12]),R=pick([2,4,5,10]),ans=1.5*KC*Q*1e-9/(R*.01);
   return {q:`A solid insulating sphere of radius ${R} cm carries a uniform charge of ${Q} nC throughout its volume. What is the potential at its center? (V = 0 at infinity.)`,ans,unit:'V',hint:'Outside, V = kQ/r down to the surface. Inside, E = kQr/R³: integrate it inward from R to 0 and add: V(0) = kQ/R + kQ/(2R) = 3kQ/(2R).',
   sol:`<span class="m"><i>V</i>(0) = 3<i>kQ</i>/(2<i>R</i>) = 1.5(8.99 × 10⁹)(${Q} × 10⁻⁹)/${num(R/100)} = <b>${sf(ans,'V')}</b></span>.`};}},
 {id:'vfromE',topic:'potential',calc:1,title:'Potential difference from a field',gen(){const a=pick([2,3,6,12]),b=pick([1,2,3]),ans=-a*b*b*b/3;
   return {q:`In a region along the x-axis the electric field is E_x = ${a}x² (in V/m, with x in m). What is V(${b} m) − V(0)? Include the sign.`,ans,unit:'V',hint:'V(b) − V(0) = −∫E dx from 0 to b.',
   sol:`<span class="m"><i>V</i>(${b}) − <i>V</i>(0) = −∫<sub>0</sub><sup>${b}</sup> ${a}<i>x</i>² d<i>x</i> = −${a}(${b})³/3 = <b>${fmt(ans,3)} V</b></span>.`};}}
);
