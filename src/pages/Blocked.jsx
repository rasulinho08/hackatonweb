import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSecurityActions } from '../hooks/useSecurityActions'
import { alertsMatchingIp, intelForIp, logsMatchingIp } from '../utils/blockedIntel'

const sevBadge = {
  Critical: 'bg-red-500/15 text-red-300 ring-red-500/30',
  High: 'bg-amber-500/15 text-amber-200 ring-amber-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-300 ring-yellow-500/30',
  Low: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
}

function formatBlockedAt(ts) {
  if (!ts) return '—'
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return '—'
  }
}

function Blocked() {
  const { blocked, unblockIp } = useSecurityActions()

  const rows = useMemo(() => {
    return Object.entries(blocked)
      .map(([ip, meta]) => ({
        ip,
        at: meta?.at,
        source: meta?.source,
        intel: intelForIp(ip),
        relatedAlerts: alertsMatchingIp(ip),
        relatedLogs: logsMatchingIp(ip),
      }))
      .sort((a, b) => (b.at || 0) - (a.at || 0))
  }, [blocked])

  return (
    <div className="space-y-6 p-4 pb-12 lg:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Perimeter</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Blocked addresses</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            IPs you blocked via the copilot or local commands. Related snapshot alerts and log lines are shown for triage. Unblock restores traffic in this demo only.
          </p>
        </div>
        <Link
          to="/alerts"
          className="rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-slate-800"
        >
          Open alerts queue
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/30 px-6 py-14 text-center">
          <p className="text-sm text-slate-400">No blocked IPs yet.</p>
          <p className="mt-2 text-xs text-slate-600">
            Use the SOC copilot (e.g. &quot;block 45.23.11.2&quot;) to add entries. They will appear here with linked alerts.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <article
              key={row.ip}
              className="overflow-hidden rounded-xl border border-slate-800/90 bg-[#111827] shadow-lg shadow-black/20 ring-1 ring-slate-800/50"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 px-5 py-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-lg font-semibold text-red-300">{row.ip}</span>
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-red-300 ring-1 ring-red-500/30">
                      Blocked
                    </span>
                    {row.intel.country && (
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">{row.intel.country}</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {row.intel.threat}
                    {row.intel.attempts != null && (
                      <span className="ml-2 font-mono tabular-nums text-slate-400">· {row.intel.attempts.toLocaleString()} attempts</span>
                    )}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-600">
                    Blocked at: {formatBlockedAt(row.at)}
                    {row.source && (
                      <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 font-medium text-slate-500">
                        {row.source === 'snapshot' ? 'From snapshot' : row.source === 'copilot' ? 'Copilot / manual' : 'Saved'}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => unblockIp(row.ip)}
                  className="shrink-0 rounded-lg border border-emerald-600/50 bg-emerald-600/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-600/25"
                >
                  Unblock
                </button>
              </div>

              <div className="grid gap-4 p-5 lg:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Related alerts</h3>
                  {row.relatedAlerts.length === 0 ? (
                    <p className="text-xs text-slate-600">No alert narrative in the snapshot references this IP.</p>
                  ) : (
                    <ul className="space-y-2">
                      {row.relatedAlerts.map((a) => (
                        <li
                          key={a.id}
                          className="rounded-lg border border-slate-800/80 bg-slate-950/50 px-3 py-2 text-xs"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ring-1 ${sevBadge[a.severity] || ''}`}>{a.severity}</span>
                            <span className="font-medium text-slate-200">{a.type}</span>
                            <span className="font-mono text-cyan-300/80">{a.ticket}</span>
                            <span className="text-slate-600">{a.time}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-slate-500">{a.description}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Related log lines</h3>
                  {row.relatedLogs.length === 0 ? (
                    <p className="text-xs text-slate-600">No raw log rows for this exact IP in the snapshot.</p>
                  ) : (
                    <ul className="space-y-1.5 font-mono text-[11px] text-slate-400">
                      {row.relatedLogs.map((l, i) => (
                        <li key={i} className="rounded border border-slate-800/60 bg-slate-950/40 px-2 py-1.5">
                          <span className="text-slate-600">{l.time}</span> · {l.ip} · {l.activity} ·{' '}
                          <span className={l.risk === 'critical' ? 'text-red-400' : l.risk === 'high' ? 'text-amber-400' : 'text-emerald-400'}>
                            {l.risk}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Blocked
