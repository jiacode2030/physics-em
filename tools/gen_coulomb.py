from mk import *
import math
# ---------- Coulomb's law
lab_html=lab('cb-canvas','Two or three charges on a grid with force arrows. Drag the charges.',
  seg('cb-mode','Number of charges',[('two','Two charges'),('three','Three charges: add the forces')]),
  '''        <div class="controls">
          <div class="ctl"><label for="cb-q1"><span>Charge 1</span> <output id="cb-q1-out"></output></label><input type="range" id="cb-q1" min="-5" max="5" step="0.5" value="3"></div>
          <div class="ctl"><label for="cb-q2"><span>Charge 2</span> <output id="cb-q2-out"></output></label><input type="range" id="cb-q2" min="-5" max="5" step="0.5" value="-2"></div>
          <div class="ctl" id="cb-q3-ctl" hidden><label for="cb-q3"><span>Charge 3</span> <output id="cb-q3-out"></output></label><input type="range" id="cb-q3" min="-5" max="5" step="0.5" value="2"></div>
        </div>
''',
  readout(('cb-r','Separation 1–2',''),('cb-F','Force size, 1 and 2','frc'),('cb-type','Between them',''),('cb-net','Net force on charge 1','frc'),('cb-r2','Force if r doubled (F ÷ 4)','')),
  'Grid squares are 4 cm. Each arrow is a force; longer arrows mean bigger forces. In two-charge mode the lengths use a logarithmic scale so they fit a huge range, and the forces on the two charges are always equal in size and opposite in direction. In three-charge mode the arrows are drawn to scale, so you can see the vector addition. The net force angle is measured from +x.')
ex_svg=svg(
  ln(20,150,240,150,'mut',1.5,'4 4')+ch(40,150,'+')+ch(130,150,'−')+ch(220,150,'+')+
  txt(40,186,'+2.0 μC','pos',12)+txt(130,186,'−3.0 μC','neg',12)+txt(220,186,'+4.0 μC','pos',12)+
  arr(130,118,92,118,'frc','F₁',2.6,(-4,0))+arr(130,98,200,98,'frc','F₃',2.6,(4,0))+
  txt(85,215,'0.20 m',"mut",12)+txt(175,215,'0.20 m',"mut",12)+
  txt(130,40,'Forces on the middle charge','ink',13)+txt(130,58,'(drawn above it for clarity)','mut',11),
  'Three charges in a line. The outer charges both pull the middle one: the left one pulls left, the right one pulls right.')
