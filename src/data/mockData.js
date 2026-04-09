/** Mock SOC + phishing data — swap for API responses later */

export const riskScore = 78

export const stats = {
  totalAlerts: 1847,
  activeThreats: 23,
  riskScore,
  safeSystemsPercent: 94.2,
  blockedAttacks: 12403,
  avgResponseTime: 4.2,
  uptime: 99.97,
  endpoints: 1284,
}

export const alerts = [
  { id: 1, type: 'Phishing', severity: 'Critical', source: 'email-gw-01', time: '10:23', status: 'Active', description: 'Credential harvesting campaign targeting finance team via spoofed DocuSign link. 14 users received; 3 clicked.', assignee: 'J. Torres', ticket: 'SOC-8844' },
  { id: 2, type: 'Brute Force', severity: 'High', source: 'vpn-gateway-01', time: '10:18', status: 'Investigating', description: 'Sustained password-spray against VPN endpoint from 45.23.11.0/24 CIDR. 2400+ attempts in 30 min window.', assignee: 'M. Chen', ticket: 'SOC-8843' },
  { id: 3, type: 'Malware', severity: 'High', source: 'endpoint-win-442', time: '09:55', status: 'Contained', description: 'Emotet dropper detected via behavioural sandbox. Host isolated; lateral movement not observed.', assignee: 'K. Patel', ticket: 'SOC-8841' },
  { id: 4, type: 'Data Exfiltration', severity: 'Critical', source: 'dlp-proxy-02', time: '09:48', status: 'Active', description: 'Anomalous 2.3 GB upload to external S3 bucket from engineering subnet. User account under review.', assignee: 'J. Torres', ticket: 'SOC-8840' },
  { id: 5, type: 'Credential Stuffing', severity: 'Medium', source: 'auth-api', time: '09:41', status: 'Resolved', description: 'Automated credential replay from Tor exit nodes against customer portal. Rate-limiting engaged.', assignee: 'A. Kim', ticket: 'SOC-8839' },
  { id: 6, type: 'Phishing', severity: 'Medium', source: 'email-gw-01', time: '09:12', status: 'Active', description: 'BEC impersonation of CEO requesting urgent wire transfer. Flagged by NLP model (98% confidence).', assignee: 'M. Chen', ticket: 'SOC-8837' },
  { id: 7, type: 'DDoS Pattern', severity: 'Medium', source: 'edge-cdn', time: '08:47', status: 'Mitigated', description: 'Layer-7 volumetric flood peaking at 340k RPS against /api/auth. Cloudflare challenge page engaged.', assignee: 'A. Kim', ticket: 'SOC-8835' },
  { id: 8, type: 'Insider Threat', severity: 'Low', source: 'ueba-engine', time: '08:22', status: 'Monitoring', description: 'User accessed 47 files outside normal working hours. Behaviour deviation score: 0.87.', assignee: 'K. Patel', ticket: 'SOC-8833' },
  { id: 9, type: 'Ransomware', severity: 'Critical', source: 'edr-cluster-03', time: '07:58', status: 'Contained', description: 'LockBit variant detected on staging server. Snapshot restored; no production impact confirmed.', assignee: 'J. Torres', ticket: 'SOC-8830' },
  { id: 10, type: 'C2 Beacon', severity: 'High', source: 'ndr-sensor-07', time: '07:30', status: 'Investigating', description: 'Periodic DNS beaconing to suspicious domain (every 60s) from workstation. Possible Cobalt Strike.', assignee: 'M. Chen', ticket: 'SOC-8828' },
]

export const logs = [
  { ip: '192.168.1.1', activity: 'login success', risk: 'low', time: '10:24' },
  { ip: '45.23.11.2', activity: 'brute force (2400 attempts)', risk: 'critical', time: '10:18' },
  { ip: '10.0.4.22', activity: 'file access', risk: 'low', time: '10:15' },
  { ip: '185.220.101.4', activity: 'suspicious payload upload', risk: 'high', time: '09:55' },
  { ip: '172.16.0.5', activity: 'sso success', risk: 'low', time: '09:42' },
  { ip: '91.132.43.88', activity: 'tor exit → credential replay', risk: 'high', time: '09:41' },
  { ip: '10.0.12.7', activity: 'abnormal data upload 2.3 GB', risk: 'critical', time: '09:48' },
  { ip: '203.0.113.42', activity: 'port scan (1-1024)', risk: 'medium', time: '08:55' },
  { ip: '10.0.1.15', activity: 'admin console login', risk: 'low', time: '08:30' },
  { ip: '198.51.100.9', activity: 'dns beacon (60s interval)', risk: 'high', time: '07:30' },
]

