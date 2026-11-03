import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/base.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Fade the boot splash once fonts are in and the logo animation has played (≥1.6s, ≤4s).
const boot = document.getElementById('boot')
if (boot) {
  const started = performance.now()
  const hide = () => {
    const wait = Math.max(0, 1600 - (performance.now() - started))
    window.setTimeout(() => {
      boot.classList.add('is-out')
      window.setTimeout(() => boot.remove(), 700)
    }, wait)
  }
  const failsafe = window.setTimeout(hide, 4000)
  Promise.all([document.fonts?.ready, new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))]).then(() => {
    window.clearTimeout(failsafe)
    hide()
  })
}
