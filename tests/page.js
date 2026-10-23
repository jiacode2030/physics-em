// node tests/page.js <view> <out.png> [width] [dark] [fullpage] : screenshot of the top of a view
const path=require('path');const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const [view,out,wd,dark,full]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:+wd||1280,height:900},colorScheme:dark==='dark'?'dark':'light'});
p.on('pageerror',e=>console.log('PAGEERR',e.message));await p.goto('file://'+path.join(__dirname,'..','index.html'));await p.evaluate(v=>location.hash=v,view);await p.waitForTimeout(1200);
await p.screenshot({path:out,fullPage:full==='full'});await b.close();})();
