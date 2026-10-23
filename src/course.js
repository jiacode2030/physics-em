/* ---------------- Course outline ---------------- */
const MODS={
  slices:{t:'Charge slices',d:'Turn a rod, ring or sheet into an integral: λ, σ and ρ.',ap:'AP C math'},
  expo:{t:'Exponential change',d:'The one function behind RC, LR and every "fills up, then levels off" curve.',ap:'AP C math'},
  coulomb:{t:"Charge & Coulomb's law",d:'Drag charges around and add the force arrows.',ap:'AP C U8 · AP 2'},
  efield:{t:'Electric fields',d:'Field arrows, field lines and dipoles you can rearrange.',ap:'AP C U8 · AP 2'},
  continuous:{t:'Rods, rings & disks',d:'Add up the field of a spread-out charge, slice by slice.',ap:'AP C U8'},
  gauss:{t:"Flux & Gauss's law",d:'Count field lines through a surface you choose.',ap:'AP C U8'},
  potential:{t:'Electric potential',d:'Equipotential maps: the hills and valleys of voltage.',ap:'AP C U9 · AP 2'},
  penergy:{t:'Energy of charges',d:'Accelerate charges through a voltage; assemble charge systems.',ap:'AP C U9 · AP 2'},
  conductors:{t:'Conductors',d:'Why the field inside a metal is zero and the charge sits on the surface.',ap:'AP C U10'},
  capacitors:{t:'Capacitors',d:'Pull plates apart, store energy, combine in series and parallel.',ap:'AP C U10 · AP 2'},
  dielectrics:{t:'Dielectrics',d:'Slide an insulator between the plates and watch E drop.',ap:'AP C U10 · AP 2'},
  current:{t:'Current & resistance',d:'Drifting electrons, resistivity, Ohm\'s law and power.',ap:'AP C U11 · AP 2'},
  circuits:{t:"Kirchhoff's rules",d:'Series, parallel and loops, with a live voltage map.',ap:'AP C U11 · AP 2'},
  rc:{t:'RC circuits',d:'Charge and discharge a capacitor; read the time constant.',ap:'AP C U11 · AP 2'},
  bforce:{t:'Magnetic force on charges',d:'Circles, helixes, velocity selectors and mass spectrometers in 3D.',ap:'AP C U12 · AP 2'},
  wireforce:{t:'Forces on wires & loops',d:'Push on a current, spin a loop: the electric motor.',ap:'AP C U12 · AP 2'},
  biot:{t:'Biot–Savart law',d:'Build the field of a wire or loop from tiny current pieces.',ap:'AP C U12'},
  ampere:{t:"Ampère's law",d:'Wires, solenoids and toroids from one loop integral.',ap:'AP C U12 · AP 2'},
  faraday:{t:"Faraday & Lenz",d:'Move a magnet through a coil and watch the flux and EMF.',ap:'AP C U13 · AP 2'},
  motional:{t:'Motional EMF',d:'A rod sliding on rails: induced current, braking force, terminal speed.',ap:'AP C U13 · AP 2'},
  inductance:{t:'Inductors & LR circuits',d:'Current that refuses to change suddenly.',ap:'AP C U13'},
  lc:{t:'LC oscillations',d:'Energy sloshing between a capacitor and an inductor.',ap:'AP C U13'},
  maxwell:{t:"Maxwell's equations",d:'The four laws together, and light as an electromagnetic wave.',ap:'AP C U13 · concepts'}
};
const GROUPS=[
  {w:'Optional',ch:'',name:'Math toolkit',ids:['slices','expo']},
  {w:'Unit 8',ch:'',name:"Charge, field & Gauss's law",ids:['coulomb','efield','continuous','gauss']},
  {w:'Unit 9',ch:'',name:'Electric potential',ids:['potential','penergy']},
  {w:'Unit 10',ch:'',name:'Conductors & capacitors',ids:['conductors','capacitors','dielectrics']},
  {w:'Unit 11',ch:'',name:'Circuits',ids:['current','circuits','rc']},
  {w:'Unit 12',ch:'',name:'Magnetism',ids:['bforce','wireforce','biot','ampere']},
  {w:'Unit 13',ch:'',name:'Induction',ids:['faraday','motional','inductance','lc','maxwell']}
];
GROUPS.forEach(g=>g.ids.forEach(id=>{const eb=document.querySelector('#v-'+id+' .eyebrow');if(eb&&eb.firstChild&&eb.firstChild.nodeType===3)eb.firstChild.nodeValue=g.w;}));
/* Shared teaching data. Each module file adds its own entries with Object.assign and PROBS.push. */
const TIPS={},TT={},KEYS={},PROBS=[];
const GLOSS={
  "charge":"A property of matter that makes it push or pull on other charges. Measured in coulombs (C). Like charges repel, unlike attract.",
  "electric field":"The force a +1 C test charge would feel at a point, per coulomb: E = F/q. Measured in N/C (same as V/m).",
  "magnetic field":"What makes moving charges and currents feel a sideways force F = qv × B. Measured in tesla (T).",
  "flux":"How much field pokes through a surface: field × area × cos(angle between field and the surface's normal).",
  "potential":"Electric potential energy per coulomb, V = U/q, measured in volts. Like height on a map: charges roll from high to low (positive ones do).",
  "equipotential":"A line or surface where the potential is the same everywhere. Field lines always cross them at right angles.",
  "conductor":"A material, like a metal, whose charges move freely. In equilibrium the field inside it is zero.",
  "insulator":"A material whose charges can't move around, like glass or plastic. Charge stays where you put it.",
  "capacitance":"Charge stored per volt, C = Q/ΔV, measured in farads (F). Depends only on the geometry and the material between the plates.",
  "dielectric":"An insulator placed in a capacitor. Its molecules line up against the field and weaken it by a factor κ.",
  "current":"Charge flowing past a point per second, I = dQ/dt, measured in amperes (A = C/s).",
  "resistance":"How hard it is to push current through something, R = ΔV/I, measured in ohms (Ω).",
  "emf":"The energy per coulomb a battery or changing flux gives to charges, measured in volts. Short for electromotive force, though it is not a force.",
  "time constant":"The time for an exponential change to get 63% of the way to its final value. τ = RC for capacitors, L/R for inductors.",
  "inductance":"How strongly a coil resists changes in its current: EMF = −L dI/dt. Measured in henries (H).",
  "dipole":"A + and − charge of equal size a small distance apart. Its strength is the dipole moment p = qd, pointing from − to +.",
  "superposition":"Fields from separate charges simply add as vectors. Find each one alone, then add the arrows.",
  "test charge":"An imaginary tiny positive charge you place somewhere to measure the field, small enough not to disturb anything.",
  "gaussian surface":"An imaginary closed surface you choose so that symmetry makes the flux easy to compute.",
  "right-hand rule":"Point your fingers along the first vector, curl them toward the second; your thumb points along the cross product."
};
const METHOD_OPTS=["Coulomb's law: add the charges","Gauss's law","Potential and energy","Kirchhoff's rules","Magnetic force: qv × B or IL × B","Biot–Savart","Ampère's law","Faraday's law and Lenz's law"];

