from mk import *
import math
# ---------------- Current & resistance
lab_i=lab('cu-canvas','A section of wire with electrons drifting slowly while jiggling randomly. Controls for current, wire diameter, length and material.',
  seg('cu-mat','Material',[('cu','Copper'),('al','Aluminum'),('ni','Nichrome')]),
  controls(('cu-I','Current I (A)',.5,10,.5,5),('cu-D','Wire diameter (mm)',.5,4,.1,2),('cu-L','Wire length (m)',1,50,1,10)),
  readout(('cu-R','Resistance R = ρL/A','ef'),('cu-V','Voltage along the wire V = IR',''),('cu-P','Power lost as heat P = I²R','frc'),('cu-J','Current density J = I/A',''),('cu-vd','Electron drift speed v<sub>d</sub>','cur')),
  'Electrons are drawn jiggling at random (they really move at about 10⁶ m/s) plus a slow drift against the current. The drift is drawn about 10⁴ times faster than it really is, so that you can see it. Real copper drift speeds are fractions of a millimeter per second.')
cu_svg=svg(f'<rect x="30" y="85" width="200" height="60" style="fill:color-mix(in srgb,var(--cv) 10%,transparent);stroke:var(--cv);stroke-width:2"/>'+
  ''.join(f'<circle cx="{x}" cy="{y}" r="3.4" style="fill:var(--neg)"/>' for x,y in [(55,100),(85,128),(110,105),(140,125),(165,98),(195,120),(215,102)])+
  arr(120,160,220,160,'cur','I',2.6,(0,0))+arr(150,72,70,72,'neg','',2)+txt(80,60,'electrons drift this way','neg',11,'start')+txt(130,40,'copper wire, d = 2.0 mm','ink',12)+txt(130,200,'I = 5.0 A','cur',13)+ln(30,178,230,178,'mut',1.2)+txt(130,194,'L = 10 m','mut',11),
  'A copper wire carrying 5.0 A. Conventional current points one way; the electrons drift the opposite way.')
