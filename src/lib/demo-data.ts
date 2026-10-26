/* Sample data for the /ask demo: a fictional food manufacturer, not a real customer.
   Deterministic, so the same question always gets the same answer. */

export const COMPANY = "Shapla Foods Ltd";
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const YEARS = [2024, 2025, 2026] as const;
export type Year = (typeof YEARS)[number];
export const THIS_YEAR: Year = 2026;
export const LAST_YEAR: Year = 2025;
/** 2026 is year-to-date: January to September. */
export const monthsIn = (y: Year) => (y === THIS_YEAR ? 9 : 12);
export const yearLabel = (y: Year) => (y === THIS_YEAR ? "Jan to Sep 2026" : String(y));

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GROWTH: Record<Year, number> = { 2024: 0.88, 2025: 1, 2026: 1.13 };
/** Rates and percentages don't compound with business growth. */
const FLAT: Record<Year, number> = { 2024: 1, 2025: 1, 2026: 1 };

/** Monthly series with a seasonal shape, year-on-year growth and a little noise. */
function monthly(base: number, season: number[], seed: number, noise = 0.04, growth = GROWTH): Record<Year, number[]> {
  const out = {} as Record<Year, number[]>;
  for (const y of YEARS) {
    const r = rng(seed + y);
    out[y] = Array.from({ length: monthsIn(y) }, (_, m) => round(growth === FLAT, base * growth[y] * season[m] * (1 + (r() - 0.5) * 2 * noise)));
  }
  return out;
}

// rates keep one decimal; money and counts are whole numbers
const round = (rate: boolean, v: number) => (rate ? Math.round(v * 10) / 10 : Math.round(v));

const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

// Eid, Pohela Boishakh and winter weddings drive a sweets & dairy business
const SALES_SEASON = [0.92, 0.95, 1.18, 1.24, 1.0, 1.1, 0.93, 0.9, 0.96, 1.02, 1.0, 1.14];

export const sales = {
  monthly: monthly(9_00_00_000, SALES_SEASON, 11), // ≈ ৳ 9 Cr a month in 2025
  divisions: [
    ["Dhaka", 0.36],
    ["Chattogram", 0.2],
    ["Rajshahi", 0.1],
    ["Khulna", 0.09],
    ["Sylhet", 0.08],
    ["Mymensingh", 0.07],
    ["Rangpur", 0.05],
    ["Barishal", 0.05],
  ] as [string, number][],
  categories: [
    ["Sweets", 0.38],
    ["Dairy & doi", 0.27],
    ["Bakery", 0.16],
    ["Snacks", 0.12],
    ["Beverages", 0.07],
  ] as [string, number][],
  channels: [
    ["Dealers", 0.52],
    ["Showrooms (POS)", 0.27],
    ["Corporate & events", 0.14],
    ["Online", 0.07],
  ] as [string, number][],
  dealers: [
    ["Rahman Distribution, Dhaka", 0.045],
    ["Port City Traders, Chattogram", 0.038],
    ["Barendra Foods, Rajshahi", 0.024],
    ["Surma Enterprise, Sylhet", 0.021],
    ["Rupali Agencies, Khulna", 0.019],
  ] as [string, number][],
};
export const salesTotal = (y: Year) => sum(sales.monthly[y]);

export const payroll = {
  monthly: monthly(1_74_00_000, [1, 1, 1.02, 1.36, 1.01, 1.03, 1, 1, 1.01, 1.02, 1.01, 1.05], 21, 0.01),
  overtime: monthly(13_50_000, [0.9, 0.95, 1.25, 1.35, 1.0, 1.15, 0.9, 0.85, 0.95, 1.05, 1.0, 1.2], 22, 0.06),
  departments: [
    ["Production", 640, 15_500],
    ["Distribution", 210, 14_200],
    ["Sales", 180, 18_800],
    ["Admin", 80, 21_000],
    ["Quality control", 60, 19_500],
    ["Finance", 30, 38_000],
    ["HR", 20, 34_000],
    ["IT", 20, 45_000],
  ] as [string, number, number][],
  components: [
    ["Basic", 0.55],
    ["House rent", 0.22],
    ["Overtime", 0.08],
    ["Medical & conveyance", 0.09],
    ["Festival bonus", 0.06],
  ] as [string, number][],
  deductions: [
    ["Income tax (TDS)", 0.045],
    ["Provident fund", 0.05],
    ["Advance recovery", 0.008],
  ] as [string, number][],
};
export const headcount: Record<Year, number> = { 2024: 1120, 2025: 1240, 2026: 1312 };

