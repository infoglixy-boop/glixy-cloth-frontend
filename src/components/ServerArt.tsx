import { memo } from 'react'
import { inr, KIND_LABEL, type Server } from '../data/servers'

/* Blade faceplate: the narrow front of the box that faces out on the shelf (142 × 840). */
export const BladeFront = memo(function BladeFront({ s, uid }: { s: Server; uid: string }) {
  const g = `bf-${uid}`
  const vents = []
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 3; col++) {
      vents.push(<rect key={`${row}-${col}`} x={30 + col * 30 + (row % 2) * 8} y={126 + row * 14} width="18" height="5" rx="2.5" />)
    }
  }
  return (
    <svg viewBox="0 0 142 840" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${g}-body`} x1="0" x2="1">
          <stop offset="0" stopColor="#1b1a22" />
          <stop offset=".5" stopColor="#2a2833" />
          <stop offset="1" stopColor="#17161d" />
        </linearGradient>
        <linearGradient id={`${g}-glow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.accent} stopOpacity=".9" />
          <stop offset="1" stopColor={s.accent2} stopOpacity=".2" />
        </linearGradient>
      </defs>
      <rect width="142" height="840" fill={`url(#${g}-body)`} />
      <rect x="1" y="1" width="140" height="838" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
      {/* accent rail */}
      <rect x="6" y="20" width="3" height="800" rx="1.5" fill={`url(#${g}-glow)`} />
      {/* handle */}
      <rect x="26" y="22" width="90" height="44" rx="8" fill="#0f0e14" stroke="rgba(255,255,255,.14)" strokeWidth="2" />
      <path d="M44 36h54M44 44h54M44 52h54" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
      {/* status LEDs */}
      <circle cx="40" cy="92" r="5" fill="#3ddc97" className="led led--ok" />
      <circle cx="60" cy="92" r="5" fill={s.accent} className="led led--act" />
      <circle cx="80" cy="92" r="5" fill="#2c2a35" />
      <text x="96" y="96" fill="rgba(255,255,255,.4)" fontFamily="JetBrains Mono, monospace" fontSize="11">
        {s.units}U
      </text>
      {/* vents */}
      <g fill="#0b0a10" stroke="rgba(255,255,255,.06)" strokeWidth="1">
        {vents}
      </g>
      {/* drive bays */}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(24 ${352 + i * 52})`}>
          <rect width="94" height="42" rx="5" fill="#121118" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
          <rect x="10" y="17" width="54" height="8" rx="4" fill="#24222c" />
          <circle cx="78" cy="21" r="4" fill={i === 0 ? s.accent : '#3ddc97'} className={i === 0 ? 'led led--act' : ''} />
        </g>
      ))}
      {/* vertical name */}
      <g transform="translate(78 760) rotate(-90)">
        <text
          x="0"
          y="0"
          fill="#efeef3"
          fontFamily="Inter Tight, Inter, sans-serif"
          fontWeight="600"
          fontSize="30"
          letterSpacing="2"
        >
          {s.name.toUpperCase()}
        </text>
        <text x="0" y="-36" fill={s.accent} fontFamily="JetBrains Mono, monospace" fontSize="15" letterSpacing="2">
          {s.code}
        </text>
      </g>
      {/* badge */}
      <rect x="30" y="782" width="82" height="34" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="2" />
      <text
        x="71"
        y="806"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Inter Tight, Inter, sans-serif"
        fontWeight="600"
        fontSize="17"
        letterSpacing="3"
      >
        GLX
      </text>
    </svg>
  )
})

/* Side panel / internal view shown when the blade turns out (474 × 900). */
export const ServerCover = memo(function ServerCover({ s, uid }: { s: Server; uid: string }) {
  const g = `sc-${uid}`
  const words = s.name.toUpperCase().split(' ')
  const isGpu = s.kind === 'gpu'
  const isColo = s.kind === 'colo'
  const isStorage = s.kind === 'storage'
  const sockets = s.cpu.startsWith('2 ×') ? 2 : 1

  return (
    <svg viewBox="0 0 474 900" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id={`${g}-glow`} cx=".6" cy=".55" r=".7">
          <stop offset="0" stopColor={s.accent} stopOpacity=".38" />
          <stop offset=".45" stopColor={s.accent2} stopOpacity=".22" />
          <stop offset="1" stopColor="#0d0c11" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${g}-pcb`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#15141c" />
          <stop offset="1" stopColor="#1d1b27" />
        </linearGradient>
        <pattern id={`${g}-dots`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="rgba(255,255,255,.08)" />
        </pattern>
      </defs>

      <rect width="474" height="900" fill="#0f0e14" />
      <rect width="474" height="900" fill={`url(#${g}-dots)`} />
      <rect width="474" height="900" fill={`url(#${g}-glow)`} />
      <rect x="1.5" y="1.5" width="471" height="897" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="3" />

      {/* header */}
      <text x="36" y="58" fill="rgba(255,255,255,.55)" fontFamily="Inter Tight, Inter, sans-serif" fontWeight="600" fontSize="14" letterSpacing="4">
        A GLIXY MACHINE
      </text>
      <text x="438" y="58" textAnchor="end" fill={s.accent} fontFamily="JetBrains Mono, monospace" fontSize="14" letterSpacing="2">
        {s.code}
      </text>
      {words.map((w, i) => (
        <text
          key={i}
          x="34"
          y={128 + i * 58}
          fill="#ffffff"
          fontFamily="Inter Tight, Inter, sans-serif"
          fontWeight="600"
          fontSize={w.length > 8 ? 50 : 60}
          letterSpacing="-1"
        >
          {w}
        </text>
      ))}
      <text
        x="36"
        y={128 + words.length * 58 - 14}
        fill="rgba(255,255,255,.6)"
        fontFamily="Inter, sans-serif"
        fontSize="16"
      >
        {KIND_LABEL[s.kind]} · {s.audience === 'B2B' ? 'For business' : 'For individuals'}
      </text>

      {/* internals board */}
      <g transform="translate(36 330)">
        <rect width="402" height="430" rx="10" fill={`url(#${g}-pcb)`} stroke="rgba(255,255,255,.12)" strokeWidth="2" />
        {/* traces */}
        <g stroke={s.accent} strokeOpacity=".22" strokeWidth="1.5" fill="none">
          <path d="M20 150h80l20 20h120M20 190h60l30 30h200M380 120h-60l-20-20H160M380 330h-90l-20 20H120l-20-20H20" />
          <path d="M60 400v-40l20-20h120M340 400v-30l-20-20h-60" />
        </g>
        {/* fan wall */}
        <g transform="translate(18 18)">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${i * 74} 0)`}>
              <rect width="66" height="66" rx="8" fill="#0d0c12" stroke="rgba(255,255,255,.1)" strokeWidth="1.5" />
              <circle cx="33" cy="33" r="26" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="1.5" />
              <g className="fan" style={{ transformOrigin: '33px 33px' }}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <path
                    key={a}
                    d="M33 33c4-12 14-16 18-12-6 2-10 8-12 14z"
                    fill={s.accent}
                    fillOpacity=".55"
                    transform={`rotate(${a} 33 33)`}
                  />
                ))}
              </g>
              <circle cx="33" cy="33" r="5" fill="#2a2833" />
            </g>
          ))}
        </g>

        {isColo ? (
          <g transform="translate(40 110)">
            {/* empty bay waiting for customer hardware */}
            <rect width="322" height="200" rx="8" fill="none" stroke={s.accent} strokeOpacity=".6" strokeWidth="2" strokeDasharray="8 8" />
            <text x="161" y="92" textAnchor="middle" fill="#fff" fontFamily="Inter Tight, Inter, sans-serif" fontWeight="600" fontSize="22" letterSpacing="3">
              YOUR HARDWARE
            </text>
            <text x="161" y="122" textAnchor="middle" fill="rgba(255,255,255,.55)" fontFamily="Inter, sans-serif" fontSize="14">
              {s.units}U · A+B power · remote hands
            </text>
          </g>
        ) : isGpu ? (
          <g transform="translate(20 108)">
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(0 ${i * 52})`}>
                <rect width="362" height="42" rx="6" fill="#121118" stroke={s.accent} strokeOpacity=".55" strokeWidth="1.5" />
                <rect x="10" y="10" width="200" height="22" rx="3" fill={s.accent} fillOpacity=".16" />
                {[0, 1, 2, 3, 4, 5].map((k) => (
                  <rect key={k} x={226 + k * 20} y="10" width="12" height="22" rx="2" fill="rgba(255,255,255,.08)" />
                ))}
              </g>
            ))}
          </g>
        ) : isStorage ? (
          <g transform="translate(20 108)">
            {Array.from({ length: 24 }).map((_, i) => (
              <g key={i} transform={`translate(${(i % 6) * 61} ${Math.floor(i / 6) * 52})`}>
                <rect width="54" height="44" rx="5" fill="#121118" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" />
                <circle cx="44" cy="10" r="3" fill={i % 5 === 0 ? s.accent : '#3ddc97'} />
                <rect x="8" y="26" width="30" height="5" rx="2.5" fill="rgba(255,255,255,.1)" />
              </g>
            ))}
          </g>
        ) : (
          <g transform="translate(20 108)">
            {/* CPU sockets with DIMMs either side */}
            {Array.from({ length: sockets }).map((_, k) => {
              const x = sockets === 1 ? 121 : 30 + k * 182
              return (
                <g key={k} transform={`translate(${x} 0)`}>
                  {[0, 1, 2, 3].map((d) => (
                    <rect key={`l${d}`} x={-4 - d * 10} y="0" width="6" height="200" rx="2" fill={s.accent2} fillOpacity=".75" />
                  ))}
                  <rect x="12" y="40" width="96" height="96" rx="8" fill="#0b0a10" stroke={s.accent} strokeWidth="2" />
                  <rect x="26" y="54" width="68" height="68" rx="4" fill={s.accent} fillOpacity=".18" />
                  <text x="60" y="95" textAnchor="middle" fill={s.accent} fontFamily="JetBrains Mono, monospace" fontSize="13">
                    CPU{sockets > 1 ? k + 1 : ''}
                  </text>
                  {[0, 1, 2, 3].map((d) => (
                    <rect key={`r${d}`} x={118 + d * 10} y="0" width="6" height="200" rx="2" fill={s.accent2} fillOpacity=".75" />
                  ))}
                </g>
              )
            })}
          </g>
        )}

        {/* NVMe / PSU row */}
        <g transform="translate(20 352)">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 52} y="0" width="44" height="58" rx="4" fill="#121118" stroke="rgba(255,255,255,.14)" strokeWidth="1.5" />
          ))}
          <rect x="222" y="0" width="68" height="58" rx="5" fill="#16151c" stroke={s.accent} strokeOpacity=".5" strokeWidth="1.5" />
          <rect x="296" y="0" width="68" height="58" rx="5" fill="#16151c" stroke={s.accent} strokeOpacity=".5" strokeWidth="1.5" />
          <text x="256" y="34" textAnchor="middle" fill="rgba(255,255,255,.5)" fontFamily="JetBrains Mono, monospace" fontSize="11">
            PSU A
          </text>
          <text x="330" y="34" textAnchor="middle" fill="rgba(255,255,255,.5)" fontFamily="JetBrains Mono, monospace" fontSize="11">
            PSU B
          </text>
        </g>
      </g>

      {/* footer */}
      <text x="36" y="822" fill="#fff" fontFamily="DM Sans, Inter, sans-serif" fontSize="34" letterSpacing="-1">
        {inr(s.price)}
      </text>
      <text x="36" y="852" fill="rgba(255,255,255,.5)" fontFamily="Inter, sans-serif" fontSize="15">
        per month · {s.setup.toLowerCase()}
      </text>
      <rect x="350" y="800" width="88" height="40" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2" />
      <text x="394" y="828" textAnchor="middle" fill="#fff" fontFamily="Inter Tight, Inter, sans-serif" fontWeight="600" fontSize="19" letterSpacing="3">
        GLX
      </text>
    </svg>
  )
})
