from mk import *
import math
# ---------------- Electric potential
lab_p=lab('pt-canvas','Map of electric potential around three charges, with equipotential contour lines. Drag the charges and the two probes.',
  seg('pt-view','View',[('map','Map'),('hill','3D hill')])+seg('pt-lines','Field lines',[('on','Show field lines'),('off','Hide field lines')]) ,
  '''        <div class="controls">
          <div class="ctl"><label for="pt-q1"><span>Charge 1</span> <output id="pt-q1-out"></output></label><input type="range" id="pt-q1" min="-4" max="4" step="1" value="2"></div>
          <div class="ctl"><label for="pt-q2"><span>Charge 2</span> <output id="pt-q2-out"></output></label><input type="range" id="pt-q2" min="-4" max="4" step="1" value="-2"></div>
          <div class="ctl"><label for="pt-q3"><span>Charge 3</span> <output id="pt-q3-out"></output></label><input type="range" id="pt-q3" min="-4" max="4" step="1" value="0"></div>
        </div>
''',
  readout(('pt-VA','Potential at A (dot)','ef'),('pt-VB','Potential at B (square)','ef'),('pt-dV','V<sub>B</sub> − V<sub>A</sub>',''),('pt-W','Work by the field moving +1 nC from A to B','frc'),('pt-EA','|E| at A','ef')),
  'Red: positive potential, violet: negative. Each contour line connects points of equal potential (levels double each step: ±20, 40, 80 … V). Field lines always cross the contours at right angles and point downhill.')
pe_svg=svg(ch(50,130,'+')+ch(210,130,'−')+ln(50,130,210,130,'mut',1.2,'4 4')+dotp(100,130,'P','ink',0,-12)+txt(50,160,'+4.0 nC','pos',12)+txt(210,160,'−2.0 nC','neg',12)+
  txt(75,119,'0.10 m','mut',11)+txt(155,119,'0.20 m','mut',11)+txt(130,196,'V = V₁ + V₂  (add numbers, not arrows)','ink',11)+txt(130,50,'Potential is a scalar','mut',12),
  'Two point charges and the point P between them, 0.10 m from the +4.0 nC charge and 0.20 m from the −2.0 nC charge.')
