// Visits every view at desktop and phone width; reports JS errors, overflow, blank canvases, NaN text, broken "Set it up" buttons.
const path=require('path');const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const b=await chromium.launch();const only=process.argv[2];
for (const [w,dark] of [[1280,false],[400,true]]){
const p=await b.newPage({viewport:{width:w,height:900},colorScheme:dark?'dark':'light'});
p.on('pageerror',e=>console.log('PAGEERR',w,e.message));p.on('console',m=>{if(m.type()==='error')console.log('ERR',m.text())});
await p.goto(process.env.URL||'file://'+path.join(__dirname,'..','index.html'));await p.waitForTimeout(500);
if(w===1280){const d=await p.evaluate(()=>{const ids={};document.querySelectorAll('[id]').forEach(e=>{const k=e.id.toLowerCase();ids[k]=(ids[k]||0)+1});return Object.entries(ids).filter(([k,v])=>v>1)});console.log('dup ids (case-insens)',JSON.stringify(d));}
let views=await p.evaluate(()=>['overview',...Array.from(document.querySelectorAll('#nav a')).map(a=>a.dataset.view)].filter((v,i,a)=>a.indexOf(v)===i));
if(only)views=views.filter(v=>only.split(',').includes(v));
for(const v of views){await p.evaluate(v=>location.hash=v,v);await p.waitForTimeout(350);
  if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))console.log('OVERFLOW',w,v);
  const blank=await p.evaluate(()=>Array.from(document.querySelectorAll('.view:not([hidden]) canvas')).filter(c=>{if(c.offsetParent===null)return false;if(!c.width||!c.clientWidth)return c.closest('details')?false:true;const x=c.getContext('2d');if(!x)return false;const d=x.getImageData(0,0,c.width,c.height).data;for(let i=3;i<d.length;i+=40)if(d[i])return false;return true}).map(c=>c.id));
  if(blank.length)console.log('BLANK',w,v,blank);
  const bad=await p.evaluate(()=>(document.querySelector('.view:not([hidden])').innerText.match(/NaN|undefined|Infinity/g)||[]).length);if(bad)console.log('BADTEXT',w,v);
  if(w===1280){const n=await p.evaluate(()=>document.querySelectorAll('.view:not([hidden]) [data-show]').length);
    for(let i=0;i<n;i++){await p.evaluate(i=>document.querySelectorAll('.view:not([hidden]) [data-show]')[i].click(),i);await p.waitForTimeout(120);
      const bad2=await p.evaluate(()=>(document.querySelector('.view:not([hidden])').innerText.match(/NaN|undefined/g)||[]).length);if(bad2)console.log('SHOWBAD',v,i);}}
  if(process.env.SHOTS&&w===1280){await p.screenshot({path:path.join(process.env.SHOTS,v+'.png'),fullPage:false});}
}
await p.close();}
await b.close();console.log('smoke done');})();
