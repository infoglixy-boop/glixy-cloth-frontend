import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import ExpertForm from './ExpertForm'
import Logo from './Logo'
import { ExpertCtx, type ExpertPrefill } from './expertContext'
import './expert.css'

export function ExpertProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [prefill, setPrefill] = useState<ExpertPrefill>({})
  const [nonce, setNonce] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  const show = useCallback((p: ExpertPrefill = {}) => {
    lastFocus.current = document.activeElement as HTMLElement
    setPrefill(p)
    setNonce((n) => n + 1)
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    lastFocus.current?.focus?.()
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.classList.add('lock')
    const t = window.setTimeout(() => dialogRef.current?.querySelector<HTMLInputElement>('input')?.focus(), 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey, true)
      if (!document.querySelector('.detail.is-open')) document.body.classList.remove('lock')
    }
  }, [open, close])

  return (
    <ExpertCtx.Provider value={show}>
      {children}
      {open && (
        <div className="expert" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <div className="expert__panel glass" role="dialog" aria-modal="true" aria-labelledby="expert-title" ref={dialogRef}>
            <button className="expert__close" onClick={close} aria-label="Close">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>

            <Logo height={18} className="expert__logo" />
            <ExpertForm key={nonce} prefill={prefill} onDone={close} />
          </div>
        </div>
      )}
    </ExpertCtx.Provider>
  )
}
