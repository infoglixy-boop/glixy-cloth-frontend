/* 7-row LED bitmap glyphs ("1" = lit dot). */
const GLYPHS: Record<string, string> = {
  '0': '01110 10001 10011 10101 11001 10001 01110',
  '1': '010 110 010 010 010 010 111',
  '2': '01110 10001 00001 00010 00100 01000 11111',
  '3': '11110 00001 00001 01110 00001 00001 11110',
  '4': '00010 00110 01010 10010 11111 00010 00010',
  '5': '11111 10000 10000 11110 00001 00001 11110',
  '6': '01110 10000 10000 11110 10001 10001 01110',
  '7': '11111 00001 00010 00100 01000 01000 01000',
  '8': '01110 10001 10001 01110 10001 10001 01110',
  '9': '01110 10001 10001 01111 00001 00001 01110',
  '.': '0 0 0 0 0 0 1',
  ',': '0 0 0 0 0 1 1',
  I: '111 010 010 010 010 010 111',
  a: '00000 00000 01110 00001 01111 10001 01111',
  e: '00000 00000 01110 10001 11111 10000 01110',
  g: '00000 00000 01111 10001 01111 00001 01110',
  i: '1 0 1 1 1 1 1',
  l: '10 10 10 10 10 10 01',
  n: '00000 00000 11110 10001 10001 10001 10001',
  t: '010 010 111 010 010 010 001',
  r: '00000 00000 10110 11001 10000 10000 10000',
}

export function layoutDots(text: string, pitchX: number, pitchY = 4, gap = 1) {
  const dots: [number, number][] = []
  let x = 0
  for (const ch of text) {
    const g = GLYPHS[ch]
    if (!g) {
      x += 3 * pitchX
      continue
    }
    const rows = g.split(' ')
    const w = rows[0].length
    rows.forEach((row, y) => {
      for (let c = 0; c < row.length; c++) if (row[c] === '1') dots.push([x + c * pitchX + 1.55, y * pitchY + 1.55])
    })
    x += (w + gap) * pitchX
  }
  return { dots, width: Math.max(1, x) }
}

/** Splits "₹43k" → { pre: "₹", num: "43", post: "k" } so only the digits are drawn in dots. */
export function splitNumber(value: string) {
  const m = value.match(/\d[\d,]*(\.\d+)?/)
  if (!m || m.index === undefined) return null
  return { pre: value.slice(0, m.index), num: m[0], post: value.slice(m.index + m[0].length) }
}

const VARIANTS = ['gc--speed', 'gc--context', 'gc--connections'] as const

/** Class names for the glass card skin; variants cycle crimson → lilac → orange. */
export const gc = (i: number, extra = '') => `gc ${VARIANTS[((i % 3) + 3) % 3]}${extra ? ' ' + extra : ''}`
