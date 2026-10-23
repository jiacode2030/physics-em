(function practice(){
  const list=$('#pr-list');let filter='all';const inst={};const inGroup=(f,tp)=>f==='all'||GROUPS[+f].ids.includes(tp);
  function solved(){return store('eml-solved')||{};}
  function score(){const s=solved();const n=PROBS.filter(p=>s[p.id]).length;$('#pr-score').textContent=`${n} of ${PROBS.length} solved`;$('#pr-meter').style.width=(100*n/PROBS.length)+'%';renderMods();}
  function card(p){const s=solved();const d=inst[p.id]=p.gen();const el=document.createElement('article');el.className='prob'+(s[p.id]?' solved':'');el.dataset.topic=p.topic;el.id='prob-'+p.id;el.rpCtx={pid:p.id,title:p.title,ans:d.ans,unit:d.unit};
    el.innerHTML=`<header><span class="tag">${MODS[p.topic].t}</span><span class="tag ap">${MODS[p.topic].ap}</span>${p.calc?'<span class="tag calc">Calculus</span>':''}<span class="done">${s[p.id]?'Solved':''}</span></header>
      <h3>${p.title}</h3><p class="q">${d.q}</p>
      <form class="ans"><label class="small" for="in-${p.id}">Answer</label><input type="text" inputmode="decimal" id="in-${p.id}" autocomplete="off"><span class="unit">${d.unit}</span><button type="submit" class="btn primary">Check</button></form>
      <p class="fb" aria-live="polite"></p>
      <div class="row"><button type="button" class="btn link" data-act="hint">Hint</button><button type="button" class="btn link" data-act="sol">Show solution</button><button type="button" class="btn link" data-act="new">New numbers</button><button type="button" class="btn link rp-link" data-report="${p.topic}" style="margin-left:auto">Report this problem</button></div>
      <div class="box" data-box="hint" hidden><p>${d.hint}</p></div><div class="box" data-box="sol" hidden><p>${d.sol}</p></div>`;
    $('form',el).addEventListener('submit',e=>{e.preventDefault();const raw=$('input',el).value.trim().replace(/[−–]/g,'-').replace(/,/g,'');const fb=$('.fb',el);const x=parseFloat(raw);const ans=inst[p.id].ans;
      if(raw===''||!isFinite(x)){fb.className='fb no';fb.textContent='Enter a number, without units.';return;}
      const ok=Math.abs(x-ans)<=Math.max(.02*Math.abs(ans),.01);
      if(ok){fb.className='fb ok';fb.textContent=`Correct: ${fmt(ans,3)} ${inst[p.id].unit}.`;const s=solved();s[p.id]=1;store('eml-solved',s);el.classList.add('solved');$('.done',el).textContent='Solved';score();}
      else{fb.className='fb no';fb.textContent=(Math.abs(x+ans)<=Math.max(.02*Math.abs(ans),.01)?'Check your sign.':'Not yet. Try the hint, or check your units.')+' (Added to Review my mistakes.)';reviewMiss(p.id);}});
    $$('[data-act]',el).forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.act;if(a==='new'){el.replaceWith(card(p));return;}const box=$(`[data-box="${a}"]`,el);box.hidden=!box.hidden;
      if(a==='sol')b.textContent=box.hidden?'Show solution':'Hide solution';}));
    el.hidden=!inGroup(filter,p.topic);return el;}
  PROBS.forEach(p=>list.appendChild(card(p)));
  $('#pr-filter').innerHTML='<button type="button" data-f="all" aria-pressed="true">All</button>'+GROUPS.map((g,i)=>`<button type="button" data-f="${i}">${g.name}</button>`).join('');
  $$('#pr-filter button').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.f;$$('#pr-filter button').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.prob',list).forEach(el=>el.hidden=!inGroup(filter,el.dataset.topic));}));
  setText('pr-count',PROBS.length);
  $('#pr-reset').addEventListener('click',()=>{store('eml-solved',{});$$('.prob',list).forEach(el=>{el.classList.remove('solved');$('.done',el).textContent='';});score();});
  score();
})();



/* ---------------- Formula sheet drawer ---------------- */
(function(){const fs=$('#fs'),btn=$('#fs-btn'),scrim=$('#fs-scrim');$$('.body>*',fs).forEach((el,i)=>el.style.setProperty('--i',Math.min(i,16)));
  function set(o){fs.classList.toggle('open',o);fs.setAttribute('aria-hidden',!o);btn.setAttribute('aria-expanded',o);$('.fs-lbl',btn).textContent=o?'Hide formulas':'Formula sheet';scrim.classList.toggle('on',o);store('eml-fs',o);setTimeout(()=>redraw(),280);}
  btn.addEventListener('click',()=>set(!fs.classList.contains('open')));$('#fs-close').addEventListener('click',()=>set(false));scrim.addEventListener('click',()=>set(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&fs.classList.contains('open'))set(false);});
  if(store('eml-fs')===true&&window.innerWidth>=1500)set(true);})();



