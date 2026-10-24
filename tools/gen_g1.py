from mk import *
import math
# ---------------- Exponential change
def curve_pts(f,x0,x1,y0,y1,xr,yr,n=40):
    return ' '.join(f'{x0+(x1-x0)*t/xr:.1f},{y0-(y0-y1)*f(t)/yr:.1f}' for t in [xr*k/n for k in range(n+1)])
f=lambda t:12*(1-math.exp(-t/0.5))
exs=svg(ln(36,190,240,190,'mut',1.5)+ln(36,190,36,36,'mut',1.5)+
  ln(36,52,240,52,'mut',1,'4 4')+txt(30,56,'12','mut',11,'end')+
  f'<polyline points="{curve_pts(f,36,236,190,52,2.5,12)}" style="fill:none;stroke:var(--cx);stroke-width:2.8"/>'+
  ln(36+200*.75/2.5,190,36+200*.75/2.5,190-138*f(.75)/12,'frc',1.5,'4 3')+ln(36,190-138*f(.75)/12,36+200*.75/2.5,190-138*f(.75)/12,'frc',1.5,'4 3')+
  dotp(36+200*.75/2.5,190-138*f(.75)/12,'','frc')+txt(150,162,'9.3 V at 0.75 s','frc',12,'start')+txt(36+200*.5/2.5,208,'τ','mut',12)+txt(138,214,'t (s)','mut',12)+txt(14,46,'V','mut',12),
  'Capacitor voltage while charging through a resistor (ε = 12 V, τ = 0.50 s).')
lab_e=lab('ep-canvas','Graph of an exponential approach to a final value, with markers at one, two and three time constants.',
  seg('ep-mode','Which curve',[('up','Fills up: 1 − e^(−t/τ)'),('down','Dies away: e^(−t/τ)')]),
  controls(('ep-tau','Time constant τ',.5,4,.1,1.5),('ep-t','Time t',0,10,.1,2)),
  readout(('ep-frac','Value at time t','ef'),('ep-ratio','t / τ',''),('ep-half','Time to get halfway',''),('ep-90','Time to get within 10% of the end','')),
  'The curve changes fastest at the start, and each τ takes it a fixed fraction of the way from where it is to where it\'s going. It never quite arrives.')
