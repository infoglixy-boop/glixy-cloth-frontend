import { layoutDots } from './dots'

/** Text drawn as LED dots (digits, "." "," and the letters of "Intelligent"). */
export default function DotText({
  text,
  pitchX = 5,
  r = 1.55,
  className = 'dot-svg',
  label,
}: {
  text: string
  pitchX?: number
  r?: number
  className?: string
  label?: string
}) {
  const { dots, width } = layoutDots(text, pitchX)
  return (
    <svg className={className} viewBox={`0 0 ${width} 28`} role="img" aria-label={label ?? text} fill="currentColor">
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </svg>
  )
}
