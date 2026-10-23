// Interaction checks: practice, exam builder, methods trainer, formula sheet, report dialog, quizzes, every Try-this button.
const path=require('path');const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];
p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('ERR '+m.text())});
await p.goto('file://'+path.join(__dirname,'..','index.html'));await p.waitForTimeout(400);
const nv=await p.evaluate(()=>document.querySelectorAll('.view').length);console.log('views',nv);
await p.evaluate(()=>location.hash='practice');await p.waitForTimeout(300);
console.log('practice cards',await p.evaluate(()=>document.querySelectorAll('#pr-list .prob').length),'filters',await p.evaluate(()=>document.querySelectorAll('#pr-filter button').length));
// answer the first card correctly through its hidden answer? use the solution box text to confirm renders
console.log('solution text sample',await p.evaluate(()=>document.querySelector('#pr-list .prob [data-box=sol]').innerText.slice(0,80)));
await p.evaluate(()=>location.hash='methods');await p.waitForTimeout(300);
console.log('methods items',await p.evaluate(()=>document.querySelectorAll('.mitem').length),'options per item',await p.evaluate(()=>document.querySelector('.mitem .sopts').children.length),await p.evaluate(()=>document.querySelector('.mitem .sopts').innerText.replace(/\n/g,' | ')));
await p.evaluate(()=>location.hash='exam');await p.waitForTimeout(300);
await p.click('#ex-all');await p.click('#ex-start');await p.waitForTimeout(400);
console.log('exam cards',await p.evaluate(()=>document.querySelectorAll('#ex-list .prob').length));
await p.click('#ex-submit');await p.waitForTimeout(400);console.log('exam result',await p.evaluate(()=>document.querySelector('#ex-result h2')?.innerText));
await p.evaluate(()=>location.hash='review');await p.waitForTimeout(300);console.log('review stats',await p.evaluate(()=>document.querySelector('#rv-stats')?.innerText));
await p.evaluate(()=>location.hash='overview');await p.click('#fs-btn');await p.waitForTimeout(500);console.log('formula open',await p.evaluate(()=>document.querySelector('#fs').classList.contains('open')));await p.click('#fs-close');
await p.click('.rp-link[data-report=overview]');await p.waitForTimeout(400);console.log('report dialog open',await p.evaluate(()=>document.querySelector('#rp').open),'where options',await p.evaluate(()=>document.querySelector('#rp-where').options.length));await p.keyboard.press('Escape');
// every module: quiz click correct answer, check mark done button, count Try buttons
const ids=await p.evaluate(()=>Array.from(document.querySelectorAll('#nav a[data-view]')).map(a=>a.dataset.view).filter(v=>!['practice','methods','exam','review','frq','overview'].includes(v)));
let bad=0;for(const id of ids){await p.evaluate(v=>location.hash=v,id);await p.waitForTimeout(120);
  const r=await p.evaluate(()=>{const s=document.querySelector('.view:not([hidden])');return {quiz:!!s.querySelector('.quiz'),opts:s.querySelectorAll('.quiz .opts button').length,ex:s.querySelectorAll('.exsteps li').length,fbd:!!s.querySelector('.fbdfig svg'),tries:s.querySelectorAll('.try li').length,labs:s.querySelectorAll('.lab').length,h1:s.querySelector('h1')?.innerText,done:!!s.querySelector('[data-done-btn]'),rp:!!s.querySelector('[data-report]')};});
  if(!r.quiz||r.opts!==4||r.ex<4||!r.fbd||r.tries<3||!r.labs||!r.done||!r.rp){bad++;console.log('CHECK',id,JSON.stringify(r));}}
console.log('modules checked',ids.length,'flagged',bad);
// frq
await p.evaluate(()=>location.hash='frq');await p.waitForTimeout(400);console.log('frq articles',await p.evaluate(()=>document.querySelectorAll('.frq').length),'checkboxes',await p.evaluate(()=>document.querySelectorAll('input[data-frq]').length));
// open all details in frq to draw canvases then check not blank
await p.evaluate(()=>document.querySelectorAll('#v-frq details').forEach(d=>d.open=true));await p.waitForTimeout(500);
console.log('frq canvases',await p.evaluate(()=>Array.from(document.querySelectorAll('#v-frq canvas')).map(c=>c.id+':'+(c.width>0&&c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v)?'ok':'BLANK'))));
console.log('errors',errs.length?errs.join('\n'):'none');await b.close();})();