export const manufacturing = {
  output: monthly(1_480_000, [0.93, 0.96, 1.16, 1.2, 1.0, 1.08, 0.94, 0.92, 0.97, 1.02, 1.0, 1.12], 31), // kg
  lines: [
    ["Line 1 · Sweets", 84, 79],
    ["Line 2 · Dairy", 78, 74],
    ["Line 3 · Bakery", 73, 70],
    ["Line 4 · Snacks", 69, 66],
  ] as [string, number, number][], // OEE % this year, last year
  downtime: [
    ["Changeovers", 1840],
    ["Breakdowns", 1320],
    ["Material shortage", 760],
    ["Power outages", 610],
    ["Cleaning (CIP)", 540],
    ["Quality hold", 290],
  ] as [string, number][], // minutes, last 30 days
  batches: [
    ["B-2026-0918", "Roshogolla 1 kg", "Line 1", "4,200 kg", "99.1%", "Released"],
    ["B-2026-0917", "Mishti doi 500 g", "Line 2", "6,800 cups", "98.4%", "Released"],
    ["B-2026-0917", "Butter bun", "Line 3", "12,400 pcs", "97.2%", "QC hold"],
    ["B-2026-0916", "Chanachur 250 g", "Line 4", "3,100 kg", "98.8%", "Released"],
    ["B-2026-0916", "Kacha golla", "Line 1", "1,900 kg", "99.4%", "Released"],
  ],
  yield: monthly(97, [1, 1, 0.995, 0.99, 1, 1, 1.002, 1.003, 1.001, 1, 1, 0.996], 32, 0.004, FLAT),
};

export const inventory = {
  warehouses: [
    ["Central, Tejgaon", 6_42_00_000],
    ["Factory stores, Gazipur", 4_18_00_000],
    ["Chattogram DC", 2_36_00_000],
    ["Rajshahi DC", 1_12_00_000],
    ["Khulna DC", 98_00_000],
  ] as [string, number][],
  cover: [
    ["Sweets", 6, 7],
    ["Dairy & doi", 3, 4],
    ["Bakery", 4, 5],
    ["Snacks", 21, 14],
    ["Beverages", 26, 14],
    ["Packaging", 38, 30],
  ] as [string, number, number][], // days of cover, target
  slow: [
    ["Mango juice 1 L", "Beverages", "212 days", "৳ 18.4 L"],
    ["Gift box, large", "Packaging", "187 days", "৳ 9.6 L"],
    ["Spicy chanachur 1 kg", "Snacks", "164 days", "৳ 7.1 L"],
    ["Dry cake tin", "Bakery", "141 days", "৳ 4.3 L"],
  ],
  forecast: ["W40", "W41", "W42", "W43", "W44", "W45", "W46", "W47"].map((w, i) => ({
    label: w,
    "Forecast demand": [182, 188, 196, 240, 252, 206, 194, 190][i],
    "Projected stock": [260, 236, 214, 168, 120, 112, 150, 176][i],
  })), // tonnes, all categories
};

export const procurement = {
  monthly: monthly(4_20_00_000, [0.95, 0.98, 1.2, 1.15, 0.98, 1.08, 0.94, 0.92, 0.98, 1.04, 1.02, 1.12], 41),
  suppliers: [
    ["Greenfield Dairy Co-op", 0.31],
    ["Sweetline Sugar", 0.18],
    ["Golden Grain Flour", 0.13],
    ["PackRight Packaging", 0.11],
    ["Spice Route Traders", 0.07],
    ["Other suppliers", 0.2],
  ] as [string, number][],
  poStatus: [
    ["Waiting approval", 14],
    ["Approved", 38],
    ["In transit", 22],
    ["Received", 156],
    ["Closed", 412],
  ] as [string, number][],
  priceMoves: [
    ["Raw milk (litre)", "৳ 62", "৳ 68", "+9.7%"],
    ["Sugar (kg)", "৳ 128", "৳ 136", "+6.3%"],
    ["Wheat flour (kg)", "৳ 54", "৳ 51", "−5.6%"],
    ["Corrugated carton", "৳ 38", "৳ 41", "+7.9%"],
  ],
};

export const finance = {
  pnl: (y: Year) => {
    const rev = salesTotal(y);
    const k = y === 2024 ? 0.645 : y === 2025 ? 0.63 : 0.618;
    const cogs = Math.round(rev * k);
    const opex = Math.round(rev * 0.205);
    const fin = Math.round(rev * 0.018);
    const pbt = rev - cogs - opex - fin;
    const tax = Math.round(pbt * 0.275);
    return { Revenue: rev, "Cost of goods sold": cogs, "Gross profit": rev - cogs, "Operating expenses": opex, "Finance cost": fin, Tax: tax, "Net profit": pbt - tax };
  },
  cash: monthly(14_20_00_000, [0.86, 0.9, 1.04, 1.12, 0.98, 1.06, 0.95, 0.91, 0.97, 1.01, 0.99, 1.08], 51, 0.05),
  ageing: [
    ["0 to 30 days", 7_80_00_000],
    ["31 to 60 days", 3_10_00_000],
    ["61 to 90 days", 1_24_00_000],
    ["90+ days", 86_00_000],
  ] as [string, number][],
  expenses: [
    ["Salaries & wages", 0.41],
    ["Distribution & freight", 0.19],
    ["Marketing", 0.12],
    ["Utilities & fuel", 0.1],
    ["Rent & maintenance", 0.08],
    ["Other", 0.1],
  ] as [string, number][],
  vat: monthly(68_00_000, SALES_SEASON, 52, 0.03),
};

