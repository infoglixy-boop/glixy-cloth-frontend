import PageHead from '../components/PageHead'
import Benchmarks from '../components/Benchmarks'
import CtaBand from '../components/CtaBand'
import '../components/sections.css'

const METHOD = [
  ['Machines compared', 'Glixy Forge (16 dedicated cores, 128 GB, 2 TB NVMe) against a public-cloud VM with 16 vCPU / 128 GB and a shared VPS of the closest size.'],
  ['Web API', 'An HTTP JSON service under a fixed-rate load generator; requests per second at a p99 latency target.'],
  ['Database', 'PostgreSQL OLTP read/write mix at a scale that fits in memory; transactions per second.'],
  ['Cache', 'Redis GET/SET with pipelining from a separate client machine; operations per second.'],
  ['Video encode', '1080p H.264 transcodes; frames per second, averaged over the full file.'],
  ['Repeatability', 'Each test runs 5 times on fresh machines; we publish the median and keep the raw logs.'],
]

export default function BenchmarksPage() {
  return (
    <>
      <PageHead
        eyebrow="Benchmarks"
        title={['Faster per rupee,', 'and we show our work.']}
        lead="Throughput, tail latency and monthly cost for the same workloads on Glixy dedicated servers, a public-cloud VM and a shared VPS."
        jumps={[
          ['Results', 'benchmarks'],
          ['How we test', 'method'],
        ]}
      />
      <Benchmarks />
      <section className="sec sec--tint" id="method" aria-labelledby="method-title">
        <div className="sec__inner">
          <header className="sec__head">
            <span className="eyebrow">Methodology</span>
            <h2 id="method-title">How we test.</h2>
            <p>Benchmarks only build trust if you can repeat them. Here is exactly what we run — ask us for the scripts and raw logs.</p>
          </header>
          <ul className="sec-ops">
            {METHOD.map(([h, t]) => (
              <li key={h}>
                <b>{h}</b>
                <p>{t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand
        title="Run your own benchmark on our hardware."
        text="We’ll lend you a machine for a free 72-hour trial so you can test your real workload before you commit."
        prefill={{ note: 'Request: 72-hour benchmark trial machine' }}
        next={{ label: 'AI Training', to: '/ai', blurb: 'What dedicated GPUs change for model training.' }}
      />
    </>
  )
}
