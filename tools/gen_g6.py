from mk import *
import math
# ---------------- Biot-Savart
lab_bs=lab('bs-canvas','3D view of current slices and the magnetic field each makes at a point P. Drag to rotate.',
  seg('bs-mode','Current shape',[('loop','Circular loop (point on the axis)'),('wire','Straight wire segment')]),
  '''        <div id="bs-l-ctl"><div class="controls">
          <div class="ctl"><label for="bs-R"><span>Loop radius R</span> <output id="bs-R-out"></output></label><input type="range" id="bs-R" min="2" max="10" step="0.5" value="5"></div>
          <div class="ctl"><label for="bs-z"><span>Point P on the axis, z</span> <output id="bs-z-out"></output></label><input type="range" id="bs-z" min="0" max="15" step="0.5" value="6"></div>
          <div class="ctl"><label for="bs-arc"><span>Part of the loop that carries current</span> <output id="bs-arc-out"></output></label><input type="range" id="bs-arc" min="60" max="360" step="30" value="360"></div>
        </div></div>
        <div id="bs-w-ctl" hidden><div class="controls">
          <div class="ctl"><label for="bs-L"><span>Wire length L</span> <output id="bs-L-out"></output></label><input type="range" id="bs-L" min="5" max="60" step="5" value="20"></div>
          <div class="ctl"><label for="bs-a"><span>Distance a from the wire</span> <output id="bs-a-out"></output></label><input type="range" id="bs-a" min="2" max="30" step="1" value="6"></div>
        </div></div>
        <div class="controls">
          <div class="ctl"><label for="bs-I"><span>Current I</span> <output id="bs-I-out"></output></label><input type="range" id="bs-I" min="1" max="20" step="1" value="10"></div>
          <div class="ctl"><label for="bs-n"><span>Number of slices</span> <output id="bs-n-out"></output></label><input type="range" id="bs-n" min="2" max="36" step="1" value="12"></div>
        </div>
''',
  readout(('bs-r1','','ef'),('bs-r2','',''),('bs-r3','',''),('bs-r4','','')),
  'Each slice of current makes a small field dB (arrows at P, all drawn the same length for the loop so you can see their directions). In the loop, the sideways parts cancel in pairs and the axial parts add. Reduce the arc and they no longer cancel.')
bsx=svg(f'<ellipse cx="90" cy="115" rx="14" ry="62" style="fill:none;stroke:var(--cv);stroke-width:3"/>'+ln(40,115,250,115,'mut',1.3,'4 4')+dotp(200,115,'P','ink',0,-12)+
  ln(90,53,200,115,'mut',1.2,'3 3')+arr(200,115,162,96,'bf','dB',2,(0,0))+arr(200,115,200,150,'bf','',1.8)+arr(200,115,250,115,'bf','B',2.8,(0,-4))+txt(100,120,'R','mut',12,'start')+txt(150,134,'z','mut',12)+ln(76,60,76,60,'cv',1)+arr(90,60,104,56,'cv','dl',2,(0,-8))+
  txt(130,205,'dB axial parts add; sideways parts cancel','mut',11),
  'A slice dl at the top of the loop makes a field dB at P. Its axial part adds to the others; the sideways part cancels with the opposite slice.')