module('expo','Exponential change',[('ap','AP C math'),('calc','Calculus')],
 'Charging capacitors, decaying currents in coils, cooling coffee and falling raindrops all follow the same curve: it changes fastest at first, then eases into its final value. One number, the time constant τ, sets the whole timeline.',
 ['Fill a bathtub through a leaky tap that slows as the tub fills. At first the water rises quickly; as the tub fills the flow slows, until it barely changes. Rule: <b>the rate of change is proportional to how far you still have to go.</b> That sentence, written as an equation, gives the exponential.',
  'The time constant τ is how long it would take if the initial rate kept going. A bigger τ means a slower process. After one τ the quantity is 63% of the way there; after two, 86%; after three, 95%; after five it is within 1%. In practice, "done" means about 5τ.',
  'You will meet this curve in RC circuits (τ = RC), in LR circuits (τ = L/R), and in Mechanics for drag. It is the same differential equation each time, only the letters change.'],
 [('<i>f</i>(<i>t</i>) = 1 − <i>e</i><sup>−<i>t</i>/τ</sup>','fills up to its final value'),('<i>f</i>(<i>t</i>) = <i>e</i><sup>−<i>t</i>/τ</sup>','dies away to zero'),('d<i>f</i>/d<i>t</i> = (1 − <i>f</i>)/τ','rate ∝ distance still to go')],
 lab_e,
 [('Slide time to exactly one time constant (t = τ).',[["click","#ep-mode [data-k=up]"],["#ep-tau",2],["#ep-t",2]],'The curve is at 63% of the way. That is 1 − 1/e. Try another τ: whenever t = τ it is still 63%.'),
  ('Make τ larger (slow process), keep t the same.',[["#ep-tau",4],["#ep-t",2]],'A bigger τ stretches the curve out in time. At the same t you are much less far along.'),
  ('Switch to the dying curve and read it at 2τ and 3τ.',[["click","#ep-mode [data-k=down]"],["#ep-tau",1.5],["#ep-t",3]],'At t = 2τ only 14% is left; at 3τ, 5%. The remaining amount shrinks by the same factor, 1/e, every time τ passes.'),
  ('How long until the fill-up curve is within 10% of the end?',[["click","#ep-mode [data-k=up]"],["#ep-tau",1.5],["#ep-t",3.5]],'About 2.3τ. You can read it off the "Time to get within 10%" readout. Within 1% takes 4.6τ.')],
 dict(prob='After you take a flash photo, the camera recharges its flash capacitor. Model the recharge as V(t) = 300(1 − e^(−t/τ)) volts with τ = 1.5 s. Find the voltage 2.0 s after the shot, and how long it takes until the "flash ready" light comes on at 280 V.',svg='',cap='The flash capacitor recharging toward 300 V. The ready light comes on at 280 V.',
  steps=[('Check what the curve should do.','It starts at 0 (the flash just emptied the capacitor), rises quickly at first, and approaches 300 V without crossing it.'),
   ('Voltage at 2.0 s.',m('<i>t</i>/τ = 2.0/1.5 = 1.33')+', so '+m('<i>V</i> = 300(1 − <i>e</i><sup>−1.33</sup>) = 300(1 − 0.264) = 221 V')+'.'),
   ('Time to reach 280 V.','Set '+m('280 = 300(1 − <i>e</i><sup>−<i>t</i>/τ</sup>)')+', so '+m('<i>e</i><sup>−<i>t</i>/τ</sup> = 1 − 280/300 = 1/15')+'.'),
   ('Solve for t (take the natural log).',m('<i>t</i> = τ ln 15 = (1.5 s)(2.71) = 4.1 s')+'.'),
   ('Sanity check.','280 V is 93% of the final value: between 2τ = 3.0 s (86%) and 3τ = 4.5 s (95%) ✓. That few-second wait is the pause you notice between flash shots.')]),
 ['Reading the time constant as the time to finish. It is the time to reach 63%, not 100%.','Mixing up charging and decaying forms: one has 1 − e^(−t/τ), the other e^(−t/τ).','Forgetting the minus sign in the exponent (the curve would blow up).','Entering t in different units from τ. Keep both in seconds.'],
 '''        <h2>Where the curve comes from</h2>
        <ul>
          <li>If the rate is proportional to what's left, <span class="m">d<i>f</i>/d<i>t</i> = (1 − <i>f</i>)/τ</span>, separate variables: <span class="m">d<i>f</i>/(1 − <i>f</i>) = d<i>t</i>/τ</span>. Integrate: <span class="m">−ln(1 − <i>f</i>) = <i>t</i>/τ</span>. Solve: <span class="m"><i>f</i> = 1 − <i>e</i><sup>−<i>t</i>/τ</sup></span>.</li>
          <li><b>Slope at the start</b> is 1/τ. If the curve kept that slope it would reach the end at t = τ. This tangent line is a handy way to read τ off a graph.</li>
          <li><b>Handy numbers:</b> 1 − e⁻¹ = 0.632, 1 − e⁻² = 0.865, 1 − e⁻³ = 0.950, 1 − e⁻⁴ = 0.982, 1 − e⁻⁵ = 0.993. Half-way takes 0.693τ.</li>
        </ul>
        <h2>Solving "how long until…"</h2>
        <ul>
          <li>Isolate the exponential, take the natural log of both sides, and multiply by τ: <span class="m"><i>t</i> = −τ ln(1 − <i>f</i>)</span> for the fill-up, <span class="m"><i>t</i> = −τ ln <i>f</i></span> for the decay.</li>
        </ul>''',
 dict(correct=2,explain='After three time constants the fill-up curve is at 1 − e⁻³ = 0.95, so it is 95% of the way to its final value.',q='a capacitor charges with time constant τ. After 3τ, how far along is it?',opts=['63%','86%','95%','100%']),
 )