module('coulomb',"Charge &amp; Coulomb's law",[('ap','AP C Unit 8'),('pu','AP 2: electricity')],
 'Charge comes in two kinds. Like charges push apart, opposite charges pull together, and the push or pull falls off with the square of the distance, exactly like gravity does, but trillions of times stronger.',
 ['Rub a balloon on your hair and it sticks to the wall. Rubbing moved electrons from one surface to the other, so one surface is left slightly negative and the other slightly positive. Charge is never created or destroyed, only moved. Every object is made of huge numbers of + and − charges that almost perfectly cancel.',
  f'Coulomb\'s law says how hard two small charges push or pull: double one charge and the force doubles; double the distance and the force drops to a quarter. It has the same shape as Newton\'s gravity law, with charge playing the role of mass. The big difference is that gravity only attracts, while electric forces can attract <i>or</i> repel, and they are enormously stronger: the electric force between a proton and an electron in hydrogen is about 10³⁹ times the gravitational pull between them.',
  'When there are three or more charges, the force on any one is found by <b>superposition</b>: work out the force from each of the others as if it were alone, then add the arrows as vectors.'],
 [(f'<i class="frc">F</i> = <i>k</i>|<i>q</i><sub>1</sub><i>q</i><sub>2</sub>|/<i>r</i>²','Coulomb\'s law; <i>k</i> = 8.99 × 10⁹ N·m²/C²'),
  ('<i>k</i> = 1/(4πε<sub>0</sub>)','ε₀ = 8.85 × 10⁻¹² C²/(N·m²)'),
  ('<i class="frc">F</i><sub>net</sub> = <i class="frc">F</i><sub>1</sub> + <i class="frc">F</i><sub>2</sub> + …','superposition: add as vectors')],
 lab_html,
 [('Start with a +3 and a −2 μC pair and watch both arrows. Then make them both positive.',[["click","#cb-mode [data-k=two]"],["#cb-q1",3],["#cb-q2",2]],'Opposite charges attract: the arrows point toward each other. Same-sign charges repel, so the arrows flip to point apart. The two arrows are always the same length (Newton\'s third law).'),
  ('Drag charge 2 to about twice as far from charge 1 as it was. Read the force before and after.',[["click","#cb-mode [data-k=two]"]],'Double the distance and the force drops to one quarter. The readout "Force if r doubled" predicts it before you move.'),
  ('Switch to three charges. Make charges 2 and 3 equal and place charge 1 midway between them.',[["click","#cb-mode [data-k=three]"],["#cb-q2",2],["#cb-q3",2]],'Equal pushes from opposite sides cancel, so the net force on charge 1 is zero. Superposition works on arrows, not just numbers.'),
  ('Double the size of charge 2 (−2 μC to −4 μC) and compare the force readout.',[["click","#cb-mode [data-k=two]"],["#cb-q1",3],["#cb-q2",-4]],'Doubling either charge doubles the force. The force is proportional to the product q₁q₂.')],
 dict(prob='A +2.0 μC charge sits at x = 0, a −3.0 μC charge at x = 0.20 m and a +4.0 μC charge at x = 0.40 m. Find the net electric force on the −3.0 μC charge.',svg=ex_svg,cap='The outer charges both pull the middle charge: the left one pulls left, the right one pulls right.',
  steps=[('Draw the arrows first.','The −3.0 μC charge is attracted to both positive charges. The +2.0 μC charge is to its left, so that force points left (−x). The +4.0 μC charge is to its right, so that force points right (+x).'),
  ('Force from the +2.0 μC charge (r = 0.20 m).',m('<i class="frc">F</i><sub>1</sub> = (8.99 × 10⁹)(2.0 × 10⁻⁶)(3.0 × 10⁻⁶)/(0.20)² = 1.35 N')+', pointing −x.'),
  ('Force from the +4.0 μC charge (r = 0.20 m).',m('<i class="frc">F</i><sub>3</sub> = (8.99 × 10⁹)(4.0 × 10⁻⁶)(3.0 × 10⁻⁶)/(0.20)² = 2.70 N')+', pointing +x.'),
  ('Add the vectors.',m('<i class="frc">F</i><sub>net</sub> = +2.70 − 1.35 = +1.35 N')+', so the net force is <b>1.35 N in the +x direction</b>.'),
  ('Check.','The stronger pull comes from the bigger charge, which is on the right, so the net force points right. Both charges are the same distance away, so the net is just k(3.0 μC)(4.0 − 2.0 μC)/(0.20)² = 1.35 N ✓.')]),
 ['Using the signs of the charges in the formula <i>and</i> choosing the direction from the picture, which counts the sign twice. Use |q₁q₂| for the size and the sketch for the direction.','Adding force magnitudes when the forces point in different directions. Add components.','Putting charge in microcoulombs or distance in centimeters straight into the formula. Convert to C and m.','Forgetting that the force is on <i>one</i> charge from the <i>others</i>. A charge never feels a force from itself.'],
 '''        <h2>What the law says</h2>
        <ul>
          <li><b>Direction:</b> along the line joining the charges. Like charges repel, unlike charges attract.</li>
          <li><b>Size:</b> proportional to each charge and to 1/r². Double the distance, a quarter of the force; triple it, a ninth.</li>
          <li><b>Newton's third law:</b> the force on charge 1 from charge 2 is equal and opposite to the force on 2 from 1, even if the charges are very different.</li>
          <li><b>Charge is quantized:</b> it comes in whole multiples of <span class="m"><i>e</i> = 1.60 × 10⁻¹⁹ C</span>. One electron carries −<i>e</i>, one proton +<i>e</i>. A coulomb is a huge charge: about 6 × 10¹⁸ electrons.</li>
          <li><b>Conservation of charge:</b> the total never changes. If two identical conducting spheres touch, they share charge equally.</li>
        </ul>
        <h2>Conductors and insulators</h2>
        <ul>
          <li><b>Conductors</b> (metals) let charge move freely; <b>insulators</b> (rubber, glass) hold it in place.</li>
          <li>A charged rod can pull on a <em>neutral</em> object by <b>polarization</b>: charges inside shift slightly so that the nearer charge, which is opposite, attracts more than the farther one repels.</li>
        </ul>
        <h2>Using it with gravity-sized numbers</h2>
        <ul>
          <li>Electric forces dominate for atoms and molecules; gravity dominates for planets only because large objects are almost perfectly neutral.</li>
          <li>The same 1/r² shape means a lot of what you learned about gravity carries over, including adding forces as vectors and the idea of a field.</li>
        </ul>''',
 dict(correct=1,explain='The force is proportional to q₁q₂/r². Doubling both charges multiplies it by 2 × 2 = 4. Doubling the distance divides it by 2² = 4. The two changes cancel, leaving F unchanged.',q='two charges repel with force F. You double both charges <em>and</em> double the distance between them. The new force is:',opts=['F/2','F','2F','4F']),
 assume=dict(h='Where this sits in the course',rows=[('Mechanics gave us','forces from contact and gravity, with free-body diagrams and ΣF = ma'),('Now we add','a second force that acts at a distance, with its own sign: charge can push or pull'),('Everything else still works','draw the arrows, add the vectors, use Newton\'s laws. Coulomb forces just join the diagram.')]),unit='Unit')
