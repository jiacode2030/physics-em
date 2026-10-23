from mk import *
import math
# ---------------- Conductors
lab_c=lab('cd-canvas','A conducting sphere in a uniform field, or a charge inside a neutral conducting shell.',
  seg('cd-mode','Situation',[('field','Conducting sphere in a field'),('cavity','Charge inside a shell')]),
  '''        <div id="cd-f-ctl"><div class="controls">
          <div class="ctl"><label for="cd-E0"><span>Applied field E₀</span> <output id="cd-E0-out"></output></label><input type="range" id="cd-E0" min="1" max="5" step="0.5" value="3"></div>
          <div class="ctl"><label for="cd-a"><span>Sphere radius</span> <output id="cd-a-out"></output></label><input type="range" id="cd-a" min="3" max="10" step="0.5" value="6"></div>
        </div></div>
        <div id="cd-c-ctl" hidden><div class="controls">
          <div class="ctl"><label for="cd-q"><span>Charge in the cavity</span> <output id="cd-q-out"></output></label><input type="range" id="cd-q" min="-4" max="4" step="1" value="3"></div>
          <div class="ctl"><label for="cd-ro"><span>Outer radius of the shell</span> <output id="cd-ro-out"></output></label><input type="range" id="cd-ro" min="6" max="11" step="0.5" value="8"></div>
          <div class="ctl"><span class="lbl">Connection</span><label style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="checkbox" id="cd-gnd"> Ground the shell (connect it to the earth)</label></div>
        </div></div>
''',
  readout(('cd-r1','Field inside the metal','ef'),('cd-r2','Field at the pole','ef'),('cd-r3','Field at the equator','ef'),('cd-r4','Surface charge','')),
  'Left mode: the applied field points right (E₀ in kN/C). Free charges in the metal slide until the field they make cancels E₀ inside. Dots on the surface show the induced charge (size = amount). Right mode: the shell is initially neutral; only charges in the metal can move.')
cd_svg=svg(f'<circle cx="130" cy="115" r="82" style="fill:var(--sunk);stroke:var(--ink);stroke-width:2"/><circle cx="130" cy="115" r="46" style="fill:var(--surface);stroke:var(--ink);stroke-width:2"/>'+ch(130,115,'+',11)+txt(130,98,'+3 nC','pos',11)+
  ''.join(ch(130+46*math.cos(a*math.pi/4),115+46*math.sin(a*math.pi/4),'−',5)  for a in range(8))+''.join(ch(130+82*math.cos(a*math.pi/4+.39),115+82*math.sin(a*math.pi/4+.39),'+',5) for a in range(8))+
  txt(130,222,'cavity 4 cm · metal 4–6 cm · outside','mut',11)+arr(130+20,115,130+40,115,'ef','',1.6)+arr(130+88,115,130+125,115,'ef','',2.4)+txt(215,100,'E','ef',12),
  'A neutral conducting shell (inner radius 4 cm, outer radius 6 cm) with a +3 nC point charge at the center. Induced charges sit on both surfaces.')
