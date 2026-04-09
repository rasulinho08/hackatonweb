import { topAttackers } from '../data/mockData'

export const PERIMETER_STORAGE_KEY = 'soc_perimeter_blocked_v1'

/**
 * Load blocked IP map from localStorage.
 * First visit (key missing): seed from snapshot topAttackers where blocked === true, then persist.
 * Key present (including "{}"): use as-is so "unblock all" stays empty after reload.
 */
export function loadPerimeterBlockedMap() {
  if (typeof window === 'undefined' || !window.localStorage) return {}

  try {
    const raw = window.localStorage.getItem(PERIMETER_STORAGE_KEY)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return sanitizeMap(parsed)
    }
  } catch {
    /* fall through to seed */
  }

  const seeded = {}
  const now = Date.now()
  topAttackers.forEach((t) => {
    if (t.blocked) seeded[t.ip] = { at: now, source: 'snapshot' }
  })
  savePerimeterBlockedMap(seeded)
  return seeded
}


function sanitizeMap(obj) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const ip = String(k).trim()
    if (!ip) continue
    const at = typeof v?.at === 'number' ? v.at : Date.now()
    const source = v?.source === 'snapshot' || v?.source === 'user' || v?.source === 'copilot' ? v.source : 'user'
    out[ip] = { at, source }
  }
  return out
}

export function savePerimeterBlockedMap(map) {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.setItem(PERIMETER_STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* quota / private mode */
  }
}

export function clearPerimeterStorageForTests() {
  if (typeof window === 'undefined' || !window.localStorage) return
  window.localStorage.removeItem(PERIMETER_STORAGE_KEY)
}