export const riskOverTime = [
  { t: '00:00', risk: 42 },
  { t: '02:00', risk: 35 },
  { t: '04:00', risk: 38 },
  { t: '06:00', risk: 44 },
  { t: '08:00', risk: 55 },
  { t: '10:00', risk: 68 },
  { t: '12:00', risk: 72 },
  { t: '14:00', risk: 66 },
  { t: '16:00', risk: 78 },
  { t: '18:00', risk: 71 },
  { t: '20:00', risk: 65 },
  { t: '22:00', risk: 58 },
  { t: 'Now', risk: 78 },
]

export const threatMapNodes = [
  { id: 'n1', label: 'N. Virginia', x: 22, y: 38, level: 'high', attacks: 342 },
  { id: 'n2', label: 'Frankfurt', x: 48, y: 32, level: 'medium', attacks: 128 },
  { id: 'n3', label: 'Singapore', x: 72, y: 58, level: 'low', attacks: 47 },
  { id: 'n4', label: 'São Paulo', x: 32, y: 72, level: 'medium', attacks: 89 },
  { id: 'n5', label: 'Tokyo', x: 82, y: 40, level: 'low', attacks: 31 },
  { id: 'n6', label: 'London', x: 44, y: 28, level: 'high', attacks: 276 },
  { id: 'n7', label: 'Mumbai', x: 64, y: 50, level: 'medium', attacks: 105 },
  { id: 'n8', label: 'Sydney', x: 84, y: 72, level: 'low', attacks: 22 },
]

export const phishingKeywords = [
  'verify your account',
  'urgent',
  'wire transfer',
  'click here',
  'suspended',
  'reset password',
  'gift card',
  'crypto',
  'act now',
  'confirm your identity',
  'unusual activity',
  'security alert',
]

export const mockAiReport = `Executive summary — SOC triage

• Detected suspicious activity from IP 45.23.11.2 correlating with multiple failed authentication bursts against vpn-gateway-01 between 09:40–10:18 UTC.
• Email gateway flagged two high-confidence phishing campaigns impersonating payroll; 14 users reported — no credential submission observed.
• Endpoint-win-442 isolated pending malware sweep; containment playbook executed successfully.
• DLP proxy detected anomalous 2.3 GB upload to external S3 bucket — investigation ongoing.
• LockBit variant contained on staging server; snapshot restored within SLA.

Recommended actions:
1. Force password rotation for affected VPN group.
2. Block IOC hashes at perimeter (see ticket SOC-8841).
3. Schedule user awareness nudge for finance distribution lists.
4. Review DLP policies for engineering subnet egress.
5. Conduct forensic imaging of endpoint-win-442.`

/** Alerts grouped by hour for bar chart */
export const alertsByHour = [
  { hour: '00', count: 12 },
  { hour: '01', count: 8 },
  { hour: '02', count: 5 },
  { hour: '03', count: 3 },
  { hour: '04', count: 7 },
  { hour: '05', count: 11 },
  { hour: '06', count: 18 },
  { hour: '07', count: 34 },
  { hour: '08', count: 67 },
  { hour: '09', count: 124 },
  { hour: '10', count: 156 },
  { hour: '11', count: 98 },
]

/** Threat type distribution for donut chart */
export const threatDistribution = [
  { name: 'Phishing', value: 42, color: '#f59e0b' },
  { name: 'Brute Force', value: 18, color: '#ef4444' },
  { name: 'Malware', value: 15, color: '#a855f7' },
  { name: 'DDoS', value: 12, color: '#3b82f6' },
  { name: 'Data Exfil', value: 8, color: '#ec4899' },
  { name: 'Other', value: 5, color: '#6b7280' },
]

