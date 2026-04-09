const sevDot = {
  critical: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]',
  high: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
  medium: 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.4)]',
  low: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]',
}

function IncidentTimeline({ events }) {
  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
      <h2 className="text-base font-semibold text-white">Incident timeline</h2>
      <p className="mb-4 text-xs text-slate-500">Today&apos;s events in chronological order</p>

      <ol className="relative border-l border-slate-700/60 pl-6">
        {events.map((e) => (
          <li key={e.id} className="group relative mb-6 last:mb-0">
            <span
              className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-[#111827] ${sevDot[e.severity] || sevDot.low}`}
            />
            <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 px-4 py-3 transition hover:border-slate-700/60">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] tabular-nums text-slate-500">{e.time}</span>
                <span className="text-sm font-semibold text-white">{e.title}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{e.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default IncidentTimeline
