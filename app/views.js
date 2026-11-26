// Page views for Veldria in Numbers. Each view returns the HTML for <main>;
// main.js swaps them on hash change and marks the matching nav link active.
// Every figure is shown with its source office and reference year.

import {
  COUNTRY, HEADLINES, POPULATION_TREND, AGE_PYRAMID, GDP_GROWTH, SECTORS,
  TRADE, HEALTH, EDUCATION, REGIONS, REGION_META,
} from './data.js';
import { lineChart, barChart, pyramidChart, shareBars, tradeChart } from './charts.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const src = (source, year) => `<p class="src">Source: ${esc(source)} · ${year}</p>`;

function kpiCards() {
  return `<div class="kpis">${HEADLINES.map((k) => `
    <article class="kpi">
      <p class="kpi-label">${esc(k.label)}</p>
      <p class="kpi-value">${esc(k.value)}</p>
      <p class="kpi-delta ${k.dir}">${k.dir === 'up' ? '▲' : '▼'} ${esc(k.delta)}</p>
      <p class="kpi-src">${esc(k.source)} · ${k.year}</p>
    </article>`).join('')}</div>`;
}

function chartCard(title, svg, source, year, note = '') {
  return `<section class="card"><h2>${esc(title)}</h2><div class="chart">${svg}</div>${note}${src(source, year)}</section>`;
}

export function overviewView() {
  const lastTrade = TRADE.rows[TRADE.rows.length - 1];
  const balance = (lastTrade.exports - lastTrade.imports).toFixed(1);
  return `
  <section class="hero">
    <p class="eyebrow">National statistics · ${COUNTRY.year} edition</p>
    <h1>${esc(COUNTRY.name)} in Numbers</h1>
    <p class="lede">The headline figures for ${esc(COUNTRY.name)} — population, economy, health,
    education and its ten regions — each with its source and reference year.
    Capital: ${esc(COUNTRY.capital)} · Currency: ${esc(COUNTRY.currency)} · Area: ${COUNTRY.areaKm2.toLocaleString('en-US')} km².</p>
    ${src(COUNTRY.source, COUNTRY.year)}
  </section>
  ${kpiCards()}
  <div class="grid2">
    ${chartCard(POPULATION_TREND.title, lineChart(POPULATION_TREND.points, { title: POPULATION_TREND.title }), POPULATION_TREND.source, 2025)}
    ${chartCard(GDP_GROWTH.title, barChart(GDP_GROWTH.points, { title: GDP_GROWTH.title }), GDP_GROWTH.source, 2025)}
  </div>
  <section class="card">
    <h2>Explore the statistics</h2>
    <ul class="explore">
      <li><a href="#/population">Population</a> — age pyramid, growth trend and median age.</li>
      <li><a href="#/economy">Economy</a> — GDP growth, sectors and trade (2025 goods surplus: VLD ${balance} billion).</li>
      <li><a href="#/health">Health &amp; education</a> — life expectancy, hospitals, schools and attainment.</li>
      <li><a href="#/regions">Regions</a> — search and sort all ten regions by population, income or unemployment.</li>
      <li><a href="#/methods">Methods &amp; sources</a> — how each figure is compiled and where it comes from.</li>
    </ul>
  </section>`;
}

export function populationView() {
  const maleTotal = AGE_PYRAMID.rows.reduce((a, r) => a + r.male, 0);
  const femaleTotal = AGE_PYRAMID.rows.reduce((a, r) => a + r.female, 0);
  return `
  <h1 class="page">Population</h1>
  <p class="lede">${esc(COUNTRY.name)} has ${HEADLINES[0].value} residents in 2025, up 0.6% on 2024.
  The median age is ${HEADLINES[5].value.toLowerCase()} and rising as the large 30-49 cohorts age.</p>
  ${chartCard(POPULATION_TREND.title, lineChart(POPULATION_TREND.points, { title: POPULATION_TREND.title }), POPULATION_TREND.source, 2025)}
  ${chartCard(AGE_PYRAMID.title, pyramidChart(AGE_PYRAMID.rows, { title: AGE_PYRAMID.title }), AGE_PYRAMID.source, 2025,
    `<p class="note">Totals: ${maleTotal.toLocaleString('en-US')} thousand men and ${femaleTotal.toLocaleString('en-US')} thousand women — together the ${HEADLINES[0].value} residents of 2025.</p>`)}
  <section class="card"><h2>What this means</h2>
  <p>The widest cohorts are aged 30-49, the core working-age group. The 80+ group is
  about three-fifths women, which drives demand for care services. Growth since 2016 averages
  about 0.6% a year, split between natural increase and net migration into
  <a href="#/regions">Kestrel City and Eastport</a>.</p>${src('Population Register', 2025)}</section>`;
}

