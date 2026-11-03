import Link from '../components/Link'
import Logo from '../components/Logo'
import { NAV } from '../data/nav'
import '../components/sections.css'

export default function NotFound() {
  return (
    <section className="sec nf grid-bg">
      <div className="sec__inner nf__inner">
        <Logo mode="toggle" height={64} label="Glixy logo — click to play" />
        <p className="eyebrow">Error 404</p>
        <h1>This rack slot is empty.</h1>
        <p className="nf__lead">The page you were looking for doesn’t exist or has moved. Try one of these instead:</p>
        <ul className="nf__links">
          <li>
            <Link to="/" className="btn btn--primary">
              Back to home
            </Link>
          </li>
          {NAV.map((n) => (
            <li key={n.to}>
              <Link to={n.to} className="nf__chip">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
