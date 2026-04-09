import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const tooltipStyle = {
  backgroundColor: '#111827',
  border: '1px solid #1f2937',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#e2e8f0',
}

function AlertsByHourChart({ data }) {
  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
      <h2 className="text-base font-semibold text-white">Alerts by hour</h2>
      <p className="mb-4 text-xs text-slate-500">Volume distribution today</p>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1f2937' }} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}`, 'Alerts']} cursor={{ fill: 'rgba(34,197,94,0.06)' }} />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AlertsByHourChart
