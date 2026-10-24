from mk import *
import math
# ---------------- Inductors and LR circuits
lab_l=lab('lr-canvas','An LR circuit with a switch: a battery, a resistor and an inductor, with graphs of the voltages and the current. The clock is slowed down so you can watch.',
  '<div class="row"><button type="button" class="btn primary" id="lr-on">Close the switch</button><button type="button" class="btn" id="lr-off">Open it (current coasts through R)</button><button type="button" class="btn" id="lr-rst">Reset</button></div>',
  controls(('lr-L','Inductance L (mH)',50,500,10,200),('lr-R','Resistance R (Ω)',10,200,5,50),('lr-E','Battery ε (V)',3,24,1,12)),
  readout(('lr-i','Current I','cur'),('lr-vl','Voltage across the inductor','frc'),('lr-vr','Voltage across the resistor',''),('lr-u','Magnetic energy ½LI²','ef'),('lr-t','τ = L/R | time','')),
  'Time is shown in milliseconds but the animation is slowed so that one time constant takes about 1.5 s on your screen. When the switch closes the inductor opposes the rise in current with a back-EMF; as the current levels off, that voltage disappears. When the battery is removed, the inductor keeps the current going through R.')
lr_svg=svg(ln(40,50,200,50,'ink',2)+ln(40,175,200,175,'ink',2)+ln(40,50,40,95,'ink',2)+ln(40,135,40,175,'ink',2)+bat(40,115,'',True)+txt(28,119,'12 V','ink',11,'end')+res(80,50,150,'50 Ω')+ln(200,50,200,85,'ink',2)+ln(200,175,200,145,'ink',2)+
  f'<path d="M 200 85 a 10 10 0 0 1 0 15 a 10 10 0 0 1 0 15 a 10 10 0 0 1 0 15 a 10 10 0 0 1 0 15" style="fill:none;stroke:var(--ink);stroke-width:2.5"/>'+txt(222,118,'0.20 H','ink',11,'start')+arr(100,38,150,38,'cur','I',2.2,(0,0))+txt(130,206,'τ = L/R = 4.0 ms','mut',12),
  'A 12 V battery, a 50 Ω resistor and a 0.20 H inductor in series.')