module('potential','Electric potential',[('ap','AP C Unit 9'),('pu','AP 2: electricity')],
 'Voltage is the energy-per-charge version of the electric field. Instead of arrows to add, you get one number at each point, like the height on a hill. Positive charges slide downhill, negative charges slide uphill, and equal-height lines are called equipotentials.',
 ['A hiker on a hill feels a force along the steepest downhill direction. Electric potential V works the same way: the field E points downhill on the V map, and its size is the steepness. In symbols, E = −dV/dx. A contour line on a hill map is the line of equal height; an <b>equipotential</b> is a line of equal V, and field lines always cross it at a right angle.',
  'Potential is defined as <b>energy per charge</b>: V = U/q. A 1 V potential difference means every coulomb gains 1 joule when it falls through it. A battery is a device that holds a potential difference between its terminals.',
  'Since V is a number, not an arrow, <b>adding potentials from several charges is just addition</b>, with signs. That makes potential much easier than field for many-charge problems. Find V, then take a slope if you need E.'],
 [('<i>V</i> = <i>kq</i>/<i>r</i>, &nbsp;<i>V</i> = Σ <i>kq</i><sub>i</sub>/<i>r</i><sub>i</sub>','point charges, V = 0 at ∞'),('Δ<i>V</i> = −∫ <i class="ef">E</i> · d<i>r</i>, &nbsp;<i class="ef">E</i><sub>x</sub> = −d<i>V</i>/d<i>x</i>','V and E are linked by slope'),('Δ<i>U</i> = <i>q</i>Δ<i>V</i>','energy change of a charge')],
 lab_p,
 [('Show a dipole (+2 and −2 nC). Drag probe A to the + charge, then to the − charge.',[["click","#pt-view [data-k=map]"],["#pt-q1",2],["#pt-q2",-2],["#pt-q3",0]],'Potential is high (red) near the positive charge, low (violet) near the negative one. It is exactly zero along the line halfway between them.'),
  ('Put probe A and probe B on the same contour line.',[["click","#pt-view [data-k=map]"],["#pt-q1",2],["#pt-q2",-2]],'The potentials are equal, so ΔV = 0 and the field does no work moving a charge between them, however long the path.'),
  ('Look at the 3D hill for the dipole.',[["click","#pt-view [data-k=hill]"],["#pt-q1",2],["#pt-q2",-2],["#pt-q3",0]],'A + charge is a hill, a − charge is a well. A positive charge placed on the surface would roll downhill toward the well; the steeper the slope, the stronger the field.'),
  ('Make charges 1 and 2 both +2 nC.',[["click","#pt-view [data-k=map]"],["#pt-q1",2],["#pt-q2",2],["#pt-q3",0]],'Two hills. Between them there is a saddle where V is not zero but E is: V is the sum of two positive numbers, while the fields cancel.')],
 dict(prob='A +4.0 nC charge is at x = 0 and a −2.0 nC charge is at x = 0.30 m. (a) Find the electric potential at the point P on the x-axis at x = 0.10 m. (b) How much work must an outside force do to bring a +1.0 nC charge slowly from infinity to P?',svg=pe_svg,cap='The potential at P is the sum of the two potentials, each found as kq/r.',
  steps=[('Set up.','Potential is a scalar, so add the contribution of each charge with its sign: '+m('<i>V</i> = <i>kq</i><sub>1</sub>/<i>r</i><sub>1</sub> + <i>kq</i><sub>2</sub>/<i>r</i><sub>2</sub>')+'. The distances are 0.10 m and 0.20 m. There is nothing to resolve into components.'),
   ('Potential from each charge.',m('<i>V</i><sub>1</sub> = (8.99 × 10⁹)(4.0 × 10⁻⁹)/0.10 = +360 V')+' and '+m('<i>V</i><sub>2</sub> = (8.99 × 10⁹)(−2.0 × 10⁻⁹)/0.20 = −90 V')+'.'),
   ('Add.',m('<i>V</i><sub>P</sub> = 360 − 90 = +270 V')+'. P is on the positive side overall.'),
   ('Work to bring a charge from infinity.','The outside force does work equal to the change in potential energy: '+m('<i>W</i> = <i>q</i>Δ<i>V</i> = (1.0 × 10⁻⁹ C)(270 V − 0) = 2.7 × 10⁻⁷ J')+'. It is positive because the +4 nC charge pushes the +1 nC charge back.'),
   ('Check.','The nearby +4 nC charge dominates (0.10 m away), so the potential should be positive and a bit less than 360 V ✓.')]),
 ['Adding potentials as vectors, or using the vector sum of fields. V is a scalar.','Dropping signs: a negative charge contributes a negative number to V.','Saying E = 0 wherever V = 0 (or V = 0 wherever E = 0). They are different things: E is the slope of V, not its value.','Mixing up energy and potential: U = qV. A 1 V difference gives an electron 1 eV of energy, not 1 J.'],
 '''        <h2>Potential and field</h2>
        <ul>
          <li><b>E points downhill</b> (toward lower V), perpendicular to equipotentials. Where contour lines crowd together, V changes fast and the field is strong.</li>
          <li><b>In one dimension:</b> <span class="m"><i class="ef">E</i><sub>x</sub> = −d<i>V</i>/d<i>x</i></span>. In 3D, <span class="m"><i class="ef">E</i> = −∇<i>V</i></span> (the three partial derivatives).</li>
          <li><b>Uniform field:</b> V changes linearly: <span class="m">Δ<i>V</i> = −<i class="ef">E</i><i>d</i></span> over a distance d along E. The potential is higher on the side the field points away from.</li>
          <li><b>Zero field does not mean zero potential.</b> Inside a conductor E = 0 but V is the same nonzero constant everywhere.</li>
        </ul>
        <h2>Why equipotentials matter</h2>
        <ul>
          <li>No work is done moving a charge along an equipotential (ΔV = 0).</li>
          <li>A conductor in equilibrium is an equipotential, so field lines hit its surface at right angles.</li>
          <li>The potential of a point charge is <span class="m"><i>kq</i>/<i>r</i></span>, not 1/r²: only one power of r in the denominator.</li>
        </ul>
        <h2>Potential of a continuous charge distribution</h2>
        <ul>
          <li>Because V is a scalar, the integral is easier than for E: <span class="m"><i>V</i> = ∫ <i>k</i> d<i>q</i>/<i>r</i></span>, with no components and no cancelling. Slice the charge, find each slice's distance to the point, add.</li>
          <li><b>Ring, on its axis:</b> every slice is the same distance, so <span class="m"><i>V</i> = <i>kQ</i>/√(<i>z</i>² + <i>R</i>²)</span>.</li>
          <li><b>Disk, on its axis:</b> stack rings: <span class="m"><i>V</i> = (σ/2ε<sub>0</sub>)(√(<i>z</i>² + <i>R</i>²) − <i>z</i>)</span>.</li>
          <li><b>Spherical shell:</b> outside, <span class="m"><i>kQ</i>/<i>r</i></span>; inside, the potential is constant, <span class="m"><i>kQ</i>/<i>R</i></span> (E = 0 inside, so V cannot change).</li>
          <li><b>Solid uniform sphere:</b> outside <span class="m"><i>kQ</i>/<i>r</i></span>; inside <span class="m"><i>kQ</i>(3<i>R</i>² − <i>r</i>²)/(2<i>R</i>³)</span>, so the center is at <span class="m">3<i>kQ</i>/(2<i>R</i>)</span>.</li>
          <li><b>From E to V:</b> <span class="m"><i>V</i>(<i>b</i>) − <i>V</i>(<i>a</i>) = −∫<sub>a</sub><sup>b</sup> <i class="ef">E</i> · d<i>r</i></span>. Work inward from the zero of potential (usually infinity) and integrate piece by piece when E changes form inside and outside an object.</li>
        </ul>
''',
 dict(correct=2,explain='V = 0 only means the potentials of the two charges cancel at that point. The field is the slope of V, and at a point between the two charges both fields point the same way, so E is not zero: it is actually large there.',q='at the midpoint between a +q and a −q charge, which is correct?',opts=['E = 0 and V = 0','E ≠ 0 and V ≠ 0','V = 0 but E ≠ 0','E = 0 but V ≠ 0']))
