"""Step-by-step diagrams for the worked examples. Each entry: (base svg body, [(step, svg fragment, note, class)]).
A layer appears when its step (1-based) of the worked example is revealed; its note chip appears below the figure.
Classes: f force/orange, e electric/blue, b magnetic/pink, v current/green, i ink."""
from mk import *
import math
LAY={}
def curve_pts(f,x0,x1,y0,y1,xr,yr,n=40):
    return ' '.join(f'{x0+(x1-x0)*t/xr:.1f},{y0-(y0-y1)*f(t)/yr:.1f}' for t in [xr*k/n for k in range(n+1)])
# ---- Coulomb
LAY['coulomb']=(
  ln(20,150,240,150,'mut',1.5,'4 4')+ch(40,150,'+')+ch(130,150,'−')+ch(220,150,'+')+
  txt(40,186,'+2.0 μC','pos',12)+txt(130,186,'−3.0 μC','neg',12)+txt(220,186,'+4.0 μC','pos',12)+
  txt(85,215,'0.20 m','mut',12)+txt(175,215,'0.20 m','mut',12)+txt(130,40,'Forces on the middle charge','ink',13)+txt(130,58,'(drawn above it for clarity)','mut',11),
  [(1,arr(130,118,92,118,'frc','F₁',2.6,(-4,0))+arr(130,98,200,98,'frc','F₃',2.6,(4,0)),'both outer charges attract the −3.0 μC charge','f'),
   (2,txt(111,106,'1.35 N','frc',11),'F₁ = 1.35 N, pointing −x','f'),
   (3,txt(165,88,'2.70 N','frc',11),'F₃ = 2.70 N, pointing +x','f'),
   (4,arr(130,72,165,72,'ink','F_net',3.4,(0,-6)),'F_net = +2.70 − 1.35 = +1.35 N','f'),
   (5,'','✓ the bigger charge wins','i')])
# ---- Charge slices
LAY['slices']=(
  ln(110,150,230,150,'cur',9)+ln(110,150,230,150,'bf',3)+txt(170,134,'λ = bx','ink',13)+dotp(40,150,'P','ink',0,-12)+
  ln(40,196,110,196,'mut',1.2)+txt(75,212,'a','mut',12)+ln(110,196,230,196,'mut',1.2)+txt(170,212,'L','mut',12),
  [(1,ln(150,142,150,158,'mut',1.5)+ln(160,142,160,158,'mut',1.5)+txt(155,176,'dx','mut',12)+txt(155,120,'slice at x','mut',11),'dq = λ dx = bx dx','i'),
   (2,'','Q = bL²/2 = 0.40 μC','i'),
   (3,arr(40,170,12,170,'ef','dE',2.6),'each slice: dE = k dq/(a+x)², all pointing left','e'),
   (4,'','E = kb[ln((a+L)/a) + a/(a+L) − 1]','e'),
   (5,arr(40,188,0,188,'ef','',4)+txt(24,206,'E','ef',13),'E = 3.6 × 10⁴ N/C, pointing −x','e'),
   (6,'','✓ bigger than a point charge at the center','i')])
# ---- Exponential change
def _X(t): return 36+200*t/2.5
def _Y(v): return 190-138*v/12
f_=lambda t:12*(1-math.exp(-t/0.5))
LAY['expo']=(
  ln(36,190,240,190,'mut',1.5)+ln(36,190,36,36,'mut',1.5)+ln(36,52,240,52,'mut',1,'4 4')+txt(30,56,'12','mut',11,'end')+
  f'<polyline points="{curve_pts(f_,36,236,190,52,2.5,12)}" style="fill:none;stroke:var(--cx);stroke-width:2.8"/>'+txt(138,214,'t (s)','mut',12)+txt(14,46,'V','mut',12),
  [(1,'','starts at 0, rises fast, never passes 12 V','e'),
   (2,ln(_X(.75),190,_X(.75),_Y(f_(.75)),'frc',1.5,'4 3')+ln(36,_Y(f_(.75)),_X(.75),_Y(f_(.75)),'frc',1.5,'4 3')+dotp(_X(.75),_Y(f_(.75)),'','frc')+txt(150,162,'9.3 V at 0.75 s','frc',12,'start'),'t/τ = 1.5, V = 9.3 V','f'),
   (3,ln(36,_Y(10),240,_Y(10),'cv',1.5,'3 3')+txt(238,_Y(10)-6,'10 V','cv',11,'end'),'target: 10 V, so e^(−t/τ) = 1/6','v'),
   (4,ln(_X(.896),_Y(10),_X(.896),190,'cv',1.5,'3 3')+dotp(_X(.896),_Y(10),'','cv')+txt(_X(.896),206,'0.90 s','cv',12),'t = τ ln 6 = 0.90 s','v'),
   (5,'','✓ 10 V is 83% of 12 V, just under 2τ','i')])
