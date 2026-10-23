// node tests/shot2.js <view> <out.png> <index> [width] [clicks...] : screenshot the n-th .lab of a view
const path=require('path');const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const [view,out,idx,wd,...clicks]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:+wd||1280,height:900}});
p.on('pageerror',e=>console.log('PAGEERR',e.message));await p.goto('file://'+path.join(__dirname,'..','index.html'));await p.evaluate(v=>location.hash=v,view);await p.waitForTimeout(500);
for(const c of clicks){if(c.startsWith('set:')){const [,id,val]=c.split(':');await p.evaluate(([id,val])=>{const el=document.getElementById(id);el.value=val;el.dispatchEvent(new Event('input',{bubbles:true}));},[id,val]);}else await p.click(c);await p.waitForTimeout(150);}
const labs=await p.$$(`#v-${view} .lab`);const lab=labs[+idx];await lab.scrollIntoViewIfNeeded();await p.waitForTimeout(1500);await lab.screenshot({path:out});await b.close();})();
