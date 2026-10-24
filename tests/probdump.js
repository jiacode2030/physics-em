// Prints one generated sample of every practice problem so the answers can be checked by hand.  node tests/probdump.js [topic]
const fs=require('fs'),path=require('path');const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const grab=n=>{const m=html.match(new RegExp('(?:const|function) '+n+'\\b[^\\n]*'));return m?m[0]:''};
const lines=html.split('\n');const i0=lines.findIndex(l=>l.startsWith('const ri=(a,b)'));
const hdr=lines.slice(i0,i0+6).join('\n');
const consts='const G=9.8,KC=8.99e9,EPS0=8.85e-12,MU0=4*Math.PI*1e-7,QE=1.6e-19,ME=9.11e-31;';
const sfDef=html.match(/const SUPS=[\s\S]*?\nfunction dragPoints/)[0].replace(/\nfunction dragPoints$/,'');
const helpers=[grab('fmt'),grab('num'),grab('sciv')].join('\n');
// collect all PROBS.push( ... ); blocks
const blocks=[];let idx=0;while((idx=html.indexOf('PROBS.push(',idx))>=0){let d=0,j=idx+10;for(;j<html.length;j++){if(html[j]=='(')d++;else if(html[j]==')'){d--;if(!d)break;}}blocks.push(html.slice(idx+11,j));idx=j;}
const code=consts+'\n'+hdr+'\n'+helpers+'\n'+sfDef+'\nconst PROBS=[];\n'+blocks.map(b=>'PROBS.push('+b+');').join('\n')+'\nglobalThis.PROBS=PROBS;';
eval(code);
const strip=h=>h.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
const only=process.argv[2];let n=0;
for(const p of PROBS){if(only&&p.topic!==only)continue;n++;const g=p.gen();console.log(`### ${p.id} [${p.topic}]\nQ: ${strip(g.q)}\nANS: ${g.ans} ${g.unit||''}\nSOL: ${strip(g.sol)}\n`);}
console.error(n+' problems');