# ---------------- Rods, rings and disks
lab_c=lab('ct-canvas','Side view of a charged ring or disk with the field along its axis, and a graph of field against distance.',
  seg('ct-mode','Shape',[('ring','Ring'),('disk','Disk')]),
  controls(('ct-R','Radius R',2,15,.5,6),('ct-Q','Total charge Q',1,20,1,8),('ct-z','Point at distance z',.5,40,.5,10)),
  readout(('ct-E','E on the axis at z','ef'),('ct-pt','If all charge were at the center','ef'),('ct-diff','Difference',''),('ct-lim','Far-away / near limit','')),
  'Q in nC, distances in cm. The dashed curve is the point-charge field kQ/z². Far away, every shape looks like a point charge. A disk up close looks like an infinite sheet: the field stops growing and levels off at σ/2ε₀.')
cx=130;ex2=svg(ln(40,115,248,115,'mut',1.5,'4 4')+ln(70,60,70,170,'ink',3)+ch(70,60,'+',9)+ch(70,170,'+',9)+dotp(210,115,'P','ink',0,-12)+
  arr(210,115,250,115,'ef','',2.8)+txt(238,100,'E','ef',13)+ln(70,60,210,115,'mut',1.2,'3 3')+arr(210,115,168,98,'frc','',1.8)+
  arr(210,115,208,160,'frc','',1.8)+txt(150,88,'dE','frc',12)+txt(145,178,'dE from the opposite slice','mut',10)+
  ln(70,170,210,115,'mut',1.2,'3 3')+txt(135,200,'sideways parts cancel; axial parts add','mut',11)+txt(78,115,'R','mut',12,'start')+txt(140,134,'z','mut',12),
  'A ring seen edge-on. Two opposite slices make fields at P whose sideways parts cancel, leaving only the part along the axis.')
