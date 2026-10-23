(function maxwell(){
  const cv=$('#mx-canvas');const s={e:8},C_=1/Math.sqrt(MU0*EPS0);
  const BANDS=[[1e9,'radio waves'],[3e11,'microwaves'],[4.3e14,'infrared'],[7.5e14,'visible light'],[Infinity,'ultraviolet']];
  const wl=f=>{const l=C_/f;return l>=1e3?sf(l/1e3,'km'):l>=1?sf(l,'m'):l>=1e-3?sf(l*1e3,'mm'):l>=1e-6?sf(l*1e6,'μm'):sf(l*1e9,'nm');};
  const v3=view3d(cv,{yaw:-.75,pitch:.32,dist:9.5,target:[1.5,0,0],min:4,max:20,height:w=>clamp(w*.5,300,430),scene:(S,tt)=>{
    const k=2*Math.PI/2.2,om=2*Math.PI*.45,t0=tt==null?0:tt;S.grid(-1,5,-3,3,1);S.arrow([-1.2,0,0],[5.6,0,0],T.muted,1.6,'');
    const Epts=[],Bpts=[];for(let x=-1.2;x<=5.6;x+=.1){const a=Math.cos(k*x-om*t0)*1.15;Epts.push([x,a,0]);Bpts.push([x,0,a]);}
    S.path(Epts,T.cx,2.2);S.path(Bpts,T.ca,2.2);for(let x=-1.2;x<=5.55;x+=.275){const a=Math.cos(k*x-om*t0)*1.15;if(Math.abs(a)>.06){S.arrow([x,0,0],[x,a,0],alpha(T.cx,.75),1.8);S.arrow([x,0,0],[x,0,a],alpha(T.ca,.75),1.8);}}
    S.arrow([3.9,-1.8,0],[5.5,-1.8,0],T.cv,3.5,'E × B');S.text([-1,1.4,0],'E',T.cx);S.text([-1,0,1.4],'B',T.ca);}});
  function update(){const f=Math.pow(10,s.e),band=BANDS.find(b=>f<b[0])[1];setText('mx-fv',sf(f,'Hz',3));setText('mx-lam',wl(f));setText('mx-band',band);setText('mx-c',sf(C_,'m/s'));setText('mx-ratio','E₀/B₀ = c');v3.render();}
  bindRange('mx-f',x=>sf(Math.pow(10,x),'Hz',2),x=>{s.e=x;update();});
  // displacement current
  const d={I:1,R:4,r:3};
  const Bgap=rc=>{const r=rc*.01,R=d.R*.01;return rc<d.R?MU0*d.I*r/(2*Math.PI*R*R):MU0*d.I/(2*Math.PI*r);};const Bwire=rc=>MU0*d.I/(2*Math.PI*rc*.01);
  function drawD(){const c=$('#mx-dcanvas');const w=c.clientWidth;if(!w)return;const side=w>=640,h=side?330:560;const p=prep(c,h);if(!p)return;const {ctx}=p;
    const sw=side?Math.min(280,w*.4):Math.min(w-20,300),ox=side?10:(w-sw)/2,oy=8,hh=side?h-16:200;
    ctx.fillStyle=T.sunk;ctx.fillRect(ox,oy,sw,hh);ctx.strokeStyle=T.line;ctx.strokeRect(ox+.5,oy+.5,sw-1,hh-1);
    const cx=ox+sw/2,cy=oy+hh/2,pl=hh*.34,gap=34;ctx.strokeStyle=T.ink;ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(cx-gap/2,cy-pl);ctx.lineTo(cx-gap/2,cy+pl);ctx.moveTo(cx+gap/2,cy-pl);ctx.lineTo(cx+gap/2,cy+pl);ctx.stroke();
    ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ox+10,cy);ctx.lineTo(cx-gap/2,cy);ctx.moveTo(cx+gap/2,cy);ctx.lineTo(ox+sw-10,cy);ctx.stroke();
    for(let k=-2;k<=2;k++){const y=cy+k*pl*.38;arrow(ctx,cx-gap/2+6,y,cx+gap/2-6,y,alpha(T.cx,.9),1.8);}
    arrow(ctx,ox+14,cy-14,ox+60,cy-14,T.cv,2.6);label(ctx,'I (real)',ox+66,cy-14,T.cv,'left','middle',MONO);label(ctx,'E grows →',cx,cy+pl+16,T.cx,'center','middle',MONO);label(ctx,'no charge crosses the gap',cx,oy+16,T.muted,'center','middle',MONO);
    const rp=d.r/12*(hh*.44);ctx.save();ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();ctx.ellipse(cx,cy,Math.min(rp*.5,gap*2),rp,0,0,Math.PI*2);ctx.stroke();ctx.restore();label(ctx,'Amperian loop (r)',cx+Math.min(rp*.5,gap*2)+8,cy-rp,T.ink,'left','middle',MONO);
    const gx=side?ox+sw+60:30,gy=side?14:oy+hh+24,gw=side?w-gx-16:w-gx-16,gh=side?h-gy-48:h-gy-48;const Bm=Math.max(Bgap(d.R),1e-9)*1e6*1.2;
    const P=panel(ctx,{x:gx,y:gy,w:gw,h:gh},[0,12],[0,Bm*1.05],{ylabel:'B (μT)',color:T.ca,xlabel:'r (cm)',yn:4,xn:6});
    curve(ctx,P,r=>Bwire(r)*1e6,.3,12,alpha(T.cv,.7),1.8,300,[5,4]);curve(ctx,P,r=>Bgap(r)*1e6,.05,12,T.ca,2.8,300);line(ctx,P,d.R,0,d.R,Bm*1.05,alpha(T.muted,.6),1,[4,4]);label(ctx,'plate edge',P.X(d.R)+4,P.Y(Bm),T.muted,'left','middle',MONO);
    dot(ctx,P.X(d.r),P.Y(Bgap(d.r)*1e6),6,T.hot,T.surface);label(ctx,'dashed: B around a real wire carrying I',P.X(12)-4,P.Y(Bm*.2),T.cv,'right','middle',MONO);
    const dEdt=d.I/(EPS0*Math.PI*d.R*d.R*1e-4);setText('mx-dE',sf(dEdt,'V/(m·s)'));setText('mx-Id',sf(EPS0*Math.PI*d.R*d.R*1e-4*dEdt,'A')+' = I');setText('mx-Bg',sf(Bgap(d.r),'T'));setText('mx-Bw',sf(Bwire(d.r),'T'));}
  drawers.maxwell=()=>{update();drawD();};
  bindRange('mx-I',x=>fmt(x,1)+' A',x=>{d.I=x;drawD();});bindRange('mx-pr',x=>fmt(x,1)+' cm',x=>{d.R=x;drawD();});bindRange('mx-r',x=>fmt(x,1)+' cm',x=>{d.r=x;drawD();});
  update();
})();
Object.assign(TIPS,{"mx-f":"Slide from AM radio through FM, microwave oven, infrared, visible light and ultraviolet. The speed never changes; higher frequency just means shorter wavelength (c = fλ).","mx-I":"A bigger charging current means E between the plates grows faster, and the displacement current (which equals I) makes a bigger B.","mx-pr":"Bigger plates spread the displacement current over a larger area, so at a given radius inside the plates B is smaller, but outside the plates it is unchanged.","mx-r":"Move the loop from inside the plates to outside. Inside, only the displacement current within the loop counts: B ∝ r. Outside, all of it is enclosed: B ∝ 1/r."});
Object.assign(KEYS,{"mx-canvas":["Slide the frequency. Drag the picture to rotate it.",[["cx","electric field E"],["ca","magnetic field B"],["cv","direction of travel E × B"]]],"mx-dcanvas":["Move the sliders. The solid curve is B in the gap; the dashed curve is B around a wire.",[["ca","B between and around the plates"],["cv","B around a real wire"],["hot","your point"]]]});
Object.assign(TT,{maxwell:"The two curl laws are mirror images: a changing B makes E (with a minus sign, Faraday) and a changing E makes B (Maxwell's addition). That mutual regeneration is what a wave is."});
PROBS.push(
 {id:'wlambda',topic:'maxwell',title:'Wavelength of a radio wave',gen(){const f=pick([88,100,540,900,2450]),u=f>=88&&f<=100?'MHz':f===540?'kHz':'MHz',val=f,hz=u==='kHz'?val*1e3:val*1e6,ans=2.998e8/hz;
   return {q:`What is the wavelength of an electromagnetic wave with a frequency of ${val} ${u}? (c = 3.00 × 10⁸ m/s.)`,ans:3e8/hz,unit:'m',hint:'λ = c/f.',sol:`<span class="m">λ = <i>c</i>/<i>f</i> = (3.00 × 10⁸)/(${sf(hz,'',3)}) = <b>${sf(3e8/hz,'m')}</b></span>.`};}},
 {id:'wB0',topic:'maxwell',title:'Magnetic field of a wave',gen(){const E=pick([10,30,100,300]),ans=E/3e8;
   return {q:`The electric field of an electromagnetic wave has amplitude ${E} V/m. What is the amplitude of its magnetic field?`,ans,unit:'T',hint:'E₀ = cB₀.',sol:`<span class="m"><i class="bf">B</i><sub>0</sub> = <i class="ef">E</i><sub>0</sub>/<i>c</i> = ${E}/(3.00 × 10⁸) = <b>${sf(ans,'T')}</b></span>.`};}},
 {id:'wI',topic:'maxwell',title:'Intensity of a wave',gen(){const E=pick([20,50,100,200]),ans=.5*EPS0*3e8*E*E;
   return {q:`An electromagnetic wave has an electric field amplitude of ${E} V/m. What is its intensity (average power per unit area)? (ε₀ = 8.85 × 10⁻¹² C²/(N·m²), c = 3.00 × 10⁸ m/s.)`,ans,unit:'W/m²',hint:'I = ½ε₀cE₀².',sol:`<span class="m"><i>I</i> = ½ε<sub>0</sub><i>c</i><i class="ef">E</i><sub>0</sub>² = ½(8.85 × 10⁻¹²)(3.00 × 10⁸)(${E})² = <b>${sf(ans,'W/m²')}</b></span>.`};}},
 {id:'wdisp',topic:'maxwell',calc:1,title:'B between capacitor plates',gen(){const I=pick([.5,1,2,3]),R=pick([2,3,4,5]),f=pick([.25,.5,.75]),r=R*f,ans=MU0*I*(r*.01)/(2*Math.PI*Math.pow(R*.01,2));
   return {q:`A parallel-plate capacitor with circular plates of radius ${R} cm is being charged by a ${num(I)} A current. What is the magnetic field between the plates at ${num(r)} cm from the axis? (Use the displacement current.)`,ans,unit:'T',hint:'The displacement current density is uniform, so I_enc = I(r/R)². Then B(2πr) = μ₀I_enc.',sol:`<span class="m"><i class="bf">B</i> = μ<sub>0</sub><i>I</i><i>r</i>/(2π<i>R</i>²) = (4π × 10⁻⁷)(${num(I)})(${sf(r/100,'',3)})/(2π(${num(R/100)})²) = <b>${sf(ans,'T')}</b></span>.`};}}
);
