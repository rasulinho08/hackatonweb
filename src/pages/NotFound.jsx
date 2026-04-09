import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0F19] px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-slate-500">Error</p>
      <h1 className="mt-2 text-6xl font-bold tabular-nums text-emerald-500/90">404</h1>
      <p className="mt-4 text-slate-400">This route is not monitored by SOC Sentinel.</p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
      >
        Back to dashboard
      </Link>
    </div>
  )
}

export default NotFound