module('continuous','Rods, rings &amp; disks',[('ap','AP C Unit 8'),('calc','Calculus')],
 'Real charged objects aren\'t points. Slice a ring or a disk into tiny pieces, let symmetry cancel the sideways parts, and the sum gives the field along the axis. Far away it becomes kQ/z² again, and up close a disk becomes an infinite sheet.',
 ['Take a ring of charge and a point on its axis. Every slice of the ring is the same distance from the point, so the integral is easy. But the slices pull in different directions: each field points away from its slice, partly along the axis and partly sideways. The sideways parts of opposite slices cancel, leaving only the axial part.',
  'A disk is a stack of rings. Add up the axial fields of all the thin rings from radius 0 to R. The result starts at zero in the center, grows rapidly as you approach, and levels off at σ/2ε₀ right at the surface: exactly the field of an infinite sheet, because to a point very close to it, the disk looks endless.',
  'The test of any such formula: far away (z much larger than R) it must turn into kQ/z². If your answer doesn\'t, something is wrong.'],
 [('<i class="ef">E</i><sub>ring</sub> = <i>kQz</i>/(<i>z</i>² + <i>R</i>²)<sup>3/2</sup>','on the axis'),('<i class="ef">E</i><sub>disk</sub> = (σ/2ε<sub>0</sub>)[1 − <i>z</i>/√(<i>z</i>² + <i>R</i>²)]','on the axis, σ = Q/πR²'),('<i class="ef">E</i><sub>sheet</sub> = σ/2ε<sub>0</sub>','infinite sheet (z ≪ R)')],
 lab_c,
 [('Show the ring, then move the point from near the ring to far away.',[["click","#ct-mode [data-k=ring]"],["#ct-z",10]],'The ring field is zero at the center, rises to a peak near z = R/√2 (0.71R), then falls. Far away it follows the dashed point-charge curve.'),
  ('Put the point at the very center of the ring (z ≈ 0).',[["click","#ct-mode [data-k=ring]"],["#ct-z",.5]],'Almost no field. Slices on opposite sides of the ring pull in opposite directions and cancel.'),
  ('Switch to the disk and come in close (z = 0.5 cm).',[["click","#ct-mode [data-k=disk]"],["#ct-z",.5]],'The disk\'s field is large and nearly constant here: it approaches σ/2ε₀, the infinite-sheet value.'),
  ('Move the point far from the disk and compare with a point charge.',[["click","#ct-mode [data-k=disk]"],["#ct-z",40],["#ct-R",3]],'At z = 40 cm with R = 3 cm, the disk is indistinguishable from a point charge: the difference readout is below 0.5%.')],
 dict(prob='A ring of radius 0.10 m carries a uniform charge of +6.0 nC. Find the electric field on its axis at z = 0.20 m from the center, and compare it with a point charge of the same size at the center.',svg=ex2,cap=ex2 and 'A ring seen edge-on. Opposite slices make fields at P whose sideways parts cancel, leaving the axial part.',
  steps=[('Slice and use symmetry.','Cut the ring into slices dq. Each is the same distance '+m('<i>r</i> = √(<i>z</i>² + <i>R</i>²)')+' from P. Sideways components cancel in pairs, so only the axial part '+m('d<i class="ef">E</i> cos φ')+' survives, with '+m('cos φ = <i>z</i>/<i>r</i>')+'.'),
   ('Add the axial parts.',m('<i class="ef">E</i> = ∫ <i>k</i> d<i>q</i> <i>z</i>/<i>r</i>³ = <i>kz</i>/<i>r</i>³ ∫ d<i>q</i> = <i>kQz</i>/(<i>z</i>² + <i>R</i>²)<sup>3/2</sup>')+'. Everything outside the integral is the same for every slice.'),
   ('Plug in the numbers.',m('<i>z</i>² + <i>R</i>² = 0.040 + 0.010 = 0.050 m²')+', and '+m('0.050<sup>3/2</sup> = 0.01118')+'. So '+m('<i class="ef">E</i> = (8.99 × 10⁹)(6.0 × 10⁻⁹)(0.20)/0.01118 = 9.6 × 10² N/C')+', pointing away from the ring along the axis.'),
   ('Compare with a point charge.',m('<i>kQ</i>/<i>z</i>² = (8.99 × 10⁹)(6.0 × 10⁻⁹)/(0.20)² = 1.35 × 10³ N/C')+'. The ring gives 28% less: at z = 2R it is still not far enough away to look like a point.'),
   ('Check the limits.',m('<i>z</i> ≫ <i>R</i>')+' gives '+m('<i>kQ</i>/<i>z</i>²')+', and z = 0 gives 0 ✓.')]),
 ['Adding the magnitudes of all the dE vectors without cancelling the sideways parts.','Using the distance from the center of the ring (z) for r in kdq/r². The distance from each slice is √(z² + R²).','Forgetting that for a disk σ = Q/(πR²), not Q/(2πR).','Taking the infinite-sheet formula for a small disk far away. That only works when z is much smaller than R.'],
 '''        <h2>Building up from the ring</h2>
        <ul>
          <li><b>Ring:</b> <span class="m"><i class="ef">E</i> = <i>kQz</i>/(<i>z</i>² + <i>R</i>²)<sup>3/2</sup></span>. Zero at the center, maximum at <span class="m"><i>z</i> = <i>R</i>/√2</span> where it equals about 0.385 <i>kQ</i>/<i>R</i>².</li>
          <li><b>Disk:</b> stack thin rings of radius <i>r</i> and width d<i>r</i>, each with <span class="m">d<i>q</i> = σ·2π<i>r</i> d<i>r</i></span>. Integrating gives <span class="m"><i class="ef">E</i> = (σ/2ε<sub>0</sub>)[1 − <i>z</i>/√(<i>z</i>² + <i>R</i>²)]</span>.</li>
          <li><b>Infinite sheet:</b> let <i>R</i> → ∞ and the bracket becomes 1: <span class="m"><i class="ef">E</i> = σ/2ε<sub>0</sub></span>, the same at every distance. It points away from the sheet on both sides.</li>
        </ul>
        <h2>Two rules of thumb</h2>
        <ul>
          <li>For a point much farther than the object\'s size, treat it as a point charge: <span class="m"><i>kQ</i>/<i>z</i>²</span>.</li>
          <li>For a point much closer than the object\'s size, treat it as an infinite plane or line.</li>
        </ul>''',
 dict(correct=0,explain='Opposite slices of the ring are the same distance from the center and pull in opposite directions, so all the sideways parts cancel exactly. At the center of the ring there is no axial part either, so the net field is zero.',q='what is the electric field at the exact center of a uniformly charged ring?',opts=['Zero','kQ/R²','kQ/R','Infinite']))
