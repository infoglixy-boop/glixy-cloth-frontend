import { useContent } from '../context/ContentContext'

export default function Announce() {
  const { settings } = useContent()
  if (!settings.announceActive || !settings.announceText) return null
  const text = settings.announceText
  const items = [text, text, text, text, text, text]
  return (
    <div className="bg-brand text-white overflow-hidden">
      <div className="flex w-max animate-marquee whitespace-nowrap text-[11px] sm:text-xs font-medium tracking-wide py-2">
        {items.map((t, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-2">
            <span className="opacity-70">✦</span> {t}
          </span>
        ))}
      </div>
    </div>
  )
}
