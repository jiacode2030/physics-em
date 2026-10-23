const path=require('path'),fs=require('fs');const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const out=process.argv[2];const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});await p.goto('file://'+path.join(__dirname,'..','index.html'));await p.waitForTimeout(400);
const ids=await p.evaluate(()=>Array.from(document.querySelectorAll('.view')).map(v=>v.id.slice(2)));
for(const id of ids){await p.evaluate(v=>location.hash=v,id);await p.waitForTimeout(100);
 const t=await p.evaluate(()=>{const s=document.querySelector('.view:not([hidden])');
  const clone=s.cloneNode(true);clone.querySelectorAll('.steps,.modnav,.howto,.coach,canvas,.v3ui,.v3hint,button,.ctl,output,.readout,.scorebar,svg').forEach(e=>e.remove());clone.querySelectorAll('details').forEach(d=>d.setAttribute('open',''));
  const c2=clone.querySelectorAll('.exsteps li');c2.forEach(l=>l.hidden=false);document.body.appendChild(clone);clone.style.cssText='position:absolute;left:-9999px;width:900px';const r=clone.innerText;clone.remove();return r;});
 fs.writeFileSync(path.join(out,id+'.txt'),t.replace(/\n{3,}/g,'\n\n'));}
await b.close();})();