# ---- Rods, rings, disks
LAY['continuous']=(
  ln(40,115,248,115,'mut',1.5,'4 4')+ln(70,60,70,170,'ink',3)+ch(70,60,'+',9)+ch(70,170,'+',9)+dotp(210,115,'P','ink',0,-12)+
  txt(78,115,'R','mut',12,'start')+txt(140,134,'z','mut',12),
  [(1,ln(70,60,210,115,'mut',1.2,'3 3')+ln(70,170,210,115,'mut',1.2,'3 3')+arr(210,115,168,98,'frc','',1.8)+arr(210,115,168,132,'frc','',1.8)+txt(150,88,'dE','frc',12)+txt(150,150,'dE','frc',12),'two opposite slices: sideways parts cancel','f'),
   (2,arr(210,115,250,115,'ef','',2.8),'only the axial parts add: E = kQz/(z²+R²)^(3/2)','e'),
   (3,txt(236,100,'E','ef',13),'E = 9.6 × 10² N/C','e'),
   (4,txt(135,206,'point charge would give 1.35 × 10³ N/C','mut',11),'ring is 28% weaker than a point charge','i'),
   (5,'','✓ z ≫ R gives kQ/z²; z = 0 gives 0','i')])
# ---- Gauss
LAY['gauss']=(
  f'<circle cx="130" cy="115" r="60" style="fill:color-mix(in srgb,var(--pos) 18%,transparent);stroke:var(--pos);stroke-width:2"/>'+txt(130,120,'+Q','pos',16)+ln(130,115,130+60*.866,115+60*.5,'mut',1.2)+txt(176,146,'R','mut',12),
  [(1,f'<circle cx="130" cy="115" r="30" style="fill:none;stroke:var(--ink);stroke-width:1.8;stroke-dasharray:5 4"/><circle cx="130" cy="115" r="95" style="fill:none;stroke:var(--ink);stroke-width:1.8;stroke-dasharray:5 4"/>'+txt(96,82,'r < R','ink',11,'end')+txt(195,60,'r > R','ink',11,'start'),'spherical Gaussian surfaces: Φ = E(4πr²)','i'),
   (2,f'<circle cx="130" cy="115" r="30" style="fill:color-mix(in srgb,var(--pos) 28%,transparent);stroke:none"/>','q_enc = Q(r/R)³ = 1.73 nC','i'),
   (3,arr(130+30*.707,115-30*.707,130+30*.707+22,115-30*.707-22,'ef','',2.2),'inside: E = kQr/R³ = 1.7 × 10⁴ N/C','e'),
   (4,arr(130+95*.707,115+95*.707,130+95*.707+18,115+95*.707+18,'ef','',2.2),'outside: E = kQ/r² = 7.2 × 10³ N/C','e'),
   (5,f'<circle cx="130" cy="115" r="60" style="fill:none;stroke:var(--hot);stroke-width:2.5"/>','✓ both give 2.9 × 10⁴ N/C at r = R','i')])
