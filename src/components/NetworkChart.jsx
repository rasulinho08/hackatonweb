import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const tooltipStyle = {
  backgroundColor: '#111827',
  border: '1px solid #1f2937',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#e2e8f0',
}

function NetworkChart({ data }) {
  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
      <h2 className="text-base font-semibold text-white">Network traffic</h2>
      <p className="mb-4 text-xs text-slate-500">Inbound / outbound (Mbps) — 24h</p>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="inFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="outFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1f2937' }} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              verticalAlign="top"
              height={28}
              iconType="circle"
              iconSize={8}
              formatter={(v) => <span className="text-xs text-slate-400">{v}</span>}
            />
            <Area type="monotone" dataKey="inbound" stroke="#3b82f6" strokeWidth={2} fill="url(#inFill)" animationDuration={1000} dot={false} />
            <Area type="monotone" dataKey="outbound" stroke="#a855f7" strokeWidth={2} fill="url(#outFill)" animationDuration={1000} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default NetworkChart
