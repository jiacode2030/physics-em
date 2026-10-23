# Handoff: E&M Lab

Status: all 23 modules built and tested. Since the first handoff: 3D scenes (efield, gauss, capacitors, faraday, ampere), step-by-step diagrams (tools/layers.py), AP countdown (E&M exam Wed May 5, 2027, 12 p.m.; date taken from search results, verify on AP Central), cooler palette, a coverage and accuracy audit (102 practice problems checked by hand). No GitHub repo exists yet.

TO DO FIRST (GitHub): create repo `jiacode2030/physics-em`, push this folder (index.html at the root), enable Pages from main / root. Site: https://jiacode2030.github.io/physics-em/ . The Report-an-issue link in src/h_tail.js already points to that repo.

Build: `python3 tools/gen_*.py` (edit generators, not generated files), then `python3 build.py` -> index.html. Tests: `node tests/smoke.js` and `node tests/deep.js` (Playwright, local Chromium).

Gotchas (all learned the hard way)
- Page renders in quirks mode: IDs match case-insensitively. Never two IDs differing only by case (`ck-R1` vs `ck-r1` happened). `tests/smoke.js` reports clashes.
- Never name a local `T` (theme token object).
- localStorage prefix is `eml-` (Mechanics uses `kin-`; same GitHub Pages domain).
- `[hidden]{display:none!important}` is in the CSS; use `el.hidden`.
- Selectors starting with a digit (`[data-k=16]`) are invalid; quote them.

Ideas not done
- Pull the shared engine into a common repo used by Mechanics, E&M and Chemistry.
- Landing page linking the courses (prompt in landing-page-prompt.md, separate repo).
- Verify the AP 2 topic mapping against the current CED.
- More FRQs (only four) and more practice problems per topic.
