// Veldria national statistics dataset.
// Veldria is a fictional country; every figure here is invented but internally
// consistent (regional populations sum to the national total, trade balance is
// exports minus imports, pyramid rows sum to the population). Each series
// carries the source office and reference year shown beside it on the site.

export const COUNTRY = {
  name: 'Veldria',
  capital: 'Kestrel City',
  currency: 'Veldrian veld (VLD)',
  areaKm2: 312450,
  source: 'Veldria Statistical Office, Annual Abstract',
  year: 2025,
};

export const HEADLINES = [
  { label: 'Population', value: '24.18 million', delta: '+0.6% on 2024', dir: 'up', source: 'Population Register', year: 2025 },
  { label: 'GDP growth', value: '+3.1%', delta: 'year to Q3 2025', dir: 'up', source: 'National Accounts', year: 2025 },
  { label: 'Inflation (CPI)', value: '2.8%', delta: 'down from 4.1% in 2024', dir: 'down', source: 'Consumer Prices', year: 2025 },
  { label: 'Unemployment', value: '4.9%', delta: 'ages 15-64', dir: 'down', source: 'Labour Force Survey', year: 2025 },
  { label: 'Life expectancy', value: '81.2 years', delta: 'at birth, both sexes', dir: 'up', source: 'Vital Statistics', year: 2024 },
  { label: 'Median age', value: '40.1 years', delta: 'up 0.4 since 2023', dir: 'up', source: 'Population Register', year: 2025 },
];

export const POPULATION_TREND = {
  title: 'Population, 2016-2025 (millions)',
  source: 'Population Register, 1 January estimates',
  points: [
    { year: 2016, value: 22.84 }, { year: 2017, value: 23.02 }, { year: 2018, value: 23.21 },
    { year: 2019, value: 23.43 }, { year: 2020, value: 23.55 }, { year: 2021, value: 23.68 },
    { year: 2022, value: 23.79 }, { year: 2023, value: 23.91 }, { year: 2024, value: 24.03 },
    { year: 2025, value: 24.18 },
  ],
};

export const AGE_PYRAMID = {
  title: 'Population by age group and sex, 2025 (thousands)',
  source: 'Population Register, 1 January 2025',
  rows: [
    { age: '0-9', male: 1327, female: 1268 },
    { age: '10-19', male: 1421, female: 1366 },
    { age: '20-29', male: 1672, female: 1633 },
    { age: '30-39', male: 1806, female: 1780 },
    { age: '40-49', male: 1707, female: 1695 },
    { age: '50-59', male: 1563, female: 1587 },
    { age: '60-69', male: 1314, female: 1399 },
    { age: '70-79', male: 812, female: 948 },
    { age: '80+', male: 334, female: 548 },
  ],
};

export const GDP_GROWTH = {
  title: 'Real GDP growth, 2016-2025 (% year on year)',
  source: 'National Accounts, chain-linked volumes',
  points: [
    { year: 2016, value: 2.4 }, { year: 2017, value: 3.0 }, { year: 2018, value: 2.2 },
    { year: 2019, value: 2.7 }, { year: 2020, value: -2.1 }, { year: 2021, value: 5.2 },
    { year: 2022, value: 3.6 }, { year: 2023, value: 1.8 }, { year: 2024, value: 2.5 },
    { year: 2025, value: 3.1 },
  ],
};

export const SECTORS = {
  title: 'Gross value added by sector, 2025 (share of total, %)',
  source: 'National Accounts, current prices',
  rows: [
    { name: 'Services', share: 58.4 },
    { name: 'Industry', share: 21.7 },
    { name: 'Construction', share: 7.9 },
    { name: 'Agriculture & fishing', share: 4.6 },
    { name: 'Energy & utilities', share: 4.3 },
    { name: 'Other', share: 3.1 },
  ],
};

export const TRADE = {
  title: 'Trade in goods, 2016-2025 (VLD billion)',
  source: 'Customs & Trade Statistics',
  rows: [
    { year: 2016, exports: 118.4, imports: 109.2 },
    { year: 2017, exports: 126.9, imports: 115.8 },
    { year: 2018, exports: 134.2, imports: 123.5 },
    { year: 2019, exports: 141.6, imports: 129.7 },
    { year: 2020, exports: 128.3, imports: 117.4 },
    { year: 2021, exports: 152.8, imports: 138.9 },
    { year: 2022, exports: 171.5, imports: 156.2 },
    { year: 2023, exports: 178.9, imports: 163.4 },
    { year: 2024, exports: 189.3, imports: 171.8 },
    { year: 2025, exports: 201.6, imports: 180.9 },
  ],
};

export const HEALTH = [
  { label: 'Life expectancy at birth', value: '81.2 years', note: 'women 83.4, men 78.9', source: 'Vital Statistics', year: 2024 },
  { label: 'Infant mortality', value: '3.1 per 1,000', note: 'live births', source: 'Vital Statistics', year: 2024 },
  { label: 'Physicians', value: '3.8 per 1,000', note: 'practising, headcount', source: 'Health Workforce Census', year: 2024 },
  { label: 'Hospital beds', value: '4.6 per 1,000', note: 'all hospitals', source: 'Hospital Statistics', year: 2024 },
  { label: 'Health spending', value: '9.4% of GDP', note: 'public and private', source: 'Health Accounts', year: 2024 },
  { label: 'Adult smoking rate', value: '14.2%', note: 'daily smokers, 18+', source: 'Health Interview Survey', year: 2024 },
];

export const EDUCATION = [
  { label: 'Literacy rate (15+)', value: '99.1%', note: 'self-reported reading ability', source: 'Census', year: 2023 },
  { label: 'Upper-secondary completion', value: '87.5%', note: 'age 25-34', source: 'Education Register', year: 2024 },
  { label: 'Tertiary attainment', value: '41.8%', note: 'age 25-34', source: 'Labour Force Survey', year: 2024 },
  { label: 'Student-teacher ratio', value: '13.9', note: 'primary education', source: 'School Census', year: 2024 },
  { label: 'Education spending', value: '5.2% of GDP', note: 'all levels, public', source: 'Education Finance', year: 2024 },
];

export const REGION_META = {
  source: 'Regional Accounts & Population Register',
  year: 2025,
};

// Population in thousands; sums to 24,180 (= 24.18 million).
export const REGIONS = [
  { name: 'Kestrel City', pop: 5240, density: 4180, gdpPerCap: 58200, unemployment: 4.1, medianAge: 37.2 },
  { name: 'Northmere', pop: 3115, density: 96, gdpPerCap: 39800, unemployment: 5.6, medianAge: 41.8 },
  { name: 'Southvale', pop: 2890, density: 142, gdpPerCap: 44100, unemployment: 4.8, medianAge: 39.6 },
  { name: 'Eastport', pop: 2475, density: 388, gdpPerCap: 49600, unemployment: 4.4, medianAge: 38.9 },
  { name: 'Westfield', pop: 2210, density: 118, gdpPerCap: 38400, unemployment: 5.9, medianAge: 42.4 },
  { name: 'Highmoor', pop: 1685, density: 54, gdpPerCap: 34200, unemployment: 6.3, medianAge: 44.1 },
  { name: 'Lake District', pop: 1540, density: 87, gdpPerCap: 36900, unemployment: 5.2, medianAge: 43.0 },
  { name: 'Rivergate', pop: 1830, density: 265, gdpPerCap: 42700, unemployment: 5.0, medianAge: 39.1 },
  { name: 'Stonebridge', pop: 1325, density: 174, gdpPerCap: 40500, unemployment: 5.4, medianAge: 40.6 },
  { name: 'Fenwick Isles', pop: 1870, density: 203, gdpPerCap: 41300, unemployment: 5.1, medianAge: 40.9 },
];