/** System health monitors */
export const systemHealth = [
  { label: 'CPU Load', value: 67, max: 100, unit: '%', status: 'warning' },
  { label: 'Memory', value: 12.4, max: 16, unit: 'GB', status: 'ok' },
  { label: 'Network I/O', value: 840, max: 1000, unit: 'Mbps', status: 'warning' },
  { label: 'Disk (SIEM)', value: 1.8, max: 4, unit: 'TB', status: 'ok' },
  { label: 'Firewall Rules', value: 2847, max: 5000, unit: '', status: 'ok' },
  { label: 'Active Sessions', value: 423, max: 500, unit: '', status: 'warning' },
]

/** IOC (Indicators of Compromise) */
export const iocList = [
  { type: 'IP', value: '45.23.11.2', threat: 'Brute Force C2', confidence: 96, seen: '2h ago' },
  { type: 'IP', value: '185.220.101.4', threat: 'Malware Delivery', confidence: 91, seen: '3h ago' },
  { type: 'IP', value: '91.132.43.88', threat: 'Credential Stuffing', confidence: 87, seen: '4h ago' },
  { type: 'Domain', value: 'login-docusign.support.xyz', threat: 'Phishing', confidence: 99, seen: '1h ago' },
  { type: 'Domain', value: 'update-service.xyz', threat: 'C2 Beacon', confidence: 94, seen: '5h ago' },
  { type: 'Hash', value: 'a3f2b8c1d9e4...7f6a', threat: 'Emotet Dropper', confidence: 98, seen: '3h ago' },
  { type: 'Hash', value: 'e7d1c4b2a5f8...9c3e', threat: 'LockBit Variant', confidence: 97, seen: '6h ago' },
  { type: 'URL', value: 'hxxps://cdn-payload[.]ru/dl', threat: 'Payload Host', confidence: 93, seen: '2h ago' },
]

/** Top attacking IPs */
export const topAttackers = [
  { ip: '45.23.11.2', country: 'RU', attempts: 2400, blocked: true },
  { ip: '185.220.101.4', country: 'DE', attempts: 847, blocked: true },
  { ip: '91.132.43.88', country: 'NL', attempts: 632, blocked: true },
  { ip: '203.0.113.42', country: 'CN', attempts: 418, blocked: false },
  { ip: '198.51.100.9', country: 'US', attempts: 312, blocked: false },
]

/** Incident timeline */
export const incidentTimeline = [
  { id: 't1', time: '10:23', title: 'Phishing campaign detected', detail: 'DocuSign impersonation targeting finance team', severity: 'critical', icon: 'mail' },
  { id: 't2', time: '10:18', title: 'Brute force attack spike', detail: '2400+ attempts from 45.23.11.0/24 against VPN', severity: 'high', icon: 'lock' },
  { id: 't3', time: '09:55', title: 'Malware contained', detail: 'Emotet dropper on endpoint-win-442 — host isolated', severity: 'high', icon: 'bug' },
  { id: 't4', time: '09:48', title: 'Data exfil alert', detail: 'Anomalous 2.3 GB upload from engineering subnet', severity: 'critical', icon: 'upload' },
  { id: 't5', time: '09:12', title: 'BEC attempt flagged', detail: 'CEO impersonation requesting wire transfer', severity: 'medium', icon: 'user' },
  { id: 't6', time: '08:47', title: 'DDoS mitigated', detail: '340k RPS L7 flood — challenge page engaged', severity: 'medium', icon: 'zap' },
  { id: 't7', time: '07:58', title: 'Ransomware contained', detail: 'LockBit on staging server — snapshot restored', severity: 'critical', icon: 'shield' },
  { id: 't8', time: '07:30', title: 'C2 beacon discovered', detail: 'DNS beaconing to suspicious domain every 60s', severity: 'high', icon: 'radio' },
]

