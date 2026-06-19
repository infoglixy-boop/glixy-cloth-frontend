import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useContent } from '../context/ContentContext'

export default function Hero() {
  const { hero: HERO_SLIDES } = useContent()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = HERO_SLIDES.length || 1
  const ref = useRef<HTMLElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  useEffect(() => {
    if (paused) return
    const t = window.setInterval(() => setI((n) => (n + 1) % total), 5000)
    return () => window.clearInterval(t)
  }, [paused, total])

  const go = (n: number) => setI(((n % total) + total) % total)
  const slide = HERO_SLIDES[i] || HERO_SLIDES[0]
  if (!slide) return null

  return (
    <section
      ref={ref}
      className="relative h-[64vh] min-h-[360px] max-h-[760px] overflow-hidden bg-brand-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image (parallax + crossfade) */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={slide.image}
            alt=""
            style={{ y: imgY }}
            className="w-full h-[118%] object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* subtle bottom scrim so the white dots/arrows stay visible on light banners */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />

      {/* arrows */}
      <div className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        <button
          onClick={() => go(i - 1)}
          aria-label="Previous"
          className="liquid-glass w-11 h-11 rounded-full text-white hover:bg-white hover:text-brand-ink flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(i + 1)}
          aria-label="Next"
          className="liquid-glass w-11 h-11 rounded-full text-white hover:bg-white hover:text-brand-ink flex items-center justify-center transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* progress dots */}
      <div className="absolute bottom-10 left-0 right-0">
        <div className="container-x flex items-center justify-between">
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, n) => (
              <button
                key={n}
                aria-label={`Slide ${n + 1}`}
                onClick={() => go(n)}
                className={`h-1 rounded-full transition-all ${
                  n === i ? 'w-10 bg-white' : 'w-4 bg-white/40'
                }`}
              />
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-white/70 text-[11px] font-mono uppercase tracking-[0.25em] animate-float">
            <ArrowDown size={14} /> Scroll
          </div>
        </div>
      </div>
    </section>
  )
}
