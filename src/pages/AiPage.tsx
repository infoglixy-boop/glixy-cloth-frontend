import PageHead from '../components/PageHead'
import AiTraining from '../components/AiTraining'
import PerfStage from '../components/PerfStage'
import CtaBand from '../components/CtaBand'
import { SERVERS, inr } from '../data/servers'
import { selectServer } from '../router'
import { useExpert } from '../components/expertContext'
import { gc } from '../components/glass/dots'
import { Grain } from '../components/glass/Grain'
import '../components/glass/glass.css'
import '../components/sections.css'

const FAQ = [
  ['Can I start with one GPU and scale later?', 'Yes. Start on one Helix node and add nodes on the same fabric when your runs grow — your data stays in place.'],
  ['Do you provide the ML software stack?', 'Every GPU server ships with drivers, CUDA, PyTorch and JAX tested together. You get full root access to change anything.'],
  ['Where is my training data stored?', 'In the region you choose. Pick an Indian region and your datasets and checkpoints never leave the country.'],
  ['How is billing done for long runs?', 'A fixed monthly price per node, with GST invoices. No per-hour surprises and no charge for data going in.'],
]

export default function AiPage() {
  const talk = useExpert()
  const gpus = SERVERS.filter((s) => s.kind === 'gpu')
  return (
    <>
      <PageHead
        eyebrow="AI Training"
        title={['GPUs that are yours', 'for the whole run.']}
        lead="Dedicated, never pre-empted GPU servers for training, fine-tuning and inference — on a fixed monthly price, with your data kept in India."
        jumps={[
          ['Results', 'ai'],
          ['GPU servers', 'gpus'],
          ['Questions', 'ai-faq'],
        ]}
      />
      <PerfStage />
      <AiTraining />
      <section className="sec" id="gpus" aria-labelledby="gpus-title">
        <div className="sec__inner">
          <header className="sec__head">
            <span className="eyebrow">GPU line-up</span>
            <h2 id="gpus-title">Pick your training node.</h2>
          </header>
          <ul className="gpu">
            {gpus.map((s, i) => (
              <li key={s.id} className={`gpu__card ${gc(i * 2, 'gc--dense')}`}>
                <span className="gpu__code">{s.code}</span>
                <h3>{s.name}</h3>
                <p className="gpu__tag">{s.tagline}</p>
                <dl>
                  {[
                    ['GPU', s.gpu],
                    ['CPU', s.cpu],
                    ['Memory', s.ram],
                    ['Storage', s.storage],
                    ['Network', s.network],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="gpu__foot">
                  <p>
                    <b>{inr(s.price)}</b> /mo
                  </p>
                  <div>
                    <button className="gc-pill gc-pill--ghost" onClick={() => selectServer(s.id)}>
                      View in rack
                    </button>
                    <button className="gc-pill" onClick={() => talk({ server: `${s.name} (${s.code})`, audience: 'B2B', note: 'AI / model training enquiry' })}>
                      Plan a cluster
                    </button>
                  </div>
                </div>
                <Grain />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="sec sec--tint" id="ai-faq" aria-labelledby="ai-faq-title">
        <div className="sec__inner">
          <header className="sec__head">
            <span className="eyebrow">Questions</span>
            <h2 id="ai-faq-title">What AI teams ask us.</h2>
          </header>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Plan your next training run with us."
        text="Share the model size, dataset and deadline. We’ll size the GPUs, the storage and the cost per run."
        prefill={{ audience: 'B2B', note: 'AI / model training enquiry' }}
        next={{ label: 'Customers', to: '/customers', blurb: 'Who runs on Glixy, and what they gain.' }}
      />
    </>
  )
}
