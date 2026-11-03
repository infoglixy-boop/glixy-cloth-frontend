import { useEffect, useRef, useState } from 'react'

/** Counts the first number inside `value` up from zero when it scrolls into view ("7.4× faster", "₹499"). */
export default function CountUp({ value, duration = 1300 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [p, setP] = useState(reduce ? 1 : 0)
  useEffect(() => {
    const el = ref.current
    if (!el || p >= 1) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      let start = 0
      const tick = (now: number) => {
        if (!start) start = now
        const t = Math.min(1, (now - start) / duration)
        setP(1 - Math.pow(1 - t, 3))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const m = value.match(/\d[\d,]*(\.\d+)?/)
  let shown = value
  if (m && m.index !== undefined) {
    const dec = m[1] ? m[1].length - 1 : 0
    const n = (parseFloat(m[0].replace(/,/g, '')) * p).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })
    shown = value.slice(0, m.index) + n + value.slice(m.index + m[0].length)
  }
  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{shown}</span>
    </span>
  )
}