/* ---------------- Free-body diagrams + worked-example steps ---------------- */
(function examples(){
  const C={f:'var(--hot)',a:'var(--ca)',v:'var(--cv)',o:'var(--cx)',m:'var(--muted)',i:'var(--ink)'};
  function arr(x,y,ang,len,c,lab,dash){const r=ang*Math.PI/180,ux=Math.cos(r),uy=-Math.sin(r),x2=x+ux*len,y2=y+uy*len,h=9;
    return `<line x1="${x}" y1="${y}" x2="${x2-ux*h*.7}" y2="${y2-uy*h*.7}" style="stroke:${c};stroke-width:2.6;stroke-linecap:round${dash?';stroke-dasharray:5 4':''}"/><polygon points="${x2},${y2} ${x2-ux*h-uy*h*.55},${y2-uy*h+ux*h*.55} ${x2-ux*h+uy*h*.55},${y2-uy*h-ux*h*.55}" style="fill:${c}"/>`+(lab?`<text x="${x2+ux*15}" y="${y2+uy*15+4}" text-anchor="middle" style="fill:${c};font:600 12.5px 'IBM Plex Sans',system-ui,sans-serif">${lab}</text>`:'');}
  /* Each worked example's FBD builds up with the steps: plain forces and the chosen +x/+y axes first,
     then components and the numbers each step works out. */
  const FBX={"efield":[{"notes":[[2,"E₁ = 3.60 × 10³ N/C","e"],[3,"E₂ = 4.5 × 10² N/C","e"],[4,"E = 4.05 × 10³ N/C →","e"],[5,"F on electron: 6.5 × 10⁻¹⁶ N ←","f"],[6,"✓ both pushes agree","i"]]}]};
  const NOTE={f:'f',a:'a',v:'v',i:'i',e:'e',b:'a'};
  function svg(d,cf={},n=0,prev=n){if(cf.acc&&!d.acc)d={...d,acc:cf.acc};const W=260,H=230,cx=130,cy=118;let o='';const inc=d.incline||0,ri=inc*Math.PI/180;
    const AX=cf.axes||[[0,'+x','right'],[90,'+y','up']];let axl='';
    AX.forEach(([a])=>{const r=a*Math.PI/180,ux=Math.cos(r),uy=-Math.sin(r);axl+=`<line x1="${cx-ux*104}" y1="${cy-uy*104}" x2="${cx+ux*104}" y2="${cy+uy*104}" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:3 4;opacity:.5"/>`;});
    if(d.planet)o+=`<circle cx="22" cy="${cy}" r="34" style="fill:var(--muted);opacity:.5"/><text x="22" y="${cy+4}" text-anchor="middle" style="fill:var(--ink);font:500 10px 'IBM Plex Mono',monospace">${d.planetLabel||'Earth'}</text>`;
    const LAD={bottom:[cx-55,cy+72],top:[cx+55,cy-52],mid:[cx,cy+10]};
    if(d.obj==='ladder')o+=`<line x1="14" y1="${cy+72}" x2="${W-14}" y2="${cy+72}" style="stroke:var(--ink);stroke-width:2"/><line x1="${cx+55}" y1="14" x2="${cx+55}" y2="${cy+72}" style="stroke:var(--ink);stroke-width:2"/><line x1="${cx-55}" y1="${cy+72}" x2="${cx+55}" y2="${cy-52}" style="stroke:var(--cx);stroke-width:6;stroke-linecap:round"/>`;
    if(inc){const L=150,bx=cx,by=cy+20/Math.cos(ri);o+=`<line x1="${bx-L*Math.cos(ri)}" y1="${by+L*Math.sin(ri)}" x2="${bx+L*Math.cos(ri)}" y2="${by-L*Math.sin(ri)}" style="stroke:var(--ink);stroke-width:2"/>`;}
    else if(d.ground)o+=`<line x1="20" y1="${cy+(d.obj==='car'?16:20)}" x2="${W-20}" y2="${cy+(d.obj==='car'?16:20)}" style="stroke:var(--ink);stroke-width:2"/>`;
    const tr=`transform="rotate(${-inc} ${cx} ${cy})"`;
    const CH=sg=>sg==='+'?'var(--pos)':sg==='−'?'var(--neg)':'var(--muted)';
    (d.others||[]).forEach(([dx,dy,sg])=>{o+=`<circle cx="${cx+dx}" cy="${cy+dy}" r="12" style="fill:${CH(sg)}"/><text x="${cx+dx}" y="${cy+dy+5}" text-anchor="middle" style="fill:#fff;font:700 15px 'IBM Plex Sans',sans-serif">${sg}</text>`;});
    if(d.obj==='charge'){const sg=d.sign||'+';if(sg==='+'||sg==='−')o+=`<circle cx="${cx}" cy="${cy}" r="15" style="fill:${CH(sg)}"/><text x="${cx}" y="${cy+6}" text-anchor="middle" style="fill:#fff;font:700 18px 'IBM Plex Sans',sans-serif">${sg}</text>`;
      else o+=`<circle cx="${cx}" cy="${cy}" r="5" style="fill:var(--ink)"/><text x="${cx}" y="${cy+26}" text-anchor="middle" style="fill:var(--ink);font:600 13px 'IBM Plex Sans',sans-serif">${sg}</text>`;}
    else if(d.obj==='box')o+=`<rect x="${cx-20}" y="${cy-20}" width="40" height="40" ${tr} style="fill:color-mix(in srgb,var(--cx) 18%,transparent);stroke:var(--cx);stroke-width:2"/>`;
    else if(d.obj==='ball')o+=`<circle cx="${cx}" cy="${cy}" r="18" style="fill:color-mix(in srgb,var(--cx) 18%,transparent);stroke:var(--cx);stroke-width:2"/>`;
    else if(d.obj==='dot')o+=`<circle cx="${cx}" cy="${cy}" r="6" style="fill:var(--cx)"/>`;
    else if(d.obj==='car')o+=`<rect x="${cx-30}" y="${cy-10}" width="60" height="18" rx="3" style="fill:color-mix(in srgb,var(--cx) 18%,transparent);stroke:var(--cx);stroke-width:2"/><rect x="${cx-15}" y="${cy-22}" width="30" height="12" rx="2" style="fill:color-mix(in srgb,var(--cx) 18%,transparent);stroke:var(--cx);stroke-width:2"/><circle cx="${cx-17}" cy="${cy+10}" r="6" style="fill:var(--ink)"/><circle cx="${cx+17}" cy="${cy+10}" r="6" style="fill:var(--ink)"/>`;
    else if(d.obj==='beam')o+=`<rect x="${cx-100}" y="${cy-5}" width="200" height="10" style="fill:var(--ink)"/>`;
    else if(d.obj==='segment')o+=`<path d="M ${cx-70} ${cy+10} Q ${cx} ${cy-15.5} ${cx+70} ${cy+10}" style="fill:none;stroke:var(--cx);stroke-width:4;stroke-linecap:round"/>`;
    (d.forces||[]).forEach(([lab,ang,rel,op])=>{let x=cx+(op.dx||0),y=cy+(op.dy||0);
      if(d.obj==='beam'&&op.at!==undefined){x=cx+op.at*100;y=ang===90?cy-5:cy+5;}
      if(d.obj==='ladder'&&op.at){[x,y]=LAD[op.at];}
      if(d.obj==='segment'){const left=Math.cos(ang*Math.PI/180)<0;x=left?cx-70:cx+70;y=cy+10;}
      o+=arr(x,y,ang,22+62*rel,C.f,lab);});
    const side=(sp,mx,my,c,lab)=>{const len=20+30*sp[1],r=sp[0]*Math.PI/180,ux=Math.cos(r),uy=-Math.sin(r);return arr(mx-ux*len/2,my-uy*len/2,sp[0],len,c,lab);};
    if(d.acc)o+=side(d.acc,44,H-36,C.a,'a');
    if(d.vel)o+=side(d.vel,44,36,C.v,'v');
    /* components along the chosen axes, added at the step that uses them */
    (cf.comps||[]).forEach(([fi,st,lx,ly])=>{if(st>n)return;let ang,len,x,y,col;
      if(fi==='v'){const sp=d.vel,L=20+30*sp[1],r=sp[0]*Math.PI/180;ang=sp[0];len=L;x=44-Math.cos(r)*L/2;y=36+Math.sin(r)*L/2;col=C.v;}
      else{const F=d.forces[fi],op=F[3]||{};ang=F[1];len=22+62*F[2];x=cx+(op.dx||0);y=cy+(op.dy||0);if(d.obj==='segment'){x=Math.cos(ang*Math.PI/180)<0?cx-70:cx+70;y=cy+10;}col=C.f;}
      const tip=[x+Math.cos(ang*Math.PI/180)*len,y-Math.sin(ang*Math.PI/180)*len];let g='';
      AX.slice(0,2).forEach(([a],k)=>{const p=len*Math.cos((ang-a)*Math.PI/180);if(Math.abs(p)<5)return;const dir=p>0?a:a+180,r=dir*Math.PI/180,ex=x+Math.cos(r)*Math.abs(p),ey=y-Math.sin(r)*Math.abs(p);
        const mx=(x+ex)/2,my=(y+ey)/2;let nx=-Math.sin(r),ny=-Math.cos(r);if((tip[0]-mx)*nx+(tip[1]-my)*ny>0){nx=-nx;ny=-ny;}const lb=[lx,ly][k],anc=Math.abs(nx)<.35?'middle':nx>0?'start':'end';
        g+=`<line x1="${ex}" y1="${ey}" x2="${tip[0]}" y2="${tip[1]}" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:2 3"/>`+arr(x,y,dir,Math.abs(p),col,'',true)+
          `<text x="${mx+nx*12}" y="${my+ny*12+4}" text-anchor="${anc}" style="fill:${col};font:600 11px 'IBM Plex Sans',system-ui,sans-serif;paint-order:stroke;stroke:var(--sunk);stroke-width:3px;stroke-linejoin:round">${lb}</text>`;});
      o+=`<g${st>prev?' class="fbnew"':''}>${g}</g>`;});
    /* axis key in the corner */
    let tri='';const kx=W-34,ky=H-30;AX.forEach(([a,nm])=>{const r=a*Math.PI/180;tri+=arr(kx,ky,a,26,'var(--ink)');tri+=`<text x="${kx+Math.cos(r)*40}" y="${ky-Math.sin(r)*40+4}" text-anchor="middle" style="fill:var(--ink);font:600 11px 'IBM Plex Mono',monospace">${nm}</text>`;});
    const sv=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Free-body diagram: ${(d.forces||[]).map(f=>f[0]).join(', ')}">${axl}${o}${tri}</svg>`;
    const notes=`<div class="fbdnotes"><span class="ax">${AX.map(([,nm,ds])=>nm+' '+ds).join(', ')}</span>`+(cf.notes||[]).filter(q=>q[0]<=n).map(q=>`<span class="${NOTE[q[2]]||'i'}${q[0]>prev?' new':''}">${q[1]}</span>`).join('')+'</div>';
    return sv+notes;}
  const cfOf=el=>{const v=el.closest('.view'),ex=el.closest('.example');const id=v?v.id.slice(2):'',i=ex?$$('.fbd',ex).indexOf(el):0;return (FBX[id]||[])[i]||{};};
  $$('.fbd').forEach(el=>{el._d=JSON.parse(el.dataset.fbd);el._cf=cfOf(el);el._n=0;el.innerHTML=svg(el._d,el._cf,0);});
  $$('.example').forEach(ex=>{const lis=$$('.exsteps li',ex),nx=$('[data-next]',ex),all=$('[data-all]',ex);
    const upd=()=>{const shown=lis.filter(l=>!l.hidden).length;$$('.stepfig',ex).forEach(f=>{const was=+(f.dataset.n||0);$$('[data-s]',f).forEach(el=>{const on=+el.dataset.s<=shown,wasOn=+el.dataset.s<=was;el.toggleAttribute('hidden',!on);el.classList.toggle('fbnew',on&&!wasOn&&shown>was);});f.dataset.n=shown;});$$('.fbd',ex).forEach(f=>{if(f._n!==shown){f.innerHTML=svg(f._d,f._cf,shown,f._n);f._n=shown;}});if(shown>=lis.length){nx.textContent='All steps shown';nx.disabled=true;all.textContent='Hide steps';}else{nx.disabled=false;nx.textContent=`Show step ${shown+1} of ${lis.length}`;all.textContent='Show all steps';}};
    nx.addEventListener('click',()=>{const h=lis.find(l=>l.hidden);if(h){lis.forEach(l=>{l.classList.remove('new');l.style.animationDelay='';});h.hidden=false;h.classList.add('new');}upd();});
    all.addEventListener('click',()=>{const allShown=lis.every(l=>!l.hidden);lis.forEach((l,i)=>{l.hidden=allShown;l.classList.remove('new');l.style.animationDelay=allShown?'':i*70+'ms';});upd();});upd();});
})();
/* ---------------- "How to read it" keys and Set-it-up buttons ---------------- */
(function guides(){
  Object.entries(KEYS).forEach(([id,[todo,items]])=>{const cv=$('#'+id);if(!cv)return;const d=document.createElement('div');d.className='howto';
    d.innerHTML=`<span class="do">${todo}</span>`+items.map(([c,t,st])=>`<span class="key"><i class="${st||''}" style="--k:var(--${c})"></i>${t}</span>`).join('');(cv.closest('.v3')||cv).before(d);});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-show]');if(!b)return;const acts=JSON.parse(b.dataset.show),sec=b.closest('.view');let first=null;
    acts.forEach(a=>{let el;if(a[0]==='click'){el=$(a[1],sec);el&&el.click();}else{el=$(a[0]);if(!el)return;
      if(el.type==='checkbox'){if(el.checked!==a[1]){el.checked=a[1];el.dispatchEvent(new Event('change',{bubbles:true}));el.dispatchEvent(new Event('input',{bubbles:true}));}}
      else{el.value=a[1];el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));}}first=first||el;});
    const lab=first&&first.closest('.lab');if(lab){const top=lab.getBoundingClientRect().top+scrollY-(innerWidth>900?70:80);scrollTo({top,behavior:REDUCE?'auto':'smooth'});lab.classList.add('flash');setTimeout(()=>lab.classList.remove('flash'),1200);}
    const det=b.closest('li')&&b.closest('li').querySelector('details');b.textContent='Set up ✓ (open the answer when ready)';setTimeout(()=>b.textContent='Set it up for me',4000);});})();
