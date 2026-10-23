/* ---------------- Overview: See it in 3D ---------------- */
(function g3(){const cv=$('#g3-canvas');if(!cv)return;let scene='wire';
  const CAP={wire:'A long straight wire carrying current I upward. Its magnetic field makes circles around the wire, never pointing toward or away from it. Point your right thumb along I and your fingers curl the way B goes. The field gets weaker farther out: B = μ₀I/(2πr).',
    helix:'A positive charge in a uniform magnetic field (pink, pointing up). The force qv × B (orange) is always sideways to the velocity (green), so it bends the path into a circle without changing the speed. The part of the velocity along B is untouched, which stretches the circle into a helix.',
    flux:'A square loop turning in a uniform field. The flux Φ = BA cos θ counts how much field passes through the loop. It is largest when the loop faces the field and zero when the loop is edge-on. A changing flux is what makes an induced EMF.'};
  const HOME={wire:{yaw:-.8,pitch:.32,dist:9,target:[0,0,.6]},helix:{yaw:-.9,pitch:.28,dist:9.5,target:[0,0,1.2]},flux:{yaw:-.7,pitch:.4,dist:8.5,target:[0,0,.5]}};
  const circ=(r,z,n=64)=>Array.from({length:n+1},(_,i)=>{const a=i/n*Math.PI*2;return [r*Math.cos(a),r*Math.sin(a),z];});
  const SC={
    wire(S,t){S.grid(-3,3,-3,3,.5);const tt=t==null?0:t;
      S.line([0,0,-.2],[0,0,3.2],T.ink,5);
      for(let k=0;k<7;k++){const z=((k*.5+tt*.6)%3.4)-.1;S.ball([0,0,z],.06,T.cv,1,false);}
      S.arrow([0,0,2.4],[0,0,3.3],T.cv,3.5,'I');
      [[.7,.3],[1.4,.3],[2.1,.3],[1,1.7],[1.8,1.7]].forEach(([r,z])=>{const al=clamp(1.15-r*.3,.35,1);S.path(circ(r,z),alpha(T.ca,al),1.6);
        for(let j=0;j<4;j++){const a=j/4*Math.PI*2+.4,p=[r*Math.cos(a),r*Math.sin(a),z],tg=[-Math.sin(a),Math.cos(a),0],L=.5/Math.max(.7,r)*.9+.15;S.arrow(p,V3.add(p,V3.mul(tg,L)),alpha(T.ca,Math.max(al,.6)),2.4);}});
      S.text([2.1,0,.75],'B',T.ca);S.text([1.4,-1.4,.0],'r',T.muted);},
    helix(S,t){const R=1.1,w=1.6,vz=.28,tt=t==null?3:t%14,B0=[0,0,1];
      for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++)if((i+j)%2===0)S.arrow([i*1.1,j*1.1,-.3],[i*1.1,j*1.1,.25],alpha(T.ca,.55),1.6);
      S.arrow([2.6,2.6,0],[2.6,2.6,1.2],T.ca,3,'B');
      const P=s=>[R*Math.cos(-w*s)-R,R*Math.sin(-w*s),vz*s],pts=[];for(let s=0;s<=tt;s+=.03)pts.push(P(s));if(pts.length>1)S.path(pts,alpha(T.pos,.6),2);
      const p=P(tt);
      const Vn=[R*(-w)*-Math.sin(-w*tt),R*(-w)*Math.cos(-w*tt),vz];
      const F=V3.cross(Vn,B0),c=[-R,0,p[2]];
      S.line(c,[-R,0,0],alpha(T.muted,.5),1,[3,4]);S.ball(p,.13,T.pos,1,false);S.text(V3.add(p,[0,0,.35]),'+q',T.pos);
      S.arrow(p,V3.add(p,V3.mul(Vn,.55)),T.cv,3,'v');S.arrow(p,V3.add(p,V3.mul(F,.4)),T.hot,3,'F');},
    flux(S,t){const th=t==null?.6:.5*Math.PI*(.5+.5*Math.sin(t*.7)),a=1.1,nrm=[0,-Math.sin(th),Math.cos(th)];
      const cs=[[-a,-a],[a,-a],[a,a],[-a,a]].map(([x,y])=>[x,y*Math.cos(th),y*Math.sin(th)+.6]);
      for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){const x=i*.55,y=j*.55;const inside=Math.abs(x)<a&&Math.abs(y)<a*Math.abs(Math.cos(th));S.line([x,y,-.6],[x,y,2.1],alpha(T.ca,inside?.95:.25),inside?2:1.2);if(inside)S.arrow([x,y,1.9],[x,y,2.25],T.ca,2);}
      S.poly(cs,alpha(T.cx,.18),T.cx);const c=[0,0,.6];S.arrow(c,V3.add(c,V3.mul(nrm,1.3)),T.ink,2.5,'n̂');
      const phi=Math.cos(th);S.text([0,0,2.7],'Φ = BA cos θ = '+fmt(Math.abs(phi),2)+' BA',T.ink);S.text([2.4,0,1],'B',T.ca);}};
  const v=view3d(cv,{...HOME.wire,height:w=>clamp(w*.5,280,440),scene:(S,t)=>SC[scene](S,t)});
  function pick(k){scene=k;$$('#g3-scene button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k));setText('g3-cap',CAP[k]);v.setHome(HOME[k]);}
  $$('#g3-scene button').forEach(b=>b.addEventListener('click',()=>pick(b.dataset.k)));pick('wire');
  const h0=drawers.overview;drawers.overview=()=>{h0&&h0();v.render();};})();
