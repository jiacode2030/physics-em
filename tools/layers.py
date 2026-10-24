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
  '<path d="M 80 20 L 80 92 Q 80 110 100 110 L 160 110 Q 180 110 180 92 L 180 20" style="fill:color-mix(in srgb,var(--hot) 12%,transparent);stroke:var(--ink);stroke-width:2"/>'+txt(130,48,'fingertip','ink',11)+
  '<rect x="16" y="110" width="228" height="40" style="fill:color-mix(in srgb,var(--cx) 12%,transparent);stroke:var(--cx);stroke-width:1.2"/>'+
  '<rect x="95" y="150" width="70" height="6" style="fill:var(--ink)"/>'+txt(130,186,'electrode 4.0 mm × 4.0 mm','ink',10)+txt(130,202,'glass: d = 0.50 mm, κ = 7.0','cx',10),
  [(1,txt(205,135,'C = 2.0 pF','cx',12),'C = κε₀A/d = 2.0 pF','e'),
   (2,''.join(txt(x,170,'+','pos',13) for x in (104,118,130,142,156))+''.join(txt(x,106,'−','neg',13) for x in (104,118,130,142,156)),'Q = CV = (2.0 pF)(3.0 V) = 5.9 pC','e'),
   (3,''.join(arr(x,146,x,116,'ef','',1.8) for x in (110,130,150)),'E = V/d = 6.0 × 10³ V/m in the glass','e'),
   (4,txt(130,220,'U = ½CV² = 8.9 pJ','frc',11),'U = ½CV² = 8.9 pJ','f'),
   (5,txt(130,74,'lifted 1.0 mm:','frc',10)+txt(130,88,'C → 0.13 pF','frc',10),'hovering 1.0 mm up: glass and air in series, C = 0.13 pF','e'),
   (6,'','✓ a touch changes C by 15×: easy to detect','i')])
# ---- Dielectrics
LAY['dielectrics']=(
  ln(30,60,230,60,'ink',4)+ln(30,170,230,170,'ink',4)+txt(130,48,'+Q','pos',13)+txt(130,186,'−Q','neg',13),
  [(1,'','Q = 20 nC, and it stays (isolated)','i'),
   (2,f'<rect x="60" y="68" width="140" height="94" style="fill:color-mix(in srgb,var(--cx) 14%,transparent);stroke:var(--cx);stroke-width:1.5"/>'+''.join(f'<circle cx="{x}" cy="75" r="3.2" style="fill:var(--neg)"/><circle cx="{x}" cy="155" r="3.2" style="fill:var(--pos)"/>' for x in range(72,196,16))+txt(130,118,'κ = 4','cx',14),'C = κC₀ = 400 pF, so ΔV = 50 V','e'),
   (3,arr(130,84,130,104,'ef','',1.6)+arr(130,128,130,148,'ef','',1.6)+txt(130,206,'E → E₀/κ inside','mut',12),'energy: 2.0 μJ → 0.50 μJ','e'),
   (4,txt(130,226,'bound charge on the faces','mut',11),'1.5 μJ pulled the slab in','f'),
   (5,'','battery on: Q = 80 nC, U = 8.0 μJ','e')])