# ---- Electric potential
LAY['potential']=(
  ch(50,130,'+')+ch(210,130,'−')+ln(50,130,210,130,'mut',1.2,'4 4')+dotp(100,130,'P','ink',0,-12)+txt(50,160,'+4.0 nC','pos',12)+txt(210,160,'−2.0 nC','neg',12)+
  txt(75,150,'0.10 m','mut',11)+txt(155,150,'0.20 m','mut',11)+txt(130,50,'Potential is a scalar','mut',12),
  [(1,txt(130,196,'V = V₁ + V₂  (add numbers, not arrows)','ink',11),'no components: just add with signs','i'),
   (2,txt(75,96,'V₁ = +360 V','pos',11)+txt(155,96,'V₂ = −90 V','neg',11),'kq/r for each: +360 V and −90 V','i'),
   (3,f'<circle cx="100" cy="130" r="14" style="fill:none;stroke:var(--ink);stroke-width:2"/>'+txt(100,176,'V_P = +270 V','ink',14),'V_P = 360 − 90 = +270 V','i'),
   (4,txt(130,214,'W = qΔV = 2.7 × 10⁻⁷ J','frc',12),'work to bring +1.0 nC from infinity: 2.7 × 10⁻⁷ J','f'),
   (5,'','✓ the near +4 nC charge dominates','i')])
# ---- Energy of charges
LAY['penergy']=(
  f'<rect x="40" y="55" width="8" height="120" style="fill:var(--pos)"/><rect x="212" y="55" width="8" height="120" style="fill:var(--neg)"/>'+txt(44,48,'+','pos',16)+txt(216,48,'−','neg',16)+ch(70,115,'+',11)+
  arr(88,80,185,80,'ef','',2)+arr(88,150,185,150,'ef','',2)+txt(130,68,'E','ef',13)+txt(130,176,'ΔV = 500 V','ink',13)+txt(70,138,'p','ink',12),
  [(1,txt(130,208,'ΔK + ΔU = 0: skip the field','mut',11),'energy method: only the voltage matters','i'),
   (2,ch(190,115,'+',11)+txt(190,138,'K = 500 eV','cv',11),'K = qΔV = 8.0 × 10⁻¹⁷ J = 500 eV','v'),
   (3,arr(190,100,222,100,'cur','v',2.4,(0,-8)),'v = 3.1 × 10⁵ m/s for the proton','v'),
   (4,txt(130,226,'electron: 1.3 × 10⁷ m/s, same energy','mut',11),'electron: 1.3 × 10⁷ m/s (43× faster)','v'),
   (5,'','✓ speed ratio = √(m_p/m_e) = 43','i')])
# ---- Conductors
def _chs(r,sgn,n=8,off=0): return ''.join(ch(130+r*math.cos(a*math.pi/4+off),115+r*math.sin(a*math.pi/4+off),sgn,5) for a in range(n))
LAY['conductors']=(
  f'<circle cx="130" cy="115" r="82" style="fill:var(--sunk);stroke:var(--ink);stroke-width:2"/><circle cx="130" cy="115" r="46" style="fill:var(--surface);stroke:var(--ink);stroke-width:2"/>'+ch(130,115,'+',11)+txt(130,98,'+3 nC','pos',11)+
  txt(130,222,'cavity 4 cm · metal 4–6 cm · outside','mut',11),
  [(1,_chs(46,'−'),'inner wall: −3.0 nC (cancels the point charge)','e'),
   (2,_chs(82,'+',off=.39),'outer surface: +3.0 nC (the shell was neutral)','e'),
   (3,arr(130+20,115,130+40,115,'ef','',1.6)+txt(163,110,'E','ef',11),'r = 2 cm: E = 6.7 × 10⁴ N/C','e'),
   (4,txt(130,152,'E = 0','ink',12)+f'<circle cx="130" cy="115" r="64" style="fill:none;stroke:var(--ink);stroke-width:1.5;stroke-dasharray:4 4"/>','r = 5 cm (in the metal): E = 0','i'),
   (5,arr(130+88,115,130+125,115,'ef','',2.4)+txt(220,104,'E','ef',12),'r = 8 cm: E = 4.2 × 10³ N/C','e'),
   (6,'','✓ σ/ε₀ at the outer surface equals kq/R²','i')])
# ---- Capacitors
LAY['capacitors']=(
  ln(40,90,220,90,'ink',4)+ln(40,140,220,140,'ink',4)+ln(232,90,232,140,'mut',1.2)+txt(246,120,'d','mut',12)+txt(130,28,'A = 100 cm², d = 2.0 mm','ink',12)+
  ln(20,90,40,90,'ink',1.5)+ln(20,140,40,140,'ink',1.5)+ln(20,90,20,104,'ink',1.5)+ln(20,126,20,140,'ink',1.5)+bat(20,115,'',True)+txt(130,200,'ε = 12 V','mut',12),
  [(1,'','C = ε₀A/d = 44 pF','e'),
   (2,txt(130,78,'+Q','pos',13)+txt(130,162,'−Q','neg',13)+arr(130,95,130,135,'ef','',2.4)+txt(147,120,'E','ef',13,'start'),'Q = 0.53 nC, E = 6.0 × 10³ V/m, U = 3.2 nJ','e'),
   (3,txt(20,76,'✕','bad',16)+txt(20,166,'✕','bad',16)+txt(130,214,'battery disconnected: Q is stuck','bad',11),'disconnected: Q = 0.53 nC stays fixed','i'),
   (4,ln(40,190,220,190,'mut',3,'6 4')+ln(236,140,236,190,'mut',1.2)+txt(252,168,"d′",'mut',12),'d′ = 4.0 mm → C′ = 22 pF, ΔV′ = 24 V','e'),
   (5,'','W = ΔU = 6.4 − 3.2 = 3.2 nJ (work you did)','f'),
   (6,'','✓ E is unchanged: it only depends on Q/A','i')])
# ---- Dielectrics
LAY['dielectrics']=(
  ln(30,60,230,60,'ink',4)+ln(30,170,230,170,'ink',4)+txt(130,48,'+Q','pos',13)+txt(130,186,'−Q','neg',13),
  [(1,'','Q = 20 nC, and it stays (isolated)','i'),
   (2,f'<rect x="60" y="68" width="140" height="94" style="fill:color-mix(in srgb,var(--cx) 14%,transparent);stroke:var(--cx);stroke-width:1.5"/>'+''.join(f'<circle cx="{x}" cy="75" r="3.2" style="fill:var(--neg)"/><circle cx="{x}" cy="155" r="3.2" style="fill:var(--pos)"/>' for x in range(72,196,16))+txt(130,118,'κ = 4','cx',14),'C = κC₀ = 400 pF, so ΔV = 50 V','e'),
   (3,arr(130,84,130,104,'ef','',1.6)+arr(130,128,130,148,'ef','',1.6)+txt(130,206,'E → E₀/κ inside','mut',12),'energy: 2.0 μJ → 0.50 μJ','e'),
   (4,txt(130,226,'bound charge on the faces','mut',11),'1.5 μJ pulled the slab in','f'),
   (5,'','battery on: Q = 80 nC, U = 8.0 μJ','e')])
# ---- Current
LAY['current']=(
  f'<rect x="30" y="85" width="200" height="60" style="fill:color-mix(in srgb,var(--cv) 10%,transparent);stroke:var(--cv);stroke-width:2"/>'+
  ''.join(f'<circle cx="{x}" cy="{y}" r="3.4" style="fill:var(--neg)"/>' for x,y in [(55,100),(85,128),(110,105),(140,125),(165,98),(195,120),(215,102)])+
  arr(120,160,220,160,'cur','I',2.6)+txt(130,40,'copper wire, d = 2.0 mm','ink',12)+txt(130,212,'I = 5.0 A','cur',13)+ln(30,178,230,178,'mut',1.2)+txt(130,194,'L = 10 m','mut',11),
  [(1,ln(130,78,130,152,'mut',1.5,'4 3')+txt(130,72,'A','mut',12),'A = π(1.0 mm)² = 3.14 × 10⁻⁶ m²','i'),
   (2,arr(36,115,70,115,'cur','',2)+txt(52,108,'J','cur',12),'J = I/A = 1.6 × 10⁶ A/m²','v'),
   (3,arr(150,72,70,72,'neg','',2)+txt(80,60,'electrons drift this way','neg',11,'start'),'v_d = J/ne = 0.12 mm/s (slow!)','v'),
   (4,txt(190,130,'R','ink',14),'R = ρL/A = 0.054 Ω','i'),
   (5,txt(130,229,'ΔV = IR = 0.27 V,  P = I²R = 1.3 W','frc',11),'ΔV = 0.27 V and P = 1.3 W','f'),
   (6,'','✓ P = IΔV agrees','i')])
# ---- Kirchhoff
LAY['circuits']=(
  ln(40,50,220,50,'ink',2)+ln(40,170,220,170,'ink',2)+ln(40,50,40,70,'ink',2)+ln(40,150,40,170,'ink',2)+ln(130,50,130,85,'ink',2)+ln(130,135,130,170,'ink',2)+ln(220,50,220,70,'ink',2)+ln(220,150,220,170,'ink',2)+
  bat(40,110,'',True)+txt(54,128,'12 V','ink',11,'start')+f'<polyline points="130,85 124,92 136,98 124,104 136,110 124,116 136,122 130,128 130,135" style="fill:none;stroke:var(--ink);stroke-width:2"/>'+
  bat(220,110,'',True)+txt(208,128,'6 V','ink',11,'end')+txt(66,96,'R₁ = 4 Ω','mut',10)+txt(130,78,'R₃ = 6 Ω','mut',10)+txt(190,96,'R₂ = 2 Ω','mut',10)+txt(130,205,'junction at top, ground at bottom','mut',11),
  [(1,arr(52,86,52,66,'cur','',1.8)+txt(36,80,'I₁','cur',12,'end')+arr(208,66,208,86,'cur','',1.8)+txt(232,80,'I₂','cur',12,'start')+arr(145,92,145,126,'cur','',1.8)+txt(158,110,'I₃','cur',12,'start'),'guess directions: I₁, I₂ up; I₃ down','v'),
   (2,dotp(130,50,'','ink'),'junction: I₁ + I₂ = I₃','v'),
   (3,f'<path d="M 52 60 L 52 160 L 130 160 L 130 60 Z" style="fill:none;stroke:var(--hot);stroke-width:1.6;stroke-dasharray:4 3"/>','left loop: 12 − 4I₁ − 6I₃ = 0','f'),
   (4,f'<path d="M 140 60 L 140 160 L 208 160 L 208 60 Z" style="fill:none;stroke:var(--ca);stroke-width:1.6;stroke-dasharray:4 3"/>','right loop: 6 − 2I₂ − 6I₃ = 0','b'),
   (5,txt(130,222,'I₃ = 1.09 A   I₁ = 1.36 A   I₂ = −0.27 A','ink',11),'I₃ = 1.09 A, I₁ = 1.36 A, I₂ = −0.27 A','v'),
   (6,arr(208,86,208,66,'bad','',1.8),'I₂ < 0: the 6 V battery is being charged','f'),
   (7,'','✓ V_top = 6.55 V fits all three branches','i')])
# ---- RC
LAY['rc']=(
  ln(40,60,200,60,'ink',2)+ln(40,170,200,170,'ink',2)+ln(40,60,40,100,'ink',2)+ln(40,130,40,170,'ink',2)+bat(40,115,'',True)+txt(26,119,'12 V','ink',11,'end')+res(80,60,160,'20 kΩ')+ln(200,60,200,100,'ink',2)+ln(200,130,200,170,'ink',2)+
  ln(188,105,212,105,'ink',2.5)+ln(188,125,212,125,'ink',2.5)+txt(224,119,'50 μF','ink',11,'start'),
  [(1,txt(130,210,'τ = RC = 1.0 s','mut',12),'τ = (20 kΩ)(50 μF) = 1.0 s','i'),
   (2,txt(184,140,'V_C = 10.4 V','cx',10,'end'),'V_C = 12(1 − e⁻²) = 10.4 V at t = 2 s','e'),
   (3,arr(100,48,150,48,'cur','I',2.2)+txt(125,36,'81 μA','cur',11),'I = (ε/R)e⁻² = 81 μA','v'),
   (4,txt(184,154,'U = 3.6 mJ','frc',10,'end'),'stored: ½Cε² = 3.6 mJ','f'),
   (5,txt(120,86,'heat 3.6 mJ','frc',11),'heat in R = 3.6 mJ, whatever R is','f')])
# ---- Magnetic force on charges
LAY['bforce']=(
  f'<rect x="20" y="40" width="220" height="160" style="fill:color-mix(in srgb,var(--ca) 6%,transparent);stroke:none"/>'+''.join(txt(x,y,'×','bf',16) for x in range(46,240,48) for y in (70,120,170))+txt(120,28,'B into the page','bf',12),
  [(1,ch(105,70,'−',10)+arr(105,70,148,70,'cur','v',2.4,(0,-10))+arr(105,70,105,98,'frc','F',2.4,(10,0)),'v → right, B into page: F ↓ for an electron','f'),
   (2,f'<path d="M 55 120 A 50 50 0 1 0 155 120 A 50 50 0 1 0 55 120" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4"/>'+ln(105,120,105,70,'mut',1.2)+txt(112,100,'r','mut',12,'start'),'qvB = mv²/r, so r = 1.4 × 10⁻² m','i'),
   (3,txt(105,196,'T = 2πm/(eB) = 1.8 × 10⁻⁸ s','mut',11),'period doesn\'t depend on speed','i'),
   (4,txt(122,106,'1.6 × 10⁻¹⁵ N','frc',10,'start'),'F = evB = 1.6 × 10⁻¹⁵ N','f'),
   (5,arr(60,60,60,90,'ef','E',2.4,(8,0)),'add E = vB = 1.0 × 10⁴ V/m (E points down)','e')])
# ---- Forces on wires and loops
LAY['wireforce']=(
  f'<rect x="60" y="60" width="140" height="80" transform="rotate(-18 130 100)" style="fill:color-mix(in srgb,var(--cv) 10%,transparent);stroke:var(--cv);stroke-width:2.5"/>'+arr(130,100,130,40,'bf','B',2.4,(8,0))+txt(130,210,'N = 20, I = 2.0 A, B = 0.30 T','mut',11)+txt(14,22,'edge view of the loop','mut',11,'start'),
  [(1,arr(60+8,128,60+8,170,'frc','F',2.4,(10,0))+arr(200-8,76,200-8,34,'frc','F',2.4,(10,0)),'forces act on the two 8 cm sides only','f'),
   (2,'','F = NIℓB = 0.96 N on each side','f'),
   (3,arr(130,100,130+42,100-14,'ink','μ',2.4,(2,-2)),'τ = 2F(0.025 m) = 0.048 N·m','i'),
   (4,'','μ = NIA = 0.16 A·m²','i'),
   (5,'','plane ⟂ B (μ ∥ B): τ = 0','i')])
# ---- Biot-Savart
LAY['biot']=(
  f'<ellipse cx="90" cy="115" rx="14" ry="62" style="fill:none;stroke:var(--cv);stroke-width:3"/>'+ln(40,115,250,115,'mut',1.3,'4 4')+dotp(200,115,'P','ink',0,-12)+txt(100,120,'R','mut',12,'start')+txt(150,134,'z','mut',12),
  [(1,ln(90,53,200,115,'mut',1.2,'3 3')+arr(90,60,104,56,'cv','dl',2,(0,-8))+arr(200,115,162,96,'bf','dB',2),'a slice dl makes dB, ⊥ to dl and r̂','b'),
   (2,arr(200,115,200,150,'bf','',1.8)+txt(130,205,'sideways parts cancel; axial parts add','mut',11),'cos α = R/r keeps only the axial part','b'),
   (3,arr(200,115,250,115,'bf','B',2.8,(0,-4)),'B = μ₀IR²/2(R²+z²)^(3/2)','b'),
   (4,'','center: B = μ₀I/2R = 1.0 × 10⁻⁴ T','b'),
   (5,'','z = 12 cm: B = 5.7 μT','b'),
   (6,'','✓ falls like 1/z³ far away; direction by right hand','i')])
