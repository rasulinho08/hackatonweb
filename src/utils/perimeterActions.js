export function isValidIpv4(s) {
  const m = String(s).match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!m) return false
  return m.slice(1).every((x) => {
    const n = Number(x)
    return n >= 0 && n <= 255
  })
}

/** User text like "block 45.23.11.2" or "deny ip 1.2.3.4" */
export function extractBlockIpFromUserText(text) {
  const re =
    /\b(?:block|ban|deny|blacklist|denylist|cut\s+off)\s+(?:the\s+)?(?:ip\s+)?([\d]{1,3}(?:\.[\d]{1,3}){3})\b/i
  const m = String(text).match(re)
  if (!m) return null
  const ip = m[1].trim()
  return isValidIpv4(ip) ? ip : null
}

/**
 * @param {unknown[]} actions
 * @param {Set<string>} knownIps
 * @param {(ip: string) => boolean} blockIp
 * @returns {string[]} human lines for chat
 */
export function applyCopilotBlockActions(actions, knownIps, blockIp) {
  const lines = []
  if (!Array.isArray(actions)) return lines
  for (const a of actions) {
    if (!a || typeof a !== 'object') continue
    if (a.op !== 'block_ip') continue
    const ip = String(a.ip ?? '').trim()
    if (!isValidIpv4(ip)) continue
    if (!knownIps.has(ip)) continue
    if (blockIp(ip)) lines.push(`Perimeter block applied for ${ip} (automated).`)
  }
  return lines
}
