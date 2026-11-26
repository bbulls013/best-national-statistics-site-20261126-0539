// Hash router for Veldria in Numbers.
// Routes: #/ overview · #/population · #/economy · #/health ·
// #/regions?q=&metric=&dir= · #/methods · anything else -> not-found page.

import {
  overviewView, populationView, economyView, healthView,
  regionsView, methodsView, notFoundView,
} from './views.js';

const mainEl = document.getElementById('main');
const navLinks = [...document.querySelectorAll('nav a[data-route]')];

const TITLES = {
  '/': 'Overview',
  '/population': 'Population',
  '/economy': 'Economy',
  '/health': 'Health & education',
  '/regions': 'Regions',
  '/methods': 'Methods & sources',
};

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  return { path: path === '' ? '/' : path, params: new URLSearchParams(query) };
}

function render() {
  const { path, params } = parseHash();
  let html;
  switch (path) {
    case '/': html = overviewView(); break;
    case '/population': html = populationView(); break;
    case '/economy': html = economyView(); break;
    case '/health': html = healthView(); break;
    case '/regions': html = regionsView(params); break;
    case '/methods': html = methodsView(); break;
    default: html = notFoundView(path);
  }
  mainEl.innerHTML = html;
  mainEl.setAttribute('aria-label', TITLES[path] ?? 'Not found');
  document.title = `${TITLES[path] ?? 'Not found'} · Veldria in Numbers`;
  for (const a of navLinks) {
    if (a.dataset.route === path) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  const form = document.getElementById('region-search');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const qs = new URLSearchParams();
      const q = String(data.get('q') ?? '').trim();
      if (q) qs.set('q', q);
      qs.set('metric', String(data.get('metric') ?? 'pop'));
      qs.set('dir', String(data.get('dir') ?? 'desc'));
      location.hash = `#/regions?${qs}`;
    });
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
