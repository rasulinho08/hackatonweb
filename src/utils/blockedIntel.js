import { alerts, logs, topAttackers, iocList } from '../data/mockData'

/** Alerts whose text references this IP (exact or /24-style mention). */
export function alertsMatchingIp(ip) {
  return alerts.filter((a) => alertReferencesIp(a, ip))
}

export function alertReferencesIp(alert, ip) {
  const hay = `${alert.description || ''} ${alert.source || ''} ${alert.ticket || ''}`
  if (hay.includes(ip)) return true
  const parts = String(ip).split('.')
  if (parts.length !== 4) return false
  const p24 = `${parts[0]}.${parts[1]}.${parts[2]}.`
  return hay.includes(`${p24}0/24`) || hay.includes(`${p24}0 /24`)
}

export function logsMatchingIp(ip) {
  return logs.filter((l) => l.ip === ip)
}

export function intelForIp(ip) {
  const ta = topAttackers.find((t) => t.ip === ip)
  if (ta) return { kind: 'top_attacker', country: ta.country, attempts: ta.attempts, threat: 'Top attacker' }
  const ioc = iocList.find((r) => r.type === 'IP' && r.value === ip)
  if (ioc) return { kind: 'ioc', country: null, attempts: null, threat: ioc.threat }
  return { kind: 'manual', country: null, attempts: null, threat: 'Perimeter block' }
}