const GLYPH={"slices": "<path d=\"M3 17h18\"/><path d=\"M6 17v-3M9 17v-5M12 17v-7M15 17v-9M18 17v-11\"/><path d=\"M5 20h14\" stroke-dasharray=\"2 2\"/>", "expo": "<path d=\"M3 20h18M3 20V4\"/><path d=\"M4 19c4-1 7-6 9-10s4-4 7-4\"/>", "coulomb": "<circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"12\" r=\"3\"/><path d=\"M9 12h6M11.5 10l-2 2 2 2M12.5 10l2 2-2 2\"/>", "efield": "<circle cx=\"12\" cy=\"12\" r=\"2.4\"/><path d=\"M12 9.6V3M12 14.4V21M9.6 12H3M14.4 12H21M10.3 10.3L5.5 5.5M13.7 13.7l4.8 4.8M13.7 10.3l4.8-4.8M10.3 13.7l-4.8 4.8\"/>", "continuous": "<ellipse cx=\"12\" cy=\"12\" rx=\"9\" ry=\"4\"/><path d=\"M12 12V4M12 12l5-8\"/>", "gauss": "<circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M12 12l5-5M12 12l-6 2M12 12l2 7\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\"/>", "potential": "<path d=\"M3 20c4 0 4-14 9-14s5 14 9 14\"/><path d=\"M3 20h18\" stroke-dasharray=\"2 3\"/>", "penergy": "<path d=\"M3 5v14\"/><path d=\"M21 5v14\"/><circle cx=\"7\" cy=\"12\" r=\"1.8\"/><path d=\"M10 12h8M15.5 9.5L18 12l-2.5 2.5\"/>", "conductors": "<rect x=\"5\" y=\"5\" width=\"14\" height=\"14\" rx=\"3\"/><path d=\"M9 9l6 6M15 9l-6 6\" stroke-dasharray=\"1 3\"/>", "capacitors": "<path d=\"M3 12h6M15 12h6\"/><path d=\"M9 5v14M15 5v14\"/>", "dielectrics": "<path d=\"M3 12h4M17 12h4\"/><path d=\"M7 5v14M17 5v14\"/><rect x=\"9.5\" y=\"7\" width=\"5\" height=\"10\"/>", "current": "<path d=\"M3 12h18\"/><circle cx=\"6\" cy=\"12\" r=\"1.5\"/><circle cx=\"11\" cy=\"12\" r=\"1.5\"/><circle cx=\"16\" cy=\"12\" r=\"1.5\"/><path d=\"M18 8l3 4-3 4\"/>", "circuits": "<path d=\"M4 6h16v12H4z\"/><path d=\"M12 6v12\"/><path d=\"M8 6v0\" /><path d=\"M10 12h4\"/>", "rc": "<path d=\"M3 12h4l1.5-4 2 8 2-8 2 8 1.5-4h5\" /><path d=\"M3 20c5 0 7-3 9-6\" stroke-dasharray=\"2 2\"/>", "bforce": "<path d=\"M5 18a7 7 0 1 1 7-4\"/><path d=\"M12 14l4 1-2-4\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/>", "wireforce": "<path d=\"M12 3v18\"/><path d=\"M12 8l5 1M12 12l5 1M12 16l5 1\"/><path d=\"M6 21l12-3\" stroke-dasharray=\"2 2\"/>", "biot": "<path d=\"M12 3v18\"/><ellipse cx=\"12\" cy=\"9\" rx=\"6\" ry=\"2\"/><ellipse cx=\"12\" cy=\"15\" rx=\"8\" ry=\"2.5\"/>", "ampere": "<circle cx=\"12\" cy=\"12\" r=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"9.5\" stroke-dasharray=\"3 3\"/>", "faraday": "<ellipse cx=\"14\" cy=\"12\" rx=\"3\" ry=\"7\"/><rect x=\"2\" y=\"9\" width=\"8\" height=\"6\" rx=\"1\"/><path d=\"M6 9v6\"/>", "motional": "<path d=\"M3 6h18M3 18h18\"/><path d=\"M13 4v16\" stroke-width=\"2.6\"/><path d=\"M15 12h5M18 10l2 2-2 2\"/>", "inductance": "<path d=\"M3 12h3a2.5 2.5 0 0 1 5 0a2.5 2.5 0 0 1 5 0a2.5 2.5 0 0 1 5 0h0\"/><path d=\"M3 18h18\" stroke-dasharray=\"2 3\"/>", "lc": "<path d=\"M3 12c3-8 6-8 9 0s6 8 9 0\"/><path d=\"M3 12h18\" stroke-dasharray=\"2 3\"/>", "maxwell": "<path d=\"M3 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0\"/><path d=\"M3 12c2 6 4 6 6 0s4-6 6 0 4 6 6 0\" stroke-dasharray=\"3 2\"/>"};
