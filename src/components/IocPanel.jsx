import { useSecurityActions } from '../hooks/useSecurityActions'

const typeColor = {
  IP: 'bg-red-500/15 text-red-300',
  Domain: 'bg-amber-500/15 text-amber-300',
  Hash: 'bg-purple-500/15 text-purple-300',
  URL: 'bg-rose-500/15 text-rose-300',
}

function IocPanel({ data }) {
  const { isBlocked } = useSecurityActions()
  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
      <h2 className="text-base font-semibold text-white">Indicators of compromise</h2>
      <p className="mb-4 text-xs text-slate-500">Active IOCs — block or investigate</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800/80 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Value</th>
              <th className="px-3 py-2 font-medium">Threat</th>
              <th className="px-3 py-2 font-medium">Conf.</th>
              <th className="px-3 py-2 font-medium">Seen</th>
            </tr>
          </thead>
          <tbody>
            {data.map((ioc, i) => {
              const ipBlocked = ioc.type === 'IP' && isBlocked(ioc.value)
              return (
              <tr key={i} className="border-b border-slate-800/40 transition hover:bg-slate-800/40">
                <td className="px-3 py-2.5">
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${typeColor[ioc.type] || 'bg-slate-700 text-slate-300'}`}>
                    {ioc.type}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-xs">
                  <span className={ipBlocked ? 'text-slate-500 line-through' : 'text-cyan-300'}>{ioc.value}</span>
                  {ipBlocked && (
                    <span className="ml-2 rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-bold text-red-300">BLOCKED</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-slate-300">{ioc.threat}</td>
                <td className="px-3 py-2.5 font-mono text-xs font-semibold tabular-nums text-white">{ioc.confidence}%</td>
                <td className="px-3 py-2.5 text-xs text-slate-500">{ioc.seen}</td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default IocPanel
