import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const tooltipStyle = {
  backgroundColor: '#111827',
  border: '1px solid #1f2937',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#e2e8f0',
}

function RiskChart({ data }) {
  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-white">Risk score over time</h2>
          <p className="text-xs text-slate-500">Aggregate exposure index (0–100)</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Current</p>
          <p className="text-lg font-semibold tabular-nums text-amber-300">
            {data[data.length - 1]?.risk ?? '—'}
          </p>
        </div>
      </div>

      <div className="h-[240px] w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#1f2937' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(v) => [`${v}`, 'Risk']}
            />
            <Area
              type="monotone"
              dataKey="risk"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#riskFill)"
              animationDuration={1200}
              dot={{ fill: '#fbbf24', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#fcd34d' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RiskChart
