/* ---------------- FRQ section ---------------- */
(function frqs(){
  const saved=store('eml-frq')||{};const boxes=$$('input[data-frq]');
  boxes.forEach(b=>{b.checked=!!saved[b.id];b.addEventListener('change',()=>{const s2=store('eml-frq')||{};s2[b.id]=b.checked;store('eml-frq',s2);tally();});});
  function tally(){let all=0,max=0;$$('.frq').forEach(q=>{const n=$$('input[data-frq]',q).filter(b=>b.checked).length,t=+q.dataset.total;all+=n;max+=t;setText(q.id+'-score',`${n} / ${t}`);});
    setText('frq-total',`${all} of ${max} points`);$('#frq-meter').style.width=(100*all/max)+'%';}
  $('#frq-reset').addEventListener('click',()=>{boxes.forEach(b=>b.checked=false);store('eml-frq',{});tally();});
  function drawRC(){const cv=$('#frq-rc');if(!cv)return;const w=cv.clientWidth;if(!w)return;const c=prep(cv,220);if(!c)return;const {ctx}=c;const bw=Math.min(w-60,520);
    const P=panel(ctx,{x:48,y:10,w:bw,h:176},[0,5],[0,1.1],{ylabel:'I·R/ℰ  and  V_C/ℰ',color:T.ink,xlabel:'t / RC'});
    curve(ctx,P,t=>Math.exp(-t),0,5,T.cv,2.5);curve(ctx,P,t=>1-Math.exp(-t),0,5,T.cx,2.5);
    label(ctx,'I (from ℰ/R to 0)',P.X(1.2),P.Y(.42),T.cv,'left');label(ctx,'V_C (from 0 to ℰ)',P.X(1.3),P.Y(.72),T.cx,'left');}
  const R=[.01,.02,.03,.04,.05],B=[98,51,34,24,20],X=R.map(r=>1/r);let sl=.8,ic=5;
  function drawB(){const cv=$('#frq-bfit');if(!cv)return;const w=cv.clientWidth;if(!w)return;const c=prep(cv,240);if(!c)return;const {ctx}=c;
    const P=panel(ctx,{x:52,y:8,w:w-66,h:206},[0,110],[0,120],{ylabel:'B (μT)',color:T.ink,xlabel:'1/r (1/m)'});
    line(ctx,P,0,ic,110,ic+sl*110,T.cx,2);X.forEach((x,i)=>dot(ctx,P.X(x),P.Y(B[i]),5,T.hot));
    const sse=X.reduce((a,x,i)=>a+(B[i]-(ic+sl*x))**2,0);
    setText('frq-mu',sf(2*Math.PI*sl*1e-6/5,'T·m/A'));setText('frq-fit',sse<40?'good fit':sse<250?'close':'keep adjusting');}
  bindRange('frq-sl',x=>fmt(x,2)+' μT·m',x=>{sl=x;drawB();});bindRange('frq-ic',x=>fmt(x,1)+' μT',x=>{ic=x;drawB();});
  $$('#frq2 details').forEach(d=>d.addEventListener('toggle',drawRC));
  drawers.frq=()=>{drawRC();drawB();};tally();
})();