# ---- Ampere
LAY['ampere']=(
  f'<circle cx="130" cy="115" r="70" style="fill:color-mix(in srgb,var(--cv) 10%,transparent);stroke:var(--cv);stroke-width:2"/>'+
  ''.join(f'<circle cx="{130+x}" cy="{115+y}" r="3" style="fill:var(--cv)"/>' for x,y in [(0,0),(25,15),(-25,15),(0,-30),(35,-20),(-35,-20),(0,45),(45,20),(-45,20),(15,-52),(-15,-52),(20,52)])+txt(130,120,'⊙ I','cur',12)+txt(130,208,'R = 2 cm; loops at r = 1 cm and 6 cm','mut',10),
  [(1,f'<circle cx="130" cy="115" r="38" style="fill:none;stroke:var(--ink);stroke-width:1.8;stroke-dasharray:5 4"/><circle cx="130" cy="115" r="100" style="fill:none;stroke:var(--ink);stroke-width:1.8;stroke-dasharray:5 4"/>','circular loops: ∮B·dℓ = B(2πr)','i'),
   (2,arr(92,115,92,100,'bf','',2.2),'inside: I_enc = I(r/R)² = 3.0 A, B = 60 μT','b'),
   (3,arr(130,15,148,17,'bf','',2.2),'outside: all 12 A enclosed, B = 40 μT','b'),
   (4,f'<circle cx="130" cy="115" r="70" style="fill:none;stroke:var(--ca);stroke-width:2.5"/>','at r = R: B = 120 μT, the maximum','b'),
   (5,'','out of the page ⇒ counterclockwise field lines','i')])
# ---- Faraday
LAY['faraday']=(
  f'<circle cx="130" cy="115" r="70" style="fill:color-mix(in srgb,var(--ca) 6%,transparent);stroke:var(--ink);stroke-width:2"/>'+''.join(txt(x,y,'×','bf',15) for x in (95,130,165) for y in (85,120,155))+txt(130,38,'N = 200, r = 4.0 cm','ink',12),
  [(1,txt(130,134,'B: 0.50 T → 0','bf',11),'ΔΦ = (0 − 0.50)(5.03 × 10⁻³) = −2.5 × 10⁻³ Wb','b'),
   (2,'','ε = −NΔΦ/Δt = 5.0 V','i'),
   (3,'','I = ε/R = 0.50 A','v'),
   (4,f'<path d="M 130 52 A 63 63 0 1 1 129 52" style="fill:none;stroke:var(--cv);stroke-width:3"/>'+arr(88,72,100,62,'cv','',2.2)+txt(130,218,'B into page, decreasing: Lenz → clockwise current','mut',10),'Lenz: oppose the decrease, so clockwise','v'),
   (5,'','✓ no change in B, no EMF','i')])
# ---- Motional EMF
LAY['motional']=(
  ln(60,60,230,60,'ink',3)+ln(60,170,230,170,'ink',3)+ln(60,60,60,80,'ink',3)+ln(60,150,60,170,'ink',3)+
  f'<polyline points="60,80 52,86 68,92 52,98 68,104 52,110 68,116 52,122 68,128 52,134 68,140 60,146 60,150" style="fill:none;stroke:var(--ink);stroke-width:2"/>'+ln(180,55,180,175,'ink',6)+
  ''.join(txt(x,y,'×','bf',14) for x in (95,125,155,205) for y in (90,125,160))+txt(40,119,'R','mut',12,'end')+txt(130,205,'L = 0.50 m','mut',11)+txt(150,32,'B into the page','bf',12),
  [(1,arr(180,115,225,115,'cur','v',2.6,(0,-10)),'ε = BLv = 0.60 V','v'),
   (2,arr(160,150,160,82,'cur','I',2.2,(-10,0)),'I = ε/R = 0.30 A, counterclockwise (Lenz)','v'),
   (3,arr(180,80,150,80,'frc','F',2.2,(-8,-8)),'F = ILB = 0.060 N, opposes v (you push 0.060 N →)','f'),
   (4,'','P = I²R = 0.18 W = Fv ✓','f'),
   (5,'','released: τ = mR/(B²L²) = 5.0 s','i')])