module('inductance','Inductors &amp; LR circuits',[('ap','AP C Unit 13'),('calc','Calculus')],
 'A coil of wire resists any change in the current through it, the way a heavy flywheel resists any change in its speed. The inductor is the electromagnetic twin of mass, and an LR circuit follows the same exponential curve as an RC circuit.',
 ['When current flows in a coil it makes a magnetic field through the coil itself. If the current changes, so does the flux through the coil, and Faraday\'s law makes an EMF that opposes the change: ε = −L dI/dt. The number L is the <b>inductance</b>, in henries (H). A big coil with a lot of turns, or an iron core, has a big L.',
  'Think of inductance as electrical inertia. A resistor opposes current. An inductor opposes <em>changes</em> in current. Close a switch on an LR circuit and the current cannot jump: at first the inductor takes the whole battery voltage (its back-EMF cancels it), so the current starts at zero. Over time the current climbs toward ε/R and the back-EMF fades.',
  'The time constant is τ = L/R: a big L (heavy flywheel) makes the current rise slowly; a big R lets it reach its final value quickly. And the energy is stored in the magnetic field: U = ½LI², just as a moving mass stores ½mv².'],
 [('ε<sub>L</sub> = −<i>L</i> d<i class="cur">I</i>/d<i>t</i>','back-EMF of an inductor'),('<i class="cur">I</i>(<i>t</i>) = (ε/<i>R</i>)(1 − <i>e</i><sup>−<i>t</i>/τ</sup>), &nbsp;τ = <i>L</i>/<i>R</i>','switch closed'),('<i>U</i> = ½<i>L</i><i class="cur">I</i>², &nbsp;<i>u</i> = <i class="bf">B</i>²/(2μ<sub>0</sub>)','stored magnetic energy')],
 lab_l,
 [('Close the switch and watch the two voltages.',[["#lr-L",200],["#lr-R",50],["#lr-E",12],["click","#lr-on"]],'At the start the inductor has all 12 V across it (back-EMF cancels the battery) and the current is zero. As the current rises, the voltage across the resistor grows and the inductor voltage falls. At the end the inductor has no voltage across it: it acts like a plain wire.'),
  ('Double the inductance and close the switch.',[["#lr-L",400],["#lr-R",50],["#lr-E",12],["click","#lr-on"]],'The time constant doubles: the current rises more slowly. The final current is the same, ε/R, because L doesn\'t matter once everything is steady.'),
  ('Close the switch, wait until it levels off, then open it.',[["#lr-L",200],["#lr-R",50],["#lr-E",12],["click","#lr-on"]],'The inductor keeps the current going through the resistor: the current decays exponentially and the inductor\'s voltage reverses sign. The stored magnetic energy turns into heat in R.'),
  ('Increase R to 200 Ω.',[["#lr-L",200],["#lr-R",200],["#lr-E",12],["click","#lr-on"]],'The time constant shrinks (L/R = 1 ms) and the final current falls to ε/R = 60 mA. Faster, but weaker.')],
 dict(prob='How does a car make a 20,000 V spark from a 12 V battery? The ignition coil\'s primary winding has L = 6.0 mH and a resistance of 2.0 Ω. A switch connects it to the 12 V battery. Find (a) the time constant, (b) the current it would reach if left on, (c) the current after the switch has been closed for 3.0 ms, and (d) the energy stored then. (e) The switch opens and the current falls to zero in about 0.10 ms. Estimate the EMF across the primary. (f) A secondary winding on the same iron core has 100 times as many turns. Estimate its EMF.',svg='',cap='An ignition coil: the primary (left) builds up current, and the secondary (right, many more turns) fires the spark plug when the switch opens.',
  steps=[('Time constant.',m('τ = <i>L</i>/<i>R</i> = (6.0 × 10⁻³ H)/(2.0 Ω) = 3.0 × 10⁻³ s = 3.0 ms')+'.'),
   ('Final current.','Once the current is steady the inductor has no voltage across it: '+m('<i class="cur">I</i><sub>max</sub> = ε/<i>R</i> = 12/2.0 = 6.0 A')+'.'),
   ('Current after 3.0 ms (= τ).',m('<i class="cur">I</i> = 6.0(1 − <i>e</i>⁻¹) = 6.0(0.632) = 3.8 A')+'. Cars cut the switch-on time short like this, especially at high engine speed.'),
   ('Energy stored.',m('<i>U</i> = ½<i>L</i><i class="cur">I</i>² = ½(6.0 × 10⁻³)(3.8)² = 4.3 × 10⁻² J')+' (43 mJ).'),
   ('Switch opens.','The current tries to drop from 3.8 A to zero in 0.10 ms. The inductor fights that: '+m('|ε| = <i>L</i>|Δ<i class="cur">I</i>|/Δ<i>t</i> = (6.0 × 10⁻³)(3.8)/(1.0 × 10⁻⁴) ≈ 230 V')+', far more than the battery\'s 12 V.'),
   ('The secondary.','The same changing flux passes through every turn of both windings, and Faraday\'s law gives each turn the same EMF. With 100 times the turns, the secondary\'s EMF is about 100 times larger: '+m('≈ 23 kV')+', enough to jump the spark plug\'s gap. The stored 43 mJ is what powers the spark.')]),
 ['Saying the inductor has no effect: it only matters while the current is changing.','Using τ = RL instead of L/R.','Thinking the current starts at ε/R. It starts at zero when the switch closes (an inductor opposes the change).','Forgetting that opening a switch in an inductive circuit can create a huge voltage: with dI/dt very large, the back-EMF L dI/dt can spark across the switch.'],
 '''        <h2>Inductance</h2>
        <ul>
          <li><b>Definition:</b> <span class="m"><i>L</i> = <i>N</i>Φ<sub>B</sub>/<i class="cur">I</i></span> (flux linkage per amp). For a long solenoid of length ℓ, area A and N turns: <span class="m"><i>L</i> = μ<sub>0</sub><i>N</i>²<i>A</i>/ℓ = μ<sub>0</sub><i>n</i>²<i>A</i>ℓ</span>.</li>
          <li><b>Back-EMF:</b> <span class="m">ε<sub>L</sub> = −<i>L</i> d<i class="cur">I</i>/d<i>t</i></span>: it points so as to oppose the change in current.</li>
          <li><b>Energy:</b> <span class="m"><i>U</i> = ½<i>L</i><i class="cur">I</i>²</span>, stored as magnetic field with energy density <span class="m"><i>u</i> = <i class="bf">B</i>²/(2μ<sub>0</sub>)</span>.</li>
        </ul>
        <h2>The LR circuit</h2>
        <ul>
          <li><b>Rising:</b> loop rule <span class="m">ε − <i class="cur">I</i><i>R</i> − <i>L</i> d<i class="cur">I</i>/d<i>t</i> = 0</span>, giving <span class="m"><i class="cur">I</i> = (ε/<i>R</i>)(1 − <i>e</i><sup>−<i>t</i>/τ</sup>)</span>, τ = <i>L</i>/<i>R</i>.</li>
          <li><b>Decaying:</b> <span class="m"><i class="cur">I</i> = <i class="cur">I</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup></span>.</li>
          <li><b>Two limits:</b> at t = 0 an inductor acts like an open switch (current can't jump); at t → ∞ it acts like a plain wire. (A capacitor is the opposite.)</li>
        </ul>
        <h2>LR circuits with more than one resistor</h2>
        <ul>
          <li>Use the two limits: just after a switch changes, the inductor keeps its current; a long time later it acts as a plain wire and the current settles by ordinary series and parallel rules.</li>
          <li>The time constant is <span class="m">τ = <i>L</i>/<i>R</i><sub>eq</sub></span>, where <i>R</i><sub>eq</sub> is the resistance the inductor "sees" across its own terminals.</li>
          <li>Then <span class="m"><i class="cur">I</i>(<i>t</i>) = <i class="cur">I</i><sub>∞</sub> + (<i class="cur">I</i><sub>0</sub> − <i class="cur">I</i><sub>∞</sub>)<i>e</i><sup>−<i>t</i>/τ</sup></span>, with I₀ the current just after the change.</li>
          <li>Opening a switch with the inductor still carrying current forces that current through whatever is left: a large resistor makes a large voltage spike, <span class="m"><i class="cur">I</i><sub>0</sub><i>R</i></span>.</li>
        </ul>
''',
 dict(correct=0,explain='An inductor opposes changes in current. The current through it cannot change instantly, so just after the switch closes it is still zero, and the inductor acts like an open switch (it has the whole battery voltage across it).',q='a battery is connected to a resistor and an inductor in series at t = 0. Immediately afterward, the current is:',opts=['Zero','ε/R','ε/L','Infinite']))
