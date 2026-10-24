from mk import *
import math
# ---------------- Magnetic force on charges
lab_b=lab('bf-canvas','3D view of a charged particle moving in a uniform magnetic field. Drag to rotate the view.',
  seg('bf-sp','Particle',[('e','Electron'),('p','Proton'),('a','Alpha particle')])+seg('bf-view','Camera',[('3d','3D'),('top','From above'),('side','From the side')]),
  controls(('bf-v','Speed (× 10⁶ m/s)',1,10,.5,5),('bf-ang','Angle between v and B',10,90,5,60),('bf-B','Field B (mT)',.5,5,.5,2)),
  readout(('bf-r','Radius of the circle','ef'),('bf-T','Period of one loop',''),('bf-p','Pitch (distance along B per loop)',''),('bf-F','Magnetic force qvB sin θ','frc'),('bf-dir','Direction (seen from above)','')),
  'The magnetic field (pink) points up. The force (orange) is always sideways to the velocity (green), so it changes the direction of motion but never the speed. The component of velocity along B is untouched, so the circle stretches into a spiral. The loop radius is drawn relative to the default setting for each particle.')
lab_vs=lab('vs-canvas','Velocity selector: a particle passes through crossed electric and magnetic fields. It goes straight only if its speed equals E over B.',
  '<span class="title">Velocity selector (proton)</span>',
  controls(('vs-v','Proton speed (km/s)',20,200,5,100),('vs-E','Electric field (kV/m)',1,10,.5,5),('vs-B','Magnetic field (T)',.02,.1,.005,.05)),
  readout(('vs-sel','Selected speed E/B','ef'),('vs-fe','Electric force qE','frc'),('vs-fb','Magnetic force qvB','frc'),('vs-res','Result','')),
  'B points into the page (×), E points down, and the proton enters from the left. Electric force pushes down; magnetic force pushes up. They cancel only at v = E/B. Too slow: electric force wins and it curves down. Too fast: magnetic force wins and it curves up.',drag=False)
bs=svg(f'<rect x="20" y="40" width="220" height="160" style="fill:color-mix(in srgb,var(--ca) 6%,transparent);stroke:none"/>'+
  ''.join(txt(x,y,'×','bf',16) for x in range(46,240,48) for y in (70,120,170))+
  f'<path d="M 55 120 A 50 50 0 1 0 155 120 A 50 50 0 1 0 55 120" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4"/>'+
  ch(105,70,'−',10)+arr(105,70,105,98,'frc','F',2.4,(10,0))+arr(105,70,148,70,'cur','v',2.4,(0,-10))+txt(105,196,'r = mv/(|q|B)','mut',12)+txt(120,28,'B into the page','bf',12),
  'An electron entering a field perpendicular to its velocity moves in a circle. The force points to the center.')
