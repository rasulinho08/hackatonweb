import { useCallback, useEffect, useMemo, useState } from 'react'
import { SecurityActionsContext } from './securityActionsStore'
import { loadPerimeterBlockedMap, PERIMETER_STORAGE_KEY, savePerimeterBlockedMap } from '../utils/perimeterStorage'

export function SecurityActionsProvider({ children }) {
  const [blocked, setBlocked] = useState(() => loadPerimeterBlockedMap())

  useEffect(() => {
    savePerimeterBlockedMap(blocked)
  }, [blocked])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== PERIMETER_STORAGE_KEY || e.newValue == null) return
      try {
        const parsed = JSON.parse(e.newValue)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) setBlocked(parsed)
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const blockIp = useCallback((ip) => {
    const normalized = String(ip).trim()
    if (!normalized) return false
    setBlocked((b) => ({
      ...b,
      [normalized]: { at: Date.now(), source: b[normalized]?.source === 'snapshot' ? 'snapshot' : 'copilot' },
    }))
    return true
  }, [])

  const unblockIp = useCallback((ip) => {
    const k = String(ip).trim()
    setBlocked((b) => {
      const next = { ...b }
      delete next[k]
      return next
    })
  }, [])

  const isBlocked = useCallback((ip) => Boolean(blocked[String(ip).trim()]), [blocked])

  const value = useMemo(
    () => ({
      blocked,
      blockedIps: Object.keys(blocked),
      blockIp,
      unblockIp,
      isBlocked,
    }),
    [blocked, blockIp, unblockIp, isBlocked],
  )

  return <SecurityActionsContext.Provider value={value}>{children}</SecurityActionsContext.Provider>
}