# ---- Current
_heat=''.join(f'<path d="M {x} 72 q 5 -5 0 -10 q -5 -5 0 -10" style="fill:none;stroke:var(--hot);stroke-width:1.8;stroke-linecap:round"/>' for x in (70,100,130,160,190))
LAY['current']=(
  '<rect x="10" y="88" width="32" height="56" rx="5" style="fill:var(--surface);stroke:var(--ink);stroke-width:2"/>'+ln(21,104,21,112,'ink',2.5)+ln(31,104,31,112,'ink',2.5)+ln(21,120,21,128,'ink',2.5)+ln(31,120,31,128,'ink',2.5)+txt(26,160,'120 V','mut',10)+
  '<rect x="206" y="80" width="44" height="72" rx="6" style="fill:var(--surface);stroke:var(--ink);stroke-width:2"/>'+'<polyline points="214,94 242,100 214,108 242,116 214,124 242,132 214,138" style="fill:none;stroke:var(--hot);stroke-width:2"/>'+txt(228,168,'heater','mut',10)+txt(228,181,'1500 W','mut',10)+
  ln(42,104,206,104,'ink',3)+ln(42,128,206,128,'ink',3)+txt(124,24,'15 m cord, 16-gauge (d = 1.29 mm)','ink',11),
  [(1,arr(70,94,170,94,'cur','',2)+txt(120,88,'12.5 A out','cur',10)+arr(170,138,70,138,'cur','',2)+txt(120,152,'12.5 A back','cur',10),'I = P/V = 1500 W / 120 V = 12.5 A','v'),
   (2,'<circle cx="34" cy="204" r="12" style="fill:color-mix(in srgb,var(--cv) 25%,transparent);stroke:var(--cv);stroke-width:2"/>'+txt(52,208,'A = 1.31 mm²','mut',10,'start'),'A = π(0.645 mm)² = 1.31 × 10⁻⁶ m²','i'),
   (3,txt(124,120,'R = 0.385 Ω (30 m of wire)','ink',10),'R = ρ(30 m)/A = 0.385 Ω: the current goes out and back','i'),
   (4,_heat+txt(124,40,'60 W of heat','frc',11),'P = I²R = (12.5)²(0.385) = 60 W, about 4 W per meter','f'),
   (5,txt(110,172,'electrons drift at only 0.70 mm/s','neg',10),'v_d = J/(ne) = 0.70 mm/s','v'),
   (6,txt(150,208,'12-gauge: 24 W','frc',10,'start'),'12-gauge wire has 2.5× the area, so 2.5× less heat: 24 W','f'),
   (7,'','✓ P = IΔV = (12.5 A)(4.8 V) = 60 W','i')])
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
_RX=lambda t:40+200*t/15
_RY=lambda v:212-66*v/2000
_rv=lambda t:2000*math.exp(-t/5)
LAY['rc']=(
  ln(40,36,170,36,'ink',2)+ln(40,118,170,118,'ink',2)+ln(40,36,40,70,'ink',2)+ln(40,82,40,118,'ink',2)+ln(26,70,54,70,'ink',3)+ln(26,82,54,82,'ink',3)+
  txt(20,74,'+','pos',13,'end')+txt(20,92,'−','neg',13,'end')+txt(60,66,'100 μF','ink',11,'start')+txt(60,80,'2.0 kV','ink',11,'start')+
  '<ellipse cx="170" cy="77" rx="26" ry="36" style="fill:color-mix(in srgb,var(--hot) 10%,transparent);stroke:var(--muted);stroke-width:1.2"/>'+
  ln(170,36,170,52,'ink',2)+'<polyline points="170,52 162,57 178,63 162,69 178,75 162,81 178,87 162,93 170,98" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/>'+ln(170,98,170,118,'ink',2)+
  ln(156,44,184,44,'ink',5)+ln(156,110,184,110,'ink',5)+txt(222,74,'chest','mut',11)+txt(222,88,'≈ 50 Ω','mut',11)+
  ln(40,212,244,212,'mut',1.4)+ln(40,212,40,142,'mut',1.4)+txt(34,150,'2 kV','mut',10,'end')+txt(34,216,'0','mut',10,'end')+
  ''.join(txt(_RX(k),225,f'{k}'+(' ms' if k==15 else ''),'mut',10) for k in (5,10,15))+
  f'<polyline points="{curve_pts(_rv,40,240,212,146,15,2000)}" style="fill:none;stroke:var(--cx);stroke-width:2.6"/>',
  [(1,txt(60,100,'U = 200 J','frc',11,'start'),'U = ½CV² = ½(100 μF)(2000 V)² = 200 J','f'),
   (2,ln(_RX(5),212,_RX(5),_RY(_rv(5)),'mut',1.2,'3 3')+dotp(_RX(5),_RY(_rv(5)),'','ink')+txt(_RX(5)+6,_RY(_rv(5))-6,'τ = 5.0 ms','ink',10,'start'),'τ = RC = (50 Ω)(100 μF) = 5.0 ms','i'),
   (3,arr(70,26,140,26,'cur','',2.2)+txt(105,18,'I₀ = 40 A','cur',11),'I₀ = V₀/R = 2000 V / 50 Ω = 40 A','v'),
   (4,ln(40,_RY(200),_RX(11.5),_RY(200),'frc',1.3,'3 3')+ln(_RX(11.5),212,_RX(11.5),_RY(200),'frc',1.3,'3 3')+dotp(_RX(11.5),_RY(200),'','frc')+txt(_RX(11.5),160,'10% at 11.5 ms','frc',10),'V = V₀e^(−t/τ) = 0.10V₀ ⇒ t = τ ln 10 = 11.5 ms','f'),
   (5,'','U ∝ V²: 1% of the energy is left, so 198 J went into the chest','f'),
   (6,'','✓ tens of amps for a few milliseconds, like a real shock','i')])
