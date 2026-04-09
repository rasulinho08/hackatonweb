import AlertsByHourChart from '../components/AlertsByHourChart'
import NetworkChart from '../components/NetworkChart'
import ReportPanel from '../components/ReportPanel'
import RiskChart from '../components/RiskChart'
import ThreatDonut from '../components/ThreatDonut'
import { alertsByHour, networkTraffic, riskOverTime, threatDistribution } from '../data/mockData'

function Reports() {
  return (
    <div className="space-y-6 p-4 pb-12 lg:p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Reports</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Analytics &amp; intelligence</h2>
        <p className="mt-1 text-sm text-slate-400">Risk trends, traffic, threat breakdowns and automated narratives.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RiskChart data={riskOverTime} />
        </div>
        <div className="lg:col-span-2">
          <ThreatDonut data={threatDistribution} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AlertsByHourChart data={alertsByHour} />
        <NetworkChart data={networkTraffic} />
      </div>

      <ReportPanel />
    </div>
  )
}

export default Reports
