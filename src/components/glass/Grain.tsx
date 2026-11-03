/** Film-grain layer for glass cards. Uses the shared #cardNoise filter from <GlassDefs/>. */
export function Grain() {
  return (
    <svg className="gc__grain" viewBox="0 0 429 554" preserveAspectRatio="none" aria-hidden="true">
      <rect width="429" height="554" filter="url(#cardNoise)" />
    </svg>
  )
}

/** Shared SVG filters; rendered once near the root. */
export function GlassDefs() {
  return (
    <svg className="filter-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="cardNoise" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency=".54" numOctaves={3} seed={27} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.8" intercept="-.25" />
            <feFuncG type="linear" slope="1.8" intercept="-.25" />
            <feFuncB type="linear" slope="1.8" intercept="-.25" />
            <feFuncA type="table" tableValues="0 .52" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  )
}
