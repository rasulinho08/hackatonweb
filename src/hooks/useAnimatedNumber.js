import { useEffect, useState } from 'react'

/**
 * @param {number} target
 * @param {number} durationMs
 * @param {number} decimals
 */
export function useAnimatedNumber(target, durationMs = 900, decimals = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame
    const start = performance.now()
    const from = 0

    const step = (now) => {
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - (1 - t) ** 3
      const next = from + (target - from) * eased
      setValue(decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next))
      if (t < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, durationMs, decimals])

  return value
}
