// Inline-SVG chart builders for the Veldria site. Pure functions from data to
// SVG strings: no library, no network, values labelled so charts stay readable
// when shrunk. All charts size to their container via viewBox.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function niceCeil(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 1.5, 2, 2.5, 5, 10]) if (v <= m * p) return m * p;
  return 10 * p;
}

export function lineChart(points, opts = {}) {
  const w = 640, h = 280, padL = 52, padR = 16, padT = 18, padB = 34;
  const vals = points.map((p) => p.value);
  const span = Math.max(...vals) - Math.min(...vals);
  const lo = opts.zeroBase ? 0 : Math.min(...vals) - span * 0.08;
  const hi = niceCeil(Math.max(...vals) * 1.05);
  const x = (i) => padL + (i * (w - padL - padR)) / Math.max(1, points.length - 1);
  const y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (h - padT - padB);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${path} L${x(points.length - 1).toFixed(1)},${y(lo).toFixed(1)} L${x(0).toFixed(1)},${y(lo).toFixed(1)} Z`;
  const dots = points.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="3.5" fill="#0e7c7b"/>`).join('');
  const labels = points.map((p, i) => `<text x="${x(i).toFixed(1)}" y="${h - 12}" text-anchor="middle" font-size="11" fill="#5a6b76">${p.year}</text>`).join('');
  const last = points[points.length - 1];
  const lastLabel = `<text x="${x(points.length - 1).toFixed(1)}" y="${(y(last.value) - 10).toFixed(1)}" text-anchor="end" font-size="13" font-weight="700" fill="#0f2b46">${last.value}</text>`;
  const grid = [0, 0.5, 1].map((f) => {
    const v = lo + f * (hi - lo);
    return `<line x1="${padL}" x2="${w - padR}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="#dfe7ec"/><text x="${padL - 6}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#5a6b76">${Math.round(v * 10) / 10}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title ?? 'line chart')}">${grid}<path d="${area}" fill="#0e7c7b" opacity="0.12"/><path d="${path}" fill="none" stroke="#0e7c7b" stroke-width="2.5"/>${dots}${labels}${lastLabel}</svg>`;
}

export function barChart(points, opts = {}) {
  const w = 640, h = 280, padL = 44, padR = 12, padT = 24, padB = 34;
  const vals = points.map((p) => p.value);
  const hi = niceCeil(Math.max(...vals, 0) * 1.15);
  const lo = Math.min(...vals, 0);
  const y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (h - padT - padB);
  const bw = (w - padL - padR) / points.length;
  const bars = points.map((p, i) => {
    const top = y(Math.max(p.value, 0)), bot = y(Math.min(p.value, 0));
    const fill = p.value < 0 ? '#c0392b' : '#0f2b46';
    const ly = p.value < 0 ? bot + 14 : top - 5;
    return `<rect x="${(padL + i * bw + 3).toFixed(1)}" y="${top.toFixed(1)}" width="${(bw - 6).toFixed(1)}" height="${Math.max(1, bot - top).toFixed(1)}" fill="${fill}" rx="2"/><text x="${(padL + i * bw + bw / 2).toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#17242e">${p.value}</text><text x="${(padL + i * bw + bw / 2).toFixed(1)}" y="${h - 12}" text-anchor="middle" font-size="11" fill="#5a6b76">${p.year}</text>`;
  }).join('');
  const zero = `<line x1="${padL}" x2="${w - padR}" y1="${y(0).toFixed(1)}" y2="${y(0).toFixed(1)}" stroke="#9db2bf"/>`;
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title ?? 'bar chart')}">${zero}${bars}</svg>`;
}

