#!/usr/bin/env python3
"""Render the four Veldria screenshots without a browser.

No browser binary exists on the build machine, so this script draws the site
with PIL, mirroring app/'s own composition and data: navy header with nav,
hero, KPI cards, the population and GDP charts on the overview; the trend and
age pyramid on the population page; the searchable regions table; and the
overview stacked at phone width. Figures match app/data.js exactly.
Output: screenshots/1-overview.png, 2-population.png, 3-regions.png (1280x800)
and 4-phone.png (390x844). Run from the repo root: python3 tools/render_shots.py
"""

from PIL import Image, ImageDraw, ImageFont

NAVY = (15, 43, 70)
TEAL = (14, 124, 123)
AMBER = (232, 163, 61)
INK = (23, 36, 46)
MUTED = (90, 107, 118)
LINE = (223, 231, 236)
BG = (244, 247, 249)
WHITE = (255, 255, 255)
DOWN = (179, 84, 30)

POP_TREND = [(2016, 22.84), (2017, 23.02), (2018, 23.21), (2019, 23.43), (2020, 23.55),
             (2021, 23.68), (2022, 23.79), (2023, 23.91), (2024, 24.03), (2025, 24.18)]
GDP = [(2016, 2.4), (2017, 3.0), (2018, 2.2), (2019, 2.7), (2020, -2.1), (2021, 5.2),
       (2022, 3.6), (2023, 1.8), (2024, 2.5), (2025, 3.1)]
PYRAMID = [('0-9', 1327, 1268), ('10-19', 1421, 1366), ('20-29', 1672, 1633),
           ('30-39', 1806, 1780), ('40-49', 1707, 1695), ('50-59', 1563, 1587),
           ('60-69', 1314, 1399), ('70-79', 812, 948), ('80+', 334, 548)]
KPIS = [('POPULATION', '24.18 million', '+0.6% on 2024', True, 'Population Register · 2025'),
        ('GDP GROWTH', '+3.1%', 'year to Q3 2025', True, 'National Accounts · 2025'),
        ('INFLATION (CPI)', '2.8%', 'down from 4.1% in 2024', False, 'Consumer Prices · 2025'),
        ('UNEMPLOYMENT', '4.9%', 'ages 15-64', False, 'Labour Force Survey · 2025'),
        ('LIFE EXPECTANCY', '81.2 years', 'at birth, both sexes', True, 'Vital Statistics · 2024'),
        ('MEDIAN AGE', '40.1 years', 'up 0.4 since 2023', True, 'Population Register · 2025')]
REGIONS = [('Kestrel City', 5240, 4180, 58200, 4.1, 37.2), ('Northmere', 3115, 96, 39800, 5.6, 41.8),
           ('Southvale', 2890, 142, 44100, 4.8, 39.6), ('Eastport', 2475, 388, 49600, 4.4, 38.9),
           ('Westfield', 2210, 118, 38400, 5.9, 42.4), ('Rivergate', 1830, 265, 42700, 5.0, 39.1),
           ('Fenwick Isles', 1870, 203, 41300, 5.1, 40.9), ('Highmoor', 1685, 54, 34200, 6.3, 44.1),
           ('Lake District', 1540, 87, 36900, 5.2, 43.0), ('Stonebridge', 1325, 174, 40500, 5.4, 40.6)]
NAV = ['Overview', 'Population', 'Economy', 'Health & education', 'Regions', 'Methods']


def font(size, bold=False):
    names = (['DejaVuSans-Bold.ttf'] if bold else ['DejaVuSans.ttf'])
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            pass
    return ImageFont.load_default()


def header(d, w, active):
    d.rectangle([0, 0, w, 64], fill=NAVY)
    d.rounded_rectangle([18, 13, 56, 51], 8, fill=AMBER)
    d.text((29, 20), 'V', font=font(22, True), fill=NAVY)
    d.text((66, 12), 'Veldria in Numbers', font=font(19, True), fill=WHITE)
    d.text((66, 36), 'NATIONAL STATISTICS', font=font(10), fill=(188, 211, 228))
    x = w - 18
    for label in reversed(NAV):
        tw = d.textlength(label, font=font(14, label == active))
        x -= tw + 18
        if label == active:
            d.rounded_rectangle([x - 6, 18, x + tw + 6, 46], 6, fill=TEAL)
        d.text((x, 23), label, font=font(14, label == active), fill=WHITE)
        x -= 6


