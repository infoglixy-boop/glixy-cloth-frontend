/*
 * Every number shown in the charts lives here.
 *
 * IMPORTANT: these are SAMPLE figures so the layout can be built and reviewed.
 * Replace them with your own measured benchmarks and audited business numbers,
 * then set SAMPLE_DATA to false. While it is true, every chart shows a
 * "Sample data" badge so nobody mistakes the placeholders for real results.
 */
export const SAMPLE_DATA = true

/* ---------- Series identity (fixed order, validated for colour-blind separation) ---------- */
export const SERIES = {
  glixy: { name: 'Glixy dedicated', color: '#e8590c' },
  cloud: { name: 'Public cloud VM', color: '#2a78d6' },
  vps: { name: 'Shared VPS', color: '#1baf7a' },
} as const

export type SeriesKey = keyof typeof SERIES

/* ---------- Benchmarks ---------- */
// Index: public cloud VM (16 vCPU / 128 GB) = 100. Higher is better.
export const BENCH_INDEX = {
  categories: ['Web API (req/s)', 'PostgreSQL OLTP (tps)', 'Redis (ops/s)', 'Video encode (fps)'],
  series: {
    glixy: [212, 238, 176, 191],
    cloud: [100, 100, 100, 100],
    vps: [61, 54, 72, 58],
  } as Record<SeriesKey, number[]>,
}

// p99 latency in milliseconds as concurrent users grow. Lower is better.
export const LATENCY = {
  x: [100, 250, 500, 1000, 1500, 2000],
  series: {
    glixy: [8, 9, 11, 14, 18, 23],
    cloud: [12, 15, 22, 38, 61, 95],
    vps: [18, 26, 44, 88, 160, 260],
  } as Record<SeriesKey, number[]>,
}

// Monthly cost for the same compute: 16 cores, 128 GB RAM, 2 TB NVMe (₹ thousand / month).
export const COST = [
  { label: 'Glixy Forge', value: 15, key: 'glixy' as const },
  { label: 'Cloud, 3-yr reserved', value: 32, key: 'cloud' as const },
  { label: 'Cloud, on-demand', value: 58, key: 'cloud' as const },
]

/* ---------- AI & model training ---------- */
// Hours to fine-tune a 7B-parameter model on 1, 2, 4 and 8 GPUs.
export const TRAIN_TIME = {
  x: [1, 2, 4, 8],
  series: {
    glixy: [96, 49, 25, 13],
    cloud: [140, 78, 44, 26], // shared cloud on spot capacity, including restarts after pre-emption
  } as Partial<Record<SeriesKey, number[]>>,
}

// Cost of one 7B fine-tune run (₹ lakh).
export const TRAIN_COST = [
  { label: 'Glixy Helix, reserved month', value: 1.9, key: 'glixy' as const },
  { label: 'Cloud spot + re-runs', value: 3.1, key: 'cloud' as const },
  { label: 'Cloud on-demand', value: 4.6, key: 'cloud' as const },
]

// Average GPU utilisation over a month of training (%).
export const GPU_UTIL = [
  { label: 'Glixy dedicated', value: 94, color: '#e8590c' },
  { label: 'Shared, pre-emptible', value: 61, color: '#2a78d6' },
]

export const AI_STATS = [
  { label: 'Average GPU utilisation', value: '94%', note: 'vs 61% on shared, pre-emptible capacity' },
  { label: 'Pre-emptions per month', value: '0', note: 'your GPUs are never taken back mid-run' },
  { label: 'Data leaves India', value: 'Never', note: 'Indian regions for DPDP-sensitive datasets' },
]

/* ---------- Customers ---------- */
// Share of active customers by segment (%). Adds up to 100.
export const CUSTOMER_MIX = [
  { label: 'Startups & SaaS', value: 32, color: '#e8590c' },
  { label: 'E-commerce & fintech', value: 21, color: '#2a78d6' },
  { label: 'AI / ML teams', value: 18, color: '#1baf7a' },
  { label: 'Individuals & creators', value: 15, color: '#eda100' },
  { label: 'Gaming studios', value: 14, color: '#e87ba4' },
]

/* ---------- Trust & business health ---------- */
// Monthly recurring revenue, last 12 months (₹ lakh).
export const MRR = {
  x: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  values: [4.2, 4.8, 5.5, 6.1, 7.0, 7.9, 8.6, 9.8, 11.2, 12.5, 14.1, 15.8],
}

export const BUSINESS_STATS = [
  { label: 'Active customers', value: '1,240', delta: '+38% YoY' },
  { label: 'Net revenue retention', value: '118%', delta: 'trailing 12 months' },
  { label: 'Monthly logo churn', value: '1.6%', delta: 'trailing 6 months' },
  { label: 'Median first response', value: '3m 40s', delta: 'support, last 90 days' },
]

export const UPTIME_FACTS = [
  { label: 'Incidents', value: '3' },
  { label: 'SLA breaches', value: '0' },
  { label: 'Median recovery', value: '12 min' },
]

// Daily uptime for the last 90 days (%). Anything below 100 is a degraded day.
export const UPTIME_90: number[] = Array.from({ length: 90 }, (_, i) =>
  i === 23 ? 99.82 : i === 61 ? 99.94 : i === 77 ? 99.97 : 100,
)
