import { useEffect, useState } from 'react'
import { activityFeed } from '../data/mockData'
import LivePulse from './LivePulse'

const typeStyles = {
  block: 'text-red-400',
  quarantine: 'text-amber-400',
  alert: 'text-rose-300',
  action: 'text-cyan-300',
  info: 'text-slate-400',
}

function ActivityFeed() {
  const [visible, setVisible] = useState(6)

  useEffect(() => {
    if (visible >= activityFeed.length) return
    const timer = setInterval(() => {
      setVisible((v) => Math.min(v + 1, activityFeed.length))
    }, 3000)
    return () => clearInterval(timer)
  }, [visible])

  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Live activity feed</h2>
          <p className="text-xs text-slate-500">Streaming events in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <LivePulse />
          <span className="text-xs font-medium text-emerald-400">LIVE</span>
        </div>
      </div>
      <ul className="max-h-[340px] space-y-1 overflow-y-auto pr-1">
        {activityFeed.slice(0, visible).map((e) => (
          <li
            key={e.id}
            className="flex gap-3 rounded-lg border border-slate-800/40 bg-slate-950/40 px-3 py-2 transition hover:border-slate-700/60"
          >
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-slate-600">{e.time}</span>
            <span className={`text-sm ${typeStyles[e.type] || 'text-slate-400'}`}>{e.event}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActivityFeed
