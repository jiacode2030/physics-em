/* ---------------- Quizzes ---------------- */
$$('.quiz').forEach(q=>{const right=+q.dataset.correct,btns=$$('.opts button',q),fb=$('.fb',q);
  btns.forEach((b,i)=>b.addEventListener('click',()=>{btns.forEach(x=>x.classList.remove('right','wrong'));
    if(i===right){b.classList.add('right');fb.textContent='Correct. '+q.dataset.explain;}else{b.classList.add('wrong');q.misses=(q.misses||0)+1;fb.textContent=q.misses>=2?'Not quite. Here is the idea: '+q.dataset.explain:'Not quite. Think about it once more, then try another answer.';}}));});

/* ---------------- 07 Practice ---------------- */
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const rf=(a,b,st)=>+(a+Math.round(Math.random()*((b-a)/st))*st).toFixed(4);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
function sci(n){const e=Math.floor(Math.log10(Math.abs(n)));return (n/10**e).toFixed(2)+' × 10'+String(e).split('').map(ch=>SUP[ch]).join('');}
