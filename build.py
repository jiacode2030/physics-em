#!/usr/bin/env python3
"""Assemble index.html from src/. Usage: python3 build.py [out.html]
Module order comes from GROUPS in src/course.js. Each module <id> has src/modules/<id>.html and src/modules/<id>.js."""
import re, sys, os
R = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(R, 'src', p)).read().rstrip('\n') + '\n'
course = rd('course.js')
ids = [i for grp in re.findall(r"ids:\[([^\]]*)\]", course) for i in re.findall(r"'([^']+)'", grp)]
miss = [i for i in ids if not os.path.exists(os.path.join(R, 'src/modules', i + '.html'))]
built = [i for i in ids if i not in miss]
html = ''.join(rd(f'modules/{i}.html') for i in built)
js = ''.join(f'/* ---------------- module: {i} ---------------- */\n' + rd(f'modules/{i}.js') for i in built)
stub = ''.join(f'  <section class="view" id="v-{i}" hidden><div class="wrap"><div class="head"><div class="eyebrow">Unit</div><h1>Coming soon</h1><p class="lede">This module is being written.</p></div></div></section>\n' for i in miss)
out = (rd('a_head.html') + rd('formula.html') + rd('b_shell.html') + rd('overview.html') + html + stub + rd('review_head.html') + rd('review_frq.html') + rd('review_methods.html') + rd('review_tail.html')
       + rd('d_engine.js') + rd('hero.js') + course + rd('e_nav.js') + rd('g3.js') + rd('f_helpers.js') + js
       + rd('g_quiz_practice.js') + rd('frq.js') + rd('h_tail.js'))
out = out.replace("'kin-", "'eml-")
dest = sys.argv[1] if len(sys.argv) > 1 else os.path.join(R, 'index.html')
open(dest, 'w').write(out)
print(f'{dest}: {len(out)//1024} KB, {len(built)} modules built, {len(miss)} stubs: {" ".join(miss)}')