# ---------------- LC oscillations
lab_c=lab('lc-canvas','An LC circuit: a charged capacitor connected to an inductor. Graphs of the charge, the current and the energy sloshing between them.',
  '<div class="row"><button type="button" class="btn primary" id="lc-play">Pause</button><button type="button" class="btn" id="lc-rs">Restart</button></div>',
  controls(('lc-L','Inductance L (mH)',10,100,5,50),('lc-C','Capacitance C (μF)',5,100,5,20),('lc-z','Damping (0 = no resistance)',0,1.5,.05,0)),
  readout(('lc-w','Angular frequency ω₀ = 1/√(LC)','ef'),('lc-f','Frequency f',''),('lc-T','Period T',''),('lc-R','Resistance R',''),('lc-I','Peak current ω₀Q₀','cur')),
  'The capacitor starts fully charged. The charge flows through the inductor, which makes it keep flowing after the capacitor is empty and charges it the other way. Energy sloshes between the electric field (capacitor) and the magnetic field (inductor), exactly like a mass on a spring. Add damping (a resistor) and the oscillation dies away. The time axis is in milliseconds; the animation is slowed.')
lc_svg=svg(ln(40,60,220,60,'ink',2)+ln(40,170,220,170,'ink',2)+ln(40,60,40,100,'ink',2)+ln(40,130,40,170,'ink',2)+ln(28,100,52,100,'ink',3)+ln(28,114,52,114,'ink',3)+ln(40,114,40,130,'ink',2)+txt(26,92,'+','pos',13,'end')+txt(60,112,'20 μF','ink',11,'start')+
  ln(220,60,220,85,'ink',2)+ln(220,170,220,145,'ink',2)+f'<path d="M 220 85 a 8 8 0 0 1 0 15 a 8 8 0 0 1 0 15 a 8 8 0 0 1 0 15 a 8 8 0 0 1 0 15" style="fill:none;stroke:var(--ink);stroke-width:2.5"/>'+txt(238,118,'50 mH','ink',11,'start')+txt(130,206,'ω₀ = 1/√(LC) = 1000 rad/s','mut',12),
  'A 20 μF capacitor charged to 10 V is connected to a 50 mH inductor.')
