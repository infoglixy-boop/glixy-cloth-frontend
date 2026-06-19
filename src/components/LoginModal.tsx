import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User as UserIcon,
  X,
} from 'lucide-react'
import { useStore } from '../context/StoreContext'

type Mode = 'login' | 'signup'

const PERKS = [
  '₹200 off your first order',
  'Early access to every drop',
  'Save addresses, track orders in one click',
  'Free returns on the first three orders',
]

export default function LoginModal() {
  const { loginOpen, setLoginOpen, login, setInfoPage, pushToast } = useStore()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [accept, setAccept] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loginOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [loginOpen])

  const reset = () => {
    setName('')
    setEmail('')
    setPassword('')
    setShowPw(false)
  }

  const close = () => {
    setLoginOpen(false)
    reset()
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (mode === 'signup' && !accept) {
      pushToast('Please accept the Terms to continue')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    const who = mode === 'signup' ? name : email.split('@')[0]
    login(who || 'Friend')
    setLoading(false)
    close()
  }

  const social = (label: string) => {
    pushToast(`Continuing with ${label}…`)
    setTimeout(() => {
      login(label === 'Google' ? 'Alex' : 'Sam')
      close()
    }, 500)
  }

  return (
    <AnimatePresence>
      {loginOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 pointer-events-none"
          >
            <div className="pointer-events-auto bg-brand-cream rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden grid md:grid-cols-2 max-h-[92vh]">
              {/* Visual side */}
              <div className="relative hidden md:block bg-brand-ink text-white overflow-hidden">
                <img
                  src="/products/look2.jpg"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/40 via-brand-ink/55 to-brand-ink" />
                <div className="relative h-full p-9 flex flex-col">
                  <a href="#" className="font-display text-3xl italic tracking-tight">
                    Glixy<span className="text-brand">.</span>
                  </a>

                  <div className="mt-auto">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand mb-3">
                      Member perks
                    </p>
                    <h3 className="font-display italic text-4xl leading-[1.05] tracking-tight">
                      Become part of the gang.
                    </h3>
                    <ul className="mt-5 flex flex-col gap-2.5">
                      {PERKS.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2.5 text-sm text-white/85"
                        >
                          <span className="mt-0.5 w-4 h-4 rounded-full bg-brand text-white grid place-items-center shrink-0">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-7 text-[11px] text-white/55 max-w-xs leading-relaxed">
                      Joining is free, forever. We will never sell your data — see our{' '}
                      <button
                        onClick={() => setInfoPage('privacy')}
                        className="underline hover:text-white transition-colors"
                      >
                        Privacy Policy
                      </button>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* Form side */}
              <div className="relative p-7 sm:p-10 overflow-y-auto">
                <button
                  onClick={close}
                  aria-label="Close"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-card hover:bg-brand-sand transition-colors flex items-center justify-center"
                >
                  <X size={18} />
                </button>

                <div className="md:hidden mb-6 flex items-center justify-between">
                  <a href="#" className="font-display text-2xl italic tracking-tight">
                    Glixy<span className="text-brand">.</span>
                  </a>
                </div>

                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-3">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </p>
                <h2 className="font-display italic text-3xl sm:text-4xl leading-tight text-brand-ink tracking-tight">
                  {mode === 'login' ? 'Sign in to Glixy.' : 'Join Glixy. ₹200 inside.'}
                </h2>

                {/* Social buttons */}
                <div className="mt-6 grid grid-cols-2 gap-2.5">
                  <SocialBtn label="Google" onClick={() => social('Google')}>
                    <GoogleIcon />
                    Google
                  </SocialBtn>
                  <SocialBtn label="Apple" onClick={() => social('Apple')}>
                    <AppleIcon />
                    Apple
                  </SocialBtn>
                </div>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-brand-ink/10" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-muted">
                    or with email
                  </span>
                  <div className="flex-1 h-px bg-brand-ink/10" />
                </div>

                <form onSubmit={submit} className="flex flex-col gap-3">
                  {mode === 'signup' && (
                    <Field icon={UserIcon} label="Full name">
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full bg-transparent outline-none text-sm"
                      />
                    </Field>
                  )}
                  <Field icon={Mail} label="Email">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@glixy.in"
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </Field>
                  <Field icon={Lock} label="Password">
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-transparent outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      className="text-brand-muted hover:text-brand-ink transition-colors p-1 -mr-1"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </Field>

                  {mode === 'login' ? (
                    <div className="flex items-center justify-between text-xs">
                      <label className="inline-flex items-center gap-2 text-brand-ink/80 cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-brand" />
                        Remember me
                      </label>
                      <button
                        type="button"
                        className="text-brand font-semibold hover:underline"
                        onClick={() => pushToast('Reset link sent if the email exists')}
                      >
                        Forgot password?
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-start gap-2 text-xs text-brand-ink/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accept}
                        onChange={(e) => setAccept(e.target.checked)}
                        className="accent-brand mt-0.5"
                      />
                      <span>
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setInfoPage('terms')}
                          className="text-brand font-semibold hover:underline"
                        >
                          Terms
                        </button>{' '}
                        &{' '}
                        <button
                          type="button"
                          onClick={() => setInfoPage('privacy')}
                          className="text-brand font-semibold hover:underline"
                        >
                          Privacy Policy
                        </button>
                        .
                      </span>
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-2 inline-flex items-center justify-center gap-2 bg-brand-ink text-white text-sm font-medium tracking-wide pl-6 pr-4 py-3.5 rounded-full hover:bg-brand transition-colors disabled:opacity-60"
                  >
                    {loading
                      ? 'One sec…'
                      : mode === 'login'
                      ? 'Sign in'
                      : 'Create my account'}
                    <span className="grid place-items-center w-6 h-6 rounded-full bg-white text-brand-ink group-hover:bg-brand-ink group-hover:text-white transition-colors">
                      <ArrowUpRight size={14} />
                    </span>
                  </button>
                </form>

                <div className="mt-5 text-center text-xs text-brand-muted">
                  {mode === 'login' ? "New to Glixy?" : 'Already a member?'}{' '}
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-brand-ink font-semibold hover:underline"
                  >
                    {mode === 'login' ? 'Create an account' : 'Sign in'}
                  </button>
                </div>

                <div className="mt-6 rounded-2xl bg-brand-sand/70 border border-brand-ink/5 p-3.5 flex items-center gap-3">
                  <Sparkles size={16} className="text-brand shrink-0" />
                  <p className="text-xs text-brand-ink/80 leading-snug">
                    Want a quick fit? Open the{' '}
                    <span className="font-semibold">AI Stylist</span> from the header —
                    no sign-up needed.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-muted">
        {label}
      </span>
      <div className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-3 border border-brand-ink/10 focus-within:border-brand-ink transition-colors">
        <Icon size={16} className="text-brand-muted shrink-0" />
        {children}
      </div>
    </label>
  )
}

function SocialBtn({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Continue with ${label}`}
      className="inline-flex items-center justify-center gap-2 bg-white border border-brand-ink/10 text-brand-ink text-sm font-medium py-3 rounded-xl hover:bg-brand-sand transition-colors"
    >
      {children}
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.5 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.22-4.74 3.22-8.11Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.26 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.42 3.46 1.18 4.94l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.46c1.61 0 3.06.55 4.2 1.64l3.15-3.15C17.46 2.15 14.96 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.39 9.14 5.46 12 5.46Z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.36 1.43c0 1.18-.47 2.31-1.24 3.14-.82.88-2.16 1.55-3.27 1.46-.13-1.16.43-2.32 1.18-3.13.84-.91 2.27-1.6 3.33-1.47Zm3.61 16.95c-.6 1.38-.89 2-1.66 3.22-1.07 1.7-2.58 3.82-4.46 3.84-1.67.02-2.1-1.09-4.37-1.08-2.27.02-2.74 1.1-4.41 1.08-1.88-.02-3.31-1.93-4.38-3.63-3-4.76-3.32-10.36-1.47-13.34 1.32-2.12 3.4-3.36 5.35-3.36 1.99 0 3.24 1.09 4.89 1.09 1.6 0 2.57-1.09 4.87-1.09 1.74 0 3.58.95 4.89 2.59-4.3 2.36-3.6 8.51.75 9.68Z" />
    </svg>
  )
}