# ---------- Charge slices (math toolkit)
lab2=lab('sl-canvas','A charged rod cut into slices with the field each slice makes at a point to the left of the rod.',
  seg('sl-mode','Charge pattern',[('uniform','Uniform rod'),('ramp','Charge grows to the right')]),
  controls(('sl-n','Number of slices',1,40,1,6),('sl-L','Rod length L',.1,1,.05,.4),('sl-a','Distance a to the rod',.05,.5,.05,.1)),
  readout(('sl-sum','Sum of slices','ef'),('sl-ex','Exact integral','ef'),('sl-err','Error',''),('sl-pt','Everything at the center','')),
  'Rod total charge is 10 nC. Each slice makes a small field pointing left (away from the rod, since the charge is positive). Add the arrows and the total approaches the exact answer. Putting all the charge at one point is only a rough shortcut.')
sl_svg=svg(ln(110,150,230,150,'cur',9)+ln(110,150,230,150,'bf',3)+txt(170,134,'λ = bx','ink',13)+dotp(40,150,'P','ink',0,-12)+arr(40,170,12,170,'ef','dE',2.6,(0,0))+ln(150,142,150,158,'mut',1.5)+ln(160,142,160,158,'mut',1.5)+txt(155,176,'dx','mut',12)+ln(40,196,110,196,'mut',1.2)+txt(75,212,'a','mut',12)+ln(110,196,230,196,'mut',1.2)+txt(170,212,'L','mut',12)+txt(155,120,'slice at x','mut',11),
  'A rod whose charge grows toward the right end, and a point P to its left. One thin slice at distance x from the rod\'s left end.')
