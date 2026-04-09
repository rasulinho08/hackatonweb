import { useMemo, useState } from 'react'
import AlertDetailModal from './AlertDetailModal'

const severityStyles = {
  Critical: 'bg-red-500/15 text-red-300 ring-red-500/30',
  High: 'bg-amber-500/15 text-amber-200 ring-amber-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-300 ring-yellow-500/30',
  Low: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
}

const statusStyles = {
  Active: 'text-red-300',
  Investigating: 'text-amber-300',
  Contained: 'text-cyan-300',
  Mitigated: 'text-slate-300',
  Resolved: 'text-emerald-300',
  Monitoring: 'text-blue-300',
}

const sevOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }

const triageStyles = {
  P1: 'bg-red-500/15 text-red-300 ring-red-500/35',
  P2: 'bg-amber-500/15 text-amber-200 ring-amber-500/35',
  P3: 'bg-yellow-500/15 text-yellow-200 ring-yellow-500/35',
  P4: 'bg-slate-600/20 text-slate-300 ring-slate-600/40',
}

function triageFor(alert) {
  const sevW = { Critical: 42, High: 32, Medium: 22, Low: 12 }
  const stW = { Active: 28, Investigating: 20, Contained: 14, Mitigated: 12, Resolved: 6, Monitoring: 10 }
  const score = Math.min(100, (sevW[alert.severity] ?? 15) + (stW[alert.status] ?? 10))
  const tier = score >= 62 ? 'P1' : score >= 48 ? 'P2' : score >= 34 ? 'P3' : 'P4'
  return { tier, score }
}

function AlertsTable({ alerts: rows, compact }) {
  const [search, setSearch] = useState('')
  const [sevFilter, setSevFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [patches, setPatches] = useState({})

  const rowsWithPatches = useMemo(
    () => rows.map((r) => ({ ...r, ...(patches[r.id] ?? {}) })),
    [rows, patches],
  )

  const handleEscalate = (alert) => {
    setPatches((p) => ({ ...p, [alert.id]: { status: 'Investigating' } }))
    setSelected((s) => (s && s.id === alert.id ? { ...s, status: 'Investigating' } : s))
  }

  const filtered = useMemo(() => {
    let list = rowsWithPatches
    if (sevFilter !== 'All') list = list.filter((a) => a.severity === sevFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) =>
          a.type.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          (a.ticket && a.ticket.toLowerCase().includes(q)),
      )
    }
    return [...list].sort((a, b) => (sevOrder[a.severity] ?? 9) - (sevOrder[b.severity] ?? 9))
  }, [rowsWithPatches, search, sevFilter])

  const sevOptions = ['All', 'Critical', 'High', 'Medium', 'Low']

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-[#111827] shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">Threat alerts</h2>
            <p className="text-xs text-slate-500">
              {filtered.length} of {rows.length} items
            </p>
          </div>
          {!compact && (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search type, source, ticket..."
                className="h-9 w-56 rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 text-xs text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
              />
              <div className="flex gap-1">
                {sevOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSevFilter(s)}
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition ${
                      sevFilter === s
                        ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                        : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800/80 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                {!compact && <th className="px-5 py-3 font-medium">Triage</th>}
                <th className="px-5 py-3 font-medium">Source</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Status</th>
                {!compact && <th className="px-5 py-3 font-medium">Ticket</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const { tier, score } = triageFor(a)
                return (
                <tr
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className="cursor-pointer border-b border-slate-800/40 transition-colors hover:bg-slate-800/40"
                >
                  <td className="px-5 py-3.5 font-medium text-slate-200">{a.type}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${severityStyles[a.severity] ?? ''}`}>
                      {a.severity}
                    </span>
                  </td>
                  {!compact && (
                    <td className="px-5 py-3.5">
                      <span className="inline-flex flex-col gap-0.5">
                        <span className={`inline-flex w-fit rounded-md px-2 py-0.5 text-[11px] font-bold ring-1 ${triageStyles[tier]}`}>
                          {tier}
                        </span>
                        <span className="text-[10px] tabular-nums text-slate-500">{score}</span>
                      </span>
                    </td>
                  )}
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{a.source}</td>
                  <td className="px-5 py-3.5 tabular-nums text-slate-400">{a.time}</td>
                  <td className={`px-5 py-3.5 text-xs font-semibold ${statusStyles[a.status] ?? 'text-slate-400'}`}>
                    {a.status}
                  </td>
                  {!compact && (
                    <td className="px-5 py-3.5 font-mono text-xs text-cyan-300/70">{a.ticket || '—'}</td>
                  )}
                </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={compact ? 5 : 7} className="px-5 py-8 text-center text-sm text-slate-500">
                    No alerts match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDetailModal alert={selected} onClose={() => setSelected(null)} onEscalate={handleEscalate} />
    </>
  )
}

export default AlertsTable