# ---------------- Energy of charges
lab_e=lab('pe-canvas','Either a charged particle accelerated between two plates, or three charges whose total potential energy is calculated.',
  seg('pe-mode','What to show',[('accel','Accelerate a particle'),('assemble','Energy of a charge system')]),
  '''        <div id="pe-a-ctl"><div class="controls">
          <div class="ctl"><span class="lbl">Particle</span><div class="seg" id="pe-sp" role="group" aria-label="Particle"><button type="button" data-k="p" aria-pressed="true">Proton</button><button type="button" data-k="e">Electron</button><button type="button" data-k="a">Alpha particle</button></div></div>
          <div class="ctl"><label for="pe-V"><span>Voltage ΔV between plates</span> <output id="pe-V-out"></output></label><input type="range" id="pe-V" min="50" max="2000" step="50" value="500"></div>
          <div class="ctl"><span class="lbl">Run</span><div class="row"><button type="button" class="btn primary" id="pe-go">Release</button></div></div>
        </div></div>
        <div id="pe-s-ctl" hidden><div class="controls">
          <div class="ctl"><label for="pe-q1"><span>Charge 1</span> <output id="pe-q1-out"></output></label><input type="range" id="pe-q1" min="-4" max="4" step="1" value="3"></div>
          <div class="ctl"><label for="pe-q2"><span>Charge 2</span> <output id="pe-q2-out"></output></label><input type="range" id="pe-q2" min="-4" max="4" step="1" value="-2"></div>
          <div class="ctl"><label for="pe-q3"><span>Charge 3</span> <output id="pe-q3-out"></output></label><input type="range" id="pe-q3" min="-4" max="4" step="1" value="2"></div>
        </div></div>
''',
  readout(('pe-r1','Kinetic energy gained','ef'),('pe-r2','In electron-volts',''),('pe-r3','Final speed','cur'),('pe-r4','Compared to the speed of light','')),
  'Left mode: the charge starts at rest on the plate where it is repelled, and falls through the potential difference. Energy changes form (potential → kinetic) but the total stays the same. Right mode: drag the charges; the system energy is the sum over every pair.')