module('current','Current &amp; resistance',[('ap','AP C Unit 11'),('pu','AP 2: circuits')],
 'Current is the flow of charge, resistance is how hard it is to push, and Ohm\'s law ties them to voltage. Underneath, it is a crowd of electrons slowly drifting through a lattice of atoms that keeps bumping them: the bumps are the resistance, and the heat they make is the power.',
 ['Electric current is how much charge passes a point each second: I = dQ/dt, in amperes (1 A = 1 C/s). By convention we draw current in the direction positive charges would move, even though in metals it is really electrons moving the other way.',
  'Switch on a lamp and it lights instantly, yet the electrons in the wire barely creep: a typical <b>drift speed</b> is a fraction of a millimeter per second. The field that pushes them travels near the speed of light along the whole wire at once, like pushing a tube full of marbles: every marble moves the instant you push one end.',
  'Electrons don\'t accelerate forever. They keep colliding with the atoms of the metal, losing speed each time, so they reach a steady drift. A longer wire means more collisions to push through (R ∝ L); a wider wire means more paths in parallel (R ∝ 1/A). The energy lost in collisions heats the wire: P = I²R.'],
 [('<i class="cur">I</i> = d<i>Q</i>/d<i>t</i> = <i>nqv</i><sub>d</sub><i>A</i>','current and drift velocity'),('<i>R</i> = ρ<i>L</i>/<i>A</i>, &nbsp;Δ<i>V</i> = <i class="cur">I</i><i>R</i>','resistance of a wire; Ohm\'s law'),('<i>P</i> = <i class="cur">I</i>Δ<i>V</i> = <i class="cur">I</i>²<i>R</i> = Δ<i>V</i>²/<i>R</i>','electric power')],
 lab_i,
 [('Double the current. Then double the diameter.',[["click","#cu-mat [data-k=cu]"],["#cu-I",5],["#cu-D",2],["#cu-L",10],["#cu-I",10]],'Double I and the drift speed, voltage drop (IR) and current density double; power (I²R) quadruples. Now double the diameter: the area quadruples, so R drops to a quarter and the drift speed drops to a quarter.'),
  ('Switch from copper to nichrome (the heater-wire material).',[["click","#cu-mat [data-k=ni]"],["#cu-I",5],["#cu-D",2],["#cu-L",10]],'Nichrome\'s resistivity is about 65 times copper\'s. The same current makes 65 times the voltage drop and heat. That is why toaster elements are made of it.'),
  ('Double the length with a fixed current.',[["click","#cu-mat [data-k=cu]"],["#cu-I",5],["#cu-D",2],["#cu-L",20]],'Resistance doubles, so the voltage needed doubles and the heating doubles. The drift speed and current density are unchanged: they depend only on I and the cross-section.'),
  ('Make the wire very thin (0.5 mm) at 10 A.',[["click","#cu-mat [data-k=cu]"],["#cu-D",.5],["#cu-I",10],["#cu-L",10]],'Resistance is 16 times larger than for 2 mm wire; the heat is huge. This is why thin extension cords overheat.')],
 dict(prob='A copper wire of diameter 2.0 mm and length 10 m carries a current of 5.0 A. Copper has resistivity ρ = 1.68 × 10⁻⁸ Ω·m and 8.5 × 10²⁸ free electrons per m³. Find the current density, the drift speed, the resistance, the voltage drop and the power lost.',svg=cu_svg,cap='A copper wire carrying 5.0 A. Electrons drift opposite to the conventional current.',
  steps=[('Cross-sectional area.',m('<i>A</i> = π(1.0 × 10⁻³ m)² = 3.14 × 10⁻⁶ m²')+'. Careful: the diameter is 2.0 mm, so the radius is 1.0 mm.'),
   ('Current density.',m('<i>J</i> = <i class="cur">I</i>/<i>A</i> = 5.0/(3.14 × 10⁻⁶) = 1.6 × 10⁶ A/m²')+'.'),
   ('Drift speed.',m('<i>v</i><sub>d</sub> = <i>J</i>/(<i>ne</i>) = (1.6 × 10⁶)/((8.5 × 10²⁸)(1.6 × 10⁻¹⁹)) = 1.2 × 10⁻⁴ m/s = 0.12 mm/s')+'. Surprisingly slow.'),
   ('Resistance.',m('<i>R</i> = ρ<i>L</i>/<i>A</i> = (1.68 × 10⁻⁸)(10)/(3.14 × 10⁻⁶) = 0.054 Ω')+'.'),
   ('Voltage drop and power.',m('Δ<i>V</i> = <i class="cur">I</i><i>R</i> = (5.0)(0.054) = 0.27 V')+' and '+m('<i>P</i> = <i class="cur">I</i>²<i>R</i> = (5.0)²(0.054) = 1.3 W')+'.'),
   ('Check.','Power should also equal IΔV = 5.0 × 0.27 = 1.3 W ✓. A 10 m extension cord warming a little at 5 A is realistic.')]),
 ['Using the diameter instead of the radius in A = πr².','Thinking electrons travel through the wire at the speed of light. The field does; the electrons drift slowly.','Using R = V/I as if resistance depended on the voltage. For a given wire R is fixed by ρ, L and A (for an ohmic material).','Forgetting the direction: conventional current is opposite to electron flow.'],
 '''        <h2>The microscopic picture</h2>
        <ul>
          <li><b>Drift velocity:</b> in time <i>t</i> the charge crossing a wire's cross-section is the charge in a length <span class="m"><i>v</i><sub>d</sub><i>t</i></span> of wire: <span class="m"><i>Q</i> = (<i>n</i><i>A</i><i>v</i><sub>d</sub><i>t</i>)<i>q</i></span>. So <span class="m"><i class="cur">I</i> = <i>nqv</i><sub>d</sub><i>A</i></span>.</li>
          <li><b>Current density:</b> <span class="m"><i>J</i> = <i class="cur">I</i>/<i>A</i> = <i>nqv</i><sub>d</sub></span> (A/m²), and in an ohmic material <span class="m"><i>J</i> = σ<i class="ef">E</i> = <i class="ef">E</i>/ρ</span>: the field in the wire pushes the charges.</li>
          <li><b>Ohm's law</b> in its microscopic form is <span class="m"><i class="ef">E</i> = ρ<i>J</i></span>. Multiply by L and A to get <span class="m">Δ<i>V</i> = <i class="cur">I</i><i>R</i></span> with <span class="m"><i>R</i> = ρ<i>L</i>/<i>A</i></span>.</li>
        </ul>
        <h2>Resistance and power</h2>
        <ul>
          <li><b>Resistivity</b> ρ depends on the material and its temperature; for metals it rises as they heat up.</li>
          <li><b>Power:</b> <span class="m"><i>P</i> = <i class="cur">I</i>Δ<i>V</i></span> is the rate energy leaves the circuit element. Over a resistor that is heat: <span class="m"><i>I</i>²<i>R</i> = Δ<i>V</i>²/<i>R</i></span>.</li>
          <li><b>Non-ohmic parts</b> (diodes, bulb filaments) don't have a constant R: their I–V graph is not a straight line.</li>
        </ul>''',
 dict(correct=3,explain='R = ρL/A. Doubling the diameter makes the area four times as large, so the resistance drops to one quarter.',q='you replace a copper wire with another copper wire of the same length but twice the diameter. Its resistance is:',opts=['Twice as large','The same','Half as large','One quarter as large']))
