import { useExpert, type ExpertPrefill } from './expertContext'
import Link from './Link'
import { Grain } from './glass/Grain'
import './glass/glass.css'
import './ctaband.css'

/** Closing band on each page: talk to an expert, or carry on to the next page. */
export default function CtaBand({
  title = 'Tell us what you run. We’ll size it.',
  text = 'A real engineer replies with a sizing plan, a rack slot and a price — usually within the hour.',
  prefill,
  next,
}: {
  title?: string
  text?: string
  prefill?: ExpertPrefill
  next?: { label: string; to: string; blurb: string }
}) {
  const talk = useExpert()
  return (
    <section className="cta-band" aria-label="Next steps">
      <div className="cta-band__inner">
        <div className="cta-band__main">
          <span className="cta-band__orb" aria-hidden="true" />
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="cta-band__btns">
            <button className="btn btn--light" onClick={() => talk(prefill)}>
              Talk to an expert
            </button>
            <Link className="cta-band__ghost" to="/contact">
              Other ways to reach us →
            </Link>
          </div>
        </div>
        {next && (
          <Link className="cta-band__next gc gc--context gc--dense" to={next.to}>
            <span className="cta-band__k">Next page</span>
            <b>{next.label}</b>
            <span className="cta-band__blurb">{next.blurb}</span>
            <span className="cta-band__arrow" aria-hidden="true">
              <svg viewBox="0 0 18 10">
                <path d="M13 1l4 4-4 4M17 5H1" />
              </svg>
            </span>
            <Grain />
          </Link>
        )}
      </div>
    </section>
  )
}