pe2=svg(f'<rect x="40" y="55" width="8" height="120" style="fill:var(--pos)"/><rect x="212" y="55" width="8" height="120" style="fill:var(--neg)"/>'+txt(44,48,'+','pos',16)+txt(216,48,'−','neg',16)+ch(70,115,'+',11)+ln(88,115,190,115,'ef',2.6)+arr(150,115,185,115,'ef','',2.6)+txt(130,100,'E','ef',13)+txt(130,150,'ΔV = 500 V','ink',13)+txt(130,200,'q = +e, released from rest','mut',11)+txt(70,138,'p','ink',12),
  'A proton released at the positive plate and accelerated across 500 V to the negative plate.')
module('penergy','Energy of charges',[('ap','AP C Unit 9'),('pu','AP 2: electricity')],
 'Move a charge through a potential difference and it gains or loses energy: ΔU = qΔV. That one line gives the speed of particles in accelerators, TV tubes and mass spectrometers, and it gives the energy stored in any arrangement of charges.',
 ['Think of a charge as a ball on the potential hill. Let it fall through a voltage ΔV and it gains kinetic energy qΔV; the potential energy it loses becomes motion. No need to know the field or the path in between: only the voltage difference matters. That is why this is the tool for "speed after being accelerated through…" questions.',
  'Physicists often use a new unit of energy: the <b>electron-volt</b>. One eV is the energy an electron (or any single-charge particle) gains falling through 1 V: 1 eV = 1.6 × 10⁻¹⁹ J. A proton accelerated through 500 V gains 500 eV, with no multiplication needed.',
  'For several charges, the energy of the arrangement is the work it took to assemble them: add up kq₁q₂/r for every pair. Positive means you had to push (like charges close together); negative means the system is bound.'],
 [('Δ<i>U</i> = <i>q</i>Δ<i>V</i>, &nbsp;Δ<i>K</i> = −Δ<i>U</i>','energy from a potential difference'),('½<i>mv</i>² = |<i>q</i>|Δ<i>V</i>','from rest, through ΔV'),('<i>U</i> = Σ<sub>pairs</sub> <i>kq</i><sub>i</sub><i>q</i><sub>j</sub>/<i>r</i><sub>ij</sub>','energy of a charge system')],
 lab_e,
 [('Release a proton through 500 V, then an electron through the same voltage.',[["click","#pe-mode [data-k=accel]"],["click","#pe-sp [data-k=p]"],["#pe-V",500]],'Both gain exactly the same energy: 500 eV. The electron is almost 2000 times lighter, so it ends up about 43 times faster.'),
  ('Try an alpha particle (charge +2e) at 500 V.',[["click","#pe-mode [data-k=accel]"],["click","#pe-sp [data-k=a]"],["#pe-V",500]],'Twice the charge means twice the energy (1000 eV). It is also about 4 times heavier than a proton, so it ends up slower than a proton.'),
  ('Quadruple the voltage.',[["click","#pe-mode [data-k=accel]"],["click","#pe-sp [data-k=p]"],["#pe-V",2000]],'Four times the energy, but only twice the speed: speed goes as √V.'),
  ('Switch to the charge system. Make two charges +3 nC and +2 nC and the third zero.',[["click","#pe-mode [data-k=assemble]"],["#pe-q1",3],["#pe-q2",2],["#pe-q3",0]],'Like charges: positive energy. It took work to push them together, and the energy would be released if they were let go.')],
 dict(prob='A proton is released from rest at the positive plate of a parallel-plate accelerator, with a potential difference of 500 V between the plates. Find its kinetic energy and its speed when it reaches the negative plate. Then compare with an electron.',svg=pe2,cap='The proton falls through 500 V. The field does work qΔV on it.',
  steps=[('Which principle?','The field between the plates is uniform, but you don\'t need it. Energy conservation links the start and end directly: '+m('Δ<i>K</i> + Δ<i>U</i> = 0')+'.'),
   ('Energy gained.',m('<i>K</i> = <i>q</i>Δ<i>V</i> = (1.6 × 10⁻¹⁹ C)(500 V) = 8.0 × 10⁻¹⁷ J = 500 eV')+'.'),
   ('Speed of the proton.',m('½<i>mv</i>² = 8.0 × 10⁻¹⁷')+', so '+m('<i>v</i> = √(2(8.0 × 10⁻¹⁷)/(1.67 × 10⁻²⁷)) = 3.1 × 10⁵ m/s')+'.'),
   ('Electron.','The same 8.0 × 10⁻¹⁷ J goes to a much lighter particle: '+m('<i>v</i> = √(2(8.0 × 10⁻¹⁷)/(9.11 × 10⁻³¹)) = 1.3 × 10⁷ m/s')+'. That is 4% of the speed of light, so ignoring relativity is still fine.'),
   ('Check.','Ratio of speeds should be √(m<sub>p</sub>/m<sub>e</sub>) = √1836 = 43; 1.3 × 10⁷/3.1 × 10⁵ = 43 ✓.')]),
 ['Using the formula ΔU = qΔV with the potential <em>at one point</em> instead of the difference between two.','Forgetting that a negative charge gains energy moving toward <em>higher</em> potential.','Putting 500 V into the energy equation as 500 J. Energy is qΔV in joules.','Using E = ΔV/d to find speed: you don\'t need E at all for the energy method.'],
 '''        <h2>Energy methods for charges</h2>
        <ul>
          <li><b>Charge in a potential difference:</b> <span class="m">½<i>mv</i>² = |<i>q</i>|Δ<i>V</i></span>. Positive charges speed up going from high to low V, negative charges going from low to high.</li>
          <li><b>Two point charges:</b> <span class="m"><i>U</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i></span> (zero at infinite separation). If they are released and fly apart, each ends up with kinetic energy and <span class="m"><i>K</i><sub>total</sub> = <i>U</i></span>.</li>
          <li><b>Three or more:</b> add every pair once. Three charges have three pairs.</li>
          <li><b>Escape and closest approach:</b> a charge shot straight at another stops where its kinetic energy has all turned into potential energy.</li>
        </ul>
        <h2>The electron-volt</h2>
        <ul>
          <li>1 eV = 1.60 × 10⁻¹⁹ J. Atomic energies are a few eV; X-rays are thousands.</li>
          <li>A particle with charge <i>ne</i> falling through ΔV volts gains <i>n</i>ΔV eV.</li>
        </ul>''',
 dict(correct=1,explain='Energy gained is qΔV, the same for any particle with the same charge. The electron is lighter, so it ends up faster, but the energy is equal.',q='a proton and an electron are each released from rest at opposite plates and accelerated through the same 100 V. Which statement is correct?',opts=['The proton gains more energy','They gain the same energy; the electron ends up faster','They gain the same energy; the proton ends up faster','The electron gains more energy']))