def kpi_row(d, x, y, w, items, cols):
    gap = 10
    cw = (w - gap * (cols - 1)) / cols
    ch = 108
    for i, (label, value, delta, up, src) in enumerate(items):
        cx = x + (i % cols) * (cw + gap)
        cy = y + (i // cols) * (ch + gap)
        d.rounded_rectangle([cx, cy, cx + cw, cy + ch], 9, fill=WHITE, outline=LINE)
        d.rectangle([cx, cy, cx + cw, cy + 4], fill=TEAL)
        d.text((cx + 12, cy + 12), label, font=font(11, True), fill=MUTED)
        d.text((cx + 12, cy + 30), value, font=font(22, True), fill=NAVY)
        delta_text = ('▲ ' if up else '▼ ') + delta
        dsize = 12
        while dsize > 9 and d.textlength(delta_text, font=font(dsize, True)) > cw - 22:
            dsize -= 1
        d.text((cx + 12, cy + 62), delta_text, font=font(dsize, True), fill=TEAL if up else DOWN)
        d.text((cx + 12, cy + 84), src, font=font(10), fill=MUTED)
    rows = (len(items) + cols - 1) // cols
    return y + rows * (ch + gap)


def line_chart(d, x, y, w, h, points):
    vals = [v for _, v in points]
    lo, hi = min(vals), max(vals) * 1.02
    px = lambda i: x + 46 + i * (w - 62) / (len(points) - 1)
    py = lambda v: y + 14 + (1 - (v - lo) / (hi - lo)) * (h - 48)
    for f in (0, 0.5, 1):
        v = lo + f * (hi - lo)
        d.line([x + 46, py(v), x + w - 14, py(v)], fill=LINE)
        d.text((x + 40, py(v) - 6), f'{v:.1f}', font=font(10), fill=MUTED, anchor='ra')
    pts = [(px(i), py(v)) for i, (_, v) in enumerate(points)]
    d.line(pts, fill=TEAL, width=3)
    for (cx, cy) in pts:
        d.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=TEAL)
    for i, (yr, _) in enumerate(points):
        d.text((px(i), y + h - 20), str(yr), font=font(10), fill=MUTED, anchor='ma')
    d.text((px(len(points) - 1), py(vals[-1]) - 22), str(vals[-1]), font=font(13, True), fill=NAVY, anchor='ra')


def bar_chart(d, x, y, w, h, points):
    vals = [v for _, v in points]
    hi, lo = max(vals) * 1.15, min(vals + [0])
    py = lambda v: y + 22 + (1 - (v - lo) / (hi - lo)) * (h - 56)
    bw = (w - 58) / len(points)
    d.line([x + 44, py(0), x + w - 12, py(0)], fill=(157, 178, 191))
    for i, (yr, v) in enumerate(points):
        bx = x + 44 + i * bw + 3
        top, bot = py(max(v, 0)), py(min(v, 0))
        d.rounded_rectangle([bx, top, bx + bw - 6, max(bot, top + 2)], 2, fill=(192, 57, 43) if v < 0 else NAVY)
        d.text((bx + (bw - 6) / 2, (bot + 3) if v < 0 else (top - 15)), str(v), font=font(10, True), fill=INK, anchor='ma')
        d.text((bx + (bw - 6) / 2, y + h - 20), str(yr), font=font(10), fill=MUTED, anchor='ma')


def card(d, x, y, w, h, title, source):
    d.rounded_rectangle([x, y, x + w, y + h], 11, fill=WHITE, outline=LINE)
    d.text((x + 16, y + 12), title, font=font(16, True), fill=NAVY)
    d.text((x + 16, y + h - 24), source, font=font(11), fill=MUTED)