# ---------------- Gauss's law
lab_g=lab('gs-canvas','Gauss\'s law. Either a movable set of charges and a spherical surface, or a graph of the field against distance for symmetric charge distributions.',
  seg('gs-mode','What to show',[('flux','Flux through a sphere'),('profile','Field of symmetric charges')]),
  '''        <div id="gs-flux-ctl"><div class="controls">
          <div class="ctl"><label for="gs-R"><span>Sphere radius</span> <output id="gs-R-out"></output></label><input type="range" id="gs-R" min="3" max="13" step="0.5" value="7"></div>
          <div class="ctl"><label for="gs-q1"><span>Charge 1</span> <output id="gs-q1-out"></output></label><input type="range" id="gs-q1" min="-4" max="4" step="1" value="3"></div>
          <div class="ctl"><label for="gs-q2"><span>Charge 2</span> <output id="gs-q2-out"></output></label><input type="range" id="gs-q2" min="-4" max="4" step="1" value="-2"></div>
          <div class="ctl"><label for="gs-q3"><span>Charge 3</span> <output id="gs-q3-out"></output></label><input type="range" id="gs-q3" min="-4" max="4" step="1" value="2"></div>
        </div></div>
        <div id="gs-prof-ctl" hidden><div class="controls" style="margin-bottom:0">
          <div class="ctl"><span class="lbl">Object</span><div class="seg" id="gs-obj" role="group" aria-label="Object"><button type="button" data-k="solid" aria-pressed="true">Solid sphere</button><button type="button" data-k="shell">Thin shell</button><button type="button" data-k="rod">Long rod (cylinder)</button></div></div>
          <div class="ctl"><label for="gs-prad"><span>Radius R</span> <output id="gs-prad-out"></output></label><input type="range" id="gs-prad" min="2" max="10" step="0.5" value="5"></div>
          <div class="ctl"><label for="gs-pQ"><span id="gs-pQ-lbl">Total charge Q</span> <output id="gs-pQ-out"></output></label><input type="range" id="gs-pQ" min="1" max="10" step="1" value="5"></div>
          <div class="ctl"><label for="gs-pr"><span>Look at r</span> <output id="gs-pr-out"></output></label><input type="range" id="gs-pr" min="0.5" max="30" step="0.5" value="8"></div>
        </div></div>
''',
  readout(('gs-r1','Enclosed charge / E at r','ef'),('gs-r2','Flux Φ = q_enc/ε₀ / E·area',''),('gs-r3','Flux measured by adding up E·n over the surface',''),('gs-r4','Result','')),
  'Left: the sphere\'s cross-section is the circle; drag the charges (a charge on the circle is not allowed to sit too close to it). "Measured" flux adds up E·n̂ over the whole 3D sphere numerically, so you can check Gauss\'s law yourself. Right mode: field strength against distance for three symmetric objects.')
gx=svg(f'<circle cx="130" cy="115" r="60" style="fill:color-mix(in srgb,var(--pos) 18%,transparent);stroke:var(--pos);stroke-width:2"/>'+txt(130,120,'+Q','pos',16)+
  f'<circle cx="130" cy="115" r="30" style="fill:none;stroke:var(--ink);stroke-width:1.8;stroke-dasharray:5 4"/>'+
  f'<circle cx="130" cy="115" r="95" style="fill:none;stroke:var(--ink);stroke-width:1.8;stroke-dasharray:5 4"/>'+
  arr(130+30*.707,115-30*.707,130+30*.707+22,115-30*.707-22,'ef','',2.2)+arr(130+95*.707,115+95*.707,130+95*.707+18,115+95*.707+18,'ef','',2.2)+
  ln(130,115,130+60*.866,115+60*.5,'mut',1.2)+txt(176,146,'R','mut',12)+txt(152,92,'r < R','ink',11,'start')+txt(195,60,'r > R','ink',11,'start'),
  'A uniformly charged solid sphere (radius R) and two spherical Gaussian surfaces: one inside, one outside.')
