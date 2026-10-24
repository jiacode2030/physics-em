"""Helpers that turn a short spec into a module's HTML, following the Electric fields template."""
import json, html as _h
import os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','src','modules','')
C={'cx':'var(--cx)','ca':'var(--ca)','cv':'var(--cv)','bad':'var(--bad)','ef':'var(--cx)','bf':'var(--ca)','cur':'var(--cv)','frc':'var(--hot)','pos':'var(--pos)','neg':'var(--neg)','ink':'var(--ink)','mut':'var(--muted)'}
def m(s): return f'<span class="m">{s}</span>'
def i(s,c=''): return f'<i class="{c}">{s}</i>' if c else f'<i>{s}</i>'
# ---- tiny SVG toolkit for worked-example diagrams (viewBox 260 x 230)
def svg(body,label='Diagram',h=230): return f'<svg viewBox="0 0 260 {h}" role="img" aria-label="{_h.escape(label)}">{body}</svg>'
def txt(x,y,s,c='ink',size=13,anchor='middle',weight=600): return f'<text x="{x}" y="{y}" text-anchor="{anchor}" style="fill:{C.get(c,c)};font:{weight} {size}px \'IBM Plex Sans\',sans-serif">{s}</text>'
def ln(x1,y1,x2,y2,c='ink',w=2,dash=''): return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" style="stroke:{C.get(c,c)};stroke-width:{w};stroke-linecap:round'+(f';stroke-dasharray:{dash}' if dash else '')+'"/>'
def arr(x1,y1,x2,y2,c='ef',lab='',w=2.6,off=(0,0)):
    import math
    L=math.hypot(x2-x1,y2-y1) or 1;ux,uy=(x2-x1)/L,(y2-y1)/L;h=9
    s=ln(x1,y1,x2-ux*h*.7,y2-uy*h*.7,c,w)+f'<polygon points="{x2},{y2} {x2-ux*h-uy*h*.55},{y2-uy*h+ux*h*.55} {x2-ux*h+uy*h*.55},{y2-uy*h-ux*h*.55}" style="fill:{C.get(c,c)}"/>'
    if lab: s+=txt(x2+ux*14+off[0],y2+uy*14+4+off[1],lab,c,13)
    return s
def ch(x,y,sg,r=13): 
    c='pos' if sg=='+' else 'neg' if sg in '−-' else 'mut'
    return f'<circle cx="{x}" cy="{y}" r="{r}" style="fill:{C[c]}"/>'+txt(x,y+5,sg,'#fff',16,weight=700)
def dotp(x,y,lab='',c='ink',dx=0,dy=-10): return f'<circle cx="{x}" cy="{y}" r="4.5" style="fill:{C.get(c,c)}"/>'+(txt(x+dx,y+dy,lab,c,12) if lab else '')
def res(x1,y,x2,lab=''):
    n=6;w=(x2-x1-16)/n;pts=[(x1,y),(x1+8,y)]
    for k in range(n): pts.append((x1+8+w*(k+.5),y+(-8 if k%2==0 else 8)))
    pts+= [(x2-8,y),(x2,y)]
    return '<polyline points="'+' '.join(f'{a:.1f},{b:.1f}' for a,b in pts)+'" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/>'+(txt((x1+x2)/2,y-14,lab,'ink',12) if lab else '')
def bat(x,y,lab='',vertical=False):
    if vertical: return ln(x-10,y-4,x+10,y-4,'ink',3)+ln(x-5,y+4,x+5,y+4,'ink',3)+(txt(x+22,y+4,lab,'ink',12,'start') if lab else '')
    return ln(x-4,y-10,x-4,y+10,'ink',3)+ln(x+4,y-5,x+4,y+5,'ink',3)+(txt(x,y-16,lab,'ink',12) if lab else '')
def cap(x,y,lab=''):  # horizontal wire, plates vertical
    return ln(x-4,y-11,x-4,y+11,'ink',2.5)+ln(x+4,y-11,x+4,y+11,'ink',2.5)+(txt(x,y-17,lab,'ink',12) if lab else '')
def ind(x1,y,x2,lab=''):
    n=4;w=(x2-x1)/n;p=f'M {x1} {y} '
    for k in range(n): p+=f'a {w/2} {w/2} 0 0 1 {w} 0 '
    return f'<path d="{p}" style="fill:none;stroke:var(--ink);stroke-width:2"/>'+(txt((x1+x2)/2,y-16,lab,'ink',12) if lab else '')