# ---------------- Kirchhoff's rules
lab_k=lab('ck-canvas','A circuit with batteries and resistors. Wires are colored by electric potential and arrows show the current in each resistor.',
  seg('ck-mode','Circuit',[('ser','Series'),('par','Parallel'),('mix','Series and parallel'),('kir','Two batteries (Kirchhoff)')]),
  '''        <div class="controls">
          <div class="ctl"><label for="ck-E1"><span id="ck-E1-lbl">Battery ε</span> <output id="ck-E1-out"></output></label><input type="range" id="ck-E1" min="2" max="24" step="1" value="12"></div>
          <div class="ctl" id="ck-E2-ctl" hidden><label for="ck-E2"><span>Battery ε₂</span> <output id="ck-E2-out"></output></label><input type="range" id="ck-E2" min="-12" max="12" step="1" value="6"></div>
          <div class="ctl"><label for="ck-res1"><span>R₁ (Ω)</span> <output id="ck-res1-out"></output></label><input type="range" id="ck-res1" min="1" max="20" step="1" value="4"></div>
          <div class="ctl"><label for="ck-res2"><span>R₂ (Ω)</span> <output id="ck-res2-out"></output></label><input type="range" id="ck-res2" min="1" max="20" step="1" value="6"></div>
          <div class="ctl" id="ck-res3-ctl"><label for="ck-res3"><span>R₃ (Ω)</span> <output id="ck-res3-out"></output></label><input type="range" id="ck-res3" min="1" max="20" step="1" value="12"></div>
        </div>
''',
  readout(('ck-r1','Equivalent resistance','ef'),('ck-r2','Battery current','cur'),('ck-r3','Power from the battery','frc'),('ck-r4','Check: loop rule','')),
  'Red wires are at high potential, violet at low (ground = bottom wire = 0 V). Along a resistor the color shifts as the potential drops. Each arrow points the way positive current flows. A negative ε₂ flips that battery around.')