/* ---------------- Teaching layer: steps, coach, glossary, tips, progress ---------------- */
(function teach(){
  const order=[...Object.keys(MODS)];const done=()=>store('eml-done')||{};
  function setDone(id,v){const d=done(),was=!!d[id];if(v)d[id]=1;else delete d[id];store('eml-done',d);paint();if(v&&!was)celebrate(id);}
  function paint(){const d=done();$$('#nav a').forEach(a=>a.classList.toggle('done',!!d[a.dataset.view]));
    $$('.mod').forEach(m=>m.classList.toggle('done',!!d[(m.getAttribute('href')||'').slice(1)]));
    $$('[data-done-btn]').forEach(b=>{const on=!!d[b.dataset.doneBtn];if(on===b.classList.contains('isdone')&&b.childNodes.length)return;b.classList.toggle('isdone',on);
      b.innerHTML=on?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Done':'Mark as done';});
    const n=order.filter(k=>d[k]).length;const el=$('#ov-prog');if(el)el.textContent=`${n} of ${order.length} modules done`;
    const rp=$('#rail-prog');if(rp)rp.textContent=`${n} of ${order.length} modules done`;const rm=$('#rail-meter');if(rm)rm.style.setProperty('--p',n/order.length);}
  const _rm=renderMods;renderMods=function(){_rm();paint();};
  order.forEach((id,i)=>{const sec=$('#v-'+id);if(!sec)return;const wrap=$('.wrap',sec),head=$('.head',sec);
    if(TT[id]){const q=$('.quiz',sec);const tip=document.createElement('div');tip.className='ttip';tip.innerHTML=`<h3>Teaching tip</h3><p>${TT[id]}</p>`;(q||wrap.lastChild).before(tip);}
    const parts=[['.intuit','The idea'],['.assume','What changed'],['.lab','Explore'],['.try','Try this'],['.example','Worked example'],['.oops','Mistakes'],['.prose','Explanation'],['.ttip','Tip'],['.quiz','Check yourself']];
    const found=parts.map(([sel,lab])=>[$(sel,sec),lab]).filter(x=>x[0]).sort((a,b)=>a[0].compareDocumentPosition(b[0])&4?-1:1);
    const bar=document.createElement('nav');bar.className='steps';bar.setAttribute('aria-label','Sections of this module');
    found.forEach(([el,lab],k)=>{el.id=el.id||`${id}-s${k}`;const a=document.createElement('a');a.href='#'+id;a.innerHTML=`<span class="sn">${k+1}</span>${lab}`;a.dataset.target=el.id;
      a.addEventListener('click',e=>{e.preventDefault();const top=$('#'+a.dataset.target).getBoundingClientRect().top+scrollY-(innerWidth>900?64:80);scrollTo({top,behavior:REDUCE?'auto':'smooth'});});bar.appendChild(a);});
    const ind=document.createElement('span');ind.className='ind';ind.setAttribute('aria-hidden','true');bar.prepend(ind);bar.classList.add('has-ind');
    head.after(bar);
    const prev=order[i-1],next=order[i+1]||'practice';const nm=k=>k==='practice'?'Practice set':MODS[k].t;
    const nav=document.createElement('div');nav.className='modnav';
    nav.innerHTML=(prev?`<a href="#${prev}"><span>← Previous</span><strong>${nm(prev)}</strong></a>`:'<div></div>')+`<div class="mid"><button type="button" class="btn" data-done-btn="${id}">Mark as done</button><button type="button" class="btn link rp-link" data-report="${id}">Report an issue</button></div><a class="nx" href="#${next}"><span>Next →</span><strong>${nm(next)}</strong></a>`;
    wrap.appendChild(nav);
    $$('.quiz',sec).forEach(q=>$$('.opts button',q).forEach((b,j)=>b.addEventListener('click',()=>{if(j===+q.dataset.correct)setDone(id,true);})));
  });
  document.addEventListener('click',e=>{const b=e.target.closest('[data-done-btn]');if(b){const id=b.dataset.doneBtn;setDone(id,!done()[id]);if(done()[id])burst(b,18);}});
  stepSync=snap=>{const sec=$('.view:not([hidden])');if(!sec)return;const bar=$('.steps',sec);if(!bar)return;const links=$$('a',bar);if(!links.length)return;let cur=links[0];
    links.forEach(a=>{const el=$('#'+a.dataset.target);if(el&&el.getBoundingClientRect().top<innerHeight*.35)cur=a;});
    const moved=!cur.classList.contains('on');links.forEach(a=>a.classList.toggle('on',a===cur));
    const ind=$('.ind',bar);if(!ind||!cur.offsetWidth)return;if(snap||!ind.style.width)ind.classList.add('snap');
    ind.style.top=cur.offsetTop+'px';ind.style.height=cur.offsetHeight+'px';ind.style.width=cur.offsetWidth+'px';ind.style.transform=`translateX(${cur.offsetLeft}px)`;
    if(ind.classList.contains('snap')){void ind.offsetWidth;ind.classList.remove('snap');}
    if(moved){const L=cur.offsetLeft,R=L+cur.offsetWidth;if(L<bar.scrollLeft||R>bar.scrollLeft+bar.clientWidth)bar.scrollTo({left:Math.max(0,L-16),behavior:REDUCE?'auto':'smooth'});}};
  window.addEventListener('scroll',()=>stepSync(),{passive:true});
  $$('.lab').forEach(lab=>{const inputs=$$('input[type=range],input[type=checkbox],select',lab);if(!inputs.length)return;
    const coach=document.createElement('p');coach.className='coach';coach.setAttribute('aria-live','polite');coach.innerHTML='<b>Coach</b><span>Move any control and I\'ll explain what it changes.</span>';lab.appendChild(coach);
    let ft;lab.addEventListener('input',e=>{const t=TIPS[e.target.id];if(!t)return;coach.lastChild.textContent=t;coach.classList.add('flash');clearTimeout(ft);ft=setTimeout(()=>coach.classList.remove('flash'),500);});
    lab.addEventListener('change',e=>{if(e.target.type==='checkbox'||e.target.tagName==='SELECT'){const t=TIPS[e.target.id];if(t)coach.lastChild.textContent=t;}});
    const defs=inputs.map(x=>[x,x.type==='checkbox'?x.checked:x.value]);const bar=$('.labbar',lab);
    if(bar){const r=document.createElement('button');r.type='button';r.className='btn';r.textContent='Reset';r.title='Put every control in this panel back to its starting value';
      r.addEventListener('click',()=>{defs.forEach(([x,v])=>{if(x.type==='checkbox'){if(x.checked!==v){x.checked=v;x.dispatchEvent(new Event('change',{bubbles:true}));}}else if(x.value!==v){x.value=v;x.dispatchEvent(new Event(x.tagName==='SELECT'?'change':'input',{bubbles:true}));}});coach.lastChild.textContent='Everything is back to its starting values.';});
      let row=bar.lastElementChild&&bar.lastElementChild.classList.contains('row')?bar.lastElementChild:null;if(!row){row=document.createElement('div');row.className='row';const last=bar.lastElementChild;if(last&&last.tagName==='BUTTON')row.appendChild(last);bar.appendChild(row);}row.appendChild(r);}});
  const tip=document.createElement('div');tip.id='gtip';tip.hidden=true;document.body.appendChild(tip);
  const terms=Object.keys(GLOSS).sort((a,b)=>b.length-a.length);const re=new RegExp('\\b('+terms.join('|')+')\\b','i');
  $$('.view').forEach(sec=>{const used=new Set();$$('.intuit p, .lede, .prose p, .prose li, .try li > p, .oops li',sec).forEach(box=>{
    const w=document.createTreeWalker(box,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('.m,a,.gloss,b,summary')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
    nodes.forEach(n=>{const m=n.nodeValue.match(re);if(!m)return;const key=m[1].toLowerCase();if(used.has(key))return;used.add(key);
      const after=n.splitText(m.index);after.nodeValue=after.nodeValue.slice(m[1].length);const sp=document.createElement('span');sp.className='gloss';sp.tabIndex=0;sp.textContent=m[1];sp.dataset.term=key;n.after(sp);});});});
  function show(el){const r=el.getBoundingClientRect();tip.innerHTML=`<b>${el.dataset.term}</b>${GLOSS[el.dataset.term]}`;tip.hidden=false;const tw=tip.offsetWidth,th=tip.offsetHeight;
    let x=clamp(r.left+r.width/2-tw/2,8,innerWidth-tw-8),y=r.top-th-8;if(y<8)y=r.bottom+8;tip.style.left=x+'px';tip.style.top=y+'px';}
  const hide=()=>tip.hidden=true;
  document.addEventListener('pointerover',e=>{const g=e.target.closest&&e.target.closest('.gloss');if(g&&e.pointerType==='mouse')show(g);});
  document.addEventListener('pointerout',e=>{if(e.target.closest&&e.target.closest('.gloss')&&e.pointerType==='mouse')hide();});
  document.addEventListener('focusin',e=>{if(e.target.classList&&e.target.classList.contains('gloss'))show(e.target);});
  document.addEventListener('focusout',e=>{if(e.target.classList&&e.target.classList.contains('gloss'))hide();});
  document.addEventListener('click',e=>{const g=e.target.closest('.gloss');if(g){tip.hidden&&show(g);}else hide();});
  window.addEventListener('scroll',hide,{passive:true});window.addEventListener('hashchange',hide);
  paint();
})();

/* ---------------- Review tools: principle trainer, exam review, mistakes queue ---------------- */
function reviewGet(){return store('eml-review')||{};}
function reviewMiss(id){const r=reviewGet();const e=r[id]||{n:0,streak:0};e.n++;e.streak=0;e.due=Date.now();r[id]=e;store('eml-review',r);reviewBadge();}
function reviewHit(id){const r=reviewGet();const e=r[id];if(!e)return 'none';e.streak++;let res;if(e.streak>=3){delete r[id];res='mastered';}else{e.due=Date.now()+[1,3,7][e.streak-1]*864e5;r[id]=e;res=e.streak;}store('eml-review',r);reviewBadge();return res;}
function reviewBadge(){const r=reviewGet(),now=Date.now(),due=Object.keys(r).filter(k=>r[k].due<=now&&PROBS.some(p=>p.id===k)).length;const a=$('#nav a[data-view=review]');if(a)a.textContent='Review my mistakes'+(due?` (${due} due)`:'');const o=$('#navsel option[value=review]');if(o)o.textContent=a?a.textContent:o.textContent;}
function probCard(p,o={}){const d=p.gen(),uid='q'+Math.random().toString(36).slice(2,9),el=document.createElement('article');el.className='prob';el.pid=p.id;el.rpCtx={pid:p.id,title:p.title,ans:d.ans,unit:d.unit,exam:!!o.exam};
  el.innerHTML=`<header><span class="tag">${MODS[p.topic].t}</span>${o.badge||''}<span class="done"></span></header><h3>${p.title}</h3><p class="q">${d.q}</p>
    <form class="ans"><label class="small" for="${uid}">Answer</label><input type="text" inputmode="decimal" id="${uid}" autocomplete="off"><span class="unit">${d.unit}</span>${o.exam?'':'<button type="submit" class="btn primary">Check</button>'}</form>
    <p class="fb" aria-live="polite"></p><div class="row">${o.exam?'':'<button type="button" class="btn link" data-act="hint">Hint</button>'}<button type="button" class="btn link" data-act="sol"${o.exam?' hidden':''}>Show solution</button><button type="button" class="btn link rp-link" data-report="${p.topic}" style="margin-left:auto">Report this problem</button></div>
    <div class="box" data-box="hint" hidden><p>${d.hint}</p></div><div class="box" data-box="sol" hidden><p>${d.sol}</p></div>`;
  const inp=$('input',el),fb=$('.fb',el);
  const check=()=>{const raw=inp.value.trim().replace(/[−–]/g,'-').replace(/,/g,''),x=parseFloat(raw);return {blank:raw===''||!isFinite(x),ok:raw!==''&&isFinite(x)&&Math.abs(x-d.ans)<=Math.max(.02*Math.abs(d.ans),.01)};};
  el.grade=()=>{const r=check();fb.className='fb '+(r.ok?'ok':'no');fb.textContent=r.ok?`Correct: ${fmt(d.ans,3)} ${d.unit}.`:`${r.blank?'No answer.':'Not quite.'} The answer is ${fmt(d.ans,3)} ${d.unit}.`;inp.disabled=true;$('[data-act=sol]',el).hidden=false;return r.ok;};
  $('form',el).addEventListener('submit',e=>{e.preventDefault();if(o.exam)return;const r=check();if(r.blank){fb.className='fb no';fb.textContent='Enter a number, without units.';return;}
    if(r.ok){fb.className='fb ok';fb.textContent=`Correct: ${fmt(d.ans,3)} ${d.unit}.`;inp.disabled=true;$('button[type=submit]',el).disabled=true;o.onRight&&o.onRight(el);}
    else{fb.className='fb no';fb.textContent='Not yet. Try the hint, or check your units.';o.onWrong&&o.onWrong(el);}});
  $$('[data-act]',el).forEach(b=>b.addEventListener('click',()=>{const bx=$(`[data-box="${b.dataset.act}"]`,el);bx.hidden=!bx.hidden;if(b.dataset.act==='sol')b.textContent=bx.hidden?'Show solution':'Hide solution';}));
  return el;}
(function methods(){const OPTS=METHOD_OPTS,_old=["Kinematics only", "Forces: ΣF = ma", "Energy", "Momentum / impulse", "Angular momentum", "Torque: Στ = 0 or Iα", "Momentum, then energy", "Energy, then forces"];const items=$$('.mitem');let right=0;const sc=()=>setText('mt-score',`${right} of ${items.length} right so far.`);
  items.forEach(it=>{const box=$('.sopts',it),fb=$('.fb',it),c=+it.dataset.correct;let done=false;
    OPTS.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.textContent=o;b.addEventListener('click',()=>{$$('button',box).forEach(x=>x.classList.remove('right','wrong'));
      if(i===c){b.classList.add('right');fb.textContent='Yes. '+it.dataset.explain;if(!done){done=true;right++;sc();}}else{b.classList.add('wrong');fb.textContent='Not the best first tool. What is the question asking for: a time, a force, a speed, or what happens in a collision?';}});box.appendChild(b);});});sc();})();
(function exam(){const box=$('#ex-weeks');let N=10,timed=false,timer=null,cards=[];
  GROUPS.forEach((g,i)=>{const b=document.createElement('button');b.type='button';b.dataset.i=i;b.setAttribute('aria-pressed','false');b.textContent=g.w==='Optional'?'Math toolkit':g.w;b.title=g.name;b.addEventListener('click',()=>b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true')));box.appendChild(b);});
  segBind('ex-n','n',v=>N=+v);segBind('ex-t','t',v=>timed=v==='on');
  $('#ex-all').addEventListener('click',()=>$$('#ex-weeks button').forEach(b=>b.setAttribute('aria-pressed','true')));
  $('#ex-none').addEventListener('click',()=>$$('#ex-weeks button').forEach(b=>b.setAttribute('aria-pressed','false')));
  function start(){const sel=$$('#ex-weeks button').filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>GROUPS[+b.dataset.i]),msg=$('#ex-msg');
    if(!sel.length){msg.textContent='Pick at least one unit first.';return;}
    const ids=new Set(sel.flatMap(g=>g.ids));let pool=PROBS.filter(p=>ids.has(p.topic));if(!pool.length){msg.textContent='No practice problems in those units yet. Add another unit.';return;}
    pool=pool.map(p=>[Math.random(),p]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).slice(0,N);msg.textContent=pool.length<N?`Only ${pool.length} problems exist for those units, so the set has ${pool.length}.`:'';
    const list=$('#ex-list');list.innerHTML='';cards=pool.map((p,i)=>{const c=probCard(p,{exam:true,badge:`<span class="tag ap">Q${i+1}</span>`});list.appendChild(c);return c;});
    $('#ex-run').hidden=false;$('#ex-result').hidden=true;$('#ex-submit').hidden=false;$('#ex-setup').hidden=true;clearInterval(timer);const tEl=$('#ex-timer');
    if(timed){let left=pool.length*120;const tick=()=>{tEl.textContent=`Time left ${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;if(left--<=0)finish();};tick();timer=setInterval(tick,1000);}else tEl.textContent=`${pool.length} problems · untimed`;
    scrollTo({top:$('#ex-run').getBoundingClientRect().top+scrollY-80,behavior:REDUCE?'auto':'smooth'});}
  function finish(){clearInterval(timer);if(!cards.length)return;let right=0;const by={};
    cards.forEach(c=>{const ok=c.grade(),t=PROBS.find(p=>p.id===c.pid).topic;if(ok)right++;else reviewMiss(c.pid);by[t]=by[t]||[0,0];by[t][1]++;if(ok)by[t][0]++;});
    $('#ex-submit').hidden=true;$('#ex-timer').textContent=`Graded: ${right} of ${cards.length}`;const r=$('#ex-result');r.hidden=false;
    r.innerHTML=`<h2>${right} of ${cards.length} correct (${Math.round(100*right/cards.length)}%)</h2><p class="small" style="margin:0">Each problem now shows the answer and a full solution. Missed problems were added to <a href="#review">Review my mistakes</a> with new numbers.</p><div class="tablewrap"><table style="min-width:0"><thead><tr><th>Topic</th><th>Score</th><th></th></tr></thead><tbody>`+
      Object.entries(by).sort((a,b)=>a[1][0]/a[1][1]-b[1][0]/b[1][1]).map(([t,[a,n]])=>`<tr><td>${MODS[t].t}</td><td>${a}/${n}</td><td>${a<n?`<a href="#${t}">Revisit this module</a>`:'✓'}</td></tr>`).join('')+`</tbody></table></div><div class="row"><button type="button" class="btn primary" id="ex-again">Build another set</button></div>`;
    $('#ex-again').addEventListener('click',()=>{$('#ex-setup').hidden=false;$('#ex-run').hidden=true;cards=[];scrollTo(0,0);});cards=[];
    r.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'});}
  $('#ex-start').addEventListener('click',start);$('#ex-submit').addEventListener('click',finish);})();
(function review(){function render(all){const r=reviewGet(),now=Date.now(),list=$('#rv-list');list.innerHTML='';const ids=Object.keys(r).filter(id=>PROBS.some(p=>p.id===id));
    const dueIds=ids.filter(id=>r[id].due<=now),later=ids.filter(id=>r[id].due>now),show=all?ids:dueIds;
    setText('rv-stats',ids.length?`${dueIds.length} due now · ${later.length} scheduled later`:'Your queue is empty');
    if(!show.length){list.innerHTML=`<p class="small" style="margin:0">${ids.length?'Nothing due right now. Next review: '+new Date(Math.min(...later.map(id=>r[id].due))).toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})+'.':'Nothing to review yet. Problems you miss in the <a href="#practice">practice set</a> or <a href="#exam">exam review</a> will show up here.'}</p>`;return;}
    show.forEach(id=>{const p=PROBS.find(q=>q.id===id),e=r[id];const c=probCard(p,{badge:`<span class="tag calc">missed ${e.n}×</span><span class="tag">${e.streak} of 3 reviews done</span>`,
      onRight:el=>{const res=reviewHit(id);$('.done',el).textContent=res==='mastered'?'Mastered ✓':typeof res==='number'?`Next review in ${[1,3,7][res-1]} day${res>1?'s':''}`:'';},onWrong:()=>reviewMiss(id)});list.appendChild(c);});}
  const go=()=>{if(location.hash==='#review')render(false);};window.addEventListener('hashchange',go);$('#rv-all').addEventListener('click',()=>render(true));go();reviewBadge();})();
/* ---------------- Router, resize, theme ---------------- */
const VIEWS=['overview',...Object.keys(MODS),'practice','frq','methods','exam','review'];
/* one highlight slides to the current module in the side nav */
function navSync(snap){const nav=$('#nav'),a=$('#nav a[aria-current="page"]');let ind=$('.ind',nav);
  if(!ind){ind=document.createElement('span');ind.className='ind';ind.setAttribute('aria-hidden','true');nav.prepend(ind);nav.classList.add('has-ind');snap=true;}
  if(!a||!a.offsetHeight){ind.style.opacity=0;return;}ind.style.opacity=1;if(snap)ind.classList.add('snap');
  ind.style.height=a.offsetHeight+'px';ind.style.transform=`translateY(${a.offsetTop}px)`;if(snap){void ind.offsetWidth;ind.classList.remove('snap');}
  const rail=$('.rail'),rr=rail.getBoundingClientRect(),ar=a.getBoundingClientRect();if(ar.top<rr.top+60||ar.bottom>rr.bottom-20)rail.scrollBy({top:ar.top-rr.top-rr.height/3,behavior:REDUCE?'auto':'smooth'});}
function route(){let id=(location.hash||'').slice(1);if(!VIEWS.includes(id))id='overview';const changed=id!==current,first=!current,back=VIEWS.indexOf(id)<VIEWS.indexOf(current);
  const apply=()=>{current=id;
    $$('.view').forEach(v=>v.hidden=v.id!=='v-'+id);$('#navsel').value=id;
    $$('.nav a').forEach(a=>{const on=a.dataset.view===id;a.setAttribute('aria-current',on?'page':'false');if(on&&a.scrollIntoView&&window.innerWidth<=900)a.scrollIntoView({block:'nearest',inline:'center'});});
    if(changed)window.scrollTo(0,0);redraw();navSync(first);stepSync(true);armReveal();};
  if(!changed||first||REDUCE){apply();return;}
  apply();const v=$('#v-'+id);v.classList.remove('enter','back');void v.offsetWidth;v.classList.add('enter');v.classList.toggle('back',back);}
window.addEventListener('hashchange',route);
let rz;new ResizeObserver(()=>{cancelAnimationFrame(rz);rz=requestAnimationFrame(()=>{redraw();navSync(true);stepSync(true);});}).observe(document.querySelector('main'));
/* ---------------- Report an issue ----------------
   Reports are saved to the artifact's db at reports/<viewer id>/items. Only the owner can read them.
   Viewers who can't write (view-only access, or no db here) get a comment box or a copy-paste box instead. */
(function report(){
  const dlg=$('#rp'),form=$('#rp-form'),where=$('#rp-where'),type=$('#rp-type'),det=$('#rp-details'),ctxEl=$('#rp-ctx'),msg=$('#rp-msg'),send=$('#rp-send');
  const fbBox=$('#rp-fb'),fbMsg=$('#rp-fbmsg'),fbText=$('#rp-text'),cmtBtn=$('#rp-comment'),issue=$('#rp-issue');
  const REPO='https://github.com/jiacode2030/intulab-feedback';
  const COURSE='E&M Lab',COURSE_LABEL='course:em',SITE_VERSION='2026-10-23';
  const use=n=>(window.claude&&typeof window.claude.use==='function')?Promise.resolve(window.claude.use(n)).catch(()=>null):Promise.resolve(null);
  const cap={db:use('db'),user:use('user'),comments:use('comments')};
  let src=null,ctx='',canWrite=true,lastText='';
  const viewName=v=>{if(v==='overview')return 'Overview';if(MODS[v])return MODS[v].t;const a=$(`#nav a[data-view="${v}"]`);return a?a.textContent.trim():v;};
  const clip=(t,n)=>t.length>n?t.slice(0,n-1)+'…':t;
  function fillWhere(){if(where.options.length)return;VIEWS.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=viewName(v);where.appendChild(o);});
    const o=document.createElement('option');o.value='site';o.textContent='The whole site';where.appendChild(o);}
  function open(btn){fillWhere();src=btn.closest('.prob')||btn.closest('.view')||document.body;
    const v=btn.dataset.report;where.value=VIEWS.includes(v)?v:(VIEWS.includes(current)?current:'site');
    const card=btn.closest('.prob');
    if(card&&card.rpCtx){const c=card.rpCtx,q=$('.q',card).textContent.trim();
      ctx=clip(`Problem ${c.pid} "${c.title}": ${q}`,800)+` | Generated answer: ${fmt(c.ans,3)} ${c.unit}`;type.value='Wrong answer in a problem';
      ctxEl.textContent=c.exam&&!$('input',card).disabled?clip(`Problem ${c.pid} "${c.title}": ${q}`,800)+' | the generated answer is attached but hidden until you finish':ctx;}
    else{ctx=`View: ${viewName(where.value)} (#${where.value})`;ctxEl.textContent=ctx;if(type.value==='Wrong answer in a problem')type.selectedIndex=0;}
    msg.textContent='';msg.className='msg';fbBox.hidden=true;form.hidden=false;send.disabled=false;
    if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');det.focus();
    loadInbox();}
  let closing=0;
  function close(){const end=()=>{clearTimeout(closing);closing=0;dlg.classList.remove('closing');if(dlg.close)dlg.close();else dlg.removeAttribute('open');};
    if(REDUCE||!dlg.open){end();return;}if(closing)return;dlg.classList.add('closing');closing=setTimeout(end,190);}
  dlg.addEventListener('cancel',e=>{e.preventDefault();close();});
  function asText(r){return `Report an issue (E&M Lab)\nWhere: ${viewName(r.where)}\nType: ${r.type}\nDetails: ${r.details}\nContext: ${r.context}`;}
  async function save(r){const [db,user]=await Promise.all([cap.db,cap.user]);if(!db||!user)return false;
    const uid=await user.id();if(!uid)return false;
    const tryTwice=async f=>{try{return await f();}catch(e){if(e&&e.code==='unavailable'){await new Promise(z=>setTimeout(z,400+Math.random()*600));return f();}throw e;}};
    try{await tryTwice(()=>db.doc('reports/'+uid).set({last:r.at}));await tryTwice(()=>db.collection('reports/'+uid+'/items').add(r));return true;}
    catch(e){if(e&&e.code==='quota_exceeded'){fbMsg.textContent='The report inbox is full right now.';}return false;}}
  async function fallback(r){lastText=asText(r);fbText.value=lastText;form.hidden=true;fbBox.hidden=false;
    const copied=await copy(lastText);const cm=await cap.comments;cmtBtn.hidden=!cm;
    issue.href=REPO+'/issues/new?labels='+encodeURIComponent(COURSE_LABEL)+'&title='+encodeURIComponent(clip(`[${COURSE}] [${r.type}] ${viewName(r.where)}: ${r.details.replace(/\s+/g,' ')}`,100))+'&body='+encodeURIComponent(`**Course:** ${COURSE}\n**Module:** ${viewName(r.where)} (#${r.where})\n**Type:** ${r.type}\n**Site version:** ${SITE_VERSION}\n\n${r.details}\n\n**Context:** ${r.context}`);
    issue.hidden=false;issue.className='btn'+(cm?'':' primary');
    fbMsg.textContent=(fbMsg.textContent?fbMsg.textContent+' ':'')+(cm?'Your report couldn’t be saved here (you may have view-only access). '+(copied?'It’s copied to your clipboard: ':'Copy it below, then ')+'post it as a comment so the owner sees it, or open a public GitHub issue.'
      :'Send it as a GitHub issue (you’ll need a free GitHub account, and issues are public). '+(copied?'It’s also copied to your clipboard.':''));}
  async function copy(t){try{await navigator.clipboard.writeText(t);return true;}catch(e){}
    try{fbText.select();const ok=document.execCommand('copy');fbText.setSelectionRange(0,0);return ok;}catch(e){return false;}}
  form.addEventListener('submit',async e=>{e.preventDefault();const details=det.value.trim();
    if(!details){msg.className='msg no';msg.textContent='Add a few words about the issue first.';det.focus();return;}
    const r={where:where.value,type:type.value,details:details.slice(0,2000),context:ctx||`View: ${viewName(where.value)} (#${where.value})`,at:Date.now(),status:'open'};
    send.disabled=true;msg.className='msg';msg.textContent='Sending…';fbMsg.textContent='';
    const ok=canWrite&&await save(r);send.disabled=false;
    if(ok){msg.className='msg ok';msg.textContent='Thanks! Your report was sent.';det.value='';loadInbox();return;}
    canWrite=false;msg.textContent='';fallback(r);});
  cmtBtn.addEventListener('click',async()=>{const cm=await cap.comments;if(!cm)return;await copy(lastText);close();
    try{const res=await cm.openComposer({element:src&&src.isConnected?src:document.body});
      if(res&&res.opened)return;}catch(e){cmtBtn.hidden=true;}
    if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');fbMsg.textContent='The comment box didn\u2019t open. Copy the report below and send it to the site\u2019s owner.';});
  $('#rp-copy').addEventListener('click',async()=>{const ok=await copy(fbText.value);$('#rp-copy').textContent=ok?'Copied ✓':'Select the text and copy it';setTimeout(()=>$('#rp-copy').textContent='Copy report',2500);});
  $('#rp-close').addEventListener('click',close);
  dlg.addEventListener('click',e=>{if(e.target===dlg)close();});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-report]');if(b){e.preventDefault();open(b);}});
  /* Owner inbox */
  const inbox=$('#rp-inbox'),list=$('#rp-list'),count=$('#rp-count'),showRes=$('#rp-showres');let items=[],loading=false;
  async function loadInbox(){const user=await cap.user;if(!user||!(await user.isOwner()))return;const db=await cap.db;if(!db)return;
    inbox.hidden=false;if(loading)return;loading=true;count.textContent='Loading…';
    try{const people=await db.collection('reports').get();const all=[];
      for(const p of people.docs){const s=await db.collection('reports/'+p.id+'/items').get();s.docs.forEach(d=>{if(d.exists)all.push({path:'reports/'+p.id+'/items/'+d.id,...d.data()});});}
      items=all.sort((a,b)=>(b.at||0)-(a.at||0));renderInbox();}
    catch(e){count.textContent='Couldn’t load reports.';}
    loading=false;}
  function renderInbox(){const open=items.filter(r=>r.status!=='resolved').length;count.textContent=`${open} open · ${items.length} total`;list.textContent='';
    const shown=items.filter(r=>showRes.checked||r.status!=='resolved');
    if(!shown.length){const p=document.createElement('p');p.className='small';p.style.margin='0';p.textContent=items.length?'No open reports.':'No reports yet.';list.appendChild(p);return;}
    shown.forEach(r=>{const el=document.createElement('div');el.className='ri'+(r.status==='resolved'?' resolved':'');
      const meta=document.createElement('div');meta.className='meta';meta.textContent=`${new Date(r.at||0).toLocaleString()} · ${viewName(String(r.where||''))} · ${r.type||''}${r.status==='resolved'?' · resolved':''}`;
      const d=document.createElement('p');d.textContent=String(r.details||'');const c=document.createElement('p');c.className='ctx';c.textContent=String(r.context||'');
      const row=document.createElement('div');row.className='row';
      const b1=document.createElement('button');b1.type='button';b1.className='btn';b1.textContent=r.status==='resolved'?'Reopen':'Mark resolved';
      b1.addEventListener('click',async()=>{const db=await cap.db;const st=r.status==='resolved'?'open':'resolved';b1.disabled=true;try{await db.doc(r.path).update({status:st});r.status=st;}catch(e){}renderInbox();});
      const b2=document.createElement('button');b2.type='button';b2.className='btn link';b2.textContent='Delete';b2.style.color='var(--bad)';
      b2.addEventListener('click',async()=>{if(b2.dataset.arm!=='1'){b2.dataset.arm='1';b2.textContent='Click again to delete';return;}const db=await cap.db;b2.disabled=true;try{await db.doc(r.path).delete();items=items.filter(x=>x!==r);}catch(e){}renderInbox();});
      row.append(b1,b2);el.append(meta,d,c,row);list.appendChild(el);});}
  showRes.addEventListener('change',renderInbox);$('#rp-refresh').addEventListener('click',loadInbox);
})();
function onTheme(){readTokens();redraw();}
const mq=matchMedia('(prefers-color-scheme: dark)');if(mq.addEventListener)mq.addEventListener('change',onTheme);
new MutationObserver(onTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
/* ---------------- AP exam countdown ----------------
   College Board sets the date each year. Add the next date here when it is announced (apstudents.collegeboard.org/exam-dates).
   Until then the countdown says the date isn't announced instead of guessing. E&M is a Session 2 (afternoon) exam, starting 12 p.m. local time. */
const AP_EXAM_DATES=['2027-05-05'];
(function countdown(){const el=$('#ap-count'),rl=$('#rail-count');if(!el)return;
  function paint(){const now=new Date();const next=AP_EXAM_DATES.map(d=>{const [y,m,dd]=d.split('-').map(Number);return {start:new Date(y,m-1,dd,12),end:new Date(y,m-1,dd,23,59)};}).filter(x=>x.end>now).sort((a,b)=>a.start-b.start)[0];
    const link='<a href="https://apstudents.collegeboard.org/exam-dates" target="_blank" rel="noopener">official schedule</a>';
    if(next){const fmtD=next.start.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'}),days=Math.ceil((next.start-now)/864e5);
      if(days<=0){el.innerHTML=`<span class="num">Today</span><span class="lbl">AP Physics C: E&M exam, 12 p.m. Good luck!<small>${fmtD}</small></span>`;if(rl)rl.textContent='AP exam today. Good luck!';}
      else{el.innerHTML=`<span class="num">${days}</span><span class="lbl">day${days===1?'':'s'} until the AP Physics C: E&M exam<small>${fmtD}, 12 p.m. local time · ${link}</small></span>`;if(rl)rl.textContent=`${days} day${days===1?'':'s'} to the AP exam`;}}
    else{const y=now.getMonth()>4?now.getFullYear()+1:now.getFullYear();el.innerHTML=`<span class="lbl">Next AP Physics C: E&M exam: early to mid May ${y}<small>College Board hasn't posted the date here yet. Check the ${link}.</small></span>`;if(rl)rl.textContent='';}}
  paint();setInterval(paint,6e5);})();
/* ---------------- Theme switch: auto (follows the device), light, dark ---------------- */
(function theme(){const b=$('#theme-btn'),root=document.documentElement,NAMES={auto:'auto',light:'light',dark:'dark'};
  function show(m){b.dataset.mode=m;$('.tl',b).textContent='Theme: '+NAMES[m];b.setAttribute('aria-label',`Color theme: ${NAMES[m]}. Click to change.`);}
  function apply(m){if(m==='auto')root.removeAttribute('data-theme');else root.setAttribute('data-theme',m);show(m);}
  const saved=store('eml-theme');if(saved&&NAMES[saved])apply(saved);else show('auto');
  let tm;b.addEventListener('click',()=>{const m={auto:'light',light:'dark',dark:'auto'}[b.dataset.mode]||'auto';
    if(!REDUCE){root.classList.add('theming');clearTimeout(tm);tm=setTimeout(()=>root.classList.remove('theming'),400);}apply(m);store('eml-theme',m);});})();
/* ---------------- Feedback motion: new text slides in; right answers burst ---------------- */
new MutationObserver(recs=>{const seen=new Set();recs.forEach(r=>{const el=r.target;if(!el.classList||seen.has(el))return;
  if(el.classList.contains('fb')||(el.parentElement&&el.parentElement.classList.contains('coach'))){seen.add(el);el.classList.remove('swap');void el.offsetWidth;el.classList.add('swap');}});})
  .observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',e=>{const b=e.target.closest('.quiz .opts button, .sopts button');if(!b)return;if(b.classList.contains('right')){burst(b);bubble(b,'Correct!');}else if(b.classList.contains('wrong'))bubble(b,'Not quite',true);});
document.addEventListener('submit',e=>{const card=e.target.closest('.prob');if(!card)return;const btn=$('button[type=submit]',card)||card;if($('.fb.ok',card)){burst(btn);bubble(btn,'Correct!');}});
/* ---------------- Popups and expanding panels ---------------- */
const ICON={x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'};
function bubble(el,text,bad){if(REDUCE)return;const r=el.getBoundingClientRect(),b=document.createElement('span');b.className='bubble'+(bad?' no':'');b.textContent=text;b.setAttribute('aria-hidden','true');
  b.style.left=clamp(r.left+r.width-60,50,innerWidth-50)+'px';b.style.top=(r.top-30)+'px';document.body.appendChild(b);setTimeout(()=>b.remove(),1200);}
function confetti(x,y,n=40){FX.spray(x,y,n,{paper:true,speed:720,spread:1.5});}
/* open/close a dialog with the shared pop animation */
function popOpen(d){d.classList.remove('closing');if(d.showModal){if(!d.open)d.showModal();}else d.setAttribute('open','');}
function popClose(d,then){const end=()=>{d.classList.remove('closing','flip');if(d.close)d.close();else d.removeAttribute('open');then&&then();};if(REDUCE||!d.open){end();return;}d.classList.add('closing');setTimeout(end,190);}
/* FLIP: animate an element from a rectangle it used to occupy to where it is now */
function flipFrom(el,from,ms=480){if(REDUCE||!el.animate)return null;const to=el.getBoundingClientRect();if(!to.width||!to.height)return null;
  return el.animate([{transformOrigin:'0 0',transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`},{transformOrigin:'0 0',transform:'none'}],{duration:ms,easing:'cubic-bezier(.2,.9,.25,1.04)'});}

/* Search: jump to any module (button in the rail, or press / anywhere) */
(function search(){const d=$('#cmd'),q=$('#cmd-q'),list=$('#cmd-list');let items=[],sel=0;
  const all=()=>{const dn=store('eml-done')||{};const out=[];GROUPS.forEach(g=>g.ids.forEach(id=>out.push({id,t:MODS[id].t,d:MODS[id].d,w:g.w==='Optional'?'Math':g.w,done:!!dn[id]})));
    $$('#nav a').forEach(a=>{const v=a.dataset.view;if(v&&!MODS[v]&&v!=='overview')out.push({id:v,t:a.textContent.replace(/ \(\d+ due\)/,''),d:'Review and practice',w:'Review',done:false});});return out;};
  function render(){const words=q.value.toLowerCase().split(/\s+/).filter(Boolean);items=all().filter(it=>words.every(w=>(it.t+' '+it.d+' '+it.w).toLowerCase().includes(w)));sel=0;
    list.innerHTML=items.length?items.map((it,i)=>`<li role="option" id="cmd-o${i}" aria-selected="${i===0}" data-id="${it.id}" style="animation-delay:${Math.min(i,12)*18}ms"><span class="wk">${it.w}</span><b>${it.t}</b>${it.done?'<span class="ok">✓</span>':'<span></span>'}<span class="d">${it.d}</span></li>`).join('')
      :'<li class="none">No module matches that. Try a shorter word.</li>';}
  function move(k){if(!items.length)return;sel=(sel+k+items.length)%items.length;$$('li',list).forEach((li,i)=>li.setAttribute('aria-selected',i===sel));const li=$(`#cmd-o${sel}`);li&&li.scrollIntoView({block:'nearest'});q.setAttribute('aria-activedescendant','cmd-o'+sel);}
  function go(id){popClose(d,()=>{location.hash=id;});}
  function open(){q.value='';render();popOpen(d);q.focus();}
  q.addEventListener('input',render);
  q.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();move(1);}else if(e.key==='ArrowUp'){e.preventDefault();move(-1);}else if(e.key==='Enter'&&items[sel]){e.preventDefault();go(items[sel].id);}});
  list.addEventListener('click',e=>{const li=e.target.closest('li[data-id]');if(li)go(li.dataset.id);});
  list.addEventListener('mousemove',e=>{const li=e.target.closest('li[data-id]');if(!li)return;const i=$$('li',list).indexOf(li);if(i!==sel){sel=i;move(0);}});
  d.addEventListener('cancel',e=>{e.preventDefault();popClose(d);});d.addEventListener('click',e=>{if(e.target===d)popClose(d);});
  $('#cmd-btn').addEventListener('click',open);
  document.addEventListener('keydown',e=>{const tg=e.target,typing=tg.closest&&tg.closest('input,textarea,select,[contenteditable]');
    if(((e.key==='/'&&!typing)||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'))&&!d.open){e.preventDefault();open();}});})();

/* Module preview: clicking a module card expands it into a preview */
(function preview(){const d=$('#mprev'),body=$('#mprev-body');let card=null;
  function countUp(el,to){if(REDUCE){el.textContent=to;return;}const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/600);el.textContent=Math.round(to*(1-(1-k)**3));if(k<1)requestAnimationFrame(f);};requestAnimationFrame(f);}
  function open(c){const id=(c.getAttribute('href')||'').slice(1);if(!MODS[id])return;card=c;const m=MODS[id],g=GROUPS.find(g=>g.ids.includes(id)),solved=store('eml-solved')||{},probs=PROBS.filter(p=>p.topic===id),
      ns=probs.filter(p=>solved[p.id]).length,dn=!!(store('eml-done')||{})[id],secs=$$('.steps a',$('#v-'+id)).map(a=>a.textContent.replace(/^\d+/,''));
    const i=GROUPS.flatMap(g=>g.ids).indexOf(id),dots=[0,1,2,3,4,5].map(k=>`<circle cx="${18+k*22}" cy="${14+2.4*k*k}" r="${k===5?7:6}" fill="var(--${k===5?'hot':'cx'})" opacity="${k===5?1:.25+k*.13}" style="animation-delay:${200+k*70}ms"/>`).join('');
    body.innerHTML=`<div class="mp-hero"><svg viewBox="0 0 150 110" aria-hidden="true">${dots}</svg><div class="eyebrow">${g?g.w+' · '+g.name:''}</div><h2 id="mprev-title">${m.t}</h2><p>${m.d}</p></div>
      <button type="button" class="mp-x" aria-label="Close preview">${ICON.x}</button>
      <div class="mp-body"><div class="mp-stats"><div><span>Module</span><strong>${i+1} / ${GROUPS.flatMap(g=>g.ids).length}</strong></div><div><span>Practice</span><strong><b class="cu">0</b>/${probs.length}</strong></div><div><span>Status</span><strong class="${dn?'yes':''}">${dn?'Done ✓':'Not yet'}</strong></div></div>
      ${secs.length?`<div><div class="small" style="margin-bottom:6px">Inside this module</div><div class="mp-chips">${secs.map((t,k)=>`<span style="animation-delay:${260+k*45}ms">${t}</span>`).join('')}</div></div>`:''}
      <div class="row"><span class="tag ${apTag(id)}">${m.ap}</span></div>
      <div class="mp-actions"><button type="button" class="btn" data-close>Back to all modules</button><a class="btn primary" href="#${id}" style="text-decoration:none">${dn?'Open again':'Start module'} →</a></div></div>`;
    const from=c.getBoundingClientRect();d.classList.toggle('flip',!REDUCE);popOpen(d);flipFrom(d,from,520);$$('.mp-body>*',d).forEach(x=>x.style.animationDelay='');countUp($('.cu',d),ns);$('.btn.primary',d).focus({preventScroll:true});}
  function close(){if(REDUCE||!card||!card.isConnected||!card.offsetWidth){popClose(d);return;}const to=card.getBoundingClientRect(),from=d.getBoundingClientRect();
    const an=d.animate([{transformOrigin:'0 0',transform:'none',opacity:1},{transformOrigin:'0 0',transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width},${to.height/from.height})`,opacity:0}],{duration:300,easing:'cubic-bezier(.4,0,1,1)'});
    an.onfinish=()=>{d.classList.remove('flip');d.close();};}
  document.addEventListener('click',e=>{const c=e.target.closest('a.mod');if(!c||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button)return;e.preventDefault();open(c);});
  d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-close],.mp-x'))close();else if(e.target.closest('a.btn.primary')){d.classList.remove('flip');d.close();}});
  d.addEventListener('cancel',e=>{e.preventDefault();close();});})();

/* Simulations: Expand opens the panel as a big focus view, Close shrinks it back */
(function focusLab(){let openLab=null;const IC='<svg class="ic-out" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"/></svg><svg class="ic-in" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10h-6V4M14 10l7-7M4 14h6v6M10 14l-7 7"/></svg>';
  function expand(lab){if(openLab)return;openLab=lab;lab.classList.remove('rv','in');const from=lab.getBoundingClientRect(),ph=document.createElement('div');ph.className='lab-ph';ph.style.height=from.height+'px';ph.textContent='Simulation open in focus view';
    lab.before(ph);lab._ph=ph;const sc=document.createElement('div');sc.className='lab-scrim';sc.addEventListener('click',()=>collapse());document.body.appendChild(sc);lab._sc=sc;
    lab.classList.add('big');document.documentElement.style.overflow='hidden';redraw();flipFrom(lab,from,520);setBtn(lab,true);$('.lab-x',lab).focus({preventScroll:true});}
  function collapse(){const lab=openLab;if(!lab)return;openLab=null;const from=lab.getBoundingClientRect();lab.classList.remove('big');document.documentElement.style.overflow='';lab._ph.remove();redraw();
    lab.classList.add('landing');const an=flipFrom(lab,from,420);const done=()=>lab.classList.remove('landing');if(an)an.onfinish=done;else done();
    const sc=lab._sc;if(REDUCE)sc.remove();else{sc.classList.add('out');setTimeout(()=>sc.remove(),200);}setBtn(lab,false);}
  function setBtn(lab,big){const b=$('.lab-x',lab);if(!b)return;$('span',b).textContent=big?'Close':'Expand';b.setAttribute('aria-label',big?'Close the focus view':'Expand this simulation');b.setAttribute('aria-expanded',big);}
  $$('.lab').forEach(lab=>{const bar=$('.labbar',lab);if(!bar)return;let row=bar.lastElementChild&&bar.lastElementChild.classList.contains('row')?bar.lastElementChild:null;
    if(!row){row=document.createElement('div');row.className='row';bar.appendChild(row);}
    const b=document.createElement('button');b.type='button';b.className='btn lab-x';b.innerHTML=IC+'<span>Expand</span>';b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Expand this simulation');
    b.addEventListener('click',()=>openLab===lab?collapse():expand(lab));row.appendChild(b);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openLab){e.preventDefault();collapse();}});
  window.addEventListener('hashchange',()=>{if(openLab)collapse();});})();

/* Answers and scoring guides slide open and closed */
(function expandDetails(){document.addEventListener('click',e=>{const s=e.target.closest('summary');if(!s||REDUCE)return;const d=s.parentElement;if(!d||d.tagName!=='DETAILS'||!d.animate)return;e.preventDefault();
  if(d._an)d._an.cancel();const start=d.getBoundingClientRect().height;d.style.overflow='hidden';
  if(!d.open){d.open=true;const end=d.getBoundingClientRect().height;d._an=d.animate([{height:start+'px'},{height:end+'px'}],{duration:420,easing:'cubic-bezier(.2,.9,.25,1.04)'});}
  else{d.open=false;const end=d.getBoundingClientRect().height;d.open=true;d._an=d.animate([{height:start+'px'},{height:end+'px'}],{duration:240,easing:'cubic-bezier(.4,0,1,1)'});d._an.onfinish=()=>{d.open=false;};}
  d._an.addEventListener('finish',()=>{d.style.overflow='';d._an=null;});});})();

/* Sections that start below the fold rise in as they scroll into view */
(function reveal(){if(REDUCE||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const el=en.target;io.unobserve(el);el.classList.add('in');setTimeout(()=>el.classList.remove('rv','in'),800);}),{rootMargin:'0px 0px -6% 0px'});
  armReveal=()=>{$$('.rv').forEach(el=>el.classList.remove('rv','in'));io.disconnect();const sec=$('.view:not([hidden])');if(!sec)return;
    $$('.wrap>*:not(.head):not(.steps):not(.modgroups), .modgroups>.modgroup',sec).forEach(el=>{if(el.getBoundingClientRect().top>innerHeight*.92&&!el.classList.contains('big')){el.classList.add('rv');io.observe(el);}});};
  window.addEventListener('beforeprint',()=>$$('.rv').forEach(el=>el.classList.remove('rv','in')));})();

/* Module complete: a popup with a progress ring, confetti and a link to the next module */
(function cele(){const box=$('#cele');let tm=0;const order=GROUPS.flatMap(g=>g.ids);
  function hide(){if(box.hidden)return;clearTimeout(tm);if(REDUCE){box.hidden=true;return;}box.classList.add('out');setTimeout(()=>{box.hidden=true;box.classList.remove('out');},280);}
  celebrate=id=>{const dn=store('eml-done')||{},n=order.filter(k=>dn[k]).length,N=order.length,nx=order[order.indexOf(id)+1],C=2*Math.PI*24;
    box.innerHTML=`<svg class="ring" viewBox="0 0 54 54" aria-hidden="true"><circle class="bg" cx="27" cy="27" r="24"/><circle class="fg" cx="27" cy="27" r="24" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-(n-1)/N)}"/></svg>
      <b>Module complete!</b><button type="button" class="x" aria-label="Dismiss">×</button><span class="sub">${MODS[id].t} · ${n} of ${N} modules done</span>
      <div class="acts">${nx?`<a class="btn primary" href="#${nx}" style="text-decoration:none">Next: ${MODS[nx].t} →</a>`:`<a class="btn primary" href="#practice" style="text-decoration:none">Go to the practice set →</a>`}</div>`;
    box.hidden=false;box.classList.remove('out');void box.offsetWidth;const fg=$('.fg',box);requestAnimationFrame(()=>requestAnimationFrame(()=>fg.style.strokeDashoffset=C*(1-n/N)));
    const r=box.getBoundingClientRect();confetti(r.left+r.width/2,r.top+10);clearTimeout(tm);tm=setTimeout(hide,7000);};
  box.addEventListener('click',e=>{if(e.target.closest('.x,a'))hide();});box.addEventListener('mouseenter',()=>clearTimeout(tm));box.addEventListener('mouseleave',()=>{tm=setTimeout(hide,3000);});
  window.addEventListener('hashchange',()=>{if(!box.hidden&&!box.matches(':hover'))tm=setTimeout(hide,1500);});})();
(function words(){const h=$('.hero h1');if(!h)return;let k=0;const ws=[];const wrap=n=>[...n.childNodes].forEach(ch=>{if(ch.nodeType!==3){wrap(ch);return;}const f=document.createDocumentFragment();
  ch.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){f.append(p);return;}const w=document.createElement('span');w.className='w';w.textContent=p;ws.push(w);f.append(w);});ch.replaceWith(f);});wrap(h);
  if(REDUCE||!h.animate)return;
  /* drop from height 1 with g = 2 (so the first fall takes 1 time unit), bounce with e = 0.35 until it settles */
  const e=.35,frames=[],T0=[0];let v=2,t=1;while(v>.05&&T0.length<6){T0.push(t);t+=2*v*e/2;v*=e;}
  const tEnd=t,y=q=>{if(q<1)return 1-q*q;let tb=1,vb=2*e;while(tb+2*vb/2<q){tb+=vb;vb*=e;}const u=q-tb;return Math.max(0,vb*u-u*u);};
  for(let i=0;i<=48;i++){const q=i/48*tEnd;frames.push({transform:`translateY(${-y(q)*.55}em)`,opacity:Math.min(1,.15+q*1.4),offset:i/48});}
  ws.forEach((w,i)=>w.animate(frames,{duration:900,delay:80+i*85,easing:'linear',fill:'backwards'}));})();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{redraw();navSync(true);stepSync(true);});
current='';route();
})();
/* Analytics: GoatCounter, shared with every Intulab site. Anonymous, no cookies, no personal data.
   Loads only on the public GitHub Pages site, and counts each module view as its own page. */
(function analytics(){if(!/\.github\.io$/.test(location.hostname))return;
  /* honor Do Not Track and Global Privacy Control: no counter at all */
  if(navigator.doNotTrack==='1'||window.doNotTrack==='1'||navigator.globalPrivacyControl===true)return;window.goatcounter={no_onload:true};
  const s=document.createElement('script');s.async=true;s.src='https://gc.zgo.at/count.js';s.dataset.goatcounter='https://intulab.goatcounter.com/count';
  const view=()=>{const id=(location.hash||'').slice(1)||'overview';if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:location.pathname.replace(/\/$/,'')+'/'+id,title:id});};
  s.onload=()=>{view();addEventListener('hashchange',view);};document.head.appendChild(s);})();
/* Intulab app: offline support (sw.js). Only on the live site, and localhost for testing. */
if('serviceWorker' in navigator&&(/\.github\.io$/.test(location.hostname)||location.hostname==='localhost'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
/* Get the Intulab app (same app as the Intulab page; hidden once you're in it) */
(function appInstall(){var btns=document.querySelectorAll('.appbtn,.appbtn2'),dlg=document.getElementById('app-dlg');if(!btns.length||!dlg)return;
  var each=function(f){Array.prototype.forEach.call(btns,f);};
  if(matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)return;
  each(function(b){b.hidden=false;});var prompt=null;
  var ua=navigator.userAgent,os=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1)?'ios':/Android/.test(ua)?'android':'desktop';
  var form=dlg.querySelector('form'),mine=dlg.querySelector('[data-os="'+os+'"]'),more=document.createElement('details');more.innerHTML='<summary>Other devices</summary>';
  Array.prototype.forEach.call(dlg.querySelectorAll('.appos'),function(el){if(el!==mine)more.appendChild(el);});form.insertBefore(more,form.querySelector('.approw'));
  addEventListener('beforeinstallprompt',function(e){e.preventDefault();prompt=e;});
  addEventListener('appinstalled',function(){each(function(b){b.hidden=true;});});
  each(function(b){b.addEventListener('click',function(){if(prompt){prompt.prompt();prompt=null;return;}if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');});});})();
</script>