module('bforce','Magnetic force on charges',[('ap','AP C Unit 12'),('pu','AP 2: magnetism')],
 'A magnetic field pushes moving charges sideways. The push is always perpendicular to the motion, so it can bend a path into a circle or a spiral but can never speed a charge up or slow it down. That one fact drives mass spectrometers, cyclotrons and auroras.',
 ['A charge sitting still in a magnetic field feels nothing. Make it move and a force appears, at right angles to both the velocity and the field: F = q v × B. Faster charges, stronger fields and bigger charges all feel more force, but only the part of the velocity <em>perpendicular</em> to B counts: F = qvB sin θ.',
  'Because the force is perpendicular to the velocity, it does no work and cannot change the speed. All it can do is turn the charge. That turns the path into a circle (when the velocity is perpendicular to B), with the magnetic force acting as the centripetal force: qvB = mv²/r, so r = mv/(qB). Lighter, slower particles in stronger fields make tighter circles.',
  'If the velocity has a component along the field, that component is unaffected and the charge drifts along B while it circles: a helix, or a spiral. The right-hand rule gives the direction: fingers along v, curl them toward B, the thumb points along the force on a <em>positive</em> charge (reverse it for electrons).'],
 [('<i class="frc">F</i> = <i>q</i><i class="cur">v</i> × <i class="bf">B</i>, &nbsp;|<i class="frc">F</i>| = |<i>q</i>|<i>v</i><i class="bf">B</i> sin θ','magnetic force'),('<i>r</i> = <i>mv</i><sub>⊥</sub>/(|<i>q</i>|<i class="bf">B</i>)','radius of the circle'),('<i>T</i> = 2π<i>m</i>/(|<i>q</i>|<i class="bf">B</i>), &nbsp;ω = |<i>q</i>|<i class="bf">B</i>/<i>m</i>','period and cyclotron frequency')],
 lab_b+'\n'+lab_vs,
 [('Compare an electron and a proton at the same speed and field.',[["click","#bf-sp [data-k=e]"],["#bf-v",5],["#bf-ang",90],["#bf-B",2]],'The electron and the proton circle in opposite directions (opposite charges), and the proton\'s circle is about 1800 times larger because it is about 1800 times heavier.'),
  ('Tilt the velocity: set the angle to 30° so there is a component along B.',[["click","#bf-sp [data-k=e]"],["#bf-ang",30],["#bf-v",5],["#bf-B",2]],'The circle shrinks (only v sin θ counts for the radius) and the particle spirals along B. The pitch is v cos θ times the period.'),
  ('Double the magnetic field.',[["click","#bf-sp [data-k=e]"],["#bf-ang",90],["#bf-v",5],["#bf-B",4]],'The radius halves and the period halves: the particle circles twice as often. The speed has not changed.'),
  ('In the velocity selector, tune the speed to exactly E/B.',[["#vs-E",5],["#vs-B",.05],["#vs-v",100]],'At 100 km/s = E/B, the electric and magnetic forces cancel and the proton flies straight through. Move the speed either way and it bends.')],
 dict(prob='The aurora: an electron from the solar wind arrives high above the Arctic at 2.0 × 10⁷ m/s (about 1 keV), moving at 30° to Earth\'s magnetic field, which there is about 5.0 × 10⁻⁵ T. Find (a) the magnetic force on it, (b) the radius of the spiral it follows, (c) the time for one turn and (d) how far along the field it moves per turn. Why do these electrons end up near the poles?',svg='',cap='An electron spiraling around one of Earth\'s field lines. Solid: the near side of each turn; dashed: the far side.',
  steps=[('Split the velocity.','Only the part perpendicular to B feels a force: '+m('<i>v</i><sub>⊥</sub> = <i>v</i> sin 30° = 1.0 × 10⁷ m/s')+'. The part along B is '+m('<i>v</i><sub>∥</sub> = <i>v</i> cos 30° = 1.73 × 10⁷ m/s')+'.'),
   ('Force.',m('<i class="frc">F</i> = <i>ev</i><sub>⊥</sub><i class="bf">B</i> = (1.60 × 10⁻¹⁹)(1.0 × 10⁷)(5.0 × 10⁻⁵) = 8.0 × 10⁻¹⁷ N')+'. It is perpendicular to both v and B, so it always points toward the axis of the spiral.'),
   ('Radius.',m('<i>r</i> = <i>mv</i><sub>⊥</sub>/(<i>e</i><i class="bf">B</i>) = (9.11 × 10⁻³¹)(1.0 × 10⁷)/((1.60 × 10⁻¹⁹)(5.0 × 10⁻⁵)) = 1.1 m')+'.'),
   ('Time for one turn.',m('<i>T</i> = 2π<i>m</i>/(<i>e</i><i class="bf">B</i>) = 2π(9.11 × 10⁻³¹)/((1.60 × 10⁻¹⁹)(5.0 × 10⁻⁵)) = 7.2 × 10⁻⁷ s')+'. It does not depend on the speed.'),
   ('Distance along the field per turn.',m('<i>p</i> = <i>v</i><sub>∥</sub><i>T</i> = (1.73 × 10⁷)(7.2 × 10⁻⁷) = 12 m')+'.'),
   ('Why the poles?','The magnetic force never has a part along B, so v∥ never changes: the electron is tied to its field line like a bead on a wire, in a corkscrew about 2 m wide. Earth\'s field lines dip into the atmosphere near the magnetic poles, so that is where the electrons hit the air (about 100 km up) and make it glow. Check: '+m('<i>mv</i><sub>⊥</sub>²/<i>r</i> = 8.0 × 10⁻¹⁷ N')+' ✓.')]),
 ['Using v instead of v sin θ for the force or the radius.','Getting the direction wrong for a negative charge. The right-hand rule gives the force on a positive charge; for an electron reverse it.','Thinking the magnetic force speeds the particle up. It does no work: the speed is constant.','Using B in mT in the formula without converting to tesla.'],
 '''        <h2>Motion in a magnetic field</h2>
        <ul>
          <li><b>Perpendicular to B:</b> uniform circular motion with <span class="m"><i>r</i> = <i>mv</i>/(|<i>q</i>|<i class="bf">B</i>)</span>. Kinetic energy is constant.</li>
          <li><b>Cyclotron frequency</b> <span class="m"><i>f</i> = |<i>q</i>|<i class="bf">B</i>/(2π<i>m</i>)</span> does not depend on speed or radius, which is what makes cyclotron accelerators work.</li>
          <li><b>At an angle:</b> the perpendicular part circles, the parallel part drifts: pitch <span class="m"><i>p</i> = <i>v</i><sub>∥</sub><i>T</i></span>. Charges spiral along Earth's field lines toward the poles and make the aurora.</li>
          <li><b>Zero when v ∥ B</b> (sin 0 = 0): a charge moving along the field feels no force.</li>
        </ul>
        <h2>Crossed fields and applications</h2>
        <ul>
          <li><b>Velocity selector:</b> E and B perpendicular, with <span class="m"><i>qE</i> = <i>qvB</i></span> for the chosen speed <span class="m"><i>v</i> = <i class="ef">E</i>/<i class="bf">B</i></span>. Independent of charge and mass.</li>
          <li><b>Mass spectrometer:</b> select the speed, then send the ions into a second field. They circle with <span class="m"><i>r</i> = <i>mv</i>/(<i>qB</i>)</span>, so <span class="m"><i>m</i> = <i>qBr</i>/<i>v</i></span>: measure where they land to find the mass.</li>
          <li><b>Hall effect:</b> in a current-carrying conductor in a field, charges pile up on one side, creating a measurable transverse voltage; its sign shows whether the carriers are positive or negative.</li>
        </ul>''',
 dict(correct=1,explain='The magnetic force is always perpendicular to the velocity, so it does no work. It changes the direction of the velocity but not the speed, and the kinetic energy stays constant.',q='a proton moves through a uniform magnetic field perpendicular to its velocity. Its kinetic energy:',opts=['Increases steadily','Stays constant','Decreases steadily','Oscillates up and down']))
