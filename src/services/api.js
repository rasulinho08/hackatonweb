/**
 * Backend integration — point VITE_API_BASE_URL at your Java API when ready.
 * Groq / copilot calls live in groqAi.js until the backend proxies them.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function getJson(path, init) {
  const res = await fetch(`${API_BASE}${path}`, init)
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`)
  return res.json()
}

export async function fetchDashboardStats() {
  return getJson('/api/stats')
}

export async function fetchAlerts(query = '') {
  return getJson(`/api/alerts${query}`)
}

export async function fetchAlertById(id) {
  return getJson(`/api/alerts/${id}`)
}

export async function updateAlertStatus(id, status) {
  return getJson(`/api/alerts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

export async function analyzePhishingEmail(text) {
  return getJson('/api/phishing/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

export async function fetchQuarantine() {
  return getJson('/api/phishing/quarantine')
}

export async function generateSocReport(body) {
  return getJson('/api/reports/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })
}

export async function fetchIocList() {
  return getJson('/api/threats/ioc')
}

export async function fetchTopAttackers() {
  return getJson('/api/threats/top-attackers')
}

export async function fetchThreatDistribution() {
  return getJson('/api/threats/distribution')
}

export async function fetchIncidentTimeline() {
  return getJson('/api/threats/timeline')
}

export async function fetchThreatMap() {
  return getJson('/api/threats/map')
}

export async function startVulnerabilityScan() {
  return getJson('/api/vulnerabilities/scan', { method: 'POST' })
}

export async function fetchVulnerabilityScan(scanId) {
  return getJson(`/api/vulnerabilities/scan/${scanId}`)
}

export async function fetchNetworkTraffic() {
  return getJson('/api/network/traffic')
}

export async function fetchSystemHealth() {
  return getJson('/api/system/health')
}

export async function fetchActivityFeed() {
  return getJson('/api/activity/feed')
}

export async function loginApi(email, password) {
  return getJson('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export async function fetchUsers() {
  return getJson('/api/users')
}

export async function fetchAuditLog() {
  return getJson('/api/audit-log')
}

export async function copilotChatApi(message, history) {
  return getJson('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })
}
