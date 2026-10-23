(function penergy(){
  const cv=$('#pe-canvas');const s={mode:'accel',sp:'p',V:500,q:[3,-2,2]};
  const SP={p:{q:1,m:1.67e-27,name:'proton'},e:{q:-1,m:ME,name:'electron'},a:{q:2,m:6.64e-27,name:'alpha particle'}};
  const Pt=[{x:12,y:16},{x:28,y:16},{x:20,y:5}];let geo=null,tt=1,run=false;const TD=2.6;
  const fin=()=>{const p=SP[s.sp],K=Math.abs(p.q)*QE*s.V;return {K,eV:Math.abs(p.q)*s.V,v:Math.sqrt(2*K/p.m)};};
  function drawA(ctx,w,h){const p=SP[s.sp],pos=p.q>0,x0=70,x1=w-135,py=h*.5,ph=Math.min(150,h*.6),f=clamp(tt/TD,0,1),prog=f*f,fin_=fin();
    ctx.fillStyle=alpha(T.pos,.9);ctx.fillRect(x0-10,py-ph/2,10,ph);ctx.fillStyle=alpha(T.neg,.9);ctx.fillRect(x1,py-ph/2,10,ph);label(ctx,'+',x0-5,py-ph/2-12,T.pos,'center','middle','700 18px "IBM Plex Sans", system-ui, sans-serif');label(ctx,'−',x1+5,py-ph/2-12,T.neg,'center','middle','700 18px "IBM Plex Sans", system-ui, sans-serif');
    for(let i=0;i<5;i++){const y=py-ph/2+ph*(i+.5)/5;arrow(ctx,x0+22,y,x1-22,y,alpha(T.cx,.35),1.4);}label(ctx,'E',(x0+x1)/2,py-ph/2-10,T.cx,'center','middle');
    label(ctx,'ΔV = '+s.V+' V',(x0+x1)/2,py+ph/2+20,T.ink,'center','middle',MONO);
    const xs=pos?x0+16+(x1-x0-32)*prog:x1-16-(x1-x0-32)*prog;chargeDot(ctx,xs,py,p.q>0?1:-1,12);label(ctx,p.name,xs,py-24,T.ink,'center','middle',MONO);
    if(f>.04){const L=10+90*Math.sqrt(prog);arrow(ctx,xs,py+26,xs+(pos?1:-1)*L,py+26,T.cv,3);label(ctx,'v',xs+(pos?1:-1)*(L+10),py+26,T.cv,'center','middle');}
    const bx=w-34,bh=h-70,by=24;[[1-prog,'U',T.hot],[prog,'K',T.cv]].forEach(([fr,l,col],i)=>{const x=bx-i*44-26;ctx.fillStyle=T.sunk;ctx.fillRect(x,by,20,bh);ctx.fillStyle=col;ctx.fillRect(x,by+bh*(1-fr),20,bh*fr);label(ctx,l,x+10,by+bh+14,col,'center');});
    setText('pe-r1',sf(fin_.K,'J'));setText('pe-r2',sf(fin_.eV,'eV'));setText('pe-r3',sf(fin_.v,'m/s'));setText('pe-r4',fmt(100*fin_.v/3e8,2)+' % of c');}
  const pairs=()=>{const out=[];[[0,1],[0,2],[1,2]].forEach(([i,j])=>{const r=Math.max(.5,Math.hypot(Pt[i].x-Pt[j].x,Pt[i].y-Pt[j].y))*.01;out.push({i,j,r,U:KC*s.q[i]*s.q[j]*1e-18/r});});return out;};
  function drawS(ctx,w,h){const sc=Math.min(w/42,h/28),ox=w/2,oy=h/2,X=x=>ox+(x-20)*sc,Y=y=>oy-(y-13)*sc;geo={sc,ox,oy,w,h};
    ctx.strokeStyle=T.grid;ctx.lineWidth=1;for(let g=0;g<=40;g+=4){ctx.beginPath();ctx.moveTo(Math.round(X(g))+.5,Y(26));ctx.lineTo(Math.round(X(g))+.5,Y(0));ctx.stroke();}for(let g=0;g<=26;g+=4){ctx.beginPath();ctx.moveTo(X(0),Math.round(Y(g))+.5);ctx.lineTo(X(40),Math.round(Y(g))+.5);ctx.stroke();}
    const pr=pairs();let tot=0;pr.forEach(p=>{tot+=p.U;const col=p.U>0?T.hot:T.cv;ctx.strokeStyle=alpha(col,.8);ctx.lineWidth=2;ctx.setLineDash(p.U<0?[]:[6,4]);ctx.beginPath();ctx.moveTo(X(Pt[p.i].x),Y(Pt[p.i].y));ctx.lineTo(X(Pt[p.j].x),Y(Pt[p.j].y));ctx.stroke();ctx.setLineDash([]);
      label(ctx,sf(p.U*1e9,'nJ',2),X((Pt[p.i].x+Pt[p.j].x)/2),Y((Pt[p.i].y+Pt[p.j].y)/2)-10,col,'center','middle',MONO);});
    Pt.forEach((p,i)=>{chargeDot(ctx,X(p.x),Y(p.y),s.q[i],13);label(ctx,(s.q[i]>0?'+':s.q[i]<0?'−':'')+Math.abs(s.q[i])+' nC',X(p.x),Y(p.y)+26,s.q[i]>0?T.pos:s.q[i]<0?T.neg:T.muted,'center','middle',MONO);});
    setText('pe-r1',sf(pr[0].U*1e9,'nJ'));setText('pe-r2',sf(pr[1].U*1e9,'nJ'));setText('pe-r3',sf(pr[2].U*1e9,'nJ'));setText('pe-r4',sf(tot*1e9,'nJ')+(tot>0?' (repulsive overall)':tot<0?' (bound overall)':''));}
  function draw(){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.5,280,400));const c=prep(cv,h);if(!c)return;if(s.mode==='accel')drawA(c.ctx,w,h);else drawS(c.ctx,w,h);}
  function relabel(){const l=(id,t)=>{$('#'+id).previousElementSibling.textContent=t;};
    if(s.mode==='accel'){l('pe-r1','Kinetic energy gained');l('pe-r2','In electron-volts');l('pe-r3','Final speed');l('pe-r4','Compared to the speed of light');}
    else{l('pe-r1','U₁₂ (charges 1 and 2)');l('pe-r2','U₁₃ (charges 1 and 3)');l('pe-r3','U₂₃ (charges 2 and 3)');l('pe-r4','Total energy of the system');}}
  drawers.penergy=draw;
  ticker('penergy',dt=>{if(s.mode!=='accel'||!run)return;tt+=dt;if(tt>=TD){tt=TD;run=false;}draw();});
  $('#pe-go').addEventListener('click',()=>{if(REDUCE){tt=TD;draw();return;}tt=0;run=true;draw();});
  dragPoints(cv,()=>geo&&s.mode==='assemble'?Pt.map(p=>[geo.ox+(p.x-20)*geo.sc,geo.oy-(p.y-13)*geo.sc]):[],(k,x,y,ph)=>{if(ph!=='move'||!geo)return;const nx=clamp((x-geo.ox)/geo.sc+20,1.5,38.5),ny=clamp(13-(y-geo.oy)/geo.sc,1.5,24.5);
    for(let j=0;j<3;j++)if(j!==k&&Math.hypot(nx-Pt[j].x,ny-Pt[j].y)<3.2)return;Pt[k]={x:nx,y:ny};draw();});
  segBind('pe-mode','k',k=>{s.mode=k;$('#pe-a-ctl').hidden=k!=='accel';$('#pe-s-ctl').hidden=k==='accel';relabel();draw();});
  segBind('pe-sp','k',k=>{s.sp=k;tt=TD;run=false;draw();});
  bindRange('pe-V',x=>x+' V',x=>{s.V=x;draw();});const qf=x=>(x>0?'+':x<0?'−':'')+Math.abs(x)+' nC';[1,2,3].forEach(k=>bindRange('pe-q'+k,qf,x=>{s.q[k-1]=x;draw();}));
  relabel();
})();
Object.assign(TIPS,{"pe-V":"Kinetic energy gained is qΔV, so it grows in proportion to the voltage. The speed grows only as the square root of V.","pe-q1":"A pair has positive energy if its charges have the same sign (repel) and negative if they differ (attract).","pe-q2":"Total energy is the sum over all three pairs. Change one charge and two pair energies change.","pe-q3":"Try making the total zero: one attractive pair can cancel the energy of repulsive ones."});
Object.assign(KEYS,{"pe-canvas":["Press Release to accelerate the particle, or switch to the charge-system view.",[["hot","potential energy U"],["cv","kinetic energy K, velocity"],["cx","electric field"]]]});
Object.assign(TT,{penergy:"For \"how fast\" questions through a voltage, skip the field and forces entirely. Write ½mv² = qΔV and solve. Use ΔU = qΔV for work."});
PROBS.push(
 {id:'vspeed',topic:'penergy',title:'Speed after a voltage',gen(){const sp=pick([['proton',1.67e-27],['electron',ME]]),V=pick([100,250,500,1000,2000]),ans=Math.sqrt(2*QE*V/sp[1]);
   return {q:`A ${sp[0]} is released from rest and accelerated through a potential difference of ${V} V. What is its final speed? (Ignore relativity. Mass: ${sp[0]==='proton'?'1.67 × 10⁻²⁷':'9.11 × 10⁻³¹'} kg.)`,ans,unit:'m/s',hint:'½mv² = eΔV.',
   sol:`<span class="m"><i>v</i> = √(2<i>e</i>Δ<i>V</i>/<i>m</i>) = √(2(1.6 × 10⁻¹⁹)(${V})/${sp[0]==='proton'?'1.67 × 10⁻²⁷':'9.11 × 10⁻³¹'}) = <b>${sf(ans,'m/s')}</b></span>.`};}},
 {id:'work',topic:'penergy',title:'Work between two points',gen(){const q=pick([2,5,10,20]),Va=pick([100,200,300]),Vb=pick([600,800,1000]),ans=q*1e-9*(Vb-Va);
   return {q:`How much work must an outside force do to move a +${q} nC charge slowly from a point at ${Va} V to a point at ${Vb} V? Give your answer in microjoules.`,ans:ans*1e6,unit:'μJ',hint:'W = qΔV, with ΔV = V_final − V_initial.',
   sol:`<span class="m"><i>W</i> = <i>q</i>(<i>V</i><sub>B</sub> − <i>V</i><sub>A</sub>) = (${q} × 10⁻⁹)(${Vb - Va}) = <b>${fmt(ans*1e6,3)} μJ</b></span>.`};}},
 {id:'u3',topic:'penergy',title:'Energy of three charges',gen(){const q=pick([1,2,3,4]),a=pick([5,10,20]),ans=3*KC*q*q*1e-18/(a*.01);
   return {q:`Three identical +${q} nC charges are placed at the corners of an equilateral triangle with sides of ${a} cm. How much energy does it take to assemble them from far apart, in μJ?`,ans:ans*1e6,unit:'μJ',hint:'Add the energy of every pair: three pairs, each kq²/a.',
   sol:`<span class="m"><i>U</i> = 3<i>kq</i>²/<i>a</i> = 3(8.99 × 10⁹)(${q} × 10⁻⁹)²/${num(a/100)} = <b>${fmt(ans*1e6,3)} μJ</b></span>.`};}},
 {id:'closest',topic:'penergy',title:'Closest approach',gen(){const K=pick([1,2,5,10]),q=pick([2,4,6]);
   const r=KC*(q*1e-9)*(QE)/(K*1e3*QE);return {q:`A proton with ${K} keV of kinetic energy is fired directly at a fixed ${q} nC positive charge from far away. How close does it get? Give your answer in meters. (Use e = 1.6 × 10⁻¹⁹ C and 1 eV = 1.6 × 10⁻¹⁹ J.)`,ans:r,unit:'m',hint:'At closest approach all the kinetic energy is potential energy: K = kqe/r.',
   sol:`<span class="m"><i>r</i> = <i>kqe</i>/<i>K</i> = (8.99 × 10⁹)(${q} × 10⁻⁹)(1.6 × 10⁻¹⁹)/(${K} × 10³ × 1.6 × 10⁻¹⁹) = <b>${sf(r,'m')}</b></span>.`};}}
);
