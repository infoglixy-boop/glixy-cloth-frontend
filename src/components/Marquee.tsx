import { useContent } from '../context/ContentContext'

export default function Marquee() {
  const { settings } = useContent()
  const words = settings.marqueeItems.length ? settings.marqueeItems : ['NEW DROP']
  const loop = [...words, ...words, ...words, ...words]
  return (
    <div className="bg-brand-ink text-brand-cream py-5 sm:py-7 overflow-hidden border-y border-white/10">
      <div className="flex w-max animate-marquee whitespace-nowrap items-center">
        {loop.map((w, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-3xl sm:text-5xl font-medium mx-7 tracking-tight">
              {w}
            </span>
            <span className="text-brand text-2xl sm:text-3xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