# ---------------- Forces on wires and loops
lab_w=lab('wf-canvas','3D view of a current-carrying wire or loop in a magnetic field that points up. Drag to rotate.',
  seg('wf-mode','Show',[('wire','A wire'),('loop','A loop (motor)')])+'<div class="row"><button type="button" class="btn primary" id="wf-spin">Spin the loop</button><label style="display:flex;gap:6px;align-items:center;font-weight:400"><input type="checkbox" id="wf-comm"> commutator</label></div>',
  '''        <div id="wf-w-ctl"><div class="controls">
          <div class="ctl"><label for="wf-I"><span>Current I</span> <output id="wf-I-out"></output></label><input type="range" id="wf-I" min="1" max="10" step="1" value="5"></div>
          <div class="ctl"><label for="wf-L"><span>Wire length L</span> <output id="wf-L-out"></output></label><input type="range" id="wf-L" min="0.1" max="1" step="0.05" value="0.5"></div>
          <div class="ctl"><label for="wf-th"><span>Angle between wire and B</span> <output id="wf-th-out"></output></label><input type="range" id="wf-th" min="0" max="180" step="5" value="90"></div>
        </div></div>
        <div id="wf-l-ctl" hidden><div class="controls">
          <div class="ctl"><label for="wf-N"><span>Number of turns N</span> <output id="wf-N-out"></output></label><input type="range" id="wf-N" min="1" max="20" step="1" value="10"></div>
          <div class="ctl"><label for="wf-ph"><span>Angle between loop normal and B</span> <output id="wf-ph-out"></output></label><input type="range" id="wf-ph" min="0" max="180" step="5" value="90"></div>
        </div></div>
        <div class="controls"><div class="ctl"><label for="wf-B"><span>Field B</span> <output id="wf-B-out"></output></label><input type="range" id="wf-B" min="0.1" max="1" step="0.05" value="0.4"></div></div>
''',
  readout(('wf-r1','Force on the wire','frc'),('wf-r2','Direction',''),('wf-r3','Maximum possible force',''),('wf-r4','',''),('wf-r5','','')),
  'The field B is vertical (pink arrows). A wire parallel to B feels no force. A loop whose plane is perpendicular to B (its normal parallel to B) feels no torque, and one with its normal at 90° to B feels the largest torque, which tries to turn the normal toward B.')
