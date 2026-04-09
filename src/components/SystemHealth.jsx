function HealthBar({ label, value, max, unit, status }) {
  const pct = Math.min((value / max) * 100, 100)
  const barColor =
    status === 'warning' ? 'bg-amber-500' : status === 'critical' ? 'bg-red-500' : 'bg-emerald-500'
  const textColor =
    status === 'warning' ? 'text-amber-300' : status === 'critical' ? 'text-red-300' : 'text-emerald-300'

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <span className={`font-mono text-xs font-semibold tabular-nums ${textColor}`}>
          {value}{unit && <span className="text-slate-500"> {unit}</span>}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function SystemHealth({ data }) {
  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
      <h2 className="text-base font-semibold text-white">System health</h2>
      <p className="mb-4 text-xs text-slate-500">Infrastructure resource utilisation</p>
      <div className="space-y-4">
        {data.map((item) => (
          <HealthBar key={item.label} {...item} />
        ))}
      </div>
    </div>
  )
}

export default SystemHealth