module('conductors','Conductors',[('ap','AP C Unit 10')],
 'In a metal, charges can move freely. So when the field is not zero inside, charges keep moving until it is. That single fact explains shielding, why lightning rods work, and why a charged metal ball keeps all its charge on its outside.',
 ['A conductor has charges that move freely. Place it in an electric field and the free charges slide: positives one way, negatives the other. They keep moving until the field they create exactly cancels the applied field <em>inside</em> the metal. After that, nothing moves: electrostatic equilibrium. The result: <b>E = 0 everywhere inside a conductor.</b>',
  'Because E = 0 inside, any extra charge must sit on the surface (Gauss\'s law: a surface inside the metal encloses no net charge). Just outside, the field is perpendicular to the surface with size σ/ε₀. And since E = 0 inside, V cannot change: <b>the whole conductor is at one potential</b>.',
  'This means a hollow metal box shields its inside from outside fields (a Faraday cage), and a charge placed inside a cavity attracts an equal and opposite charge onto the cavity wall, leaving the opposite charge on the outer surface.'],
 [('<i class="ef">E</i><sub>inside</sub> = 0, &nbsp;<i>V</i> = constant','equilibrium conductor'),('<i class="ef">E</i><sub>surface</sub> = σ/ε<sub>0</sub>','just outside, perpendicular'),('<i>q</i><sub>inner wall</sub> = −<i>q</i><sub>cavity</sub>','charge in a cavity')],
 lab_c,
 [('Show the sphere in a field. Compare the field inside the sphere to the applied field.',[["click","#cd-mode [data-k=field]"],["#cd-E0",3]],'Inside the metal, E = 0. The field lines stop at the sphere: they end on the induced negative charge on the left and start again from the induced positive charge on the right.'),
  ('Look at the field at the poles and at the equator.',[["click","#cd-mode [data-k=field]"],["#cd-E0",3],["#cd-a",6]],'At the poles the field is 3 times E₀: lines crowd together. At the equator it is zero. A conductor concentrates field at its pointy bits.'),
  ('Switch to the shell and put a +3 nC charge in the cavity. Watch the outside field.',[["click","#cd-mode [data-k=cavity]"],["#cd-q",3],["#cd-gnd",False]],'The cavity wall gets −3 nC, so the metal itself has E = 0. The outer surface gets +3 nC, which makes exactly the field a +3 nC point charge would make outside.'),
  ('Now ground the shell.',[["click","#cd-mode [data-k=cavity]"],["#cd-q",3],["#cd-gnd",True]],'Earth supplies charge to cancel the outer +3 nC. There is no field outside at all. The inside field is unchanged. Grounding a shell hides the charge inside.')],
 dict(prob='A neutral conducting spherical shell has inner radius 4.0 cm and outer radius 6.0 cm. A +3.0 nC point charge sits at its center. Find the induced charges on the two surfaces and the electric field at r = 2.0 cm, 5.0 cm and 8.0 cm.',svg=cd_svg,cap=cd_svg and 'A neutral conducting shell (inner radius 4 cm, outer radius 6 cm) with a +3 nC point charge at the center.',
  steps=[('Use E = 0 in the metal.','Draw a Gaussian sphere at r = 5 cm, inside the metal. E = 0 there, so the enclosed charge must be zero: the inner surface carries '+m('<i>q</i><sub>in</sub> = −3.0 nC')+' to cancel the +3.0 nC point charge.'),
   ('Conservation of charge.','The shell was neutral, so the outer surface carries the opposite amount: '+m('<i>q</i><sub>out</sub> = +3.0 nC')+'.'),
   ('r = 2.0 cm (in the cavity).','The enclosed charge is just the point charge: '+m('<i class="ef">E</i> = <i>kq</i>/<i>r</i>² = (8.99 × 10⁹)(3.0 × 10⁻⁹)/(0.020)² = 6.7 × 10⁴ N/C')+', pointing outward.'),
   ('r = 5.0 cm (in the metal).',m('<i class="ef">E</i> = 0')+'.'),
   ('r = 8.0 cm (outside).','Enclosed charge is +3.0 − 3.0 + 3.0 = +3.0 nC: '+m('<i class="ef">E</i> = (8.99 × 10⁹)(3.0 × 10⁻⁹)/(0.080)² = 4.2 × 10³ N/C')+', outward.'),
   ('Check.','Just outside the outer surface, σ = 3.0 nC/(4π(0.060)²) = 66 nC/m², and σ/ε₀ = 7.5 × 10³ N/C, which equals kq/R² at r = 6 cm ✓.')]),
 ['Saying a conductor has no charge inside because charge can\'t be inside: excess charge sits on the surface, but the metal is full of charges that merely cancel.','Thinking E = 0 inside a conductor means E = 0 in the cavity. A charge in the cavity does make a field there.','Forgetting that a neutral shell with +q in the cavity has −q on the inner wall <em>and</em> +q on the outer wall.','Assuming the surface charge is spread evenly on a non-spherical conductor. It gathers at sharp points.'],
 '''        <h2>Properties of a conductor in equilibrium</h2>
        <ul>
          <li><b>E = 0</b> everywhere inside the material.</li>
          <li><b>Excess charge sits on the outer surface.</b> If there is a cavity with no charge in it, the cavity wall carries no charge either.</li>
          <li><b>Field at the surface</b> is perpendicular to it with size <span class="m">σ/ε<sub>0</sub></span>.</li>
          <li><b>One potential:</b> the whole conductor, including its surface, is an equipotential. Equipotentials hug the surface, and field lines meet it at right angles.</li>
          <li><b>Sharp points</b> have a high surface charge density and a strong local field, which is why lightning rods are pointed and why sharp points make sparks.</li>
        </ul>
        <h2>Shielding and induction</h2>
        <ul>
          <li><b>Faraday cage:</b> the field inside an empty closed conducting shell is zero, whatever is outside. (Your car in a thunderstorm.)</li>
          <li><b>Charge in a cavity:</b> the cavity wall gets −q, the outer surface gets +q (if the shell was neutral and isolated). The outside field depends only on the total charge and the outer shape, not on where the charge is inside.</li>
          <li><b>Charging by induction:</b> bring a charged rod near an isolated conductor, ground it briefly, then remove the ground and the rod. The conductor is left charged, with the sign opposite to the rod.</li>
        </ul>
        <h2>Joining conductors</h2>
        <ul>
          <li>Connect two conductors with a wire and charge flows until they are at the <b>same potential</b>, not until they hold the same charge.</li>
          <li>For two spheres far apart, <span class="m"><i>kQ</i><sub>1</sub>/<i>r</i><sub>1</sub> = <i>kQ</i><sub>2</sub>/<i>r</i><sub>2</sub></span>, so charge splits in proportion to radius: <span class="m"><i>Q</i><sub>1</sub>/<i>Q</i><sub>2</sub> = <i>r</i><sub>1</sub>/<i>r</i><sub>2</sub></span>. The smaller sphere then has the larger surface charge density, <span class="m">σ ∝ 1/<i>r</i></span>, and the stronger field at its surface.</li>
          <li>Two identical spheres that touch share their total charge equally.</li>
          <li>Total charge is conserved: add the charges first, then split them by the equal-potential condition.</li>
        </ul>
''',
 dict(correct=0,explain='In equilibrium the charges in the metal rearrange until the field they create cancels the applied field inside. The metal is then field-free; the field lines end on induced charge on its surface.',q='a solid metal sphere is placed in a uniform external electric field. After charges stop moving, the electric field inside the metal is:',opts=['Zero','Equal to the external field','Half the external field','Pointing opposite to the external field']))