module('lc','LC oscillations',[('ap','AP C Unit 13')],
 'Connect a charged capacitor to an inductor and the charge sloshes back and forth: the capacitor empties through the coil, the coil\'s inertia keeps the current going, and it recharges the capacitor the other way. Mass on a spring, in electrical form.',
 ['A charged capacitor is like a stretched spring: it holds energy ready to push. Connect it to an inductor and the charge starts to flow, but the inductor resists any sudden change in current, so the current builds up gradually. When the capacitor is empty, the current is at its peak: all the energy is in the inductor\'s magnetic field. The current can\'t stop instantly either, so it keeps going and charges the capacitor the other way.',
  'Energy sloshes between U<sub>E</sub> = q²/(2C) and U<sub>B</sub> = ½LI², with the sum constant if there is no resistance. The frequency is ω₀ = 1/√(LC): a bigger L (more inertia) or a bigger C (a softer spring) slows the oscillation.',
  'Any real circuit has some resistance, which burns energy as heat and makes the oscillation fade: a damped oscillation exactly like the one you met in Mechanics. Radios use LC circuits as tuners: adjust C to select the frequency you want.'],
 [('<i>q</i>(<i>t</i>) = <i>Q</i><sub>0</sub> cos ω<sub>0</sub><i>t</i>, &nbsp;ω<sub>0</sub> = 1/√(<i>LC</i>)','ideal LC circuit'),('<i>L</i> d²<i>q</i>/d<i>t</i>² + <i>q</i>/<i>C</i> = 0','loop rule (compare m x″ + kx = 0)'),('<i>q</i>²/(2<i>C</i>) + ½<i>L</i><i class="cur">I</i>² = <i>Q</i><sub>0</sub>²/(2<i>C</i>)','total energy conserved')],
 lab_c,
 [('Run the ideal circuit. Watch the energy bars.',[["#lc-z",0],["#lc-L",50],["#lc-C",20],["click","#lc-rs"]],'When q is at its maximum, I is zero and all the energy is electric. A quarter period later the capacitor is empty, I is at its peak, and all the energy is magnetic. The total never changes.'),
  ('Quadruple the capacitance.',[["#lc-z",0],["#lc-L",50],["#lc-C",80],["click","#lc-rs"]],'ω₀ = 1/√(LC) drops by a factor of 2, so the period doubles. Four times the C means four times the storage for charge at the same voltage, but the circuit takes longer to swing.'),
  ('Add some damping (0.3).',[["#lc-z",.3],["#lc-L",50],["#lc-C",20],["click","#lc-rs"]],'The resistor turns energy into heat each cycle, so the amplitude falls exponentially: the envelope is e^(−Rt/2L).'),
  ('Set damping to 1.0 (critical damping).',[["#lc-z",1],["#lc-L",50],["#lc-C",20],["click","#lc-rs"]],'No oscillation at all: the charge flows away and settles to zero as fast as possible without overshooting. Beyond that (overdamped) it decays more slowly.')],
 dict(prob='An AM radio picks out one station with an LC circuit: a 240 μH coil and a capacitor you adjust with the tuning knob. (a) What capacitance tunes it to a station at 1000 kHz? (b) The AM band runs from 540 kHz to 1700 kHz. What range must the capacitor cover? (c) At 1000 kHz, the incoming signal makes the capacitor\'s voltage swing with an amplitude of 50 mV. Find the peak current in the coil.',svg='',cap='A radio\'s tuning circuit: a fixed coil and a variable capacitor (the arrow), fed by the antenna.',
  steps=[('Capacitance for 1000 kHz.','The circuit responds most strongly at its natural frequency '+m('<i>f</i> = 1/(2π√(<i>LC</i>))')+', so '+m('<i>C</i> = 1/(4π²<i>f</i>²<i>L</i>) = 1/(4π²(1.0 × 10⁶)²(240 × 10⁻⁶)) = 1.06 × 10⁻¹⁰ F = 106 pF')+'.'),
   ('The whole band.','C goes as 1/f². At 540 kHz: '+m('<i>C</i> = 362 pF')+'. At 1700 kHz: '+m('<i>C</i> = 36.5 pF')+'. A ratio of about 10 for a frequency ratio of about 3. (Classic tuning capacitors go up to 365 pF for exactly this reason.)'),
   ('Angular frequency.',m('ω = 2π<i>f</i> = 2π(1.0 × 10⁶) = 6.28 × 10⁶ rad/s')+'.'),
   ('Peak current.',m('<i>Q</i><sub>0</sub> = <i>CV</i><sub>0</sub> = (1.06 × 10⁻¹⁰)(0.050) = 5.3 × 10⁻¹² C')+', so '+m('<i class="cur">I</i><sub>max</sub> = ω<i>Q</i><sub>0</sub> = (6.28 × 10⁶)(5.3 × 10⁻¹²) = 3.3 × 10⁻⁵ A')+' (33 μA).'),
   ('Check with energy.',m('½<i>CV</i><sub>0</sub>² = ½<i>L</i><i class="cur">I</i><sub>max</sub>²')+' gives '+m('<i class="cur">I</i><sub>max</sub> = <i>V</i><sub>0</sub>√(<i>C</i>/<i>L</i>) = (0.050)√(1.06 × 10⁻¹⁰/2.4 × 10⁻⁴) = 33 μA')+' ✓.')]),
 ['Forgetting that the maximum current and the maximum charge are never at the same time.','Using f = 1/√(LC) (forgetting the 2π) or ω₀ = √(LC).','Thinking energy is lost in an ideal LC circuit. It is only transferred between the electric and magnetic fields.','Mixing up the analogy: L plays the role of mass and 1/C the role of the spring constant (not the other way round).'],
 '''        <h2>The mechanical analogy</h2>
        <div class="tablewrap"><table><thead><tr><th>Mass on a spring</th><th>LC circuit</th></tr></thead><tbody>
<tr><td>position <i>x</i></td><td>charge <i>q</i></td></tr>
<tr><td>velocity <i>v</i> = d<i>x</i>/d<i>t</i></td><td>current <i>I</i> = d<i>q</i>/d<i>t</i></td></tr>
<tr><td>mass <i>m</i></td><td>inductance <i>L</i></td></tr>
<tr><td>spring constant <i>k</i></td><td>1/<i>C</i></td></tr>
<tr><td>damping <i>b</i></td><td>resistance <i>R</i></td></tr>
<tr><td>½<i>kx</i>², ½<i>mv</i>²</td><td><i>q</i>²/(2<i>C</i>), ½<i>L</i><i>I</i>²</td></tr>
<tr><td>ω = √(<i>k</i>/<i>m</i>)</td><td>ω = 1/√(<i>LC</i>)</td></tr>
</tbody></table></div>
        <h2>Adding resistance (RLC)</h2>
        <ul>
          <li>Loop rule: <span class="m"><i>L</i> d²<i>q</i>/d<i>t</i>² + <i>R</i> d<i>q</i>/d<i>t</i> + <i>q</i>/<i>C</i> = 0</span>.</li>
          <li>Underdamped (small R): <span class="m"><i>q</i> ≈ <i>Q</i><sub>0</sub><i>e</i><sup>−<i>Rt</i>/2<i>L</i></sup> cos ω′<i>t</i></span>, with ω′ = √(ω₀² − (<i>R</i>/2<i>L</i>)²).</li>
          <li>Critical damping at <span class="m"><i>R</i> = 2√(<i>L</i>/<i>C</i>)</span>; beyond that, overdamped.</li>
        </ul>''',
 dict(correct=2,explain='ω₀ = 1/√(LC). Quadrupling C halves ω₀ (√4 = 2), so the frequency drops to half and the period doubles.',q='the capacitance in an LC circuit is made four times larger. The oscillation frequency becomes:',opts=['Four times as large','Twice as large','Half as large','A quarter as large']))
