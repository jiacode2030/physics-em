(function slices(){
  const cv=$('#sl-canvas');const s={mode:'uniform',n:6,L:.4,a:.1},Q=10e-9;
  const lam=(x,L)=>s.mode==='uniform'?1/L:2*x/(L*L);          // λ(x)·Q: fraction of Q per meter; integrates to 1
  const cx=(x,L)=>s.mode==='uniform'?x/L:x*x/(L*L);          // cumulative fraction of the charge up to x
  function exact(){const a=s.a,L=s.L;return s.mode==='uniform'?KC*Q/(a*(a+L)):KC*Q*2/(L*L)*(Math.log((a+L)/a)+a/(a+L)-1);}
  function draw(){const w=cv.clientWidth;if(!w)return;const h=Math.round(clamp(w*.34,210,260));const c=prep(cv,h);if(!c)return;const {ctx}=c;
    const {n,L,a}=s,sc=(w-60)/(a+L+.04),px0=24,y0=h*.42,X=x=>px0+x*sc;     // x measured from P
    ctx.strokeStyle=T.line;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px0-8,y0+.5);ctx.lineTo(w-8,y0+.5);ctx.stroke();
    const sl=[];let Es=0;for(let k=0;k<n;k++){const x0=L*k/n,x1=L*(k+1)/n,xm=(x0+x1)/2,dq=Q*(cx(x1,L)-cx(x0,L)),d=a+xm,dE=KC*dq/(d*d);Es+=dE;sl.push({x0,x1,xm,dq,dE});}
    sl.forEach(q=>{const xa=X(a+q.x0),xb=X(a+q.x1),sh=(q.dq/Q)*n/(s.mode==='uniform'?1:2);ctx.fillStyle=alpha(T.ca,clamp(.2+.5*sh,.15,.8));ctx.fillRect(xa+1,y0-14,Math.max(1,xb-xa-2),14);ctx.strokeStyle=alpha(T.ca,.9);ctx.strokeRect(xa+.5,y0-14.5,Math.max(1,xb-xa-1),14);});
    const chain=Math.min(w*.52,430);let acc=0;sl.forEach((q,k)=>{const xa=X(0)+10+chain*(1-acc/Es),xb=X(0)+10+chain*(1-(acc+q.dE)/Es);arrow(ctx,xa,y0+52,xb,y0+52,alpha(T.cx,k%2?.95:.6),n>16?2.5:4);acc+=q.dE;});
    label(ctx,'each slice makes a field arrow pointing left; they add tip to tail',X(0)+10,y0+74,T.muted,'left','middle',MONO);
    dot(ctx,X(0),y0-7,6,T.ink);label(ctx,'P',X(0),y0-24,T.ink,'center','middle');
    ctx.save();ctx.strokeStyle=T.muted;ctx.lineWidth=1;[[0,a,'a'],[a,a+L,'L']].forEach(([p,q,t])=>{const yy=y0-40;ctx.beginPath();ctx.moveTo(X(p),yy);ctx.lineTo(X(q),yy);ctx.stroke();label(ctx,t,(X(p)+X(q))/2,yy-10,T.muted,'center','middle',MONO);});ctx.restore();
    label(ctx,n+' slice'+(n>1?'s':''),w-12,12,T.ca,'right','top');
    const ex=exact(),pt=KC*Q/((a+(s.mode==='uniform'?L/2:2*L/3))**2);
    setText('sl-sum',sf(Es,'N/C'));setText('sl-ex',sf(ex,'N/C'));setText('sl-err',fmt(100*(Es-ex)/ex,2)+' %');setText('sl-pt',sf(pt,'N/C')+' ('+fmt(100*(pt-ex)/ex,0)+'%)');}
  drawers.slices=draw;
  segBind('sl-mode','k',k=>{s.mode=k;draw();});
  bindRange('sl-n',x=>String(x),x=>{s.n=x;draw();});bindRange('sl-L',x=>fmt(x,2)+' m',x=>{s.L=x;draw();});bindRange('sl-a',x=>fmt(x,2)+' m',x=>{s.a=x;draw();});
})();
Object.assign(TIPS,{"sl-n":"More slices means each slice is closer to a true point charge, so the sum of their fields converges to the exact integral.","sl-L":"A longer rod with the same total charge spreads the charge out, so the field at P drops.","sl-a":"The field falls off as the point moves away. Far from the rod, the slices are all nearly the same distance away and the rod acts like a single point charge."});
Object.assign(KEYS,{"sl-canvas":["Change the number of slices and the position of the point P.",[["ca","charge slices (darker = more charge)"],["cx","field of each slice at P"]]]});
Object.assign(TT,{slices:"Name the three things before integrating: what is dq, how far is it from the point, and which way does its field point."});
PROBS.push(
 {id:'qrod',topic:'slices',calc:1,title:'Total charge on a rod',gen(){const b=pick([2,3,4,5,6]),L=pick([.2,.3,.4,.5,.6]),ans=b*L*L/2;
   return {q:`A rod from x = 0 to x = ${num(L)} m has a charge density λ = bx, with b = ${num(b)} μC/m². What is its total charge, in μC?`,ans,unit:'μC',hint:'Q = ∫λ dx from 0 to L.',
   sol:`<span class="m"><i>Q</i> = ∫<sub>0</sub><sup>${num(L)}</sup> <i>bx</i> d<i>x</i> = <i>bL</i>²/2 = ${num(b)}(${num(L)})²/2 = <b>${fmt(ans,3)} μC</b></span>.`};}},
 {id:'qdisk',topic:'slices',calc:1,title:'Charge on a disk',gen(){const s0=pick([2,3,4,6]),R=pick([2,3,4,5]),ans=2*Math.PI*s0*R*R*1e-4/3;
   return {q:`A flat disk of radius ${num(R)} cm has a surface charge density σ = σ₀r/R that grows toward the edge, with σ₀ = ${num(s0)} μC/m². What is its total charge, in nC? (Slice it into thin rings: dq = σ·2πr dr.)`,ans:ans*1e3,unit:'nC',hint:'Q = ∫σ(r)·2πr dr from 0 to R. Convert R to meters first.',
   sol:`<span class="m"><i>Q</i> = ∫<sub>0</sub><sup><i>R</i></sup> (σ<sub>0</sub><i>r</i>/<i>R</i>)·2π<i>r</i> d<i>r</i> = 2πσ<sub>0</sub><i>R</i>²/3 = 2π(${num(s0)} × 10⁻⁶)(${num(R/100)})²/3 = <b>${fmt(ans*1e3,3)} nC</b></span>.`};}},
 {id:'rodE',topic:'slices',calc:1,title:'Field on the axis of a rod',gen(){const Q=pick([5,10,20,40]),L=pick([.2,.4,.6]),a=pick([.1,.2,.3]),ans=KC*Q*1e-9/(a*(a+L));
   return {q:`A uniformly charged rod of length ${num(L)} m carries ${num(Q)} nC. What is the electric field on the rod's axis, ${num(a)} m from the nearest end?`,ans,unit:'N/C',hint:'dE = k(Q/L)dx/(a + x)². Integrate x from 0 to L: the result is kQ/(a(a + L)).',
   sol:`<span class="m"><i class="ef">E</i> = <i>kQ</i>/(<i>a</i>(<i>a</i> + <i>L</i>)) = (8.99 × 10⁹)(${num(Q)} × 10⁻⁹)/(${num(a)} × ${num(a+L)}) = <b>${sf(ans,'N/C')}</b></span>, pointing away from the rod.`};}}
);
