import { useEffect, useState } from 'react'

/**
 * Reveals text gradually (client-side). Updates only from scheduled timers to avoid sync setState in effects.
 */
export function useTypewriter(fullText, active, charsPerTick = 2, tickMs = 18) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    if (!active || !fullText) return undefined

    let cancelled = false
    let i = 0
    let timeoutId

    const tick = () => {
      if (cancelled) return
      i = Math.min(fullText.length, i + charsPerTick)
      setShown(fullText.slice(0, i))
      if (i < fullText.length) timeoutId = setTimeout(tick, tickMs)
    }

    timeoutId = setTimeout(() => {
      if (cancelled) return
      setShown('')
      i = 0
      timeoutId = setTimeout(tick, tickMs)
    }, 0)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [fullText, active, charsPerTick, tickMs])

  if (!active || !fullText) return fullText || ''
  return shown
}
