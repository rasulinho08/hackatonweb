import { createElement } from 'react'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'

function StatCard({ title, value, suffix = '', description, icon, accent = 'emerald' }) {
  const isDecimal = typeof value === 'number' && !Number.isInteger(value)
  const animated = useAnimatedNumber(typeof value === 'number' ? value : 0, 1000, isDecimal ? 1 : 0)

  const accentRing = {
    emerald: 'ring-emerald-500/25',
    red: 'ring-red-500/25',
    amber: 'ring-amber-500/25',
    cyan: 'ring-cyan-500/25',
  }[accent]

  const accentIcon = {
    emerald: 'bg-emerald-500/15 text-emerald-400',
    red: 'bg-red-500/15 text-red-400',
    amber: 'bg-amber-500/15 text-amber-400',
    cyan: 'bg-cyan-500/15 text-cyan-400',
  }[accent]

  return (
    <article
      className={`rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ${accentRing} transition hover:border-slate-700/90`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-white">
            {typeof value === 'number' ? animated : value}
            {suffix && <span className="text-xl font-medium text-slate-400">{suffix}</span>}
          </p>
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accentIcon}`}
          aria-hidden
        >
          {createElement(icon)}
        </div>
      </div>
    </article>
  )
}

export function IconShield() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  )
}

export function IconBolt() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

export function IconChart() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
      />
    </svg>
  )
}

export function IconCheck() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default StatCard