# ---------------- Capacitors
lab_p=lab('cp-canvas','Side view of a parallel-plate capacitor connected to a battery, with the plate charges and field between the plates.',
  seg('cp-mode','Connection',[('batt','Battery stays connected'),('iso','Disconnected (isolated)')]),
  controls(('cp-A','Plate area A (cm²)',10,200,10,100),('cp-d','Plate separation d (mm)',.5,5,.5,2),('cp-V','Battery voltage',1,12,1,12)),
  readout(('cp-C','Capacitance C','ef'),('cp-Q','Charge on a plate Q',''),('cp-VV','Voltage ΔV',''),('cp-E','Field E between plates','ef'),('cp-U','Stored energy U','frc')),
  'With the battery attached, the voltage is fixed and the charge changes. After you disconnect it the charge is fixed instead, and the voltage and energy change. Compare the field E in the two modes as you pull the plates apart.')
lab_s=lab('cc-canvas','Two capacitors connected to a battery, in series or in parallel.',
  seg('cc-mode','Connection',[('ser','In series'),('par','In parallel')]),
  controls(('cc-V','Battery voltage',2,24,1,12),('cc-C1','C₁ (μF)',1,10,1,4),('cc-C2','C₂ (μF)',1,10,1,2)),
  readout(('cc-eq','Equivalent capacitance','ef'),('cc-Q','Total charge from the battery',''),('cc-v1','V across C₁',''),('cc-v2','V across C₂',''),('cc-q12','Charges Q₁ and Q₂','')),
  'Series: one path, so the same charge on each, and the voltages split (the smaller capacitor takes the bigger share). Parallel: the same voltage across each, and the charges split.')
cp_svg=svg(ln(40,90,220,90,'ink',4)+ln(40,140,220,140,'ink',4)+txt(130,78,'+Q','pos',13)+txt(130,162,'−Q','neg',13)+arr(130,95,130,135,'ef','',2.4)+txt(147,120,'E','ef',13,'start')+ln(232,90,232,140,'mut',1.2)+txt(246,120,'d','mut',12)+txt(130,28,'A = 100 cm², d = 2.0 mm','ink',12)+ln(20,90,40,90,'ink',1.5)+ln(20,140,40,140,'ink',1.5)+ln(20,90,20,104,'ink',1.5)+ln(20,126,20,140,'ink',1.5)+bat(20,115,'',True)+txt(130,200,'ε = 12 V','mut',12),
  'Parallel plates of area A, separation d, connected to a 12 V battery.')