# ---- module HTML
def figure(body,cap_): return f'<figure class="fbdfig">{body}<figcaption>{cap_}</figcaption></figure>'
def stepfig(base,layers,cap_,h=230):
    g=''.join(f'<g class="sl" data-s="{k}" hidden>{frag}</g>' for k,frag,_,_ in layers if frag)
    notes=''.join(f'<span class="{c}" data-s="{k}" hidden>{t}</span>' for k,_,t,c in layers if t)
    return f'<figure class="fbdfig"><div class="stepfig"><svg viewBox="0 0 260 {h}" role="img" aria-label="{_h.escape(cap_)}">{base}{g}</svg><div class="fbdnotes">{notes}</div></div><figcaption>{cap_}</figcaption></figure>'
def show_btn(show): return f'<button type="button" class="btn link" data-show=\'{json.dumps(show)}\'>Set it up for me</button>'
def module(id,title,tags,lede,intuit,eqs,lab,tries,example,oops,prose,quiz,assume=None,unit='Unit',drill=None):
    from layers import LAY
    tg=''.join(f'<span class="tag {k}">{v}</span>' for k,v in tags)
    s=f'  <!-- ============ {title.upper()} ============ -->\n  <section class="view" id="v-{id}" hidden>\n    <div class="wrap">\n      <div class="head">\n        <div class="eyebrow">{unit}{tg}</div>\n        <h1>{title}</h1>\n        <p class="lede">{lede}</p>\n      </div>\n'
    s+='      <div class="intuit"><b class="k">The intuition</b>\n'+''.join(f'        <p>{p}</p>\n' for p in intuit)+'      </div>\n'
    if assume:
        s+='      <div class="assume fornow"><h3>'+assume.get('h','Simplification for now')+'</h3><dl>'+''.join(f'<dt>{a}</dt><dd>{b}</dd>' for a,b in assume['rows'])+'</dl></div>\n'
    s+='      <div class="eqgrid">\n'+''.join(f'        <div class="eqn"><span>{a}</span><small>{b}</small></div>\n' for a,b in eqs)+'      </div>\n'
    s+=lab+'\n'
    if drill: s+=drill+'\n'
    s+='      <div class="try"><h3>Try this</h3><p class="small" style="margin:0">Predict what will happen first. Then set it up and check.</p><ol>\n'
    for p,show,ans in tries:
        s+=f'        <li><p>{p} '+(show_btn(show) if show else '')+f'</p><details><summary>What you should see</summary><p>{ans}</p></details></li>\n'
    s+='      </ol></div>\n'
    ex=example
    s+=f'      <div class="example"><h3>Worked example</h3><p class="prob">{ex["prob"]}</p><p class="small" style="margin:0">Try it yourself first, then reveal one step at a time.</p><div class="exgrid"><div class="figs">{(stepfig(*LAY[id],ex['cap']) if id in LAY else figure(ex['svg'],ex['cap']))}</div><div class="exbody"><ol class="exsteps">\n'
    s+=''.join(f'        <li hidden><b>{a}</b> {b}</li>\n' for a,b in ex['steps'])
    s+='      </ol><div class="row"><button type="button" class="btn primary" data-next>Show step 1</button><button type="button" class="btn" data-all>Show all steps</button></div></div></div></div>\n'
    s+='      <div class="oops"><h3>Common mistakes</h3><ul>'+''.join(f'<li>{o}</li>' for o in oops)+'</ul></div>\n'
    s+=f'      <div class="prose">\n{prose}\n      </div>\n'
    q=quiz
    s+=f'      <div class="quiz" data-correct="{q["correct"]}" data-explain="{_h.escape(q["explain"],quote=True)}">\n        <p class="q">Check yourself: {q["q"]}</p>\n        <div class="opts">'+''.join(f'<button type="button">{o}</button>' for o in q['opts'])+'</div>\n        <p class="fb" aria-live="polite"></p>\n      </div>\n    </div>\n  </section>\n\n'
    open(OUT+id+'.html','w').write(s)
def controls(*items):
    """items: (id,label) for sliders: (id,label,min,max,step,value)"""
    return '        <div class="controls">\n'+''.join(f'          <div class="ctl"><label for="{a}"><span>{b}</span> <output id="{a}-out"></output></label><input type="range" id="{a}" min="{c}" max="{d}" step="{e}" value="{f}"></div>\n' for a,b,c,d,e,f in items)+'        </div>\n'
def readout(*items):
    return '        <div class="readout">\n'+''.join(f'          <div><span>{b}</span><strong{(" class=%s"%chr(34)+c+chr(34)) if c else ""} id="{a}">—</strong></div>\n' for a,b,c in items)+'        </div>\n'