# ---------------- Maxwell's equations
lab_x=lab('mx-canvas','3D view of an electromagnetic wave: the electric field (blue) and magnetic field (pink) oscillate at right angles and the wave moves in the direction E × B. Drag to rotate.',
  '<span class="title">Electromagnetic wave</span>',
  controls(('mx-f','Frequency (log scale)',6,15,.1,8)),
  readout(('mx-fv','Frequency f','ef'),('mx-lam','Wavelength λ = c/f',''),('mx-band','Kind of light',''),('mx-c','Speed c = 1/√(μ₀ε₀)','cur'),('mx-ratio','E₀/B₀','')),
  'Move the slider to change the frequency from 1 MHz (AM radio) to 10¹⁵ Hz (ultraviolet). The wave always has the same speed; only the wavelength changes. The picture shows about two wavelengths, not to scale with the real length. In every case E and B are in phase, perpendicular to each other and to the direction of travel, with E₀ = cB₀.')
lab_d=lab('mx-dcanvas','A charging parallel-plate capacitor with the field B around the wire and between the plates, with a graph of B against distance from the axis.',
  '<span class="title">Displacement current</span>',
  controls(('mx-I','Charging current I (A)',.1,2,.1,1),('mx-pr','Plate radius R (cm)',2,6,.5,4),('mx-r','Distance r from the axis (cm)',.5,12,.5,3)),
  readout(('mx-dE','Rate of change of E between plates','ef'),('mx-Id','Displacement current ε₀dΦ_E/dt',''),('mx-Bg','B in the gap at r',''),('mx-Bw','B at the same r around the wire','')),
  'While the capacitor charges, a real current I flows in the wire but no charge crosses the gap. Yet B around the gap is just as if it did: the changing E between the plates acts like a current. Maxwell called it the displacement current, and it is what lets electromagnetic waves exist.')