module('capacitors','Capacitors',[('ap','AP C Unit 10'),('pu','AP 2: electricity')],
 'A capacitor stores charge, and with it energy, by holding two conductors close together at different potentials. It is the simplest example of "energy stored in an electric field", and it is the other half of every RC and LC circuit.',
 ['Two metal plates facing each other, with a gap. Connect a battery and charge flows: +Q onto one plate, −Q onto the other, until the plates\' voltage matches the battery. The charge you get per volt is the <b>capacitance</b>, C = Q/ΔV. Bigger plates hold more charge for the same voltage (A in the numerator); plates closer together hold more (d in the denominator): <b>C = ε₀A/d</b>.',
  'The energy of a charged capacitor is U = ½CΔV² = Q²/(2C). It is stored in the field between the plates: the energy per volume is u = ½ε₀E², and it is the same for any electric field anywhere.',
  'There are two different kinds of "change something on a capacitor" questions, and mixing them up is the most common error. <b>Battery connected:</b> ΔV stays fixed, everything else adjusts. <b>Battery disconnected:</b> Q stays fixed, everything else adjusts. Ask yourself first which one it is.'],
 [('<i>C</i> = <i>Q</i>/Δ<i>V</i> = ε<sub>0</sub><i>A</i>/<i>d</i>','parallel plates'),('<i>U</i> = ½<i>C</i>Δ<i>V</i>² = <i>Q</i>²/(2<i>C</i>) = ½<i>Q</i>Δ<i>V</i>','stored energy'),('<i>C</i><sub>par</sub> = <i>C</i><sub>1</sub> + <i>C</i><sub>2</sub>, &nbsp;1/<i>C</i><sub>ser</sub> = 1/<i>C</i><sub>1</sub> + 1/<i>C</i><sub>2</sub>','combinations')],
 add3(lab_p,'cp3-canvas','The same capacitor as a real object. Charge sits on the facing surfaces of the plates, and the field between them is uniform. Spread the plates apart or enlarge them and watch the field arrows.','3D parallel-plate capacitor. Drag to rotate.')+'\n'+lab_s,
 [('With the battery connected, double the plate separation.',[["click","#cp-mode [data-k=batt]"],["#cp-A",100],["#cp-d",2],["#cp-V",12],["#cp-d",4]],'C halves. The battery keeps ΔV = 12 V, so Q halves: charge flows back to the battery. E = ΔV/d halves too. Energy ½CΔV² halves.'),
  ('Disconnect the battery, then double the separation.',[["click","#cp-mode [data-k=batt]"],["#cp-A",100],["#cp-d",2],["#cp-V",12],["click","#cp-mode [data-k=iso]"],["#cp-d",4]],'Now Q cannot change. C halves, so ΔV = Q/C doubles. The field E = Q/(ε₀A) does not change at all: it depends only on the charge density. Energy Q²/2C doubles, and the extra energy is the work you did pulling the plates apart against their attraction.'),
  ('Series: 4 μF and 2 μF on 12 V. Then switch to parallel.',[["click","#cc-mode [data-k=ser]"],["#cc-V",12],["#cc-C1",4],["#cc-C2",2]],'In series C_eq = 1.33 μF (less than either), each gets the same 16 μC, and the smaller capacitor takes the bigger voltage (8 V vs 4 V). In parallel C_eq = 6 μF (the sum), each has 12 V, and the larger capacitor holds more charge.')],
 dict(prob='A parallel-plate capacitor has plates 10 cm × 10 cm, 2.0 mm apart, connected to a 12 V battery. (a) Find C, Q, E and U. (b) The battery is disconnected and the plates are pulled apart to 4.0 mm. Find the new voltage, field and energy, and the work needed.',svg=cp_svg,cap='Parallel plates, area A = 100 cm², separation d = 2.0 mm, 12 V battery.',
  steps=[('Capacitance.',m('<i>C</i> = ε<sub>0</sub><i>A</i>/<i>d</i> = (8.85 × 10⁻¹²)(0.010)/(0.0020) = 4.4 × 10⁻¹¹ F = 44 pF')+'.'),
   ('Charge, field and energy at 12 V.',m('<i>Q</i> = <i>C</i>Δ<i>V</i> = 0.53 nC')+', '+m('<i class="ef">E</i> = Δ<i>V</i>/<i>d</i> = 12/0.0020 = 6.0 × 10³ V/m')+', '+m('<i>U</i> = ½<i>C</i>Δ<i>V</i>² = ½(4.4 × 10⁻¹¹)(12)² = 3.2 nJ')+'.'),
   ('Disconnect: what is fixed?','With the battery gone the charge has nowhere to go: <b>Q = 0.53 nC stays constant</b>.'),
   ('New values at d = 4.0 mm.',m('<i>C</i>′ = 22 pF')+', so '+m('Δ<i>V</i>′ = <i>Q</i>/<i>C</i>′ = 24 V')+'. The field: '+m('<i class="ef">E</i> = Δ<i>V</i>′/<i>d</i>′ = 24/0.0040 = 6.0 × 10³ V/m')+', unchanged. Energy: '+m('<i>U</i>′ = <i>Q</i>²/(2<i>C</i>′) = 6.4 nJ')+'.'),
   ('Work done.',m('<i>W</i> = Δ<i>U</i> = 6.4 − 3.2 = 3.2 nJ')+'. You pulled against the attraction between the plates, and the energy went into the field.'),
   ('Check.','The field has the same value because E = Q/(ε₀A) and neither Q nor A changed ✓. The volume of field doubled while the energy density stayed the same, so the energy doubled ✓.')]),
 ['Using ΔV = constant after the battery has been disconnected (or Q constant with the battery on).','Adding capacitances in series. They add in parallel; in series it is the reciprocals.','Using the battery voltage for each capacitor in a series pair. The battery voltage is shared.','Forgetting to convert mm and cm² to SI units in C = ε₀A/d.'],
 '''        <h2>Parallel plates</h2>
        <ul>
          <li><b>Field:</b> between large plates the field is uniform, <span class="m"><i class="ef">E</i> = σ/ε<sub>0</sub> = <i>Q</i>/(ε<sub>0</sub><i>A</i>)</span> (the fields of the two sheets add between them and cancel outside).</li>
          <li><b>Voltage:</b> <span class="m">Δ<i>V</i> = <i class="ef">E</i><i>d</i> = <i>Qd</i>/(ε<sub>0</sub><i>A</i>)</span>, so <span class="m"><i>C</i> = <i>Q</i>/Δ<i>V</i> = ε<sub>0</sub><i>A</i>/<i>d</i></span>. It depends only on the geometry.</li>
          <li><b>Other shapes:</b> a spherical capacitor has <span class="m"><i>C</i> = 4πε<sub>0</sub><i>ab</i>/(<i>b</i> − <i>a</i>)</span>; a cylindrical one has <span class="m"><i>C</i> = 2πε<sub>0</sub><i>L</i>/ln(<i>b</i>/<i>a</i>)</span>. Find each by Gauss\'s law, then integrate E to get ΔV.</li>
        </ul>
        <h2>Energy</h2>
        <ul>
          <li><span class="m"><i>U</i> = ∫ Δ<i>V</i> d<i>q</i> = ∫ (<i>q</i>/<i>C</i>) d<i>q</i> = <i>Q</i>²/(2<i>C</i>)</span>: each extra bit of charge costs more energy, because the voltage is higher.</li>
          <li><b>Energy density:</b> <span class="m"><i>u</i> = <i>U</i>/(<i>Ad</i>) = ½ε<sub>0</sub><i class="ef">E</i>²</span>.</li>
        </ul>
        <h2>Combining capacitors</h2>
        <ul>
          <li><b>Parallel:</b> same ΔV, charges add: <span class="m"><i>C</i><sub>eq</sub> = Σ<i>C</i><sub>i</sub></span>.</li>
          <li><b>Series:</b> same Q, voltages add: <span class="m">1/<i>C</i><sub>eq</sub> = Σ 1/<i>C</i><sub>i</sub></span>.</li>
        </ul>''',
 dict(correct=2,explain='With the battery disconnected, the charge on the plates is stuck. The field depends only on the charge density σ = Q/A, and that does not change when d changes. The voltage doubles, but E = ΔV/d stays the same.',q='an isolated, charged parallel-plate capacitor has its plates pulled to twice the separation. What happens to the electric field between the plates?',opts=['It doubles','It is cut in half','It is unchanged','It drops to zero']))