/** Activity feed for live stream */
export const activityFeed = [
  { id: 'a1', time: '10:24:31', event: 'Firewall blocked 45.23.11.2 → vpn-gw-01:443', type: 'block' },
  { id: 'a2', time: '10:24:28', event: 'Email quarantined: DocuSign phishing → j.smith@corp', type: 'quarantine' },
  { id: 'a3', time: '10:24:15', event: 'EDR alert: suspicious process tree on win-442', type: 'alert' },
  { id: 'a4', time: '10:24:02', event: 'DLP: large upload detected from 10.0.12.7', type: 'alert' },
  { id: 'a5', time: '10:23:55', event: 'WAF: SQL injection attempt blocked from 203.0.113.42', type: 'block' },
  { id: 'a6', time: '10:23:41', event: 'User m.chen escalated SOC-8843 to Tier 3', type: 'info' },
  { id: 'a7', time: '10:23:28', event: 'Sandbox: detonated attachment → malicious verdict', type: 'alert' },
  { id: 'a8', time: '10:23:10', event: 'SIEM correlation: linked SOC-8844 with SOC-8837', type: 'info' },
  { id: 'a9', time: '10:22:55', event: 'Auto-response: disabled user account pending review', type: 'action' },
  { id: 'a10', time: '10:22:38', event: 'Firewall blocked 91.132.43.88 → auth-api:8443', type: 'block' },
  { id: 'a11', time: '10:22:20', event: 'Threat intel update: 3 new IOCs ingested', type: 'info' },
  { id: 'a12', time: '10:22:05', event: 'CDN: challenge rate returned to baseline', type: 'info' },
]

/** Quarantined emails */
export const quarantinedEmails = [
  { id: 'q1', from: 'noreply@login-docusign.support.xyz', to: 'j.smith@corp.com', subject: 'Action required: Review document', verdict: 'Phishing', confidence: 99, time: '10:23' },
  { id: 'q2', from: 'ceo@corpp.com', to: 'finance@corp.com', subject: 'URGENT: Wire transfer needed', verdict: 'BEC', confidence: 98, time: '09:12' },
  { id: 'q3', from: 'support@paypa1.com', to: 'r.jones@corp.com', subject: 'Unusual activity on your account', verdict: 'Phishing', confidence: 97, time: '08:45' },
  { id: 'q4', from: 'hr@corp-benefits.xyz', to: 'all-staff@corp.com', subject: 'Update your direct deposit', verdict: 'Phishing', confidence: 95, time: '08:20' },
  { id: 'q5', from: 'admin@microsoft-365.support', to: 'it-admin@corp.com', subject: 'License expiring — verify now', verdict: 'Phishing', confidence: 96, time: '07:50' },
]

/** Vulnerability scanner mock results */
export const vulnerabilities = [
  { id: 'v1', cve: 'CVE-2024-3094', package: 'xz-utils 5.6.0', severity: 'Critical', cvss: 10.0, status: 'Open', affected: 12 },
  { id: 'v2', cve: 'CVE-2024-21762', package: 'FortiOS 7.4.2', severity: 'Critical', cvss: 9.8, status: 'Patching', affected: 3 },
  { id: 'v3', cve: 'CVE-2023-44487', package: 'HTTP/2 (multiple)', severity: 'High', cvss: 7.5, status: 'Mitigated', affected: 28 },
  { id: 'v4', cve: 'CVE-2024-1086', package: 'Linux kernel 5.14+', severity: 'High', cvss: 7.8, status: 'Open', affected: 64 },
  { id: 'v5', cve: 'CVE-2023-36884', package: 'MS Office', severity: 'High', cvss: 8.3, status: 'Patched', affected: 0 },
  { id: 'v6', cve: 'CVE-2024-0204', package: 'GoAnywhere MFT', severity: 'Critical', cvss: 9.8, status: 'Patched', affected: 0 },
]

/** Network traffic for sparkline-style chart */
export const networkTraffic = [
  { t: '00', inbound: 120, outbound: 80 },
  { t: '02', inbound: 90, outbound: 60 },
  { t: '04', inbound: 70, outbound: 45 },
  { t: '06', inbound: 110, outbound: 75 },
  { t: '08', inbound: 340, outbound: 220 },
  { t: '10', inbound: 580, outbound: 390 },
  { t: '12', inbound: 640, outbound: 420 },
  { t: '14', inbound: 520, outbound: 350 },
  { t: '16', inbound: 610, outbound: 400 },
  { t: '18', inbound: 450, outbound: 300 },
  { t: '20', inbound: 280, outbound: 190 },
  { t: '22', inbound: 180, outbound: 120 },
]