kv=svg(ln(40,50,220,50,'ink',2)+ln(40,170,220,170,'ink',2)+ln(40,50,40,70,'ink',2)+ln(40,150,40,170,'ink',2)+ln(130,50,130,85,'ink',2)+ln(130,135,130,170,'ink',2)+ln(220,50,220,70,'ink',2)+ln(220,150,220,170,'ink',2)+
  bat(40,110,'',True)+txt(15,114,'12 V','ink',11,'end')+f'<polyline points="130,85 124,92 136,98 124,104 136,110 124,116 136,122 130,128 130,135" style="fill:none;stroke:var(--ink);stroke-width:2"/>'+
  bat(220,110,'',True)+txt(245,114,'6 V','ink',11,'start')+
  txt(66,96,'R₁ = 4 Ω','mut',10)+txt(130,78,'R₃ = 6 Ω','mut',10)+txt(190,96,'R₂ = 2 Ω','mut',10)+arr(52,86,52,66,'cur','',1.8)+txt(36,80,'I₁','cur',12,'end')+arr(208,66,208,86,'cur','',1.8)+txt(232,80,'I₂','cur',12,'start')+arr(145,92,145,126,'cur','',1.8)+txt(158,110,'I₃','cur',12,'start')+txt(130,205,'junction at top, ground at bottom','mut',11),
  'Two batteries share a middle resistor. Current directions are guesses: a negative answer just means the opposite way.')
