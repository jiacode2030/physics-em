// node tests/shot.js <view> <out.png> [width] [selector-to-click ...]  : screenshots the first .lab of a view after optional clicks
const path=require('path');const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const [view,out,wd,...clicks]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:+wd||1280,height:900}});
p.on('pageerror',e=>console.log('PAGEERR',e.message));
await p.goto('file://'+path.join(__dirname,'..','index.html'));await p.evaluate(v=>location.hash=v,view);await p.waitForTimeout(500);
for(const c of clicks){if(c.startsWith('set:')){const [,id,val]=c.split(':');await p.evaluate(([id,val])=>{const el=document.getElementById(id);el.value=val;el.dispatchEvent(new Event('input',{bubbles:true}));},[id,val]);}else await p.click(c);await p.waitForTimeout(150);}
await p.waitForTimeout(400);const lab0=1;const lab=await p.$(`#v-${view} .lab`);await lab.scrollIntoViewIfNeeded();await p.waitForTimeout(1300);await lab.screenshot({path:out});await b.close();})();
