import { useEffect, useState } from 'react'
import { useExpert } from './expertContext'
import { waLink } from '../data/contact'
import { WaIcon } from './WhatsApp'

export default function FloatingCta() {
  const talk = useExpert()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const on = () => {
      const vh = window.innerHeight
      const footer = document.getElementById('footer')
      const nearFooter = footer ? footer.getBoundingClientRect().top < vh * 0.7 : false
      // the shelf and the teardown have their own expert links, so stay out of their way
      const covered = ['racks', 'inside'].some((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect()
        return r ? r.top < vh * 0.5 && r.bottom > vh * 0.5 : false
      })
      setShow(window.scrollY > vh * 0.8 && !nearFooter && !covered)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])

  return (
    <>
      <a className="fwa" href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with Glixy on WhatsApp">
        <WaIcon size={28} />
        <span className="fwa__tip">Chat on WhatsApp</span>
      </a>
      <button className={`fcta${show ? ' is-on' : ''}`} onClick={() => talk()} tabIndex={show ? 0 : -1} aria-hidden={!show}>
        <span className="fcta__dot" aria-hidden="true" />
        Talk to Expert
        <style>{`
        .fcta{position:fixed;z-index:120;right:clamp(14px,3vw,28px);bottom:clamp(14px,3vw,28px);display:inline-flex;align-items:center;gap:10px;height:50px;padding:0 22px 0 18px;border-radius:999px;background:var(--violet);color:#fff;font-weight:500;font-size:14.5px;box-shadow:0 14px 40px -10px rgba(232,89,12,.6),inset 0 1px 0 rgba(255,255,255,.25);transform:translateY(calc(100% + 48px));transition:transform .6s var(--ease)}
        .fcta.is-on{transform:none}
        .fcta:hover{transform:translateY(-2px)}
        .fcta__dot{width:8px;height:8px;border-radius:50%;background:#3ddc97;box-shadow:0 0 0 0 rgba(61,220,151,.6);animation:fcta 2s infinite}
        @keyframes fcta{70%{box-shadow:0 0 0 9px rgba(61,220,151,0)}100%{box-shadow:0 0 0 0 rgba(61,220,151,0)}}
        @media (prefers-reduced-motion:reduce){.fcta{transition:none}.fcta__dot{animation:none}}
        .fwa{position:fixed;z-index:121;right:clamp(14px,3vw,28px);bottom:clamp(14px,3vw,28px);display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:#25d366;color:#fff;box-shadow:0 14px 34px -10px rgba(18,140,70,.65);transition:transform .3s var(--ease)}
        .fwa::before{content:'';position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(37,211,102,.55);animation:fwa 2.4s infinite}
        @keyframes fwa{70%{box-shadow:0 0 0 14px rgba(37,211,102,0)}100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}}
        .fwa:hover{transform:translateY(-2px) scale(1.04)}
        .fwa__tip{position:absolute;right:66px;top:50%;translate:0 -50%;padding:7px 12px;border-radius:999px;background:#1c140d;color:#fff;font-size:13px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s}
        .fwa:hover .fwa__tip{opacity:1}
        .fcta{right:calc(clamp(14px,3vw,28px) + 68px)!important;bottom:calc(clamp(14px,3vw,28px) + 3px)!important}
        body.lock .fwa{display:none}
        @media (prefers-reduced-motion:reduce){.fwa::before{animation:none}}
      `}</style>
      </button>
    </>
  )
}
