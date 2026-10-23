// node tests/exshot.js <view> <out.png> <steps> [dark] : reveal n steps of a worked example and screenshot the figure column
const path=require('path');const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const [view,out,n,dark]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900},colorScheme:dark==='dark'?'dark':'light'});
p.on('pageerror',e=>console.log('PAGEERR',e.message));await p.goto('file://'+path.join(__dirname,'..','index.html'));await p.evaluate(v=>location.hash=v,view);await p.waitForTimeout(400);
for(let i=0;i<+n;i++){await p.evaluate(v=>document.querySelector(`#v-${v} .example [data-next]`).click(),view);await p.waitForTimeout(80);}
await p.waitForTimeout(900);const el=await p.$(`#v-${view} .example .figs`);await el.scrollIntoViewIfNeeded();await el.screenshot({path:out});await b.close();})();