module('circuits',"Kirchhoff's rules",[('ap','AP C Unit 11'),('pu','AP 2: circuits')],
 'Two rules solve every DC circuit: charge doesn\'t pile up at a junction, and the voltage changes around any closed loop add to zero. Everything else (series, parallel, voltage dividers) is a shortcut built from them.',
 ['Think of a circuit as a hiking trail map. A battery lifts you up a hill (raises the potential). Each resistor is a downhill slope that uses up some of that height. Go all the way around any closed loop and you must end up at the same height you started: <b>the sum of the voltage changes around a loop is zero</b>.',
  'Charge is conserved, so at any junction the current flowing in equals the current flowing out. Water in a pipe: no matter how the pipe branches, what goes in comes out.',
  'In a series circuit there is a single path, so the same current flows through every resistor, and the voltages add. In parallel there are separate paths between the same two points, so each branch has the same voltage, and the currents add. For anything fancier (two batteries, a bridge), write the junction and loop equations and solve.'],
 [('Σ<i class="cur">I</i><sub>in</sub> = Σ<i class="cur">I</i><sub>out</sub>','junction rule'),('Σ Δ<i>V</i> = 0 around a loop','loop rule'),('<i>R</i><sub>s</sub> = Σ<i>R</i><sub>i</sub>, &nbsp;1/<i>R</i><sub>p</sub> = Σ 1/<i>R</i><sub>i</sub>','series; parallel')],
 lab_k,
 [('Compare series and parallel with the same three resistors.',[["click","#ck-mode [data-k=ser]"],["#ck-E1",12],["#ck-res1",4],["#ck-res2",6],["#ck-res3",12]],'Series: R = 22 Ω, a single 0.55 A everywhere, and the biggest resistor takes the biggest voltage. Switch to parallel: the equivalent resistance falls to 2 Ω (less than the smallest), each resistor gets the full 12 V, and the battery supplies 6 A.'),
  ('In parallel, make R₁ tiny (1 Ω) and R₃ large (20 Ω).',[["click","#ck-mode [data-k=par]"],["#ck-E1",12],["#ck-res1",1],["#ck-res2",6],["#ck-res3",20]],'The small resistor draws most of the current. Adding another parallel path always lowers the total resistance.'),
  ('Open the two-battery circuit. Make ε₂ negative.',[["click","#ck-mode [data-k=kir]"],["#ck-E1",12],["#ck-E2",-6],["#ck-res1",4],["#ck-res2",2],["#ck-res3",6]],'The second battery now opposes the first. The current through it reverses direction: the arrow flips. A battery can be charged by another one.'),
  ('In the two-battery circuit, set ε₂ = 12 V with the same ε₁.',[["click","#ck-mode [data-k=kir]"],["#ck-E1",12],["#ck-E2",12],["#ck-res1",4],["#ck-res2",4],["#ck-res3",6]],'Perfectly symmetric: each battery supplies the same current, and I₃ = I₁ + I₂ by the junction rule.')],
 dict(prob='In the circuit shown, ε₁ = 12 V, ε₂ = 6 V, R₁ = 4 Ω, R₂ = 2 Ω and R₃ = 6 Ω. Find the current in each branch and say which way it flows.',svg=kv,cap='Two batteries and three resistors. Current directions are guesses: I₁ and I₂ up through the batteries, I₃ down through R₃.',
  steps=[('Label unknowns and guess directions.','Let I₁ and I₂ flow up through the batteries and I₃ down through R₃. If a result comes out negative, the real current goes the other way.'),
   ('Junction rule (top node).',m('<i class="cur">I</i><sub>1</sub> + <i class="cur">I</i><sub>2</sub> = <i class="cur">I</i><sub>3</sub>')+'.'),
   ('Loop rule, left loop (up through ε₁, down through R₃).',m('12 − 4<i class="cur">I</i><sub>1</sub> − 6<i class="cur">I</i><sub>3</sub> = 0')+'. Going with the guessed current through a resistor is a drop (−IR).'),
   ('Loop rule, right loop.',m('6 − 2<i class="cur">I</i><sub>2</sub> − 6<i class="cur">I</i><sub>3</sub> = 0')+'.'),
   ('Solve.','From the loops, '+m('<i class="cur">I</i><sub>1</sub> = 3 − 1.5<i class="cur">I</i><sub>3</sub>')+' and '+m('<i class="cur">I</i><sub>2</sub> = 3 − 3<i class="cur">I</i><sub>3</sub>')+'. Put these in the junction rule: '+m('6 − 4.5<i class="cur">I</i><sub>3</sub> = <i class="cur">I</i><sub>3</sub>')+', so '+m('<i class="cur">I</i><sub>3</sub> = 1.09 A')+', '+m('<i class="cur">I</i><sub>1</sub> = 1.36 A')+', '+m('<i class="cur">I</i><sub>2</sub> = −0.27 A')+'.'),
   ('Interpret.','I₂ is negative: the 6 V battery is being pushed backward, with 0.27 A flowing <em>down</em> through it. The stronger battery is charging it.'),
   ('Check with the top-node voltage.',m('<i>V</i><sub>top</sub> = <i class="cur">I</i><sub>3</sub>(6) = 6.55 V')+'. Then '+m('<i class="cur">I</i><sub>1</sub> = (12 − 6.55)/4 = 1.36 A')+' ✓ and '+m('<i class="cur">I</i><sub>2</sub> = (6 − 6.55)/2 = −0.27 A')+' ✓.')]),
 ['Mixing up the sign: going through a resistor <em>with</em> the current is a drop; going through a battery from − to + is a rise.','Adding currents in series or voltages in parallel. Series: same current. Parallel: same voltage.','Using the battery voltage for each resistor in a series chain. The voltage is shared.','Forgetting that real batteries have internal resistance (not included here).'],
 '''        <h2>The two rules</h2>
        <ul>
          <li><b>Junction rule</b> (conservation of charge): at any node, the currents entering add to the currents leaving.</li>
          <li><b>Loop rule</b> (conservation of energy): going around any closed loop, the potential changes add to zero.</li>
          <li><b>Sign conventions:</b> crossing a battery from − to + is +ε; crossing a resistor in the direction of the current is −IR; against the current it is +IR.</li>
          <li><b>Strategy:</b> pick directions for every branch current; write one junction equation per independent node and one loop equation per independent loop until you have as many equations as unknowns.</li>
        </ul>
        <h2>Series and parallel shortcuts</h2>
        <ul>
          <li><b>Series:</b> <span class="m"><i>R</i><sub>eq</sub> = <i>R</i><sub>1</sub> + <i>R</i><sub>2</sub> + …</span>, same current, voltages add.</li>
          <li><b>Parallel:</b> <span class="m">1/<i>R</i><sub>eq</sub> = 1/<i>R</i><sub>1</sub> + 1/<i>R</i><sub>2</sub> + …</span>, same voltage, currents add. For two: <span class="m"><i>R</i><sub>eq</sub> = <i>R</i><sub>1</sub><i>R</i><sub>2</sub>/(<i>R</i><sub>1</sub> + <i>R</i><sub>2</sub>)</span>.</li>
          <li><b>Voltage divider:</b> two resistors in series across ε: <span class="m"><i>V</i><sub>2</sub> = ε<i>R</i><sub>2</sub>/(<i>R</i><sub>1</sub> + <i>R</i><sub>2</sub>)</span>.</li>
          <li><b>Meters:</b> an ideal ammeter has zero resistance and goes in series; an ideal voltmeter has infinite resistance and goes in parallel.</li>
        </ul>
        <h2>Real batteries</h2>
        <ul>
          <li>A real battery behaves like an ideal EMF ε in series with a small <b>internal resistance</b> <i>r</i>. Delivering current <i>I</i>, its terminal voltage is <span class="m">Δ<i>V</i><sub>terminal</sub> = ε − <i class="cur">I</i><i>r</i></span>.</li>
          <li>With no current (open circuit) the terminal voltage equals ε. The more current you draw, the lower it gets. A short circuit draws <span class="m"><i class="cur">I</i> = ε/<i>r</i></span>.</li>
          <li>To solve, treat <i>r</i> as one more resistor in series with the battery, and apply the same loop and junction rules.</li>
        </ul>
''',
 dict(correct=0,explain='Parallel resistors give the current more paths, so the total resistance is always smaller than the smallest one. Here 1/R = 1/6 + 1/12 = 1/4, so R = 4 Ω.',q='a 6 Ω and a 12 Ω resistor are connected in parallel. Their equivalent resistance is:',opts=['4 Ω','9 Ω','18 Ω','Between 6 Ω and 12 Ω, depending on the voltage']))