wsv=svg(f'<rect x="60" y="60" width="140" height="80" transform="rotate(-18 130 100)" style="fill:color-mix(in srgb,var(--cv) 10%,transparent);stroke:var(--cv);stroke-width:2.5"/>'+
  arr(130,100,130+42,100-14,'ink','μ',2.4,(2,-2))+arr(130,100,130,40,'bf','B',2.4,(8,0))+arr(60+8,128,60+8,170,'frc','F',2.4,(10,0))+arr(200-8,76,200-8,34,'frc','F',2.4,(10,0))+txt(130,210,'N = 20, I = 2.0 A, B = 0.30 T','mut',11)+txt(130,26,'edge view of the loop','mut',11),
  'The loop seen edge-on: forces on the two sides make a torque that turns the normal μ toward B.')
module('wireforce','Forces on wires &amp; loops',[('ap','AP C Unit 12'),('pu','AP 2: magnetism')],
 'A current is moving charge, so a magnetic field pushes a current-carrying wire sideways. Shape the wire into a loop and the pushes on opposite sides make a torque. That torque is the electric motor.',
 ['A wire carrying a current in a magnetic field is just a stream of moving charges, each feeling F = qv × B. Add them up over the length of wire and you get <b>F = I L × B</b>: the force is perpendicular to both the wire and the field, with size ILB sin θ. Again, a wire running along the field feels nothing.',
  'Bend the wire into a rectangular loop in a uniform field. The two sides that are perpendicular to B get equal and opposite forces, one on each side of the loop. They don\'t make a net force, but they do make a <b>torque</b> that rotates the loop until its plane is perpendicular to B (its normal lined up with B). The torque is τ = NIAB sin φ, where φ is the angle between the loop\'s normal and the field.',
  'An electric motor keeps this going: just as the loop reaches the position where the torque would reverse, a commutator flips the current, so the torque keeps pushing the same way and the loop spins round. Try the spin button with and without the commutator.'],
 [('<i class="frc">F</i> = <i class="cur">I</i><i>L</i> × <i class="bf">B</i>, &nbsp;|<i class="frc">F</i>| = <i class="cur">I</i><i>L</i><i class="bf">B</i> sin θ','force on a straight wire'),('<i>μ</i> = <i>NIA</i>, &nbsp;τ = μ × <i class="bf">B</i>','magnetic moment, torque on a loop'),('τ = <i>NIA</i><i class="bf">B</i> sin φ, &nbsp;<i>U</i> = −μ · <i class="bf">B</i>','magnitude; energy')],
 lab_w,
 [('Start with the wire at 90° to the field, then turn it to be parallel to the field (0°).',[["click","#wf-mode [data-k=wire]"],["#wf-th",90],["#wf-I",5],["#wf-L",.5],["#wf-B",.4],["#wf-th",0]],'At 0° the wire is parallel to B and the force vanishes. At 90° it is largest. Between, the force is ILB sin θ.'),
  ('Double the current and the field.',[["click","#wf-mode [data-k=wire]"],["#wf-th",90],["#wf-I",10],["#wf-B",.8],["#wf-L",.5]],'Force depends on the product: doubling both quadruples it.'),
  ('Show the loop with the normal at 90° to B, then move it to 0°.',[["click","#wf-mode [data-k=loop]"],["#wf-N",10],["#wf-ph",90],["#wf-B",.4]],'At 90° the torque is the largest possible. As the normal swings toward B the torque falls, and at 0° it is zero: the loop is in stable equilibrium (it would sit there).'),
  ('Press Spin the loop with the commutator on, then off.',[["click","#wf-mode [data-k=loop]"],["#wf-N",10],["#wf-B",.4],["#wf-comm",True]],'With the commutator the current flips every half-turn, so the torque never reverses and the loop keeps accelerating. Without it, the loop just rocks back and forth around φ = 0.')],
 dict(prob='A rectangular coil of 20 turns, 5.0 cm × 8.0 cm, carries a current of 2.0 A in a uniform 0.30 T field. (a) Find the force on each 8.0 cm side when the coil\'s plane is parallel to the field. (b) Find the torque on the coil in that position. (c) What is the torque when the coil\'s plane is perpendicular to the field?',svg=wsv,cap=wsv and 'The loop seen edge-on: the forces on the two sides make a torque that turns the normal μ toward B.',
  steps=[('Which sides feel force?','The two 8.0 cm sides perpendicular to B (when the plane is parallel to B) carry current at 90° to the field, so '+m('sin θ = 1')+'. The 5.0 cm sides are parallel to B (or anti-parallel) and feel no force.'),
   ('Force on each long side.',m('<i class="frc">F</i> = <i>N</i><i class="cur">I</i><i>ℓ</i><i class="bf">B</i> = (20)(2.0)(0.080)(0.30) = 0.96 N')+'. The two forces are equal and opposite, so the net force is zero.'),
   ('Torque (plane parallel to field).','The forces act at a lever arm of half the short side, 2.5 cm, from the axis: '+m('τ = 2(0.96 N)(0.025 m) = 0.048 N·m')+'. Check with the formula: '+m('<i>NIAB</i> = (20)(2.0)(0.0040)(0.30) = 0.048 N·m')+' ✓.'),
   ('Magnetic moment.',m('μ = <i>NIA</i> = (20)(2.0)(0.0040) = 0.16 A·m²')+'.'),
   ('Plane perpendicular to B.','Now the normal is along B (φ = 0), so '+m('τ = <i>NIAB</i> sin 0 = 0')+'. The forces on the loop are all in its plane, trying to stretch it but not turn it.')]),
 ['Using the total length of wire in the loop in F = ILB. Only the sides that are perpendicular to B feel a force.','Mixing up the angle: τ uses the angle between the <em>normal</em> and B; F uses the angle between the wire and B.','Forgetting N: a coil with N turns has N times the force and torque of one loop.','Thinking a magnetic field exerts a net force on a closed loop in a uniform field. The net force is zero; only the torque is nonzero.'],
 '''        <h2>Force on a wire</h2>
        <ul>
          <li>Each charge carrier feels <span class="m"><i>q</i><i class="cur">v</i><sub>d</sub> × <i class="bf">B</i></span>; summing over the <span class="m"><i>nAL</i></span> carriers in a length <i>L</i> gives <span class="m"><i class="frc">F</i> = <i class="cur">I</i><i>L</i> × <i class="bf">B</i></span> (here <i>L</i> is a vector along the current).</li>
          <li><b>Curved wire:</b> integrate <span class="m">d<i class="frc">F</i> = <i class="cur">I</i> d<i>ℓ</i> × <i class="bf">B</i></span>. In a uniform field the force on a curved wire equals that of a straight wire joining its ends.</li>
          <li><b>Two parallel wires</b> attract if their currents are in the same direction and repel if opposite (see Ampère's law): this is how the ampere used to be defined.</li>
        </ul>
        <h2>Loops, motors and meters</h2>
        <ul>
          <li><b>Torque:</b> <span class="m">τ = μ × <i class="bf">B</i></span> with <span class="m">μ = <i>NIA</i></span> pointing along the right-hand normal (curl your fingers along the current, thumb gives μ).</li>
          <li><b>Energy:</b> <span class="m"><i>U</i> = −μ · <i class="bf">B</i></span>; lowest when μ is along B.</li>
          <li><b>DC motor:</b> a commutator reverses the current each half turn. <b>Galvanometer</b> (analog meter): the loop turns against a spring until the spring torque balances the magnetic torque, so the deflection is proportional to the current.</li>
        </ul>''',
 dict(correct=2,explain='The magnetic force on a wire is F = ILB sin θ. A wire parallel to the field has θ = 0, so sin θ = 0 and the force is zero.',q='a straight current-carrying wire is placed parallel to a uniform magnetic field. The magnetic force on it is:',opts=['ILB, directed along the wire','ILB, directed along the field','Zero','ILB, directed perpendicular to both']))
