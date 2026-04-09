import ActivityFeed from '../components/ActivityFeed'
import AlertsByHourChart from '../components/AlertsByHourChart'
import AlertsTable from '../components/AlertsTable'
import IncidentTimeline from '../components/IncidentTimeline'
import NetworkChart from '../components/NetworkChart'
import PhishingChecker from '../components/PhishingChecker'
import ReportPanel from '../components/ReportPanel'
import RiskChart from '../components/RiskChart'
import StatCard, { IconBolt, IconChart, IconCheck, IconShield } from '../components/StatCard'
import SystemHealth from '../components/SystemHealth'
import ThreatDonut from '../components/ThreatDonut'
import ThreatMap from '../components/ThreatMap'
import TopAttackers from '../components/TopAttackers'
import {
  alerts,
  alertsByHour,
  incidentTimeline,
  networkTraffic,
  riskOverTime,
  stats,
  systemHealth,
  threatDistribution,
  threatMapNodes,
  topAttackers,
} from '../data/mockData'

function IconServer() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconArrowUp() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function IconBlock() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  )
}

function Dashboard() {
  return (
    <div className="space-y-6 p-4 pb-12 lg:p-6">
      {/* Header */}
      <div id="overview" className="scroll-mt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Overview</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Operations dashboard</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Unified view of alerts, risk posture, phishing signals and infrastructure health.
        </p>
      </div>

      {/* Stat cards — 2 rows */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total alerts" value={stats.totalAlerts} description="Last 24h across channels" icon={IconShield} accent="cyan" />
        <StatCard title="Active threats" value={stats.activeThreats} description="Require analyst review" icon={IconBolt} accent="red" />
        <StatCard title="Risk score" value={stats.riskScore} description="Org-wide exposure index" icon={IconChart} accent="amber" />
        <StatCard title="Safe systems" value={stats.safeSystemsPercent} suffix="%" description="Endpoints passing policy" icon={IconCheck} accent="emerald" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Blocked attacks" value={stats.blockedAttacks} description="Auto-blocked at perimeter" icon={IconBlock} accent="red" />
        <StatCard title="Avg response" value={stats.avgResponseTime} suffix=" min" description="Mean time to respond" icon={IconClock} accent="amber" />
        <StatCard title="Uptime" value={stats.uptime} suffix="%" description="SOC platform availability" icon={IconArrowUp} accent="emerald" />
        <StatCard title="Endpoints" value={stats.endpoints} description="Monitored devices" icon={IconServer} accent="cyan" />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RiskChart data={riskOverTime} />
        </div>
        <div className="lg:col-span-2">
          <ThreatDonut data={threatDistribution} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AlertsByHourChart data={alertsByHour} />
        <NetworkChart data={networkTraffic} />
      </div>

      {/* Threat map + System health */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ThreatMap nodes={threatMapNodes} />
        </div>
        <div className="lg:col-span-2">
          <SystemHealth data={systemHealth} />
        </div>
      </div>

      {/* Alerts table */}
      <AlertsTable alerts={alerts} />

      {/* Timeline + Activity + Top attackers */}
      <div className="grid gap-4 lg:grid-cols-3">
        <IncidentTimeline events={incidentTimeline} />
        <ActivityFeed />
        <TopAttackers data={topAttackers} />
      </div>

      {/* Phishing + Reports */}
      <div className="grid gap-4 lg:grid-cols-2">
        <PhishingChecker />
        <ReportPanel />
      </div>
    </div>
  )
}

export default Dashboard