mxs=svg(f'<path d="M 20 150 Q 50 100 80 150 T 140 150 T 200 150 T 250 150" style="fill:none;stroke:var(--cx);stroke-width:3"/>'+f'<path d="M 20 150 Q 50 195 80 150 T 140 150 T 200 150 T 250 150" style="fill:none;stroke:var(--ca);stroke-width:3;stroke-dasharray:6 4"/>'+
  arr(20,150,250,150,'mut','',1.4)+txt(235,138,'direction of travel','mut',10,'end')+txt(60,100,'E','ef',14)+txt(60,200,'B','bf',14)+arr(130,150,130,110,'ef','',2)+arr(130,150,150,160,'bf','',2)+txt(130,38,'E × B points along the motion','ink',12)+txt(130,60,'f = 100 MHz → λ = 3.0 m','mut',11),
  'A plane electromagnetic wave: E and B are perpendicular to each other and to the direction of travel.')
module('maxwell',"Maxwell's equations",[('ap','AP C Unit 13'),('pu','Concepts')],
 'Four equations contain everything about electricity and magnetism. Maxwell noticed one was missing a term, added it, and out popped a wave traveling at 3 × 10⁸ m/s: light is an electromagnetic wave.',
 ['You have already met each of the four laws. <b>Gauss\'s law</b> says electric field lines start and end on charges. <b>Gauss\'s law for magnetism</b> says magnetic field lines never start or end: no magnetic monopoles. <b>Faraday\'s law</b> says a changing magnetic field makes an electric field. <b>Ampère\'s law</b> says currents make magnetic fields.',
  'Maxwell realized Ampère\'s law was incomplete. Charge a capacitor: current flows in the wire, but no charge crosses the gap between the plates, yet the magnetic field circling the wire has to be the same size whether the loop is drawn around the wire or through the gap. His fix: <b>a changing electric field also makes a magnetic field</b>. The extra term, ε₀ dΦ<sub>E</sub>/dt, is the displacement current.',
  'Now the two curl laws feed each other: a changing B makes E (Faraday), and a changing E makes B (Maxwell). That is a self-sustaining wave, with each field regenerating the other as it travels. Plug in the constants and the speed comes out as c = 1/√(μ₀ε₀) = 3.00 × 10⁸ m/s: the speed of light. Light, radio waves and X-rays are all the same thing at different frequencies.'],
 [('∮ <i class="ef">E</i>·d<i>A</i> = <i>q</i>/ε<sub>0</sub>, &nbsp;∮ <i class="bf">B</i>·d<i>A</i> = 0','the two Gauss\'s laws'),('∮ <i class="ef">E</i>·d<i>ℓ</i> = −dΦ<sub>B</sub>/d<i>t</i>','Faraday\'s law'),('∮ <i class="bf">B</i>·d<i>ℓ</i> = μ<sub>0</sub>(<i class="cur">I</i> + ε<sub>0</sub> dΦ<sub>E</sub>/d<i>t</i>)','Ampère–Maxwell law')],
 lab_x+'\n'+lab_d,
 [('Slide the frequency to 100 MHz (FM radio) and read the wavelength.',[["#mx-f",8]],'λ = c/f = 3.0 m. The wave is a radio wave. The speed is the same for every setting; only the wavelength and frequency change.'),
  ('Go up to visible light (about 5 × 10¹⁴ Hz).',[["#mx-f",14.7]],'The wavelength is about 600 nm, a few hundred nanometers. Light is an electromagnetic wave with a frequency millions of times higher than FM radio.'),
  ('Displacement current: pick the point between the plates at r = 2 cm.',[["#mx-I",1],["#mx-pr",4],["#mx-r",2]],'There is no real current in the gap, yet there is a magnetic field. It is smaller than the field at the same distance around the wire (the displacement current only fills part of the loop) and grows in proportion to r.'),
  ('Move the point outside the plates (r = 8 cm).',[["#mx-I",1],["#mx-pr",4],["#mx-r",8]],'Now the loop encloses all the displacement current, which equals the real current I. B in the gap equals B around the wire: the two sides of the capacitor give the same B.')],
 dict(prob='A WiFi router sends out 0.10 W at 2.4 GHz. Treat it as spreading equally in all directions. At your laptop, 3.0 m away, find (a) the wavelength, (b) the intensity, (c) the amplitudes of the electric and magnetic fields, and (d) the direction the wave travels if, at the laptop, E points in +y and B points in +z.',svg='',cap='Waves spreading out from a WiFi router. At the laptop, E and B are perpendicular to each other and to the direction of travel.',
  steps=[('Wavelength.',m('λ = <i>c</i>/<i>f</i> = (3.0 × 10⁸)/(2.4 × 10⁹) = 0.125 m')+' = 12.5 cm. (5 GHz WiFi: 6.0 cm.)'),
   ('Intensity.','The power spreads over a sphere of area 4πr²: '+m('<i>I</i> = <i>P</i>/(4π<i>r</i>²) = 0.10/(4π(3.0)²) = 8.8 × 10⁻⁴ W/m²')+'.'),
   ('Electric field amplitude.','From '+m('<i>I</i> = ½ε<sub>0</sub><i>c</i><i class="ef">E</i><sub>0</sub>²')+': '+m('<i class="ef">E</i><sub>0</sub> = √(2<i>I</i>/(ε<sub>0</sub><i>c</i>)) = √(2(8.8 × 10⁻⁴)/((8.85 × 10⁻¹²)(3.0 × 10⁸))) = 0.82 V/m')+'.'),
   ('Magnetic field amplitude.',m('<i class="bf">B</i><sub>0</sub> = <i class="ef">E</i><sub>0</sub>/<i>c</i> = 0.82/(3.0 × 10⁸) = 2.7 × 10⁻⁹ T')+', about 20,000 times weaker than Earth\'s field.'),
   ('Direction.','The wave travels along '+m('<i class="ef">E</i> × <i class="bf">B</i>')+': '+m('ŷ × ẑ = x̂')+', so +x: away from the router, as it should.'),
   ('Check.','Sunlight is about 1000 W/m², a million times more intense. WiFi works because receivers are extremely sensitive, not because the waves are strong.')]),
 ['Thinking E and B in a wave are 90° out of phase (like a pendulum). They peak together.','Forgetting that the wave moves along E × B, not along E or B.','Believing the displacement current is a flow of charge. It is a changing electric field.','Using c = 3 × 10⁸ m/s in a medium: in glass or water the wave moves slower.'],
 '''        <h2>The four laws, side by side</h2>
        <div class="tablewrap"><table><thead><tr><th>Law</th><th>In words</th><th>Where we met it</th></tr></thead><tbody>
<tr><td><span class="m">∮ <i class="ef">E</i>·d<i>A</i> = <i>q</i><sub>enc</sub>/ε<sub>0</sub></span></td><td>charges are the sources of E</td><td>Gauss's law</td></tr>
<tr><td><span class="m">∮ <i class="bf">B</i>·d<i>A</i> = 0</span></td><td>no magnetic monopoles; B lines are closed loops</td><td>Magnetic force, Biot–Savart</td></tr>
<tr><td><span class="m">∮ <i class="ef">E</i>·d<i>ℓ</i> = −dΦ<sub>B</sub>/d<i>t</i></span></td><td>a changing B makes a (swirling) E</td><td>Faraday &amp; Lenz</td></tr>
<tr><td><span class="m">∮ <i class="bf">B</i>·d<i>ℓ</i> = μ<sub>0</sub><i>I</i> + μ<sub>0</sub>ε<sub>0</sub> dΦ<sub>E</sub>/d<i>t</i></span></td><td>currents <em>and changing E</em> make B</td><td>Ampère's law (+ Maxwell's term)</td></tr>
</tbody></table></div>
        <h2>Electromagnetic waves</h2>
        <ul>
          <li><b>Speed:</b> <span class="m"><i>c</i> = 1/√(μ<sub>0</sub>ε<sub>0</sub>) = 2.998 × 10⁸ m/s</span>, in vacuum, for every frequency.</li>
          <li><b>Relations:</b> <span class="m"><i>c</i> = <i>f</i>λ</span>, <span class="m"><i class="ef">E</i> = <i>c</i><i class="bf">B</i></span> at every point, and the energy flow (Poynting vector) is <span class="m"><i>S</i> = <i class="ef">E</i> × <i class="bf">B</i>/μ<sub>0</sub></span> along the direction of travel.</li>
          <li><b>Spectrum:</b> radio, microwave, infrared, visible (400–700 nm), ultraviolet, X-rays, gamma rays: the same wave at different frequencies.</li>
        </ul>
        <h2>Displacement current</h2>
        <ul>
          <li>Between capacitor plates of area A: <span class="m"><i>I</i><sub>d</sub> = ε<sub>0</sub> dΦ<sub>E</sub>/d<i>t</i> = ε<sub>0</sub><i>A</i> d<i class="ef">E</i>/d<i>t</i> = d<i>Q</i>/d<i>t</i></span>, equal to the real current in the wires. For a loop of radius r inside the plates, <span class="m"><i class="bf">B</i> = μ<sub>0</sub><i class="cur">I</i><i>r</i>/(2π<i>R</i>²)</span>.</li>
        </ul>''',
 dict(correct=3,explain='Maxwell added the displacement current: a changing electric field produces a magnetic field. Together with Faraday\'s law (changing B produces E) this makes a self-propagating wave.',q='which of these did Maxwell add to Ampère\'s law?',opts=['A term for magnetic monopoles','A term for the force on moving charges','A term for the speed of light','A term showing that a changing electric field makes a magnetic field']))
