import { API_BASE } from '../services/api'

function Settings() {
  return (
    <div className="space-y-6 p-4 pb-12 lg:p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Settings</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Integration</h2>
        <p className="mt-1 text-sm text-slate-400">Configure backend integration and API endpoints.</p>
      </div>

      <div className="max-w-xl rounded-xl border border-slate-800/90 bg-[#111827] p-6 ring-1 ring-slate-800/50">
        <h3 className="text-sm font-semibold text-white">API base URL</h3>
        <p className="mt-2 text-sm text-slate-400">
          Set <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-xs text-emerald-300">VITE_API_BASE_URL</code>{' '}
          in <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-xs">.env</code>. Service stubs live in{' '}
          <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-xs">src/services/api.js</code>.
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4 border-t border-slate-800/80 pt-3">
            <dt className="text-slate-500">Resolved base</dt>
            <dd className="font-mono text-xs text-slate-300">{API_BASE || '(not configured)'}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default Settings