module('gauss',"Flux &amp; Gauss's law",[('ap','AP C Unit 8')],
 'Gauss\'s law is Coulomb\'s law in a more powerful costume. Draw an imaginary closed surface, count the net field passing through it, and the answer depends only on the charge inside. When the charge has symmetry, it gives the field in a single line.',
 ['Imagine field lines as water streaming out of every positive charge. Put a closed net around some charges and count the water flowing through it. The count only depends on how many positive sources are inside, minus how many negative sinks. Move the charges around inside, change the shape of the net, even add charges outside: the net count doesn\'t change.',
  'That count is the electric <b>flux</b>, Φ. Gauss\'s law says Φ equals the enclosed charge divided by ε₀. In the simulation the "measured flux" adds up E·n̂ over the whole sphere; it always matches q<sub>enc</sub>/ε₀, however the charges are arranged.',
  'The law is always true. It is only <em>useful</em> for finding E when the field is the same everywhere on your surface (or zero, or parallel to it). That needs symmetry: spherical, cylindrical or planar. Then ∮E·dA becomes just E times an area, and you can solve for E.'],
 [('Φ<sub>E</sub> = ∮ <i class="ef">E</i> · d<i>A</i> = <i>q</i><sub>enc</sub>/ε<sub>0</sub>','Gauss\'s law'),('Φ<sub>E</sub> = <i class="ef">E</i><i>A</i> cos θ','uniform field, flat surface'),('<i class="ef">E</i>(4π<i>r</i>²) = <i>q</i><sub>enc</sub>/ε<sub>0</sub>','sphere: the whole law in one line')],
 add3(lab_g,'gs3-canvas','The same sphere in space. Each arrow is the field at one point of the surface: orange where the field leaves the sphere, pink where it enters. The sum of them all is the flux.','3D Gaussian sphere with field arrows on its surface. Drag to rotate.'),
 [('Start with only charge 1 inside the sphere. Then slide the sphere radius so charge 2 moves from inside to outside.',[["click","#gs-mode [data-k=flux]"],["#gs-q1",3],["#gs-q2",-2],["#gs-q3",0],["#gs-R",7]],'Each time a charge crosses the surface, the enclosed charge changes and so does the flux. The measured and predicted flux agree every time.'),
  ('Cancel everything: charge 1 = +3, charge 2 = −3 (both inside).',[["click","#gs-mode [data-k=flux]"],["#gs-q1",3],["#gs-q2",-3],["#gs-q3",0],["#gs-R",9]],'The enclosed charge is zero, so the net flux is zero, even though the field at the surface is certainly not zero. Field lines that go out also come back in.'),
  ('Switch to the profile for a solid sphere and drag r from inside to outside.',[["click","#gs-mode [data-k=profile]"],["click","#gs-obj [data-k=solid]"],["#gs-pr",3]],'Inside, E grows linearly with r (only the charge within r counts). Outside it falls as 1/r², as if all the charge were at the center. At r = R the two meet.'),
  ('Switch to the thin shell and look inside.',[["click","#gs-mode [data-k=profile]"],["click","#gs-obj [data-k=shell]"],["#gs-pr",3]],'A Gaussian sphere inside a shell encloses no charge, so E = 0 there. Outside, the shell looks like a point charge.')],
 dict(prob='A solid sphere of radius R = 5.0 cm carries a uniform charge Q = +8.0 nC throughout its volume. Use Gauss\'s law to find the field at r = 3.0 cm and at r = 10.0 cm.',svg=gx,cap='Two concentric Gaussian spheres: one at r = 3 cm inside, one at r = 10 cm outside.',
  steps=[('Use the symmetry.','By spherical symmetry E points radially and has the same size at every point of a sphere centered on the charge. So choose a spherical Gaussian surface of radius r, and then '+m('Φ = <i class="ef">E</i>(4π<i>r</i>²)')+'.'),
   ('Inside (r = 3.0 cm).','The charge is spread evenly, so the enclosed charge is the fraction of volume inside r: '+m('<i>q</i><sub>enc</sub> = <i>Q</i>(<i>r</i>/<i>R</i>)³ = 8.0 nC × (0.60)³ = 1.73 nC')+'.'),
   ('Solve for E inside.',m('<i class="ef">E</i> = <i>q</i><sub>enc</sub>/(4πε<sub>0</sub><i>r</i>²) = <i>kQr</i>/<i>R</i>³ = (8.99 × 10⁹)(8.0 × 10⁻⁹)(0.030)/(0.050)³ = 1.7 × 10⁴ N/C')+', pointing outward.'),
   ('Outside (r = 10.0 cm).','All the charge is enclosed, so '+m('<i class="ef">E</i> = <i>kQ</i>/<i>r</i>² = (8.99 × 10⁹)(8.0 × 10⁻⁹)/(0.10)² = 7.2 × 10³ N/C')+', exactly like a point charge.'),
   ('Check at the surface.','At r = R both formulas must agree: '+m('<i>kQ</i>/<i>R</i>² = <i>kQR</i>/<i>R</i>³ = 2.9 × 10⁴ N/C')+' ✓.')]),
 ['Using Gauss\'s law to find E when there is no symmetry. The law still holds, but you can\'t pull E out of the integral.','Counting charge outside the surface. Only enclosed charge appears in the law (the outside charges do affect E, but their flux cancels).','For a non-conducting sphere, using the full Q inside the sphere instead of the fraction Q(r/R)³.','Thinking E is zero everywhere when the flux is zero. Zero net flux just means as much field leaves as enters.'],
 '''        <h2>What flux means</h2>
        <ul>
          <li>For a flat surface in a uniform field, <span class="m">Φ = <i class="ef">E</i><i>A</i> cos θ</span>, where θ is the angle between E and the surface's normal (the line sticking straight out of it). Face-on: maximum. Edge-on: zero.</li>
          <li>For a curved surface or a non-uniform field, chop the surface into little patches, add up <span class="m"><i class="ef">E</i> · d<i>A</i></span> for each, and the sum is the integral <span class="m">∮ <i class="ef">E</i> · d<i>A</i></span>. The circle on the integral means the surface is closed.</li>
          <li>Outward flux counts positive, inward flux negative.</li>
        </ul>
        <h2>Three symmetric Gaussian surfaces</h2>
        <div class="tablewrap"><table><thead><tr><th>Charge distribution</th><th>Surface</th><th>Result</th></tr></thead><tbody>
<tr><td>point, sphere, spherical shell</td><td>sphere, radius r</td><td><span class="m"><i class="ef">E</i> = <i>kq</i><sub>enc</sub>/<i>r</i>²</span></td></tr>
<tr><td>long straight line or cylinder (charge λ per length)</td><td>coaxial cylinder, radius r, length ℓ</td><td><span class="m"><i class="ef">E</i> = λ/(2πε<sub>0</sub><i>r</i>)</span> outside</td></tr>
<tr><td>infinite flat sheet (σ)</td><td>"pillbox" through the sheet</td><td><span class="m"><i class="ef">E</i> = σ/2ε<sub>0</sub></span></td></tr>
</tbody></table></div>
        <h2>Why it is true</h2>
        <ul><li>For a single point charge the flux through a sphere is <span class="m"><i class="ef">E</i>·4π<i>r</i>² = <i>kq</i>·4π = <i>q</i>/ε<sub>0</sub></span>, independent of r: the 1/r² in the field cancels the r² in the area. Superposition and the shape-independence of the line count extend it to everything.</li></ul>''',
 dict(correct=3,explain='A Gaussian sphere inside a charged conducting or insulating thin shell encloses no charge, so Gauss\'s law gives zero field there. (More precisely: by symmetry E is radial and uniform on the sphere, and its flux is zero.)',q='a thin spherical shell carries charge Q. What is the electric field inside the shell, at a point away from the shell?',opts=['kQ/r²','kQr/R³','Q/ε₀','Zero']))