# ---- Inductors
LAY['inductance']=(
  ln(40,50,200,50,'ink',2)+ln(40,175,200,175,'ink',2)+ln(40,50,40,95,'ink',2)+ln(40,135,40,175,'ink',2)+bat(40,115,'',True)+txt(28,119,'12 V','ink',11,'end')+res(80,50,150,'50 Ω')+ln(200,50,200,85,'ink',2)+ln(200,175,200,145,'ink',2)+
  f'<path d="M 200 85 a 10 10 0 0 1 0 15 a 10 10 0 0 1 0 15 a 10 10 0 0 1 0 15 a 10 10 0 0 1 0 15" style="fill:none;stroke:var(--ink);stroke-width:2.5"/>'+txt(222,118,'0.20 H','ink',11,'start'),
  [(1,txt(130,206,'τ = L/R = 4.0 ms','mut',12),'τ = 0.20 H / 50 Ω = 4.0 ms','i'),
   (2,arr(100,38,150,38,'cur','I',2.2)+txt(125,26,'0.24 A','cur',11),'steady state: I = ε/R = 0.24 A','v'),
   (3,txt(120,100,'0.15 A at t = τ','cur',10),'I(τ) = 0.24(1 − e⁻¹) = 0.15 A','v'),
   (4,txt(120,116,'dI/dt = 60 A/s at t = 0','frc',10),'dI/dt = ε/L = 60 A/s at the start','f'),
   (5,txt(120,132,'U = 5.8 mJ','frc',10),'U = ½LI² = 5.8 mJ','f'),
   (6,'','after removing the battery: 9.2 ms to fall to 10%','i')])
# ---- LC
LAY['lc']=(
  ln(40,60,220,60,'ink',2)+ln(40,170,220,170,'ink',2)+ln(40,60,40,100,'ink',2)+ln(40,130,40,170,'ink',2)+ln(28,100,52,100,'ink',3)+ln(28,114,52,114,'ink',3)+ln(40,114,40,130,'ink',2)+txt(26,92,'+','pos',13,'end')+txt(60,112,'20 μF','ink',11,'start')+
  ln(220,60,220,85,'ink',2)+ln(220,170,220,145,'ink',2)+f'<path d="M 220 85 a 8 8 0 0 1 0 15 a 8 8 0 0 1 0 15 a 8 8 0 0 1 0 15 a 8 8 0 0 1 0 15" style="fill:none;stroke:var(--ink);stroke-width:2.5"/>'+txt(222,190,'50 mH','ink',11),
  [(1,txt(130,206,'ω₀ = 1/√(LC) = 1000 rad/s','mut',12),'ω₀ = 1000 rad/s, f = 159 Hz, T = 6.3 ms','i'),
   (2,txt(130,226,'U = ½CV² = 1.0 mJ','frc',11),'Q₀ = CV₀ = 2.0 × 10⁻⁴ C, U = 1.0 mJ','f'),
   (3,arr(90,48,150,48,'cur','',2.2)+txt(120,38,'I_max = 0.20 A','cur',11),'all the energy in L: I_max = 0.20 A','v'),
   (4,txt(60,136,'q = 1.7 × 10⁻⁴ C','cx',10,'start'),'at I = 0.10 A: q = 1.7 × 10⁻⁴ C','e'),
   (5,'','✓ half the current, 87% of the charge','i')])
# ---- Maxwell
LAY['maxwell']=(
  f'<path d="M 20 150 Q 50 100 80 150 T 140 150 T 200 150 T 250 150" style="fill:none;stroke:var(--cx);stroke-width:3"/>'+f'<path d="M 20 150 Q 50 195 80 150 T 140 150 T 200 150 T 250 150" style="fill:none;stroke:var(--ca);stroke-width:3;stroke-dasharray:6 4"/>'+
  arr(20,150,250,150,'mut','',1.4)+txt(130,227,'direction of travel →','mut',10)+txt(60,100,'E','ef',14)+txt(60,200,'B','bf',14)+txt(130,38,'E × B points along the motion','ink',12),
  [(1,ln(20,198,140,198,'mut',1.2)+txt(80,212,'λ','mut',12)+txt(130,60,'f = 100 MHz → λ = 3.0 m','mut',11),'λ = c/f = 3.0 m','i'),
   (2,arr(130,150,130,110,'ef','',2)+arr(130,150,150,160,'bf','',2),'B₀ = E₀/c = 1.7 × 10⁻⁷ T','b'),
   (3,'','I = ½ε₀cE₀² = 3.3 W/m²','f'),
   (4,arr(150,128,200,128,'cv','+x',2.6,(0,-6)),'E = +y, B = +z ⇒ E × B = +x','v'),
   (5,'','✓ equal energy in E and B','i')])
