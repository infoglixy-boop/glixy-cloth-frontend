import { ArrowUpRight } from 'lucide-react'

export default function SpinningBadge({
  className = '',
  text = 'GLIXY GANG ✦ FIND YOUR STYLE ✦ SHOP NOW ✦ ',
  href = '#new',
}: {
  className?: string
  text?: string
  href?: string
}) {
  return (
    <a href={href} className={`group relative block ${className}`} aria-label="Shop now">
      <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
        <defs>
          <path
            id="badgeCircle"
            d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
            fill="none"
          />
        </defs>
        <text className="fill-white font-mono" style={{ fontSize: '14px', letterSpacing: '3.5px' }}>
          <textPath href="#badgeCircle" startOffset="0">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <span className="w-12 h-12 rounded-full bg-brand text-white grid place-items-center transition-transform group-hover:scale-110">
          <ArrowUpRight size={20} />
        </span>
      </span>
    </a>
  )
}
