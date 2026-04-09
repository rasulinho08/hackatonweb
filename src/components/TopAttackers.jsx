import { useSecurityActions } from '../hooks/useSecurityActions'

function TopAttackers({ data }) {
  const { isBlocked } = useSecurityActions()
  const maxAttempts = Math.max(...data.map((d) => d.attempts))

  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
      <h2 className="text-base font-semibold text-white">Top attacking IPs</h2>
      <p className="mb-4 text-xs text-slate-500">Ranked by attempt volume</p>

      <div className="space-y-3">
        {data.map((a, i) => {
          const pct = (a.attempts / maxAttempts) * 100
          const blocked = isBlocked(a.ip)
          return (
            <div key={a.ip}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-slate-500 ring-1 ring-slate-700">
                    {i + 1}
                  </span>
                  <span className={`font-mono text-xs ${blocked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{a.ip}</span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">{a.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs tabular-nums text-slate-300">{a.attempts.toLocaleString()}</span>
                  {blocked ? (
                    <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-bold text-red-300">BLOCKED</span>
                  ) : (
                    <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">ACTIVE</span>
                  )}
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-red-500/70 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopAttackers
