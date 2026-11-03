import { AI_STATS, GPU_UTIL, SERIES, TRAIN_COST, TRAIN_TIME } from '../data/metrics'
import { BarChart, ChartCard, LineChart, RadialChart, StatTile } from './charts/Charts'
import { useExpert } from './expertContext'
import './sections.css'

const BENEFITS = [
  ['Never pre-empted', 'Reserved GPUs stay yours for the whole month. No lost checkpoints, no 3 a.m. restarts.'],
  ['Fixed monthly price', 'One number for GPUs, storage and bandwidth. Budget a training run before it starts.'],
  ['High-bandwidth fabric', 'RDMA networking between nodes so multi-GPU jobs scale close to linearly.'],
  ['Data stays in India', 'Train on sensitive customer or government data without it crossing borders.'],
  ['Ready ML stacks', 'Drivers, PyTorch, JAX, notebooks and schedulers pre-installed and tested.'],
  ['Engineers who train models', 'Help sizing GPUs, sharding datasets and tuning throughput — included.'],
]

const PIPE = [
  ['01', 'Ingest', 'Petabyte NVMe and object storage next to your GPUs.'],
  ['02', 'Train', 'Dedicated multi-GPU nodes on a non-blocking fabric.'],
  ['03', 'Evaluate', 'Spare capacity for eval sweeps without touching the training run.'],
  ['04', 'Serve', 'Low-latency inference servers in the same rack.'],
]

export default function AiTraining() {
  const talk = useExpert()
  const keys = ['glixy', 'cloud'] as const
  const names = { glixy: 'Glixy dedicated GPUs', cloud: 'Shared cloud (spot)' }

  return (
    <section className="sec sec--tint" id="ai" aria-labelledby="ai-title">
      <div className="sec__inner">
        <header className="sec__head">
          <span className="eyebrow">AI & model training</span>
          <h2 id="ai-title">Train faster. Pay less. Keep your data home.</h2>
          <p>
            Model training is where shared, pre-emptible cloud hurts the most. Dedicated Glixy GPU servers keep every
            hour of compute working on your model.
          </p>
        </header>

        <div className="sec__stats">
          {AI_STATS.map((s, i) => (
            <StatTile key={s.label} {...s} i={i} />
          ))}
        </div>

        <div className="sec__grid sec__grid--2">
          <ChartCard
            title="Time to fine-tune a 7B model"
            sub="Hours to finish, by number of GPUs · lower is better"
            legend={keys.map((k) => ({ name: names[k], color: SERIES[k].color }))}
            table={{
              head: ['GPUs', names.glixy, names.cloud],
              rows: TRAIN_TIME.x.map((x, i) => [x, `${TRAIN_TIME.series.glixy![i]} h`, `${TRAIN_TIME.series.cloud![i]} h`]),
            }}
          >
            <LineChart
              x={TRAIN_TIME.x}
              xTitle="GPUs"
              xFormat={(v) => `${v} GPU${Number(v) > 1 ? 's' : ''}`}
              format={(n) => `${n} h`}
              series={keys.map((k) => ({ name: names[k], color: SERIES[k].color, values: TRAIN_TIME.series[k]! }))}
              height={300}
            />
          </ChartCard>

          <ChartCard
            title="Cost of one fine-tuning run"
            sub="7B-parameter model · ₹ lakh"
            legend={[
              { name: 'Glixy', color: SERIES.glixy.color },
              { name: 'Public cloud', color: SERIES.cloud.color },
            ]}
            table={{ head: ['Option', '₹ lakh'], rows: TRAIN_COST.map((c) => [c.label, c.value]) }}
          >
            <BarChart
              labelAll
              format={(n) => `₹${n}L`}
              rows={TRAIN_COST.map((c) => ({
                label: c.label,
                bars: [{ name: c.label, color: SERIES[c.key].color, value: c.value, emphasis: c.key === 'glixy' }],
              }))}
            />
          </ChartCard>
        </div>

        <div className="sec__grid sec__grid--2">
          <ChartCard
            title="GPU utilisation"
            sub="Average share of each GPU-hour spent training · higher is better"
            table={{ head: ['Capacity', 'Utilisation'], rows: GPU_UTIL.map((g) => [g.label, `${g.value}%`]) }}
          >
            <RadialChart items={GPU_UTIL} centerLabel="Glixy dedicated" height={320} />
          </ChartCard>
          <ChartCard
            title="Speed-up as you add GPUs"
            sub="Times faster than one GPU · closer to the dashed ideal is better"
            legend={[
              { name: 'Glixy dedicated GPUs', color: SERIES.glixy.color },
              { name: 'Perfect linear scaling', color: '#b8a698' },
            ]}
            table={{
              head: ['GPUs', 'Glixy speed-up', 'Ideal'],
              rows: TRAIN_TIME.x.map((x, i) => [x, `${(TRAIN_TIME.series.glixy![0] / TRAIN_TIME.series.glixy![i]).toFixed(1)}×`, `${x}×`]),
            }}
          >
            <LineChart
              x={TRAIN_TIME.x}
              xFormat={(v) => `${v} GPU${Number(v) > 1 ? 's' : ''}`}
              format={(n) => `${n}×`}
              series={[
                { name: 'Glixy dedicated GPUs', color: SERIES.glixy.color, values: TRAIN_TIME.series.glixy!.map((h) => +(TRAIN_TIME.series.glixy![0] / h).toFixed(1)) },
                { name: 'Perfect linear scaling', color: '#b8a698', values: TRAIN_TIME.x.map((x) => x), dashed: true },
              ]}
              height={300}
            />
          </ChartCard>
        </div>

        <ol className="pipe">
          {PIPE.map(([n, t, d]) => (
            <li key={n}>
              <span>{n}</span>
              <b>{t}</b>
              <p>{d}</p>
            </li>
          ))}
        </ol>

        <ul className="benefits">
          {BENEFITS.map(([h, t]) => (
            <li key={h}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m4.5 10.5 3.5 3.5 7.5-8" />
              </svg>
              <div>
                <b>{h}</b>
                <p>{t}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="sec__cta">
          <button className="btn btn--primary" onClick={() => talk({ server: 'Helix GPU (HLX-G4)', audience: 'B2B', note: 'AI / model training enquiry' })}>
            Plan a training cluster
          </button>
          <span>Free sizing call with a GPU engineer.</span>
        </div>
      </div>
    </section>
  )
}