# ---------------- Dielectrics
lab_d=lab('dl-canvas','Side view of a parallel-plate capacitor with a dielectric slab sliding in from the right.',
  seg('dl-mode','Connection',[('iso','Disconnected (isolated)'),('batt','Battery stays connected')]),
  controls(('dl-k','Dielectric constant κ',1,10,.5,4),('dl-f','Slab pushed in',0,1,.05,0)),
  readout(('dl-C','Capacitance C','ef'),('dl-Q','Charge Q',''),('dl-V','Voltage ΔV',''),('dl-E','Field E (V/d)','ef'),('dl-U','Stored energy U','frc')),
  'The capacitor starts at 100 V before the slab goes in (C₀ = 88.5 pF). Slide the slab in and compare the two modes: with the battery off, the voltage and field fall; with the battery on, the charge and energy rise. The small ± on the slab are bound charges from polarization.')
dl_svg=svg(ln(30,60,230,60,'ink',4)+ln(30,170,230,170,'ink',4)+txt(130,48,'+Q','pos',13)+f'<rect x="60" y="68" width="140" height="94" style="fill:color-mix(in srgb,var(--cx) 14%,transparent);stroke:var(--cx);stroke-width:1.5"/>'+
  ''.join(f'<circle cx="{x}" cy="75" r="3.2" style="fill:var(--neg)"/><circle cx="{x}" cy="155" r="3.2" style="fill:var(--pos)"/>' for x in range(72,196,16))+txt(130,118,'κ = 4','cx',14)+arr(130,70,130,104,'ef','',1.6)+arr(130,128,130,160,'ef','',1.6)+txt(130,196,'E → E₀/κ inside','mut',12)+txt(130,226,'bound charge on the faces','mut',11),
  'A dielectric between the plates. Its faces carry bound charge that partly cancels the field.')
