(function conductors(){
  const cv=$('#cd-canvas');const s={mode:'field',E0:3,a:6,q:3,ro:8,gnd:false},RI=4;
  const Ef=(x,y)=>{const r=Math.hypot(x,y),a=s.a;if(r<a)return [0,0];const c=x/r,sn=y/r,k=Math.pow(a/r,3),Er=(1+2*k)*c,Et=-(1-k)*sn;return [Er*c-Et*sn,Er*sn+Et*c];};
  function trace(x,y,X0,X1,Y0,Y1){const pts=[[x,y]];for(let k=0;k<900;k++){const [ex,ey]=Ef(x,y),m=Math.hypot(ex,ey);if(m<1e-9)break;x+=.3*ex/m;y+=.3*ey/m;if(Math.hypot(x,y)<s.a+.05)break;pts.push([x,y]);if(x>X1||x<X0||Math.abs(y)>Y1)break;}return pts;}
  function drawF(ctx,w,h){const sc=Math.min(w/42,h/28),X=x=>w/2+x*sc,Y=y=>h/2-y*sc,a=s.a,lines=[];
    for(let y=-12;y<=12.01;y+=1.5)lines.push(trace(-21,y,-21,21,13.5,13.5));
    for(let th=-84;th<=84;th+=14){const t=th*Math.PI/180;lines.push(trace((a+.25)*Math.cos(t),(a+.25)*Math.sin(t),-21,21,13.5,13.5));}
    strokeLines(ctx,lines,X,Y,T.cx);
    ctx.fillStyle=T.sunk;ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X(0),Y(0),a*sc,0,Math.PI*2);ctx.fill();ctx.stroke();
    for(let th=0;th<360;th+=10){const t=th*Math.PI/180,c=Math.cos(t);if(Math.abs(c)<.08)continue;const r=1.6+4*Math.abs(c);dot(ctx,X((a-.0)*Math.cos(t)),Y(a*Math.sin(t)),r,c>0?T.pos:T.neg);}
    label(ctx,'E = 0 inside',X(0),Y(0),T.muted,'center','middle',MONO);label(ctx,'applied field E₀ →',10,16,T.cx,'left','middle',MONO);
    const E0=s.E0*1000;setText('cd-r1','0');setText('cd-r2',sf(3*E0,'N/C')+' (3E₀)');setText('cd-r3','0');setText('cd-r4',sf(3*EPS0*E0*1e9,'nC/m²')+' max');}
  function drawC(ctx,w,h){const sc=Math.min(w/42,h/28),X=x=>w/2+x*sc,Y=y=>h/2-y*sc,ro=s.ro,q=s.q;
    ctx.fillStyle=T.sunk;ctx.beginPath();ctx.arc(X(0),Y(0),ro*sc,0,Math.PI*2);ctx.fill();ctx.fillStyle=T.surface;ctx.beginPath();ctx.arc(X(0),Y(0),RI*sc,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X(0),Y(0),ro*sc,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(X(0),Y(0),RI*sc,0,Math.PI*2);ctx.stroke();
    const n=Math.max(6,Math.abs(q)*4);const dirOut=q>0;
    if(q){for(let k=0;k<n;k++){const t=k/n*Math.PI*2+.1;const r0=1.2,r1=RI-.15;arrow(ctx,X(r0*Math.cos(t)),Y(r0*Math.sin(t)),X(r1*Math.cos(t)),Y(r1*Math.sin(t)),T.cx,1.6);
        if(!s.gnd){const r2=ro+.2,r3=Math.min(ro+4.5,13);arrow(ctx,X(r2*Math.cos(t)),Y(r2*Math.sin(t)),X(r3*Math.cos(t)),Y(r3*Math.sin(t)),alpha(T.cx,.8),1.6);}}
      if(q<0){/* arrows should point inward */}}
    chargeDot(ctx,X(0),Y(0),q,12);
    const m=Math.max(0,Math.abs(q));for(let k=0;k<m*3;k++){const t=k/(m*3)*Math.PI*2+.05;dot(ctx,X(RI*Math.cos(t)),Y(RI*Math.sin(t)),3.2,q>0?T.neg:T.pos);if(!s.gnd)dot(ctx,X(ro*Math.cos(t+.1)),Y(ro*Math.sin(t+.1)),3.2,q>0?T.pos:T.neg);}
    label(ctx,'metal',X(0),Y((RI+ro)/2)-0,T.muted,'center','middle',MONO);
    const qs=v=>(v>0?'+':v<0?'−':'')+Math.abs(v)+' nC';setText('cd-r1',qs(-q));setText('cd-r2',s.gnd?'0 (grounded)':qs(q));setText('cd-r3','0');
    setText('cd-r4',s.gnd?'0 (no field outside)':sf(KC*Math.abs(q)*1e-9/Math.pow(2*ro*.01,2),'N/C'));}
  function draw(){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.58,300,440));const c=prep(cv,h);if(!c)return;if(s.mode==='field')drawF(c.ctx,w,h);else drawC(c.ctx,w,h);relabel();}
  function relabel(){const l=(id,t)=>{const e=$('#'+id);if(e)e.previousElementSibling.textContent=t;};
    if(s.mode==='field'){l('cd-r1','Field inside the metal');l('cd-r2','Field at the poles');l('cd-r3','Field at the equator');l('cd-r4','Induced surface charge');}
    else{l('cd-r1','Charge on the inner wall');l('cd-r2','Charge on the outer surface');l('cd-r3','Field in the metal');l('cd-r4','Field at twice the outer radius');}}
  drawers.conductors=draw;
  segBind('cd-mode','k',k=>{s.mode=k;$('#cd-f-ctl').hidden=k!=='field';$('#cd-c-ctl').hidden=k==='field';draw();});
  bindRange('cd-E0',x=>fmt(x,1)+' kN/C',x=>{s.E0=x;draw();});bindRange('cd-a',x=>fmt(x,1)+' cm',x=>{s.a=x;draw();});
  bindRange('cd-q',x=>(x>0?'+':x<0?'−':'')+Math.abs(x)+' nC',x=>{s.q=x;draw();});bindRange('cd-ro',x=>fmt(x,1)+' cm',x=>{s.ro=x;draw();});
  $('#cd-gnd').addEventListener('change',e=>{s.gnd=e.target.checked;draw();});
})();
Object.assign(TIPS,{"cd-E0":"A stronger applied field pushes more charge across the sphere, but the field inside stays exactly zero. Only the surface charge and the outside field get bigger.","cd-a":"A bigger sphere gathers more induced charge, but the field at the poles stays 3E₀. The shape, not the size, sets the factor.","cd-q":"The wall charges always match the charge in the cavity: −q on the inside surface, +q on the outside (if the shell is isolated).","cd-ro":"Changing the outer radius moves the outer charge but not its amount. The field outside is still kq/r² for the same total charge.","cd-gnd":"Grounding lets charge flow to or from the earth until the outer surface is neutral. No charge on the outside means no field outside."});
Object.assign(KEYS,{"cd-canvas":["Switch between the two situations; drag the sliders and watch the charge dots move.",[["cx","field lines"],["pos","positive induced charge"],["neg","negative induced charge"]]]});
Object.assign(TT,{conductors:"Start every conductor problem with E = 0 in the metal. Then use Gauss's law with a surface inside the metal to find the induced charges."});
PROBS.push(
 {id:'csig',topic:'conductors',title:'Field at the surface of a charged conductor',gen(){const Q=pick([2,4,6,10]),R=pick([2,3,5,8]),sig=Q*1e-9/(4*Math.PI*(R*.01)**2),ans=sig/EPS0;
   return {q:`A conducting sphere of radius ${R} cm carries a total charge of +${Q} nC. What is the electric field just outside its surface?`,ans,unit:'N/C',hint:'Charge spreads evenly over the surface of an isolated sphere: σ = Q/4πR². Just outside, E = σ/ε₀. (Or use kQ/R².)',
   sol:`<span class="m">σ = ${num(Q)} × 10⁻⁹/(4π(${num(R/100)})²) = ${sf(sig,'C/m²')}</span>, so <span class="m"><i class="ef">E</i> = σ/ε<sub>0</sub> = <b>${sf(ans,'N/C')}</b></span>.`};}},
 {id:'cshell',topic:'conductors',title:'Field outside a shell with a charge inside',gen(){const q=pick([2,4,6,9]),r=pick([10,15,20,30]),ans=KC*q*1e-9/Math.pow(r*.01,2);
   return {q:`A neutral hollow conducting shell has inner radius 3 cm and outer radius 5 cm. A +${q} nC point charge sits at its center. What is the electric field ${r} cm from the center?`,ans,unit:'N/C',hint:'The shell is neutral, so the total enclosed charge is just +q. Use Gauss\'s law with a sphere at r.',
   sol:`<span class="m"><i class="ef">E</i> = <i>kq</i>/<i>r</i>² = (8.99 × 10⁹)(${q} × 10⁻⁹)/(${num(r/100)})² = <b>${sf(ans,'N/C')}</b></span>. The inner wall has −${q} nC and the outer surface +${q} nC, but their effects outside add to the point-charge result.`};}},
 {id:'cwire',topic:'conductors',title:'Two spheres joined by a wire',gen(){const r1=pick([2,3,4]),r2=pick([6,8,9]),Q=pick([6,10,14]),ans=Q*r1/(r1+r2);
   return {q:`Two conducting spheres, of radii ${r1} cm and ${r2} cm, are connected by a long thin wire and share a total charge of ${Q} nC. How much charge ends up on the smaller sphere, in nC?`,ans,unit:'nC',hint:'Connected conductors have the same potential: kQ₁/r₁ = kQ₂/r₂, so Q ∝ r.',
   sol:`<span class="m"><i>Q</i><sub>1</sub>/<i>r</i><sub>1</sub> = <i>Q</i><sub>2</sub>/<i>r</i><sub>2</sub></span> and <span class="m"><i>Q</i><sub>1</sub> + <i>Q</i><sub>2</sub> = ${Q}</span> give <span class="m"><i>Q</i><sub>1</sub> = ${Q}·${r1}/(${r1}+${r2}) = <b>${fmt(ans,3)} nC</b></span>. The smaller sphere has the larger charge density and field.`};}}
);
PROBS.push(
 {id:'cshare',topic:'conductors',title:'Touching spheres',gen(){const Q=pick([4,6,8,12]),ans=Q/2;
   return {q:`An isolated conducting sphere carries +${Q} nC. It is touched to an identical, uncharged conducting sphere and then separated. How much charge is on each sphere afterwards, in nC?`,ans,unit:'nC',hint:'Identical spheres reach equal potential when they hold equal charge. Total charge is conserved.',
   sol:`Total = ${Q} nC, split equally: <span class="m"><b>${fmt(ans,3)} nC</b></span> on each.`};}},
 {id:'cdens',topic:'conductors',title:'Charge density on two joined spheres',gen(){const r1=pick([2,3,4]),k=pick([2,3,4]),r2=r1*k,ans=k;
   return {q:`Two conducting spheres of radii ${r1} cm and ${r2} cm are joined by a long thin wire. What is the ratio of the surface charge density of the smaller sphere to that of the larger one?`,ans,unit:'',hint:'Equal potentials mean Q ∝ r. Then σ = Q/4πr² goes as 1/r.',
   sol:`<span class="m">σ<sub>1</sub>/σ<sub>2</sub> = <i>r</i><sub>2</sub>/<i>r</i><sub>1</sub> = <b>${k}</b></span>. The smaller sphere has the larger density, and so the stronger field at its surface.`};}}
);
