import { alerts, iocList, stats, topAttackers, threatDistribution } from '../data/mockData'

/** IPs the demo may auto-block (must match this set — prevents hallucinated blocks). */
export function getKnownBlockableIps() {
  const set = new Set()
  topAttackers.forEach((t) => set.add(t.ip))
  iocList.forEach((row) => {
    if (row.type === 'IP') set.add(row.value)
  })
  return set
}

/** Compact JSON string for AI prompts (keeps token use reasonable). */
export function buildSocContextJson() {
  const blockableIps = [...getKnownBlockableIps()]
  const snapshot = {
    stats,
    threatDistribution,
    blockableIps,
    topAttackers: topAttackers.slice(0, 5),
    recentAlerts: alerts.slice(0, 12).map((a) => ({
      id: a.id,
      type: a.type,
      severity: a.severity,
      status: a.status,
      source: a.source,
      time: a.time,
      ticket: a.ticket,
      description: a.description?.slice(0, 220),
    })),
  }
  return JSON.stringify(snapshot)
}

/** Human-readable block for incident report generation. */
export function buildReportContextBlock() {
  const lines = [
    `Org stats: totalAlerts=${stats.totalAlerts}, activeThreats=${stats.activeThreats}, riskScore=${stats.riskScore}, safeSystemsPercent=${stats.safeSystemsPercent}, blockedAttacks=${stats.blockedAttacks}, avgResponseMin=${stats.avgResponseTime}, uptime=${stats.uptime}%, endpoints=${stats.endpoints}.`,
    '',
    'Recent alerts:',
    ...alerts.slice(0, 10).map(
      (a) =>
        `- [${a.severity}] ${a.type} @ ${a.source} (${a.time}) ${a.ticket || ''} status=${a.status}: ${a.description || ''}`,
    ),
    '',
    'Top attacker IPs:',
    ...topAttackers.map((t) => `- ${t.ip} (${t.country}) attempts=${t.attempts} blocked=${t.blocked}`),
  ]
  return lines.join('\n')
}