# ---------------- RC circuits
lab_r=lab('rc-canvas','An RC circuit with a switch, and graphs of the capacitor voltage and the current over time.',
  '<div class="row"><button type="button" class="btn primary" id="rc-chg">Charge</button><button type="button" class="btn" id="rc-dis">Discharge</button><button type="button" class="btn" id="rc-rst">Empty it</button></div>'+seg('rc-sp','Speed',[('1','1×'),('4','4×'),('16','16×')],False).replace('data-k="1"','data-k="1" aria-pressed="true"'),
  controls(('rc-R','Resistance R (kΩ)',1,20,1,10),('rc-C','Capacitance C (μF)',20,500,10,100),('rc-E','Battery ε (V)',3,24,1,12)),
  readout(('rc-v','Capacitor voltage V<sub>C</sub>','ef'),('rc-i','Current I','cur'),('rc-q','Charge Q',''),('rc-u','Stored energy U','frc'),('rc-t','Time constant τ | elapsed time','')),
  'Press Charge to connect the battery, Discharge to disconnect it and let the capacitor drain through R. Switch at any time: the capacitor keeps whatever voltage it has. The faster 4× and 16× settings just speed up the clock.')
rcs=svg(ln(40,60,200,60,'ink',2)+ln(40,170,200,170,'ink',2)+ln(40,60,40,100,'ink',2)+ln(40,130,40,170,'ink',2)+bat(40,115,'',True)+txt(26,119,'12 V','ink',11,'end')+res(80,60,160,'20 kΩ')+ln(200,60,200,100,'ink',2)+ln(200,130,200,170,'ink',2)+
  ln(188,105,212,105,'ink',2.5)+ln(188,125,212,125,'ink',2.5)+txt(224,119,'50 μF','ink',11,'start')+arr(100,48,150,48,'cur','I',2.2,(0,0))+txt(130,210,'τ = RC = 1.0 s','mut',12),
  'A 12 V battery charges a 50 μF capacitor through a 20 kΩ resistor.')