module('biot','Biot–Savart law',[('ap','AP C Unit 12'),('calc','Calculus')],
 'Coulomb\'s law builds electric fields from point charges. The Biot–Savart law does the same for magnetism: cut any current into tiny pieces, find the small field each one makes, and add them up. It is the tool when a wire has an awkward shape.',
 ['Each short piece of wire with current <b>I</b> and length <b>dl</b> makes a tiny magnetic field that circles around it, with strength proportional to I dl and falling as 1/r². Crucially, the direction is not along r̂ (as with a point charge) but perpendicular to both the current and the line to the point: dB ∝ I dl × r̂/r². Use the right-hand rule: thumb along the current, fingers curl the way B goes.',
  'To find the total field of a loop or wire, you add up the dB from all the pieces. Like the charged ring, the slices of a current loop sit at the same distance from a point on the axis, but their fields point in different directions; the sideways parts cancel in pairs and only the axial component survives.',
  'The result for a straight wire is B = μ₀I/(2πa) for a long wire and a bit smaller for a short one. For a circular loop, B = μ₀I/(2R) at the center. The Biot–Savart law always works, while Ampère\'s law (next module) is a shortcut that only works with symmetry.'],
 [('d<i class="bf">B</i> = (μ<sub>0</sub>/4π) <i class="cur">I</i> d<i>ℓ</i> × <i>r̂</i>/<i>r</i>²','Biot–Savart law, μ₀/4π = 10⁻⁷ T·m/A'),('<i class="bf">B</i><sub>loop axis</sub> = μ<sub>0</sub><i class="cur">I</i><i>R</i>²/(2(<i>R</i>² + <i>z</i>²)<sup>3/2</sup>)','circular loop, on its axis'),('<i class="bf">B</i><sub>wire</sub> = μ<sub>0</sub><i class="cur">I</i>/(2π<i>a</i>)','long straight wire')],
 lab_bs,
 [('Loop: move P to the center of the loop (z = 0).',[["click","#bs-mode [data-k=loop]"],["#bs-arc",360],["#bs-z",0],["#bs-R",5]],'At the center every slice is at distance R, perpendicular to the line to P, and every dB points along the axis. B = μ₀I/(2R) is the largest field on the axis.'),
  ('Cut the loop down to a half circle (arc = 180°).',[["click","#bs-mode [data-k=loop]"],["#bs-arc",180],["#bs-z",6],["#bs-R",5]],'The sideways components no longer cancel, so the total field tilts. The sideways readout is no longer zero. Symmetry is what made the full-loop answer so simple.'),
  ('Switch to a wire segment and increase its length.',[["click","#bs-mode [data-k=wire]"],["#bs-a",6],["#bs-L",60],["#bs-n",36]],'As the wire gets much longer than the distance a, the field approaches the infinite-wire value μ₀I/(2πa), and doesn\'t grow any more.'),
  ('Increase the number of slices with the wire segment.',[["click","#bs-mode [data-k=wire]"],["#bs-L",20],["#bs-a",6],["#bs-n",2]],'With two slices the sum is a rough guess. With 36 it matches the exact integral almost perfectly: the integral is what you get when the slices become infinitely thin.')],
 dict(prob='A circular loop of radius 5.0 cm carries 8.0 A. Find the magnetic field (a) at its center and (b) on the axis 12 cm from the center. Give directions using the right-hand rule.',svg=bsx,cap='A slice dl of the loop makes a field dB at P on the axis.',
  steps=[('Set up one slice.',m('d<i class="bf">B</i> = (μ<sub>0</sub>/4π) <i class="cur">I</i> d<i>ℓ</i> × <i>r̂</i>/<i>r</i>²')+'. For every slice, dl is perpendicular to the line to P, so '+m('|d<i>ℓ</i> × <i>r̂</i>| = d<i>ℓ</i>')+' and each slice is the same distance '+m('<i>r</i> = √(<i>R</i>² + <i>z</i>²)')+' from P.'),
   ('Keep only the axial part.','The sideways parts cancel in pairs. The axial component of each dB is '+m('d<i class="bf">B</i> cos α = d<i class="bf">B</i> (<i>R</i>/<i>r</i>)')+'. Add up over the loop: '+m('∫ d<i>ℓ</i> = 2π<i>R</i>')+'.'),
   ('Result.',m('<i class="bf">B</i> = (μ<sub>0</sub><i class="cur">I</i>/4π)(<i>R</i>/<i>r</i>³)(2π<i>R</i>) = μ<sub>0</sub><i class="cur">I</i><i>R</i>²/(2(<i>R</i>² + <i>z</i>²)<sup>3/2</sup>)')+'.'),
   ('(a) At the center (z = 0).',m('<i class="bf">B</i> = μ<sub>0</sub><i class="cur">I</i>/(2<i>R</i>) = (4π × 10⁻⁷)(8.0)/(2 × 0.050) = 1.0 × 10⁻⁴ T')+' = 0.10 mT.'),
   ('(b) On the axis, z = 12 cm.',m('<i class="bf">B</i> = (4π × 10⁻⁷)(8.0)(0.050)²/(2(0.0025 + 0.0144)<sup>3/2</sup>) = 5.7 × 10⁻⁶ T')+' = 5.7 μT.'),
   ('Direction and check.','Curl the fingers of your right hand along the current; the thumb gives the direction of B on the axis. The field is much weaker at 12 cm than at the center, and it falls off roughly as 1/z³ for large z ✓.')]),
 ['Treating dB like the field of a point charge (along r̂). It is perpendicular to both dl and r̂.','Adding the magnitudes of all the dB without cancelling the sideways components.','Using the formula for the center when the point is on the axis away from the center.','Forgetting that the loop formula needs the radius in meters.'],
 '''        <h2>Using the law</h2>
        <ul>
          <li><b>Direction:</b> the right-hand rule for <span class="m">d<i>ℓ</i> × <i>r̂</i></span>. For a long wire, the field circles the wire (thumb along I, fingers curl the way B goes).</li>
          <li><b>Straight wire segment</b> at perpendicular distance <i>a</i>, spanning angles θ₁ and θ₂ from the perpendicular: <span class="m"><i class="bf">B</i> = (μ<sub>0</sub><i class="cur">I</i>/(4π<i>a</i>))(sin θ<sub>1</sub> + sin θ<sub>2</sub>)</span>. For an infinitely long wire, both angles → 90° and <span class="m"><i class="bf">B</i> = μ<sub>0</sub><i class="cur">I</i>/(2π<i>a</i>)</span>.</li>
          <li><b>Circular arc</b> (angle θ) at its center: <span class="m"><i class="bf">B</i> = μ<sub>0</sub><i class="cur">I</i>θ/(4π<i>R</i>)</span>. A full loop (θ = 2π) gives μ₀I/(2R).</li>
          <li><b>Loop on its axis, far away:</b> <span class="m"><i class="bf">B</i> ≈ μ<sub>0</sub>μ/(2π<i>z</i>³)</span> with μ = I·(area): the loop acts like a tiny bar magnet (a magnetic dipole).</li>
        </ul>
        <h2>Two parallel wires</h2>
        <ul>
          <li>Wire 1 makes a field <span class="m">μ<sub>0</sub><i>I</i><sub>1</sub>/(2π<i>d</i>)</span> at wire 2, which then feels a force per length <span class="m"><i>F</i>/<i>L</i> = μ<sub>0</sub><i>I</i><sub>1</sub><i>I</i><sub>2</sub>/(2π<i>d</i>)</span>. Parallel currents attract; opposite currents repel.</li>
        </ul>
        <h2>Field of a single moving charge</h2>
        <ul>
          <li>A current is just moving charge, so one charge <i>q</i> moving at velocity <i class="cur">v</i> makes <span class="m"><i class="bf">B</i> = (μ<sub>0</sub>/4π) <i>q</i><i class="cur">v</i> × <i>r̂</i>/<i>r</i>²</span> (for speeds much less than <i>c</i>).</li>
          <li>It is largest in the plane perpendicular to <i class="cur">v</i>, and zero straight ahead of or behind the charge.</li>
          <li>Compare with the electric field of the same charge: <span class="m"><i class="bf">B</i> = (<i>v</i>/<i>c</i>²)(<i class="ef">E</i> sin θ)</span>, a tiny fraction of E at everyday speeds.</li>
        </ul>
''',
 dict(correct=3,explain='At the center of a loop, every slice is perpendicular to the line to the center and at distance R. All the dB point along the axis in the same direction, so they simply add: B = μ₀I/(2R). There is nothing to cancel.',q='all the pieces of a circular current loop contribute to the field at its exact center. How do their contributions combine?',opts=['They cancel, giving B = 0','They partially cancel','They add up to μ₀I/(2πR)','They all point the same way and add to μ₀I/(2R)']))
# ---------------- Ampere's law
lab_am=lab('am-canvas','Cross-section views and graphs of the magnetic field of a thick wire, a solenoid and a toroid.',
  seg('am-mode','Current arrangement',[('wire','Thick wire'),('sole','Solenoid'),('tor','Toroid')]),
  '''        <div class="controls">
          <div class="ctl"><label for="am-I"><span>Current I</span> <output id="am-I-out"></output></label><input type="range" id="am-I" min="1" max="50" step="1" value="12"></div>
          <div class="ctl"><label for="am-rad"><span id="am-rad-lbl">Wire radius R</span> <output id="am-rad-out"></output></label><input type="range" id="am-rad" min="1" max="6" step="0.5" value="2"></div>
          <div class="ctl" id="am-n-ctl" hidden><label for="am-n"><span id="am-n-lbl">Turns per meter n</span> <output id="am-n-out"></output></label><input type="range" id="am-n" min="100" max="2000" step="100" value="500"></div>
          <div class="ctl"><label for="am-r"><span>Amperian loop radius r</span> <output id="am-r-out"></output></label><input type="range" id="am-r" min="0.5" max="15" step="0.5" value="3"></div>
        </div>
''',
  readout(('am-r1','','ef'),('am-r2','',''),('am-r3','',''),('am-r4','','')),
  'Dashed circle: the Amperian loop of radius r. On the graph, B(r) is the field at that distance from the axis. Only the current passing through the loop matters.')
