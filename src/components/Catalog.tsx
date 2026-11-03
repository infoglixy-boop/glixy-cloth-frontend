import { useState } from 'react'
import { KINDS, KIND_LABEL, SERVERS, inr, type Kind } from '../data/servers'
import { selectServer } from '../router'
import { useExpert } from './expertContext'
import './catalog.css'

type Sort = 'price-asc' | 'price-desc' | 'units'
type Aud = 'all' | 'B2B' | 'B2C'

const SORTS: { id: Sort; label: string }[] = [
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'units', label: 'Rack units' },
]

/** Every machine in one filterable, sortable list. */
export default function Catalog() {
  const talk = useExpert()
  const [kind, setKind] = useState<Kind | 'all'>('all')
  const [aud, setAud] = useState<Aud>('all')
  const [sort, setSort] = useState<Sort>('price-asc')

  const list = SERVERS.filter((s) => (kind === 'all' || s.kind === kind) && (aud === 'all' || s.audience === aud)).sort((a, b) =>
    sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : a.units - b.units || a.price - b.price,
  )
  const maxPrice = Math.max(...SERVERS.map((s) => s.price))
  const count = (k: Kind | 'all') => SERVERS.filter((s) => (k === 'all' || s.kind === k) && (aud === 'all' || s.audience === aud)).length

  return (
    <section className="sec" id="catalog" aria-labelledby="cat-title">
      <div className="sec__inner">
        <header className="sec__head">
          <span className="eyebrow">Full catalogue</span>
          <h2 id="cat-title">Every machine, side by side.</h2>
          <p>Filter by type or customer, sort by price, then jump to the rack to pick a slot — or ask us to size it for you.</p>
        </header>

        <div className="cat__bar">
          <div className="cat__chips" role="group" aria-label="Server type">
            {KINDS.map((k) => (
              <button key={k.id} aria-pressed={kind === k.id} onClick={() => setKind(k.id)} disabled={count(k.id) === 0}>
                {k.label}
                <small>{count(k.id)}</small>
              </button>
            ))}
          </div>
          <div className="cat__right">
            <div className="cat__seg" role="group" aria-label="Customer type">
              {(['all', 'B2B', 'B2C'] as Aud[]).map((a) => (
                <button
                  key={a}
                  aria-pressed={aud === a}
                  onClick={() => {
                    setAud(a)
                    // keep the type filter valid for the new audience
                    if (kind !== 'all' && !SERVERS.some((s) => s.kind === kind && (a === 'all' || s.audience === a))) setKind('all')
                  }}
                >
                  {a === 'all' ? 'Everyone' : a === 'B2B' ? 'Business' : 'Personal'}
                </button>
              ))}
            </div>
            <label className="cat__sort">
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <p className="cat__count" aria-live="polite">
          Showing <b>{list.length}</b> of {SERVERS.length} machines
        </p>

        <ul className="cat__list" key={`${kind}-${aud}-${sort}`}>
          {list.map((s, i) => (
            <li key={s.id} className="cat__row" style={{ '--i': i, '--a': s.accent } as React.CSSProperties}>
              <div className="cat__id">
                <span className="cat__led" aria-hidden="true" />
                <div>
                  <h3>{s.name}</h3>
                  <p>
                    <span className="cat__code">{s.code}</span> · {KIND_LABEL[s.kind]}
                    {s.kind !== 'personal' && ` · ${s.audience === 'B2B' ? 'Business' : 'Personal use'}`}
                  </p>
                </div>
              </div>
              <dl className="cat__specs">
                <div>
                  <dt>CPU</dt>
                  <dd>{s.cpu}</dd>
                </div>
                <div>
                  <dt>{s.gpu ? 'GPU' : 'Memory'}</dt>
                  <dd>{s.gpu ?? s.ram}</dd>
                </div>
                <div>
                  <dt>Storage</dt>
                  <dd>{s.storage}</dd>
                </div>
                <div>
                  <dt>Network</dt>
                  <dd>{s.network}</dd>
                </div>
              </dl>
              <div className="cat__price">
                <p>
                  <b>{inr(s.price)}</b>
                  <span>/mo</span>
                </p>
                <span className="cat__meter" aria-hidden="true">
                  <span style={{ width: `${Math.max(3, Math.sqrt(s.price / maxPrice) * 100)}%` }} />
                </span>
                <small>
                  {s.units}U · {s.setup}
                </small>
              </div>
              <div className="cat__act">
                <button className="cat__btn" onClick={() => selectServer(s.id)}>
                  View in rack
                </button>
                <button className="cat__btn cat__btn--solid" onClick={() => talk({ server: `${s.name} (${s.code})`, audience: s.audience })}>
                  Get a quote
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="sec__fine">Prices are monthly, before GST. Annual prepay and multi-server discounts available on request.</p>
      </div>
    </section>
  )
}