export function pyramidChart(rows, opts = {}) {
  const w = 640, rowH = 26, padT = 26, mid = w / 2, labelW = 52;
  const h = padT + rows.length * rowH + 8;
  const max = Math.max(...rows.flatMap((r) => [r.male, r.female]));
  const scale = (mid - labelW - 46) / max;
  const body = [...rows].reverse().map((r, i) => {
    const y0 = padT + i * rowH;
    const mw = r.male * scale, fw = r.female * scale;
    return `<rect x="${(mid - labelW / 2 - mw).toFixed(1)}" y="${y0}" width="${mw.toFixed(1)}" height="${rowH - 5}" fill="#0f2b46" rx="2"/>` +
      `<rect x="${(mid + labelW / 2).toFixed(1)}" y="${y0}" width="${fw.toFixed(1)}" height="${rowH - 5}" fill="#e8a33d" rx="2"/>` +
      `<text x="${mid}" y="${y0 + rowH - 10}" text-anchor="middle" font-size="11" fill="#17242e">${esc(r.age)}</text>` +
      `<text x="${(mid - labelW / 2 - mw - 5).toFixed(1)}" y="${y0 + rowH - 10}" text-anchor="end" font-size="10" fill="#5a6b76">${r.male.toLocaleString('en-US')}</text>` +
      `<text x="${(mid + labelW / 2 + fw + 5).toFixed(1)}" y="${y0 + rowH - 10}" font-size="10" fill="#5a6b76">${r.female.toLocaleString('en-US')}</text>`;
  }).join('');
  const legend = `<rect x="${mid - 120}" y="4" width="12" height="12" fill="#0f2b46"/><text x="${mid - 104}" y="15" font-size="12" fill="#17242e">Male</text><rect x="${mid + 10}" y="4" width="12" height="12" fill="#e8a33d"/><text x="${mid + 26}" y="15" font-size="12" fill="#17242e">Female</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title ?? 'population pyramid')}">${legend}${body}</svg>`;
}

export function shareBars(rows, opts = {}) {
  const w = 640, rowH = 34, labelW = 168, valW = 52;
  const h = rows.length * rowH + 6;
  const max = Math.max(...rows.map((r) => r.share));
  const body = rows.map((r, i) => {
    const y0 = 4 + i * rowH;
    const bw = ((w - labelW - valW) * r.share) / max;
    return `<text x="0" y="${y0 + 17}" font-size="13" fill="#17242e">${esc(r.name)}</text>` +
      `<rect x="${labelW}" y="${y0}" width="${bw.toFixed(1)}" height="20" fill="#0e7c7b" rx="3"/>` +
      `<text x="${(labelW + bw + 8).toFixed(1)}" y="${y0 + 15}" font-size="13" font-weight="700" fill="#0f2b46">${r.share}%</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title ?? 'share chart')}">${body}</svg>`;
}

export function tradeChart(rows, opts = {}) {
  const w = 640, h = 280, padL = 48, padR = 12, padT = 30, padB = 34;
  const hi = niceCeil(Math.max(...rows.flatMap((r) => [r.exports, r.imports])) * 1.08);
  const y = (v) => padT + (1 - v / hi) * (h - padT - padB);
  const bw = (w - padL - padR) / rows.length;
  const bars = rows.map((r, i) => {
    const x0 = padL + i * bw;
    return `<rect x="${(x0 + 2).toFixed(1)}" y="${y(r.exports).toFixed(1)}" width="${(bw / 2 - 3).toFixed(1)}" height="${(y(0) - y(r.exports)).toFixed(1)}" fill="#0e7c7b" rx="2"/>` +
      `<rect x="${(x0 + bw / 2 + 1).toFixed(1)}" y="${y(r.imports).toFixed(1)}" width="${(bw / 2 - 3).toFixed(1)}" height="${(y(0) - y(r.imports)).toFixed(1)}" fill="#e8a33d" rx="2"/>` +
      `<text x="${(x0 + bw / 2).toFixed(1)}" y="${h - 12}" text-anchor="middle" font-size="11" fill="#5a6b76">${r.year}</text>`;
  }).join('');
  const legend = `<rect x="${padL}" y="6" width="12" height="12" fill="#0e7c7b"/><text x="${padL + 16}" y="17" font-size="12" fill="#17242e">Exports</text><rect x="${padL + 96}" y="6" width="12" height="12" fill="#e8a33d"/><text x="${padL + 112}" y="17" font-size="12" fill="#17242e">Imports</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title ?? 'trade chart')}">${legend}${bars}</svg>`;
}