module('dielectrics','Dielectrics',[('ap','AP C Unit 10')],
 'Slide an insulator between the plates of a capacitor and its capacitance goes up by a factor κ. The insulator\'s molecules line up against the field and weaken it. The same effect makes insulators attract charged objects, and it is why real capacitors are stuffed with plastic or ceramic.',
 ['An insulator has no free charges, but its molecules can be stretched or turned: the positive end pulled one way by the field, the negative end the other. This is <b>polarization</b>. Inside the slab the little dipoles line up so that the positive ends point toward the negative plate. Stack them up and you get a layer of negative <b>bound charge</b> on the face next to the positive plate, and positive bound charge next to the negative plate.',
  'These bound charges make their own field, pointing <em>against</em> the field from the plates. The field inside the dielectric drops to E₀/κ, where κ ≥ 1 is the dielectric constant. For the same charge on the plates, a smaller field means a smaller voltage (ΔV = Ed), so <b>C = Q/ΔV grows by a factor κ</b>.',
  'To keep the story straight, always decide first whether the battery is connected. <b>Isolated</b> (Q fixed): ΔV drops by κ, the field drops by κ, the energy drops by κ. <b>Battery connected</b> (ΔV fixed): Q grows by κ, the field in the gap stays at V/d, the energy grows by κ.'],
 [('<i>C</i> = κ<i>C</i><sub>0</sub> = κε<sub>0</sub><i>A</i>/<i>d</i>','fully filled'),('<i class="ef">E</i><sub>in</sub> = <i class="ef">E</i><sub>0</sub>/κ','same free charge'),('<i>u</i> = ½κε<sub>0</sub><i class="ef">E</i>²','energy density')],
 lab_d,
 [('Disconnect the battery (isolated), then push the κ = 4 slab all the way in.',[["click","#dl-mode [data-k=iso]"],["#dl-k",4],["#dl-f",1]],'Capacitance goes up 4×. The charge cannot change, so the voltage drops to 25 V and the field falls to a quarter. The energy also falls to a quarter: the field pulls the slab in.'),
  ('Do the same with the battery connected.',[["click","#dl-mode [data-k=batt]"],["#dl-k",4],["#dl-f",1]],'The battery holds 100 V. The field stays at V/d, but the charge on the plates rises 4× because the capacitor can hold more at the same voltage. The energy ½CV² rises 4×; the battery paid for it.'),
  ('Increase κ to 10 with the slab fully in, isolated.',[["click","#dl-mode [data-k=iso]"],["#dl-k",10],["#dl-f",1]],'Voltage drops to 10 V. A material with a large κ is a very strong way to boost capacitance (water κ ≈ 80, some ceramics > 1000).'),
  ('Push the slab in only halfway.',[["click","#dl-mode [data-k=iso]"],["#dl-k",4],["#dl-f",.5]],'The capacitor acts like two capacitors in parallel, one with the slab (κC₀/2) and one without (C₀/2): C = C₀(1 + κ)/2.')],
 dict(prob='An air-filled parallel-plate capacitor has C₀ = 100 pF and is charged to 200 V, then disconnected from the battery. A dielectric slab with κ = 4 is slid in until it fills the gap. Find the new voltage, the energy before and after, and explain where the energy went. What would happen with the battery still connected?',svg=dl_svg,cap='The slab\'s faces carry bound charge that partly cancels the field.',
  steps=[('Charge.',m('<i>Q</i> = <i>C</i><sub>0</sub>Δ<i>V</i><sub>0</sub> = (100 pF)(200 V) = 20 nC')+', and it stays 20 nC because the capacitor is isolated.'),
   ('New capacitance and voltage.',m('<i>C</i> = κ<i>C</i><sub>0</sub> = 400 pF')+' so '+m('Δ<i>V</i> = <i>Q</i>/<i>C</i> = 50 V')+'. The field also drops to one quarter.'),
   ('Energy before and after.',m('<i>U</i><sub>0</sub> = ½<i>C</i><sub>0</sub>Δ<i>V</i><sub>0</sub>² = 2.0 μJ')+' and '+m('<i>U</i> = <i>Q</i>²/(2<i>C</i>) = 0.50 μJ')+'. The energy fell by 1.5 μJ.'),
   ('Where did it go?','The field attracts the dielectric (the slab is pulled in). That 1.5 μJ became kinetic energy of the slab, or work done on whoever held it back.'),
   ('Battery connected instead.','The voltage stays 200 V, so '+m('<i>Q</i> = κ<i>C</i><sub>0</sub>Δ<i>V</i> = 80 nC')+' (the battery supplies 60 nC more), and '+m('<i>U</i> = ½(400 pF)(200)² = 8.0 μJ')+'. The battery did 12 μJ of work (60 nC × 200 V): 6 μJ went into stored energy and 6 μJ into pulling the slab in.')]),
 ['Using κ as the factor for the <em>field</em> in the wrong direction: E goes <em>down</em> by κ for the same free charge.','Not saying whether the battery is connected. Q fixed and V fixed give opposite answers.','Treating a dielectric like a conductor. Inside a conductor E = 0; inside a dielectric E = E₀/κ.','Forgetting that the energy changes. Something does work as the slab moves.'],
 '''        <h2>What a dielectric does</h2>
        <ul>
          <li><b>Polarization:</b> the field distorts (or rotates) the molecules into small dipoles aligned with the field.</li>
          <li><b>Bound charge:</b> the dipoles leave a surface layer of bound charge on each face. Its surface density is <span class="m">σ<sub>b</sub> = σ<sub>f</sub>(1 − 1/κ)</span>, where σ<sub>f</sub> is the free charge on the plates.</li>
          <li><b>Net field:</b> <span class="m"><i class="ef">E</i> = (σ<sub>f</sub> − σ<sub>b</sub>)/ε<sub>0</sub> = σ<sub>f</sub>/(κε<sub>0</sub>) = <i class="ef">E</i><sub>0</sub>/κ</span>.</li>
          <li>The permittivity of the material is <span class="m">ε = κε<sub>0</sub></span>. All the vacuum formulas work with ε<sub>0</sub> replaced by κε<sub>0</sub> inside the dielectric.</li>
        </ul>
        <h2>Why real capacitors use them</h2>
        <ul>
          <li>Higher capacitance for the same size (κ ≈ 2–5 plastics, hundreds to thousands for ceramics).</li>
          <li>Higher breakdown voltage than air (about 3 × 10⁶ V/m for air), so more charge fits before sparks.</li>
          <li>They keep the plates apart so they can be very close.</li>
        </ul>''',
 dict(correct=1,explain='Because the capacitor is isolated, Q cannot change. The dielectric raises C by 3, so ΔV = Q/C drops to one third. The field E = ΔV/d also drops to one third.',q='an isolated, charged capacitor has a dielectric with κ = 3 slid fully between its plates. The voltage across it becomes:',opts=['3 times larger','One third as large','The same as before','Zero']))
