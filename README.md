# Cabot Resource Dashboard

A multi-page, self-contained resource-allocation dashboard for Cabot.
No build step, no dependencies, no backend — just static HTML/CSS/JS.
All three views read from **one data file**, so you update numbers in a single place.

> All figures are **sample/prototype data** (110 people, 13 projects). Replace with
> your real roster in `assets/data.js` — every page updates automatically.

## Pages

| File | View | What it answers |
|------|------|-----------------|
| `index.html` | **Overview** | How are we doing company-wide? KPIs, attention strip, headcount per project, status table. |
| `projects.html` | **Projects** | What's happening across the portfolio? Sortable/filterable table + card view. |
| `project.html` | **Project detail** | One project in depth (opens via `?p=ProjectName`): Gantt, roles, stack, full roster. |
| `resources.html` | **Resources** | Who's free, who's overloaded? Available-to-assign cards + filterable people table. |

A shared top nav links all pages together.

## Run locally

Because the pages load `assets/data.js` and each other, serve over HTTP (don't just
double-click — some browsers block local file scripts):

```bash
cd cabot-app
python3 -m http.server 8000
# visit http://localhost:8000
```

(Opening `index.html` directly works in most browsers too, but a local server is safest.)

## Deploy as static pages

### GitHub Pages
```bash
git init
git add .
git commit -m "Cabot dashboard"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
Repo → **Settings → Pages → Source: Deploy from a branch → `main` / root**.
Live at `https://<user>.github.io/<repo>/`. (Repo must be public on the free plan.)

### Netlify / Vercel / Cloudflare Pages
Point at this folder, no build command, publish directory = root.

## Editing the data — the only file you need

Everything lives in **`assets/data.js`** as one object: `window.CABOT_DATA`.

```js
window.CABOT_DATA = {
  projects: [
    { name:"RXlive", status:"on-track", phase:"Build",
      stack:["React","Node.js","AWS"], start:"2026-01", end:"2026-09",
      pct:62, roster:["p001","p014",...], lead:"S. Okafor" }
    // ...
  ],
  people: [
    { id:"p001", name:"A. Mehta", role:"Sr. Backend",
      skills:["Node.js","Go"],
      allocations:[ {project:"PacIQ", pct:95} ],  // empty array = on the bench
      available:null }   // null = free now (if on bench) ; "2026-06-01" = frees up that date
    // ...
  ],
  meta: { asOf:"2026-05", cycle:"Q2", company:"Cabot" }
};
```

Rules the pages rely on:
- **`status`** must be one of `on-track`, `at-risk`, `delayed`.
- **`roster`** is a list of person `id`s; headcounts and rosters compute from it.
- **`allocations[].pct`** drives utilization. Total >100 = over-allocated (red),
  75–100 = healthy (green), <75 = under-utilized (amber).
- **`available`**: `null` = free now (if no allocations) ; a date string = freeing up then.
- **Dates** are `"YYYY-MM"`. The Gantt uses a Jan–Dec 2026 scale.

Add or remove a project/person by editing this one file — no HTML changes needed.

## Theming

Colors are CSS variables at the top of `assets/styles.css`:
```css
--cabot-cyan: #2EB8E6;   /* brand accent */
--bg:         #f4efe6;   /* beige background */
--panel:      #ffffff;   /* cards */
```
Project bar/donut colors rotate through a palette in `assets/app.js` (`projColor`).

## Files
```
index.html        Overview
projects.html     Projects list
project.html      Single-project detail
resources.html    People / allocation
assets/data.js    ← single source of truth (edit this)
assets/styles.css shared theme
assets/app.js     shared logic & renderers
```
