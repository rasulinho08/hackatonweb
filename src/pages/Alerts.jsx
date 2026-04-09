import AlertsTable from '../components/AlertsTable'
import IocPanel from '../components/IocPanel'
import TopAttackers from '../components/TopAttackers'
import { alerts, iocList, topAttackers, logs } from '../data/mockData'

function Alerts() {
  return (
    <div className="space-y-6 p-4 pb-12 lg:p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Alerts</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Triage queue</h2>
        <p className="mt-1 text-sm text-slate-400">Prioritized incidents — click any row for details.</p>
      </div>

      <AlertsTable alerts={alerts} />

      <div className="grid gap-4 lg:grid-cols-2">
        <IocPanel data={iocList} />
        <TopAttackers data={topAttackers} />
      </div>

      <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 ring-1 ring-slate-800/50">
        <h3 className="text-sm font-semibold text-white">Raw log stream</h3>
        <p className="mb-3 text-xs text-slate-500">Recent entries</p>
        <ul className="space-y-1.5 font-mono text-xs text-slate-400">
          {logs.map((l, i) => (
            <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-800/60 bg-slate-950/50 px-3 py-2">
              <span className="text-slate-500">{l.time}</span>
              <span className="text-slate-300">{l.ip}</span>
              <span>{l.activity}</span>
              <span
                className={
                  l.risk === 'critical' ? 'text-red-400' : l.risk === 'high' ? 'text-amber-400' : l.risk === 'medium' ? 'text-yellow-400' : 'text-emerald-400'
                }
              >
                {l.risk}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Alerts