export const hr = {
  headcount: monthly(1240, [0.97, 0.975, 0.985, 0.99, 0.995, 1, 1.0, 1.005, 1.01, 1.012, 1.015, 1.0], 61, 0.004, { 2024: 1120 / 1240, 2025: 1, 2026: 1312 / 1240 }),
  joiners: monthly(34, [1.4, 1, 1.1, 0.8, 0.9, 1.2, 1, 1.1, 1, 0.9, 0.8, 0.8], 62, 0.15),
  leavers: monthly(26, [0.9, 1, 1.1, 1.5, 1.2, 0.9, 1, 0.9, 1, 0.9, 0.8, 0.9], 63, 0.15),
  attrition: [
    ["Production", 14.2],
    ["Distribution", 18.6],
    ["Sales", 21.4],
    ["Quality control", 9.1],
    ["Admin", 7.8],
    ["Finance", 5.2],
  ] as [string, number][],
};

export const attendance = {
  rate: monthly(95, [0.99, 1, 0.995, 0.975, 0.99, 0.985, 1, 1.002, 1.001, 1, 1, 0.99], 71, 0.006, FLAT),
  leave: [
    ["Casual leave", 0.34],
    ["Sick leave", 0.27],
    ["Annual leave", 0.24],
    ["Maternity", 0.09],
    ["Other", 0.06],
  ] as [string, number][],
  late: [
    ["Production", 312],
    ["Distribution", 188],
    ["Sales", 96],
    ["Admin", 41],
    ["Quality control", 37],
  ] as [string, number][], // late arrivals, last month
};

export const crm = {
  pipeline: [
    ["Leads", 420],
    ["Qualified", 262],
    ["Proposal sent", 121],
    ["Negotiation", 54],
    ["Won", 38],
  ] as [string, number][],
  sources: [
    ["Field reps", 0.41],
    ["Referrals", 0.22],
    ["Website", 0.17],
    ["Trade fairs", 0.12],
    ["Phone & SMS", 0.08],
  ] as [string, number][],
  winRate: monthly(29, [0.95, 0.97, 1.05, 1.08, 1, 0.98, 0.96, 1, 1.02, 1.04, 1.03, 1.06], 81, 0.04, FLAT),
};

export const budget = [
  ["Production", 31_40_00_000, 32_15_00_000],
  ["Distribution", 9_80_00_000, 9_42_00_000],
  ["Marketing", 4_60_00_000, 5_12_00_000],
  ["Admin", 3_20_00_000, 3_04_00_000],
  ["IT", 1_40_00_000, 1_18_00_000],
  ["HR & training", 90_00_000, 96_00_000],
] as [string, number, number][]; // budget, actual, Jan to Sep 2026

export const quality = {
  defects: [
    ["Underweight packs", 412],
    ["Seal leakage", 286],
    ["Label errors", 154],
    ["Texture / colour", 97],
    ["Foreign particle", 21],
  ] as [string, number][],
  fpy: monthly(96.4, [1, 1, 0.995, 0.99, 1, 1.001, 1.003, 1.004, 1.005, 1, 1, 0.997], 91, 0.003, FLAT),
};

export const assets = {
  value: [
    ["Plant & machinery", 0.46],
    ["Buildings", 0.28],
    ["Vehicles", 0.15],
    ["IT equipment", 0.06],
    ["Furniture & fittings", 0.05],
  ] as [string, number][],
  total: 86_40_00_000,
  maintenance: [
    ["Homogeniser H-2", "Line 2", "Overdue 3 days", "Preventive"],
    ["Boiler B-1", "Utilities", "Due 26 Oct", "Statutory inspection"],
    ["Truck DM-TA-4412", "Fleet", "Due 29 Oct", "Service at 60,000 km"],
    ["Packing machine P-4", "Line 4", "Due 2 Nov", "Preventive"],
  ],
};

export const projects = [
  ["Gazipur cold store", 72, 4_80_00_000, 3_62_00_000],
  ["Line 5 · Ice cream", 41, 9_20_00_000, 4_05_00_000],
  ["Solar rooftop", 88, 1_60_00_000, 1_48_00_000],
  ["ERP roll-out, all DCs", 64, 85_00_000, 52_00_000],
  ["New showroom, Uttara", 23, 1_10_00_000, 31_00_000],
] as [string, number, number, number][]; // % complete, budget, spent

export const pos = {
  outlets: [
    ["Gulshan", 0.21],
    ["Dhanmondi", 0.19],
    ["Uttara", 0.16],
    ["Mirpur", 0.14],
    ["Agrabad", 0.17],
    ["Zindabazar", 0.13],
  ] as [string, number][],
  payments: [
    ["Cash", 0.44],
    ["bKash", 0.27],
    ["Card", 0.19],
    ["Nagad", 0.1],
  ] as [string, number][],
  hourly: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((h, i) => ({
    label: `${h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`,
    "Avg. sales": [3, 6, 9, 12, 14, 11, 9, 10, 15, 22, 27, 24, 16, 7][i] * 10_000,
  })),
};