ams=svg(f'<circle cx="130" cy="115" r="70" style="fill:color-mix(in srgb,var(--cv) 10%,transparent);stroke:var(--cv);stroke-width:2"/>'+
  ''.join(f'<circle cx="{130+x}" cy="{115+y}" r="3" style="fill:var(--cv)"/>' for x,y in [(0,0),(25,15),(-25,15),(0,-30),(35,-20),(-35,-20),(0,45),(45,20),(-45,20),(15,-52),(-15,-52),(20,52)])+
  f'<circle cx="130" cy="115" r="38" style="fill:none;stroke:var(--ink);stroke-width:1.8;stroke-dasharray:5 4"/><circle cx="130" cy="115" r="100" style="fill:none;stroke:var(--ink);stroke-width:1.8;stroke-dasharray:5 4"/>'+
  arr(92,115,92,100,'bf','',2.2)+arr(130,15,148,17,'bf','',2.2)+txt(130,208,'r = 1 cm inside; r = 6 cm outside (R = 2 cm)','mut',10)+txt(130,120,'⊙ I','cur',12),
  'A thick wire carries a current out of the page. The dashed circles are Amperian loops: one inside the wire, one outside.')
module('ampere',"Ampère's law",[('ap','AP C Unit 12'),('pu','AP 2: magnetism')],
 'Gauss\'s law finds E when there is symmetry. Ampère\'s law does the same for B: choose a loop, add up B along it, and the answer depends only on the current passing through the loop. Wires, solenoids and toroids each take one line.',
 ['Walk around a closed loop and add up the part of B that points along your path, times each little step. Ampère\'s law says this total equals μ₀ times the current that pierces the loop. It is not saying B depends only on that current, but that the loop sum does. When symmetry makes B constant and along the path, the sum is just B times the length of the loop, and you can solve for B immediately.',
  'For a long straight wire the field circles the wire, so a circular loop is the natural choice: B(2πr) = μ₀I. For a thick wire with current spread evenly, a loop inside the wire encloses only the fraction of the current within it: B grows linearly from zero at the center and then falls off as 1/r outside.',
  'A long solenoid packs the wire into a coil. A rectangular loop with one side inside and one outside shows that the field inside is uniform, B = μ₀nI, and nearly zero outside. A toroid (a solenoid bent into a doughnut) has B = μ₀NI/(2πr) inside the doughnut and zero outside.'],
 [('∮ <i class="bf">B</i> · d<i>ℓ</i> = μ<sub>0</sub><i class="cur">I</i><sub>enc</sub>','Ampère\'s law'),('<i class="bf">B</i> = μ<sub>0</sub><i class="cur">I</i>/(2π<i>r</i>)  (outside a wire);  μ<sub>0</sub><i>n</i><i class="cur">I</i>  (solenoid)','two key results'),('<i class="bf">B</i> = μ<sub>0</sub><i>N</i><i class="cur">I</i>/(2π<i>r</i>)','toroid')],
 add3(lab_am,'am3-canvas','The field you are finding, in space. A wire has circular field lines; inside a solenoid the field runs straight along the axis; a toroid traps it in a ring. The dashed loop is your Amperian loop.','3D view of the current and its magnetic field. Drag to rotate.'),
 [('Thick wire: move the Amperian loop from inside the wire to outside.',[["click","#am-mode [data-k=wire]"],["#am-rad",2],["#am-I",12],["#am-r",1]],'Inside, B grows in proportion to r because only the current within the loop counts. At r = R it peaks, and outside it falls as 1/r.'),
  ('Double the current in the thick wire.',[["click","#am-mode [data-k=wire]"],["#am-I",24],["#am-r",3],["#am-rad",2]],'The field at every point doubles. B is proportional to I at fixed r.'),
  ('Solenoid: move the loop outside the coil.',[["click","#am-mode [data-k=sole]"],["#am-rad",3],["#am-r",6]],'Outside an ideal long solenoid the field is zero. The inside field μ₀nI is uniform; it doesn\'t depend on where you are inside, or on the coil\'s radius.'),
  ('Toroid: look at the field inside the doughnut and just outside it.',[["click","#am-mode [data-k=tor]"],["#am-rad",6],["#am-r",8]],'Inside the doughnut the field falls as 1/r (stronger on the inner edge). Everywhere else, including the hole in the middle, it is zero.')],
 dict(prob='A long straight wire of radius R = 2.0 cm carries a total current of 12 A, uniformly distributed over its cross-section. Find the magnetic field at r = 1.0 cm and at r = 6.0 cm from the axis.',svg=ams,cap='Cross-section of the wire with current out of the page. Dashed circles are Amperian loops at r = 1 cm and r = 6 cm.',
  steps=[('Choose the loop.','By symmetry B circles the axis and has the same size everywhere on a circle centered on the wire. Choose a circular Amperian loop of radius r. Then '+m('∮ <i class="bf">B</i> · d<i>ℓ</i> = <i class="bf">B</i>(2π<i>r</i>)')+'.'),
   ('r = 1.0 cm (inside).','The current enclosed is the fraction of the area: '+m('<i class="cur">I</i><sub>enc</sub> = <i class="cur">I</i>(<i>r</i>/<i>R</i>)² = 12 × (0.50)² = 3.0 A')+'. Then '+m('<i class="bf">B</i> = μ<sub>0</sub><i class="cur">I</i><sub>enc</sub>/(2π<i>r</i>) = (4π × 10⁻⁷)(3.0)/(2π × 0.010) = 6.0 × 10⁻⁵ T')+'.'),
   ('r = 6.0 cm (outside).','All the current is enclosed: '+m('<i class="bf">B</i> = μ<sub>0</sub><i class="cur">I</i>/(2π<i>r</i>) = (4π × 10⁻⁷)(12)/(2π × 0.060) = 4.0 × 10⁻⁵ T')+'.'),
   ('Check at the surface (r = R).','Both formulas must agree: '+m('μ<sub>0</sub><i class="cur">I</i>/(2π<i>R</i>) = 1.2 × 10⁻⁴ T')+', the maximum field. At 1 cm it is half the value at the surface (r/R), 60 μT ✓.'),
   ('Direction.','Curl your fingers around the wire so that your thumb points along the current: B circles in the direction your fingers curl. Out of the page gives counterclockwise field lines.')]),
 ['Using the total current for a loop inside a thick wire. Only the current inside the loop counts.','Picking a loop with no symmetry. The law is always true, but you can\'t solve for B without a loop where B is constant and along the path.','Using n as the total number of turns for a solenoid. n is turns per unit length.','Saying B = 0 outside a toroid \'because there is no current there\'. It is zero because an Amperian loop out there encloses no net current (the wire passes through it in both directions).'],
 '''        <h2>Choosing the loop</h2>
        <div class="tablewrap"><table><thead><tr><th>Current arrangement</th><th>Loop</th><th>Field</th></tr></thead><tbody>
<tr><td>long straight wire (radius R)</td><td>circle of radius r around the axis</td><td><span class="m"><i class="bf">B</i> = μ<sub>0</sub><i class="cur">I</i><i>r</i>/(2π<i>R</i>²)</span> inside, <span class="m">μ<sub>0</sub><i class="cur">I</i>/(2π<i>r</i>)</span> outside</td></tr>
<tr><td>long solenoid (n turns per meter)</td><td>rectangle, one side inside, one outside</td><td><span class="m"><i class="bf">B</i> = μ<sub>0</sub><i>n</i><i class="cur">I</i></span> inside, ≈ 0 outside</td></tr>
<tr><td>toroid (N turns)</td><td>circle of radius r inside the doughnut</td><td><span class="m"><i class="bf">B</i> = μ<sub>0</sub><i>N</i><i class="cur">I</i>/(2π<i>r</i>)</span></td></tr>
<tr><td>infinite current sheet (K per meter)</td><td>rectangle straddling the sheet</td><td><span class="m"><i class="bf">B</i> = μ<sub>0</sub><i>K</i>/2</span> on each side</td></tr>
</tbody></table></div>
        <h2>How it fits with the others</h2>
        <ul>
          <li>Ampère's law is to magnetic fields what Gauss's law is to electric fields: a way to get the field quickly when symmetry allows it. Biot–Savart is the always-works version (like Coulomb's law).</li>
          <li>The law as written works for steady currents. For changing electric fields, Maxwell added a term (the displacement current), which comes up in the last module.</li>
        </ul>''',
 dict(correct=0,explain='The loop is outside the wire, so it encloses the whole current I. B(2πr) = μ₀I gives B = μ₀I/(2πr). It does not depend on how the current is distributed inside the wire, as long as it has cylindrical symmetry.',q='a thick cylindrical wire carries a uniform current I. For a point outside the wire, at distance r from the axis, the field is:',opts=['μ₀I/(2πr)','μ₀I r/(2πR²)','Zero','μ₀I/(2πR)']))