# ---- Magnetic force on charges (aurora helix)
def _hx(s): return 30+72*s-26*math.sin(2*math.pi*s)
def _hy(s): return 120+34*math.cos(2*math.pi*s)
def _helix():
    out='';n=200;S=2.85
    pts=[(S*k/n) for k in range(n+1)]
    seg=[];front=None
    for s in pts:
        f=math.sin(2*math.pi*s)<0   # front half (out of the page)
        if front is None: front=f
        if f!=front:
            out+=f'<polyline points="{" ".join(f"{_hx(a):.1f},{_hy(a):.1f}" for a in seg+[s])}" style="fill:none;stroke:var(--ink);stroke-width:{2.2 if front else 1.4}'+('' if front else ';stroke-dasharray:4 3;opacity:.8')+'"/>'
            seg=[];front=f
        seg.append(s)
    out+=f'<polyline points="{" ".join(f"{_hx(a):.1f},{_hy(a):.1f}" for a in seg)}" style="fill:none;stroke:var(--ink);stroke-width:{2.2 if front else 1.4}'+('' if front else ';stroke-dasharray:4 3;opacity:.8')+'"/>'
    return out
LAY['bforce']=(
  ln(14,120,246,120,'bf',1.4,'5 4')+arr(16,36,64,36,'bf','',2.4)+txt(72,40,'Earth\'s field B = 50 μT','bf',11,'start')+_helix(),
  [(1,arr(102,154,146,154,'cur','',2.4)+txt(150,158,'v∥','cur',12,'start')+txt(84,180,'⊗ v⊥','cur',12)+ch(102,154,'−',8),'v⊥ = v sin 30° = 1.0 × 10⁷ m/s, v∥ = 1.73 × 10⁷ m/s','v'),
   (2,arr(102,145,102,124,'frc','',2.4)+txt(92,136,'F','frc',12,'end'),'F = ev⊥B = 8.0 × 10⁻¹⁷ N, always toward the axis','f'),
   (3,ln(174,120,174,154,'mut',1.4)+txt(180,142,'r = 1.1 m','mut',11,'start'),'r = mv⊥/(eB) = 1.1 m','i'),
   (4,txt(130,226,'one turn: T = 0.72 μs','ink',11),'T = 2πm/(eB) = 0.72 μs, whatever the speed','i'),
   (5,ln(102,200,174,200,'mut',1.2)+ln(102,194,102,206,'mut',1.2)+ln(174,194,174,206,'mut',1.2)+txt(138,214,'pitch 12 m','mut',11),'pitch = v∥T = 12 m per turn','i'),
   (6,txt(244,66,'toward the polar sky →','bf',11,'end'),'F never points along B, so the electron rides the field line down to the pole','b')])
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
# ---- Faraday (wireless charger)
LAY['faraday']=(
  '<rect x="60" y="20" width="140" height="206" rx="18" style="fill:none;stroke:var(--ink);stroke-width:2"/>'+txt(130,36,'phone, seen from above','mut',10)+
  ''.join(f'<circle cx="130" cy="120" r="{r}" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>' for r in (50,45,40))+
  ''.join(txt(x,y,'⊙','bf',14) for x,y in ((112,106),(148,106),(112,142),(148,142),(130,125)))+txt(130,206,'N = 12, r = 2.0 cm','ink',11),
  [(1,'<circle cx="130" cy="120" r="50" style="fill:color-mix(in srgb,var(--ca) 10%,transparent)"/>','A = π(0.020 m)² = 1.26 × 10⁻³ m²','i'),
   (2,txt(130,190,'B: +0.50 mT → −0.50 mT','bf',11),'ΔΦ = (−0.50 − 0.50) mT × A = −1.26 × 10⁻⁶ Wb','b'),
   (3,txt(130,54,'ε_avg = 3.8 V','frc',11),'half a cycle is 4.0 μs: ε_avg = NΔΦ/Δt = 3.8 V','f'),
   (4,txt(130,220,'ε_peak = 5.9 V','frc',11),'ε_peak = NB₀Aω = 5.9 V (π/2 × the average)','f'),
   (5,'<path d="M 130 62 A 58 58 0 1 1 129 62" style="fill:none;stroke:var(--cv);stroke-width:3"/>'+arr(84,85,95,73,'cv','',2.4),'B up and growing ⇒ induced B down ⇒ clockwise seen from above','v'),
   (6,'','✓ volts from a field 10× Earth\'s, because it changes 125,000 times a second','i')])
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