def seg(id,label,opts,first=True):
    return f'<div class="seg" id="{id}" role="group" aria-label="{label}">'+''.join(f'<button type="button" data-k="{k}"'+(' aria-pressed="true"' if n==0 and first else '')+f'>{t}</button>' for n,(k,t) in enumerate(opts))+'</div>'
def lab(canvas_id,aria,bar,ctl='',ro='',note='',drag=True,play=None,v3=None):
    s=f'      <div class="lab">\n        <div class="labbar">{bar}</div>\n        <canvas id="{canvas_id}"'+(' class="drag"' if drag else '')+f' aria-label="{_h.escape(aria)}"></canvas>\n{ctl}{ro}'
    if note: s+=f'        <p class="small" style="margin:0">{note}</p>\n'
    if v3: s+=f'        <div class="v3block"><p class="v3cap"><b>In 3D</b> {v3[1]}</p><canvas id="{v3[0]}" aria-label="{_h.escape(v3[2])}"></canvas></div>\n'
    return s+'      </div>'

def add3(labhtml,cid,cap,aria):
    i=labhtml.rindex('      </div>')
    return labhtml[:i]+f'        <div class="v3block"><p class="v3cap"><b>In 3D</b> {cap}</p><canvas id="{cid}" aria-label="{_h.escape(aria)}"></canvas></div>\n'+labhtml[i:]


# ---- Direction-drill helpers (right-hand rule, Lenz's law) : compact 160x140 SVGs
def dsvg(body,label,w=160,h=140): return f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{_h.escape(label)}">{body}</svg>'
def fgrid(sym,c,xs,ys,size=15): return ''.join(txt(x,y+size*0.35,sym,c,size,weight=500) for x in xs for y in ys)
def finto(c='bf',xs=(34,70,106,142),ys=(34,70,106)): return fgrid('×',c,xs,ys)
def fout(c='bf',xs=(34,70,106,142),ys=(34,70,106)): return fgrid('⊙',c,xs,ys)
def loop(cx,cy,r,c='ink',w=2.4): return f'<circle cx="{cx}" cy="{cy}" r="{r}" style="fill:none;stroke:{C.get(c,c)};stroke-width:{w}"/>'
import math as _m
def _pt(cx,cy,r,phi): return (cx+r*_m.sin(_m.radians(phi)), cy-r*_m.cos(_m.radians(phi)))
def curarrow(cx,cy,r,cw,c='cv',w=3.2):
    a0,a1=(25,330) if cw else (-25,-330)
    x0,y0=_pt(cx,cy,r,a0);x1,y1=_pt(cx,cy,r,a1)
    sweep=1 if cw else 0
    if cw: tx,ty=_m.cos(_m.radians(a1)),_m.sin(_m.radians(a1))
    else: tx,ty=-_m.cos(_m.radians(a1)),-_m.sin(_m.radians(a1))
    L=_m.hypot(tx,ty);tx,ty=tx/L,ty/L;px,py=-ty,tx;hh=11;col=C.get(c,c)
    return (f'<path d="M {x0:.1f} {y0:.1f} A {r} {r} 0 1 {sweep} {x1:.1f} {y1:.1f}" style="fill:none;stroke:{col};stroke-width:{w}"/>'
            f'<polygon points="{x1:.1f},{y1:.1f} {x1-tx*hh-px*hh*0.55:.1f},{y1-ty*hh-py*hh*0.55:.1f} {x1-tx*hh+px*hh*0.55:.1f},{y1-ty*hh+py*hh*0.55:.1f}" style="fill:{col}"/>')
def drill(title,intro,cases):
    s=f'      <div class="sorter drill"><h3>{title}</h3><p class="small" style="margin:0">{intro} <span class="fc-score"></span></p><div class="fcases">\n'
    for n,cs in enumerate(cases,1):
        opts=''.join(f'<button type="button">{o}</button>' for o in cs['opts'])
        after=cs.get('after','')
        pics=f'<div class="fcpics">{dsvg(cs["before"],cs.get("lab",title))}'+(dsvg(after,cs.get("lab",title)) and f'<svg viewBox="0 0 160 140" hidden role="img" aria-label="{_h.escape(cs.get("lab",title))} (answer)">{after}</svg>' if after else '')+'</div>'
        s+=(f'        <div class="fcase" data-correct="{cs["correct"]}">{pics}'
            f'<div class="fcbody"><p class="fq"><b>{n}.</b> {cs["q"]}</p>'
            f'<div class="sopts">{opts}</div>'
            f'<div class="fcwhy" hidden><p>{cs["why"]}</p></div></div></div>\n')
    s+='      </div></div>'
    return s