module('rc','RC circuits',[('ap','AP C Unit 11'),('pu','AP 2: circuits')],
 'Put a resistor in front of a capacitor and it can no longer fill instantly. It fills fast at first and then slows as the capacitor pushes back, following the exponential curve you have already met, with time constant τ = RC.',
 ['An empty capacitor looks like a plain wire at the moment the switch closes: all the battery voltage appears across the resistor, so the current starts at its maximum, ε/R. As charge builds up, the capacitor\'s own voltage opposes the battery, the voltage across the resistor shrinks, and the current dies away. When the capacitor reaches ε, the current is zero: a full capacitor acts like a broken wire.',
  'Discharging is the mirror image. Connect the charged capacitor to just the resistor, and it drives a current that starts large and decays as the voltage falls. The charge, voltage and current all decay as e<sup>−t/RC</sup>.',
  'A good mental habit: <b>t = 0: capacitor = wire. t → ∞: capacitor = open switch.</b> Then everything in between follows the exponential, with τ = RC controlling how fast.'],
 [('<i>Q</i>(<i>t</i>) = <i>C</i>ε(1 − <i>e</i><sup>−<i>t</i>/<i>RC</i></sup>)','charging'),('<i class="cur">I</i>(<i>t</i>) = (ε/<i>R</i>)<i>e</i><sup>−<i>t</i>/<i>RC</i></sup>','current while charging'),('<i>Q</i>(<i>t</i>) = <i>Q</i><sub>0</sub><i>e</i><sup>−<i>t</i>/<i>RC</i></sup>','discharging')],
 lab_r,
 [('Press Charge and watch until the capacitor is nearly full.',[["#rc-R",10],["#rc-C",100],["#rc-E",12]],'The capacitor voltage rises quickly, then flattens toward 12 V. The current is largest at the start and fades to zero. At t = τ = 1.0 s the voltage is 63% of ε.'),
  ('Double the resistance (R = 20 kΩ) and charge again.',[["#rc-R",20],["#rc-C",100],["#rc-E",12]],'The time constant doubles, so everything takes twice as long. The final voltage is still ε, and the starting current is half as big (ε/R).'),
  ('Charge fully, then press Discharge.',[["#rc-R",10],["#rc-C",100],["#rc-E",12]],'Now the voltage and the current decay together, and the current runs the other way round the loop (the dots reverse).'),
  ('Increase C to 500 μF.',[["#rc-R",10],["#rc-C",500],["#rc-E",12]],'A big capacitor holds more charge at the same voltage, so it takes longer to fill: τ = 5 s. Stored energy at the end is ½Cε² = 36 mJ, five times larger.')],
 dict(prob='A 12 V battery charges an initially empty 50 μF capacitor through a 20 kΩ resistor. (a) What is the time constant? (b) Find the capacitor voltage and the current at t = 2.0 s. (c) How much energy does the capacitor store when full, and how much heat does the resistor make during charging?',svg=rcs,cap='A 12 V battery charging a 50 μF capacitor through a 20 kΩ resistor.',
  steps=[('Time constant.',m('τ = <i>RC</i> = (20 × 10³ Ω)(50 × 10⁻⁶ F) = 1.0 s')+'.'),
   ('Voltage at t = 2.0 s.',m('<i>V</i><sub>C</sub> = ε(1 − <i>e</i><sup>−<i>t</i>/τ</sup>) = 12(1 − <i>e</i>⁻²) = 12(0.865) = 10.4 V')+'.'),
   ('Current at t = 2.0 s.',m('<i class="cur">I</i> = (ε/<i>R</i>)<i>e</i><sup>−<i>t</i>/τ</sup> = (0.60 mA)(0.135) = 81 μA')+'. (Check: <span class="m">(ε − <i>V</i><sub>C</sub>)/<i>R</i> = 1.6 V/20 kΩ = 80 μA</span> ✓.)'),
   ('Energy stored when full.',m('<i>U</i> = ½<i>C</i>ε² = ½(50 × 10⁻⁶)(12)² = 3.6 mJ')+'.'),
   ('Heat in the resistor.','The battery supplies '+m('<i>Q</i>ε = (<i>C</i>ε)ε = 7.2 mJ')+'. Half is stored; the other half, 3.6 mJ, becomes heat, <em>whatever the value of R</em>.')]),
 ['Using t = RC to mean "fully charged". After one time constant it is only 63% charged.','Believing the initial current is zero: for an uncharged capacitor it is the maximum, ε/R.','Forgetting that the resistor value does not affect the final charge or the total heat, only the time.','Mixing up charge and discharge formulas (1 − e^(−t/τ) vs e^(−t/τ)).'],
 '''        <h2>Charging</h2>
        <ul>
          <li>Loop rule: <span class="m">ε − <i class="cur">I</i><i>R</i> − <i>q</i>/<i>C</i> = 0</span> with <span class="m"><i class="cur">I</i> = d<i>q</i>/d<i>t</i></span>. Rearranged: <span class="m">d<i>q</i>/d<i>t</i> = (ε − <i>q</i>/<i>C</i>)/<i>R</i></span>.</li>
          <li>This is the same equation as terminal speed with drag, so the solution is <span class="m"><i>q</i> = <i>C</i>ε(1 − <i>e</i><sup>−<i>t</i>/<i>RC</i></sup>)</span>.</li>
          <li>The voltage across the resistor is <span class="m"><i>V</i><sub>R</sub> = ε<i>e</i><sup>−<i>t</i>/<i>RC</i></sup></span>; the two voltages always add to ε.</li>
        </ul>
        <h2>Discharging</h2>
        <ul>
          <li>Loop rule: <span class="m"><i>q</i>/<i>C</i> + <i>R</i> d<i>q</i>/d<i>t</i> = 0</span> (current flows out of the capacitor), so <span class="m"><i>q</i> = <i>Q</i><sub>0</sub><i>e</i><sup>−<i>t</i>/<i>RC</i></sup></span>.</li>
          <li>Energy that was stored all ends up as heat in R: <span class="m">∫<i class="cur">I</i>²<i>R</i> d<i>t</i> = <i>Q</i><sub>0</sub>²/(2<i>C</i>)</span>.</li>
        </ul>
        <h2>Energy bookkeeping while charging</h2>
        <ul>
          <li>Battery supplies <span class="m"><i>C</i>ε²</span>; the capacitor stores <span class="m">½<i>C</i>ε²</span>; the resistor dissipates the other <span class="m">½<i>C</i>ε²</span>.</li>
        </ul>
        <h2>When there is more than one resistor</h2>
        <ul>
          <li>Ask what resistance the capacitor "sees": replace the capacitor with a test source and combine the resistors that are connected across it. That equivalent <span class="m"><i>R</i><sub>eq</sub></span> sets <span class="m">τ = <i>R</i><sub>eq</sub><i>C</i></span>.</li>
          <li>Use the two limits to find the end points: at <i>t</i> = 0 an uncharged capacitor is a wire (or keeps whatever voltage it had); at <i>t</i> → ∞ the capacitor is an open switch and no current flows through its branch.</li>
          <li>General recipe: <span class="m"><i>V</i>(<i>t</i>) = <i>V</i><sub>∞</sub> + (<i>V</i><sub>0</sub> − <i>V</i><sub>∞</sub>)<i>e</i><sup>−<i>t</i>/τ</sup></span>, where V₀ is the starting voltage and V∞ the final one.</li>
        </ul>
''',
 dict(correct=1,explain='At t = 0 the capacitor is empty, so it has no voltage across it. The loop rule then puts the whole battery voltage across the resistor, giving I = ε/R, the largest the current ever gets.',q='an uncharged capacitor in series with a resistor is connected to a battery at t = 0. At that moment the current is:',opts=['Zero','ε/R','ε/(RC)','Infinite']))
