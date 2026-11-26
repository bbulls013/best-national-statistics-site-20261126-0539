# Veldria in Numbers — National Statistics Site

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/bbulls013/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/bbulls013/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An original national statistics site for **Veldria**, a fictional country with
internally consistent figures (regional populations sum to the national total,
sector shares sum to 100%, trade balances are exports minus imports). Every
figure is shown with its source office and reference year. The site is plain
static files with no build step and no network requests: it works offline on
desktop and phone.

## Pages

- **Overview** (`#/`) — six headline KPI cards, population trend and GDP growth charts.
- **Population** (`#/population`) — 2016–2025 trend and the 2025 age-and-sex pyramid.
- **Economy** (`#/economy`) — GDP growth, sector composition, trade chart and table.
- **Health & education** (`#/health`) — life expectancy, hospitals, schools, attainment.
- **Regions** (`#/regions`) — all ten regions, searchable and sortable by any column.
- **Methods & sources** (`#/methods`) — how each series is compiled.

## Run locally

```sh
node serve.ts            # serves app/ at http://localhost:8080 (--port for another port)
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # hand-in: copies app/ + screenshots/, writes out/dossier.json
```

Node 22, standard library only. `main.ts` is deterministic: two runs write
identical bytes.

## Layout

```
main.ts                  hand-in program (copies app/ + screenshots/, writes dossier.json)
serve.ts                 local static server for app/
vendor/makefun-frontend.ts  make.fun dossier library, copied from the kit unchanged
app/index.html           page shell + navigation
app/main.js              hash router
app/views.js             the six page views
app/charts.js            inline-SVG chart builders (line, bars, pyramid, shares, trade)
app/data.js              the Veldria dataset (every series carries source + year)
app/style.css            responsive styling (desktop + phone)
screenshots/             4 PNGs: overview, population, regions (1280×800), phone (390×844)
shots.json               which route + viewport each screenshot shows
tools/render_shots.py    screenshot renderer (see note below)
```

## Screenshot note

No browser binary exists on the build machine, so the screenshots were drawn
with `tools/render_shots.py` (PIL), mirroring the app's own composition and
data: same header, KPI cards, charts, tables and figures as `app/`. Re-render
with `python3 tools/render_shots.py`.

## Verified

- `main.ts` run twice into different output dirs: byte-identical (`diff -r` clean).
- `serve.ts` serves `index.html` and every asset with HTTP 200; paths outside
  `app/` are refused.
- No external URLs anywhere under `app/` — the site makes no network requests.
- Screenshot dimensions: 1280×800 (×3) and 390×844 (phone).

## License

MIT — see `LICENSE`.
