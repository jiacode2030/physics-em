# E&M Lab

An interactive, intuition-first study site for AP Physics C: Electricity & Magnetism and the electricity and magnetism topics of AP Physics 2.

23 modules (Units 8 to 13, plus a small math toolkit), each with a live simulation (several in 3D), a "Try this" section, a worked example with a diagram, common mistakes and a quiz. Review tools: 102 randomized practice problems, "Which tool?" trainer, exam builder, spaced mistakes queue, four original FRQs with scoring guides, and a formula sheet.

> **Unofficial study aid.** Not affiliated with, reviewed by, or endorsed by the College Board. **Use it to study, not on graded work.**
> The AP Physics 2 mapping was written from memory. Check topics against the current Course and Exam Description on AP Central.

## Build

The site is one generated file, `index.html`, assembled from `src/`:

```
python3 build.py            # writes index.html
```

- `src/a_head.html` CSS, `src/b_shell.html` menu and dialogs, `src/formula.html` formula sheet, `src/overview.html`
- `src/d_engine.js` canvas helpers, `src/f_helpers.js` shared helpers, `src/g3.js` + `src/hero.js` overview scenes, `src/h_tail.js` practice, review, report and polish code
- `src/course.js` module list, units, glossary
- `src/modules/<id>.html` and `<id>.js` one pair per module. `tools/gen_*.py` generate the HTML (using `tools/mk.py`); edit those, then rerun them and `build.py`.

Quick regeneration: `for f in tools/gen_*.py; do (cd tools && python3 $(basename $f)); done; python3 build.py` (`efield.html` is hand-written).

## Checks (need Node and Playwright)

- `node tests/smoke.js [view,view]` visits every view at desktop and phone width: duplicate IDs (case-insensitive), overflow, blank canvases, NaN text, JS errors, "Set it up for me" buttons.
- `node tests/deep.js` practice, exam, trainer, formula sheet, report dialog, every module's parts, FRQ graphs.
- `node tests/probdump.js [topic]` prints one sample of every practice problem for hand-checking.
- `node tests/shot.js <view> out.png [width] [clicks]` screenshots a simulation.

## Reporting a problem

Every module and problem has a **Report an issue** link. It opens a pre-filled GitHub issue (or saves to the artifact database when hosted as an artifact).

Issues go to the shared [Intulab feedback](https://github.com/jiacode2030/ap-labs-feedback/issues) tracker, labelled `course:em`. You can also [open one directly](https://github.com/jiacode2030/ap-labs-feedback/issues/new/choose).

The **More labs** link in the side rail goes to the [Intulab](https://jiacode2030.github.io/ap-labs/) landing page. Visits are counted anonymously with GoatCounter (no cookies), shared with the other Intulab sites.
