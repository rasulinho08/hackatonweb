function dotClass(level) {
  if (level === 'high') return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
  if (level === 'medium') return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.45)]'
  return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.45)]'
}

function ThreatMap({ nodes }) {
  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">Global threat surface</h2>
        <p className="text-xs text-slate-500">Regional threat activity overview</p>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-slate-800/80 bg-gradient-to-br from-slate-950 via-[#0f172a] to-slate-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute left-3 top-3 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-500 ring-1 ring-slate-700/60">
          Live monitoring
        </div>

        {nodes.map((n) => (
          <div
            key={n.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ring-2 ring-[#0f172a]/80 ${dotClass(n.level)}`}
              title={n.label}
            />
            <span className="whitespace-nowrap text-[10px] font-medium text-slate-400">{n.label}</span>
          </div>
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-4 text-[11px] text-slate-500">
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" /> High
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Medium
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Low
        </li>
      </ul>
    </div>
  )
}

export default ThreatMap
