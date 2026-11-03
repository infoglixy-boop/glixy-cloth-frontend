import { BENCH_INDEX, COST, LATENCY, SAMPLE_DATA, SERIES, type SeriesKey } from '../data/metrics'
import { BarChart, ChartCard, LineChart, RadarChart, StatTile } from './charts/Charts'
import './sections.css'

const KEYS: SeriesKey[] = ['glixy', 'cloud', 'vps']
const legend = KEYS.map((k) => SERIES[k])

export default function Benchmarks() {
  const avgIdx =
    BENCH_INDEX.series.glixy.reduce((a, b) => a + b, 0) / BENCH_INDEX.series.glixy.length / 100
  const last = LATENCY.x.length - 1
  const latCut = 1 - LATENCY.series.glixy[last] / LATENCY.series.cloud[last]
  const saved = COST[COST.length - 1].value - COST[0].value

  return (
    <section className="sec" id="benchmarks" aria-labelledby="bench-title">
      <div className="sec__inner">
        <header className="sec__head">
          <span className="eyebrow">Benchmarks</span>
          <h2 id="bench-title">Measured, not marketed.</h2>
          <p>
            The same workloads on a Glixy dedicated server, a comparable public-cloud VM and a shared VPS. Dedicated
            hardware means no hypervisor tax and no neighbours stealing your CPU.
          </p>
        </header>

        <div className="sec__stats">
          <StatTile label="Average throughput vs cloud VM" value={`${avgIdx.toFixed(1)}×`} note="across web, database, cache and encode tests" />
          <StatTile
            i={1}
            label={`p99 latency at ${LATENCY.x[last].toLocaleString('en-IN')} users`}
            value={`−${Math.round(latCut * 100)}%`}
            note={`${LATENCY.series.glixy[last]} ms on Glixy vs ${LATENCY.series.cloud[last]} ms on cloud`}
          />
          <StatTile i={2} label="Saved every month" value={`₹${saved}k`} note="same 16-core / 128 GB machine vs cloud on-demand" />
        </div>

        <div className="sec__grid sec__grid--2">
          <ChartCard
            title="Throughput index"
            sub="Public cloud VM = 100 · higher is better"
            legend={legend}
            table={{
              head: ['Test', ...KEYS.map((k) => SERIES[k].name)],
              rows: BENCH_INDEX.categories.map((c, i) => [c, ...KEYS.map((k) => BENCH_INDEX.series[k][i])]),
            }}
          >
            <BarChart
              format={(n) => String(Math.round(n))}
              reference={{ value: 100, label: 'Cloud = 100' }}
              rows={BENCH_INDEX.categories.map((c, i) => ({
                label: c,
                bars: KEYS.map((k) => ({
                  name: SERIES[k].name,
                  color: SERIES[k].color,
                  value: BENCH_INDEX.series[k][i],
                  emphasis: k === 'glixy',
                })),
              }))}
            />
          </ChartCard>

          <ChartCard
            title="p99 latency under load"
            sub="Milliseconds as concurrent users grow · lower is better"
            legend={legend}
            table={{
              head: ['Users', ...KEYS.map((k) => SERIES[k].name)],
              rows: LATENCY.x.map((x, i) => [x, ...KEYS.map((k) => `${LATENCY.series[k][i]} ms`)]),
            }}
          >
            <LineChart
              numericX
              x={LATENCY.x}
              xTitle="Concurrent users"
              xFormat={(v) => Number(v).toLocaleString('en-IN')}
              format={(n) => `${n} ms`}
              series={KEYS.map((k) => ({ ...SERIES[k], values: LATENCY.series[k] }))}
              height={300}
            />
          </ChartCard>
        </div>

        <div className="sec__grid sec__grid--2">
        <ChartCard
          title="Monthly cost for the same machine"
          sub="16 cores · 128 GB RAM · 2 TB NVMe · ₹ thousand per month"
          legend={[SERIES.glixy, { name: 'Public cloud', color: SERIES.cloud.color }]}
          table={{ head: ['Option', '₹ thousand / month'], rows: COST.map((c) => [c.label, c.value]) }}
        >
          <BarChart
            labelAll
            format={(n) => `₹${n}k`}
            rows={COST.map((c) => ({
              label: c.label,
              bars: [{ name: SERIES[c.key].name, color: SERIES[c.key].color, value: c.value, emphasis: c.key === 'glixy' }],
            }))}
          />
        </ChartCard>

        <ChartCard
          title="Performance profile"
          sub="All four tests at once · cloud VM = 100 · bigger shape is better"
          legend={legend}
          table={{
            head: ['Test', ...KEYS.map((k) => SERIES[k].name)],
            rows: BENCH_INDEX.categories.map((c, i) => [c, ...KEYS.map((k) => BENCH_INDEX.series[k][i])]),
          }}
        >
          <RadarChart
            categories={BENCH_INDEX.categories.map((c) => c.replace(/ \(.*\)/, ''))}
            series={KEYS.map((k) => ({ ...SERIES[k], values: BENCH_INDEX.series[k] }))}
            height={330}
          />
        </ChartCard>
        </div>

        <p className="sec__fine">
          {SAMPLE_DATA
            ? 'Sample figures for layout only — replace with your own measured results and test method before launch.'
            : 'Method: identical workload images, same Indian region, median of three runs. Cloud figures use list prices for a 16 vCPU / 128 GB general-purpose instance.'}
        </p>
      </div>
    </section>
  )
}
