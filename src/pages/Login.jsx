import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/Spinner'

function Login() {
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  if (user) return <Navigate to="/" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const result = login(email, password)
      if (!result.ok) setError(result.error)
      setLoading(false)
    }, 800)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
            <svg className="h-8 w-8 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">SOC Sentinel</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your security operations center</p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800/90 bg-[#111827] p-8 shadow-2xl ring-1 ring-slate-800/50"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="admin@sentinel.io"
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Spinner className="h-4 w-4 text-white" />}
              Sign in
            </button>
          </div>

          <div className="mt-6 rounded-lg border border-dashed border-slate-700/80 bg-slate-950/40 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Quick access</p>
            <div className="space-y-1.5 text-xs">
              <DemoRow role="Admin" email="admin@sentinel.io" pw="admin123" onFill={(e, p) => { setEmail(e); setPassword(p) }} />
              <DemoRow role="Analyst" email="j.torres@sentinel.io" pw="analyst123" onFill={(e, p) => { setEmail(e); setPassword(p) }} />
              <DemoRow role="Viewer" email="viewer@sentinel.io" pw="viewer123" onFill={(e, p) => { setEmail(e); setPassword(p) }} />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function DemoRow({ role, email, pw, onFill }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">{role}</span>
        <span className="ml-2 text-slate-400">{email}</span>
        <span className="ml-1 text-slate-600">/ {pw}</span>
      </div>
      <button
        type="button"
        onClick={() => onFill(email, pw)}
        className="rounded px-2 py-1 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/10"
      >
        Fill
      </button>
    </div>
  )
}

export default Login
