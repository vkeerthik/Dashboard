# Cabot Resource Dashboard

A single-page, self-contained resource allocation & capacity dashboard for Cabot.
No build step, no dependencies — pure HTML/CSS. Open `index.html` in any browser.

> **Note:** All figures are **sample/prototype data**. Replace with real numbers
> directly in `index.html` (see "Editing the data" below).

## What's inside

- Company KPIs — total employees, allocated, free/bench, avg utilization, active projects
- Project cards — RXlive, PacIQ, OrthoSkool (headcount, roles, tech stack, timeline, status)
- Gantt timeline across the calendar year
- Resource-distribution donut
- Per-person utilization bars + company capacity gauge
- Available (free / freeing-up) resources with skills
- Summary table

## Run locally

Just open the file:

```bash
open index.html        # macOS
# or double-click index.html
```

Or serve it (optional):

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Deploy as static pages

### GitHub Pages
```bash
git init
git add .
git commit -m "Cabot dashboard prototype"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
Then in the repo: **Settings -> Pages -> Source: deploy from branch -> `main` / root**.
Your site goes live at `https://<user>.github.io/<repo>/`.

### Netlify / Vercel / Cloudflare Pages
Point the project at this folder. No build command needed; publish directory is the root.

## Editing the data

Open `index.html` and edit values inline. Sections are clearly labelled:

- **KPIs** — search for `<!-- KPIs -->`
- **Projects** — search for `<!-- Projects -->` (one `.pcard` block per project)
- **Gantt** — search for `<!-- Timeline + Distribution -->`; bar position uses
  `left` / `width` percentages across a 12-month (Jan–Dec) scale
- **Utilization** — search for `<!-- Utilization -->`
- **Free resources** — search for `<!-- Free resources -->`
- **Summary table** — search for `<!-- Summary table -->`

### Brand colors
All colors are CSS variables at the top of the `<style>` block:

```css
--cabot-cyan: #2EB8E6;   /* primary brand accent */
--bg:         #f4efe6;   /* beige page background */
--panel:      #ffffff;   /* card background */
--rx / --pac / --ortho   /* per-project colors */
```

## License / use
Internal prototype for Cabot. Sample data only.
