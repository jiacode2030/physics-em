I want to build the **landing page** for my family of AP science study sites. It is one small, static site that links to each course. Make it simple but really appealing.

## What it is
- Repo: `jiacode2030/jiacode2030.github.io` (a user-site repo, served at https://jiacode2030.github.io/). The course sites already live under that domain.
- Site name: **AP Science Labs** (short tagline: "Interactive, intuition-first study sites for AP sciences").
- Plain static files, no build step needed: `index.html`, plus `courses.js` (or `courses.json`) that holds the course list. Adding a new course must mean adding one entry to that file and nothing else.

## Courses (put these in the data file)
| Course | Subject | Status | URL |
|---|---|---|---|
| Mechanics Lab: Physics 1 and AP Physics C: Mechanics | Physics | Live | https://jiacode2030.github.io/physics-mechanics/ |
| E&M Lab: AP Physics C: Electricity and Magnetism | Physics | Live once pushed | https://jiacode2030.github.io/physics-em/ |
| Chemistry Lab: AP Chemistry | Chemistry | Live once pushed | https://jiacode2030.github.io/chemistry-lab/ |

Confirm the real repo names and URLs with me before you hard-code them. Later I will add more AP sciences (Biology, Physics 2, Environmental Science) and maybe AP Calculus and AP Statistics. Each entry needs: id, title, subject, one-line description, unit count or topics, URL, status (`live` or `soon`), accent color, localStorage prefix.

## Features
- A hero with the title, the tagline and a calm animated background (for example drifting particles or field lines that fit a science theme). Respect `prefers-reduced-motion`.
- A grid of course cards. Each card has a subject icon (inline SVG, not emoji), the title, a short description, a few topic chips, an accent color and an "Open" button. `soon` cards are visibly muted with a "Coming soon" badge and are not clickable.
- Subject filter chips (All, Physics, Chemistry, Biology, Math) and a search box. Only show filters that have at least one course.
- **Progress rings.** All the sites share one origin, so the landing page can read each course's localStorage. Open each course's source and find the exact key it uses for "marked as done" progress (Mechanics uses the prefix `kin-`, E&M uses `eml-`, Chemistry should use `chem-`). Show "X of Y modules done" on each card as a small ring. Wrap every read in try/catch, and hide the ring if there is no data. Never write to the course keys.
- A "Continue where you left off" strip, if the sites store a last-visited module. Check the source first; skip this if they do not.
- Footer: "Unofficial study aids. Not affiliated with the College Board." and "Use these to study, not on graded work." Do not mention any university.
- Light, dark and auto themes with a toggle, remembered in a localStorage key with the prefix `hub-`.

## Feedback and analytics (shared across all sites)
- **One shared issues repo:** `jiacode2030/intulab-feedback`. Add a "Report an issue" link on the landing page that opens a pre-filled new issue there (course: "Landing page"). For the course sites, give me a short snippet to paste into each one: change the `REPO` constant in its Report-an-issue code to `jiacode2030/intulab-feedback`, and make the issue title and body include the course name, module and site version. Labels per course: `course:mechanics`, `course:em`, `course:chem`, `course:landing`, and so on. Create issue templates (`.github/ISSUE_TEMPLATE/`) for "Content error", "Bug" and "Suggestion", each with a course dropdown.
- **Analytics:** use GoatCounter (free, no cookies, no consent banner; ask me for the site code, or use a placeholder `YOUR-CODE` in one config line). Put the snippet in one place in `index.html` and give me the same snippet for each course site, so all of them report to one property and I can see views per path.
- **Events:** the landing page sends an event when a course card is opened (`open:<course-id>`). Document, in the README, a one-line way for course sites to send `module:<id>` events when a module opens or is marked done. Send only anonymous counts, and no personal data.
- Add a short line in the footer: "Anonymous, cookie-free page-view counts only."
- In the README, add a "Feedback and analytics" section covering how to see the issues across courses (filter by label) and how to read the counts.

## Design
- Use the `ui-ux-pro-max` skill (https://github.com/nextlevelbuilder/ui-ux-pro-max-skill); install it to `~/.claude/skills/` if it is missing. Pick a palette and font pairing for a "science, calm, modern" feel, and reuse the cool blue and violet feel of the Physics sites' dark "Instrument" theme as a base. Each course card may carry its own accent.
- Keep it simple: lots of whitespace, one strong hero, clean cards with subtle hover lift, and no clutter.
- Accessibility: contrast of at least 4.5:1, visible focus rings, touch targets of at least 44px, real `<a>` links for cards, full keyboard use, and a sensible heading order.
- Fully responsive: test at 360, 768 and 1280 px widths, with no horizontal scroll.

## Rules and checks
- Quirks-mode caution: add `<!doctype html>` here (this is a new page), but avoid IDs that differ only by case.
- Fast: no framework, no external scripts. System fonts or a single Google Fonts stylesheet at most. Total page under 150 KB.
- Test with Playwright (Chromium is pre-installed): open the page at the three widths, check for overflow, NaN or undefined text and console errors, then check that the progress rings show correctly when I seed fake localStorage values.
- When done, write a short README explaining how to add a new course and how to deploy (push to `main`; GitHub Pages serves from the root).
- Do not push anything or create repos until I say so. Show me a screenshot first.