export function economyView() {
  const rows = TRADE.rows.map((r) => `<tr><td>${r.year}</td><td>${r.exports.toFixed(1)}</td><td>${r.imports.toFixed(1)}</td><td>${(r.exports - r.imports).toFixed(1)}</td></tr>`).join('');
  return `
  <h1 class="page">Economy</h1>
  <p class="lede">Real GDP grew ${HEADLINES[1].value} in the year to Q3 2025, inflation eased to
  ${HEADLINES[2].value}, and unemployment stands at ${HEADLINES[3].value}.</p>
  ${chartCard(GDP_GROWTH.title, barChart(GDP_GROWTH.points, { title: GDP_GROWTH.title }), GDP_GROWTH.source, 2025)}
  ${chartCard(SECTORS.title, shareBars(SECTORS.rows, { title: SECTORS.title }), SECTORS.source, 2025)}
  ${chartCard(TRADE.title, tradeChart(TRADE.rows, { title: TRADE.title }), TRADE.source, 2025)}
  <section class="card"><h2>Trade in goods (VLD billion)</h2>
  <div class="tablewrap"><table><thead><tr><th>Year</th><th>Exports</th><th>Imports</th><th>Balance</th></tr></thead>
  <tbody>${rows}</tbody></table></div>${src(TRADE.source, 2025)}</section>`;
}

function indicatorList(items) {
  return `<ul class="indicators">${items.map((i) => `
    <li><div><strong>${esc(i.label)}</strong><span class="note"> — ${esc(i.note)}</span></div>
    <div class="ind-value">${esc(i.value)}</div><div class="src">${esc(i.source)} · ${i.year}</div></li>`).join('')}</ul>`;
}

export function healthView() {
  return `
  <h1 class="page">Health &amp; education</h1>
  <p class="lede">Veldrians live to ${HEADLINES[4].value} on average, and ${EDUCATION[2].value} of
  25-34 year olds hold a tertiary qualification.</p>
  <section class="card"><h2>Health indicators</h2>${indicatorList(HEALTH)}</section>
  <section class="card"><h2>Education indicators</h2>${indicatorList(EDUCATION)}</section>
  <section class="card"><h2>Reading these figures</h2>
  <p>Life expectancy is a period measure: it applies 2024 mortality rates to a synthetic
  newborn cohort. Health spending covers public and private expenditure. Education
  attainment for 25-34 year olds is the headline comparator because most people have
  finished studying by then. See <a href="#/methods">Methods &amp; sources</a> for definitions.</p></section>`;
}

const METRICS = {
  pop: { label: 'Population (thousands)', fmt: (v) => v.toLocaleString('en-US') },
  density: { label: 'Density (per km²)', fmt: (v) => v.toLocaleString('en-US') },
  gdpPerCap: { label: 'GDP per capita (VLD)', fmt: (v) => v.toLocaleString('en-US') },
  unemployment: { label: 'Unemployment (%)', fmt: (v) => v.toFixed(1) },
  medianAge: { label: 'Median age (years)', fmt: (v) => v.toFixed(1) },
};

export function regionsView(params) {
  const q = (params.get('q') ?? '').trim().toLowerCase();
  const metric = METRICS[params.get('metric')] ? params.get('metric') : 'pop';
  const dir = params.get('dir') === 'asc' ? 'asc' : 'desc';
  const rows = REGIONS
    .filter((r) => !q || r.name.toLowerCase().includes(q))
    .sort((a, b) => (dir === 'desc' ? b[metric] - a[metric] : a[metric] - b[metric]));
  const totalPop = REGIONS.reduce((a, r) => a + r.pop, 0);
  const head = (key, label) => {
    const active = metric === key;
    const nextDir = active && dir === 'desc' ? 'asc' : 'desc';
    const qs = new URLSearchParams({ metric: key, dir: nextDir, ...(q ? { q } : {}) });
    return `<th><a href="#/regions?${qs}" ${active ? 'aria-current="true"' : ''}>${label}${active ? (dir === 'desc' ? ' ↓' : ' ↑') : ''}</a></th>`;
  };
  const body = rows.map((r) => `<tr><td>${esc(r.name)}</td><td>${METRICS.pop.fmt(r.pop)}</td><td>${METRICS.density.fmt(r.density)}</td><td>${METRICS.gdpPerCap.fmt(r.gdpPerCap)}</td><td>${METRICS.unemployment.fmt(r.unemployment)}</td><td>${METRICS.medianAge.fmt(r.medianAge)}</td></tr>`).join('');
  const empty = rows.length === 0 ? `<p class="note">No region matches “${esc(q)}”. <a href="#/regions">Show all ten regions</a>.</p>` : '';
  return `
  <h1 class="page">Regions</h1>
  <p class="lede">All ten regions of ${esc(COUNTRY.name)} — together ${totalPop.toLocaleString('en-US')} thousand
  residents, the national total. Search by name, or sort by any column.</p>
  <form class="controls" id="region-search" action="#/regions">
    <label>Search <input type="search" name="q" value="${esc(q)}" placeholder="e.g. kestrel" aria-label="Search regions"></label>
    <label>Sort by <select name="metric" aria-label="Sort metric">${Object.entries(METRICS).map(([k, m]) => `<option value="${k}" ${k === metric ? 'selected' : ''}>${m.label}</option>`).join('')}</select></label>
    <label>Order <select name="dir" aria-label="Sort order"><option value="desc" ${dir === 'desc' ? 'selected' : ''}>Highest first</option><option value="asc" ${dir === 'asc' ? 'selected' : ''}>Lowest first</option></select></label>
    <button type="submit">Apply</button>
    <a class="reset" href="#/regions">Reset</a>
  </form>
  <section class="card"><h2>${rows.length} of ${REGIONS.length} regions, sorted by ${METRICS[metric].label.toLowerCase()}</h2>
  ${empty}
  <div class="tablewrap"><table><thead><tr><th>Region</th>${head('pop', 'Population (000)')}${head('density', 'Density /km²')}${head('gdpPerCap', 'GDP per capita')}${head('unemployment', 'Unemployment %')}${head('medianAge', 'Median age')}</tr></thead>
  <tbody>${body}</tbody></table></div>${src(REGION_META.source, REGION_META.year)}</section>`;
}

export function methodsView() {
  return `
  <h1 class="page">Methods &amp; sources</h1>
  <p class="lede">Every figure on this site names its source office and reference year.
  ${esc(COUNTRY.name)} is fictional: the figures are invented for this demonstration, but they
  are internally consistent — regional populations sum to the national total, sector
  shares sum to 100%, and each trade balance is exports minus imports.</p>
  <section class="card"><h2>How the series are compiled</h2>
  <ul class="explore">
    <li><strong>Population</strong> — Population Register, 1 January estimates; age pyramid by sex.</li>
    <li><strong>GDP growth</strong> — National Accounts, chain-linked volumes, % year on year.</li>
    <li><strong>Sectors</strong> — National Accounts, gross value added at current prices.</li>
    <li><strong>Trade</strong> — Customs &amp; Trade Statistics, goods only, VLD billion.</li>
    <li><strong>Health</strong> — Vital Statistics, Hospital Statistics, Health Accounts.</li>
    <li><strong>Education</strong> — Census, Education Register, Labour Force Survey.</li>
    <li><strong>Regions</strong> — Regional Accounts &amp; Population Register, 2025.</li>
  </ul>${src(COUNTRY.source, COUNTRY.year)}</section>
  <section class="card"><h2>About this site</h2>
  <p>Veldria in Numbers is a static site: plain HTML, CSS and JavaScript with no build
  step and no network requests. It works offline on desktop and phone. Charts are
  drawn as inline SVG from the same dataset the tables use, so every number agrees.</p></section>`;
}

export function notFoundView(path) {
  return `
  <h1 class="page">Page not found</h1>
  <p class="lede">There is no page at <code>#${esc(path)}</code>.</p>
  <section class="card"><h2>Available pages</h2>
  <ul class="explore">
    <li><a href="#/">Overview</a></li><li><a href="#/population">Population</a></li>
    <li><a href="#/economy">Economy</a></li><li><a href="#/health">Health &amp; education</a></li>
    <li><a href="#/regions">Regions</a></li><li><a href="#/methods">Methods &amp; sources</a></li>
  </ul></section>`;
}