def overview(w, h, phone=False):
    img = Image.new('RGB', (w, h), BG)
    d = ImageDraw.Draw(img)
    if phone:
        d.rectangle([0, 0, w, 104], fill=NAVY)
        d.rounded_rectangle([14, 12, 48, 46], 7, fill=AMBER)
        d.text((23, 18), 'V', font=font(19, True), fill=NAVY)
        d.text((56, 12), 'Veldria in Numbers', font=font(16, True), fill=WHITE)
        d.text((56, 34), 'NATIONAL STATISTICS', font=font(9), fill=(188, 211, 228))
        nx = 14
        for label in ['Overview', 'Population', 'Economy']:
            tw = d.textlength(label, font=font(12, label == 'Overview'))
            if label == 'Overview':
                d.rounded_rectangle([nx - 5, 62, nx + tw + 5, 88], 6, fill=TEAL)
            d.text((nx, 67), label, font=font(12, label == 'Overview'), fill=WHITE)
            nx += tw + 22
        y = 118
        d.text((16, y), 'NATIONAL STATISTICS · 2025 EDITION', font=font(10, True), fill=TEAL)
        d.text((16, y + 18), 'Veldria in Numbers', font=font(24, True), fill=NAVY)
        d.text((16, y + 52), 'Headline figures for Veldria —', font=font(13), fill=INK)
        d.text((16, y + 70), 'population, economy, health,', font=font(13), fill=INK)
        d.text((16, y + 88), 'education and ten regions.', font=font(13), fill=INK)
        y = kpi_row(d, 16, y + 118, w - 32, KPIS, 2)
        card(d, 16, y + 6, w - 32, 250, 'Population, 2016-2025 (millions)', 'Source: Population Register · 2025')
        line_chart(d, 16, y + 44, w - 32, 180, POP_TREND)
        return img
    header(d, w, 'Overview')
    y = 84
    d.text((24, y), 'NATIONAL STATISTICS · 2025 EDITION', font=font(12, True), fill=TEAL)
    d.text((24, y + 20), 'Veldria in Numbers', font=font(32, True), fill=NAVY)
    d.text((24, y + 62), 'The headline figures for Veldria — population, economy, health, education and its ten regions —', font=font(15), fill=INK)
    d.text((24, y + 84), 'each with its source and reference year. Capital: Kestrel City · Currency: Veldrian veld (VLD).', font=font(15), fill=INK)
    d.text((24, y + 108), 'Source: Veldria Statistical Office, Annual Abstract · 2025', font=font(12), fill=MUTED)
    y = kpi_row(d, 24, y + 132, w - 48, KPIS, 6)
    cw = (w - 48 - 14) / 2
    card(d, 24, y + 8, cw, 300, 'Population, 2016-2025 (millions)', 'Source: Population Register, 1 January estimates · 2025')
    line_chart(d, 24, y + 48, cw, 224, POP_TREND)
    card(d, 24 + cw + 14, y + 8, cw, 300, 'Real GDP growth, 2016-2025 (% year on year)', 'Source: National Accounts, chain-linked volumes · 2025')
    bar_chart(d, 24 + cw + 14, y + 48, cw, 224, GDP)
    d.text((24, y + 322), 'Explore:  Population  ·  Economy  ·  Health & education  ·  Regions  ·  Methods & sources', font=font(14, True), fill=TEAL)
    return img


def population(w, h):
    img = Image.new('RGB', (w, h), BG)
    d = ImageDraw.Draw(img)
    header(d, w, 'Population')
    y = 84
    d.text((24, y), 'Population', font=font(29, True), fill=NAVY)
    d.text((24, y + 42), 'Veldria has 24.18 million residents in 2025, up 0.6% on 2024. Median age: 40.1 years.', font=font(15), fill=INK)
    card(d, 24, y + 74, w - 48, 252, 'Population, 2016-2025 (millions)', 'Source: Population Register, 1 January estimates · 2025')
    line_chart(d, 24, y + 112, w - 48, 186, POP_TREND)
    py0 = y + 342
    card(d, 24, py0, w - 48, h - py0 - 18, 'Population by age group and sex, 2025 (thousands)', 'Source: Population Register, 1 January 2025')
    mid = w / 2
    maxv = max(max(m, f) for _, m, f in PYRAMID)
    scale = (mid - 150) / maxv
    d.rectangle([mid - 110, py0 + 44, mid - 98, py0 + 56], fill=NAVY)
    d.text((mid - 93, py0 + 43), 'Male', font=font(12), fill=INK)
    d.rectangle([mid + 20, py0 + 44, mid + 32, py0 + 56], fill=AMBER)
    d.text((mid + 37, py0 + 43), 'Female', font=font(12), fill=INK)
    for i, (age, m, f) in enumerate(reversed(PYRAMID)):
        ry = py0 + 64 + i * 30
        mw, fw = m * scale, f * scale
        d.rounded_rectangle([mid - 30 - mw, ry, mid - 30, ry + 21], 2, fill=NAVY)
        d.rounded_rectangle([mid + 30, ry, mid + 30 + fw, ry + 21], 2, fill=AMBER)
        d.text((mid, ry + 4), age, font=font(11), fill=INK, anchor='ma')
        d.text((mid - 36 - mw, ry + 4), f'{m:,}', font=font(10), fill=MUTED, anchor='ra')
        d.text((mid + 36 + fw, ry + 4), f'{f:,}', font=font(10), fill=MUTED)
    return img


def regions(w, h):
    img = Image.new('RGB', (w, h), BG)
    d = ImageDraw.Draw(img)
    header(d, w, 'Regions')
    y = 84
    d.text((24, y), 'Regions', font=font(29, True), fill=NAVY)
    d.text((24, y + 42), 'All ten regions of Veldria — together 24,180 thousand residents, the national total. Search or sort by any column.', font=font(15), fill=INK)
    cy = y + 80
    for label, val, bx in [('Search', 'e.g. kestrel', 24), ('Sort by', 'Population (thousands)', 330), ('Order', 'Highest first', 640)]:
        d.text((bx, cy), label.upper(), font=font(11, True), fill=MUTED)
        d.rounded_rectangle([bx, cy + 18, bx + 270, cy + 56], 7, fill=WHITE, outline=LINE)
        d.text((bx + 10, cy + 28), val, font=font(14), fill=INK if label != 'Search' else MUTED)
    d.rounded_rectangle([940, cy + 18, 1030, cy + 56], 7, fill=TEAL)
    d.text((985, cy + 28), 'Apply', font=font(14, True), fill=WHITE, anchor='ma')
    d.text((1050, cy + 28), 'Reset', font=font(14), fill=TEAL)
    ty = cy + 78
    card(d, 24, ty, w - 48, h - ty - 18, '10 of 10 regions, sorted by population (thousands)', 'Source: Regional Accounts & Population Register · 2025')
    cols = [('Region', 24), ('Population (000) ↓', 500), ('Density /km²', 690), ('GDP per capita', 860), ('Unemployment %', 1020), ('Median age', 1180)]
    hy = ty + 48
    for label, cx in cols:
        d.text((cx + 16 if cx == 24 else cx, hy), label, font=font(13, True), fill=NAVY, anchor='la' if cx == 24 else 'ra')
    d.line([40, hy + 22, w - 40, hy + 22], fill=LINE)
    for i, (name, pop, den, gdp, un, age) in enumerate(sorted(REGIONS, key=lambda r: -r[1])):
        ry = hy + 32 + i * 36
        if i % 2:
            d.rectangle([40, ry - 4, w - 40, ry + 28], fill=(248, 250, 251))
        d.text((40, ry), name, font=font(14), fill=INK)
        for val, cx in [(f'{pop:,}', 500), (f'{den:,}', 690), (f'{gdp:,}', 860), (f'{un:.1f}', 1020), (f'{age:.1f}', 1180)]:
            d.text((cx, ry), val, font=font(14), fill=INK, anchor='ra')
    return img


def main():
    overview(1280, 800).save('screenshots/1-overview.png', optimize=True)
    population(1280, 800).save('screenshots/2-population.png', optimize=True)
    regions(1280, 800).save('screenshots/3-regions.png', optimize=True)
    overview(390, 844, phone=True).save('screenshots/4-phone.png', optimize=True)
    print('rendered 4 screenshots')


if __name__ == '__main__':
    main()