module('slices','Charge slices',[('ap','AP C math'),('calc','Calculus')],
 'When charge is spread along a rod, over a ring or through a ball, you can\'t plug it into kq/r². Cut it into tiny slices that are each small enough to count as point charges, then add them up. That sum is an integral.',
 ['The recipe is always the same: <b>cut, treat each piece as a point charge, add.</b> A tiny piece of charge is called dq. For a rod, dq = λ dx, where λ is the charge per meter. A slice of a surface has dq = σ dA, and a slice of a volume has dq = ρ dV.',
  'Slide the number of slices up in the simulation. With one slice the answer is a guess. With ten it is close. With forty it matches the exact integral to within a fraction of a percent. An integral is what you get when the slices become infinitely thin.',
  'Two tricks save most of the work: use <b>symmetry</b> to cancel components before you integrate, and choose slices that are all the <em>same distance</em> from the point (a thin ring, for a point on its axis).'],
 [('d<i>q</i> = λ d<i>x</i> = σ d<i>A</i> = ρ d<i>V</i>','charge in a slice'),('d<i class="ef">E</i> = <i>k</i> d<i>q</i>/<i>r</i>²','field of one slice'),('<i class="ef">E</i> = ∫ d<i class="ef">E</i>','add them all (as vectors)')],
 lab2,
 [('Use one slice, then add more. Watch the error shrink.',[["click","#sl-mode [data-k=uniform]"],["#sl-n",1]],'One slice puts all the charge at the middle of the rod, which is just a point-charge guess. Increase the slices and the sum climbs toward the exact value.'),
  ('Move the point far from the rod (a = 0.5 m).',[["#sl-a",.5],["#sl-n",3]],'Far away the rod looks like a point charge. Even three slices are close, and the "everything at the center" shortcut is within about 10%.'),
  ('Bring the point close to the rod (a = 0.05 m) with 3 slices.',[["#sl-a",.05],["#sl-n",3],["#sl-L",.4]],'Up close, the near end matters most because of the 1/r². Few slices miss that, and the "everything at the center" shortcut is far off.'),
  ('Switch to the ramp: charge grows toward the far end.',[["click","#sl-mode [data-k=ramp]"],["#sl-n",8]],'Most of the charge is far from P, so the field is smaller than for the same total charge spread evenly.')],
 dict(prob='A rod lies along the x-axis from x = 0 to L = 0.40 m. Its charge density grows along the rod: λ = bx with b = 5.0 μC/m². Find the total charge, and the electric field at point P on the axis, a = 0.10 m to the left of the rod.',svg=sl_svg,cap='The slice at position x carries dq = λ dx = bx dx and sits a distance a + x from P.',
  steps=[('Pick a slice.',m('d<i>q</i> = λ d<i>x</i> = <i>bx</i> d<i>x</i>')+'. It is a distance a + x from P.'),
   ('Total charge.',m('<i>Q</i> = ∫<sub>0</sub><sup><i>L</i></sup> <i>bx</i> d<i>x</i> = <i>bL</i>²/2 = (5.0 × 10⁻⁶)(0.40)²/2 = 4.0 × 10⁻⁷ C')+' = 0.40 μC.'),
   ('Field of one slice.',m('d<i class="ef">E</i> = <i>k</i> d<i>q</i>/(<i>a</i> + <i>x</i>)² = <i>kb</i> <i>x</i> d<i>x</i>/(<i>a</i> + <i>x</i>)²')+', pointing away from the rod (−x), because the charge is positive. All slices point the same way, so the sizes just add.'),
   ('Integrate.',m('<i class="ef">E</i> = <i>kb</i> ∫<sub>0</sub><sup><i>L</i></sup> <i>x</i> d<i>x</i>/(<i>a</i> + <i>x</i>)² = <i>kb</i> [ln((<i>a</i> + <i>L</i>)/<i>a</i>) + <i>a</i>/(<i>a</i> + <i>L</i>) − 1]')+'. (Use <i>x</i> = (<i>a</i> + <i>x</i>) − <i>a</i> to split the integrand.)'),
   ('Numbers.',m('ln(5) + 0.20 − 1 = 0.809')+', so '+m('<i class="ef">E</i> = (8.99 × 10⁹)(5.0 × 10⁻⁶)(0.809) = 3.6 × 10⁴ N/C')+', directed in the −x direction.'),
   ('Sanity check.','A point charge of 0.40 μC at the rod\'s charge-weighted center (0.267 m from the end, 0.367 m from P) would give 2.7 × 10⁴ N/C. The real answer is larger because 1/r² weights the nearer charge more heavily than the average position suggests. ✓')]),
 ['Using a single r for all the slices when they are at different distances.','Forgetting the integrand needs x written in terms of the variable (dq = λ dx with λ depending on x).','Adding field magnitudes when the slices\' arrows point in different directions (rings and arcs). Use symmetry or components.','Integrating over the wrong limits: the slice position runs along the object, not from P.'],
 '''        <h2>Which dq to use</h2>
        <div class="tablewrap"><table><thead><tr><th>Charge lives on…</th><th>Density</th><th>Slice</th><th>dq</th></tr></thead><tbody>
<tr><td>a line or rod</td><td>λ (C/m)</td><td>length dx</td><td>λ dx</td></tr>
<tr><td>a thin ring of radius R</td><td>λ (C/m)</td><td>arc R dθ</td><td>λ R dθ</td></tr>
<tr><td>a flat disk</td><td>σ (C/m²)</td><td>thin ring: area 2πr dr</td><td>σ 2πr dr</td></tr>
<tr><td>a ball</td><td>ρ (C/m³)</td><td>thin shell: volume 4πr² dr</td><td>ρ 4πr² dr</td></tr>
</tbody></table></div>
        <h2>Symmetry saves work</h2>
        <ul>
          <li>For a ring, the sideways parts of the field cancel in pairs, so only the component along the axis survives: add cos θ times each d<i>E</i>.</li>
          <li>Pick slices that are all the same distance from the point (a ring for a point on its axis) and the integral has one distance in it.</li>
        </ul>''',
 dict(correct=2,explain='Every slice of a ring of charge is the same distance from the center of the ring, but they point in different directions. The field of one slice points away from it, and opposite slices cancel exactly, so the total is zero.',q='what is the electric field at the exact center of a uniformly charged ring?',opts=['kQ/R²','kQ/R','Zero','It can\'t be found']))
