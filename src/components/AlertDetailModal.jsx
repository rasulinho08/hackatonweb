import { useEffect, useState } from 'react'
import { alertTriageInsight, hasGroqConfigured } from '../services/groqAi'
import Spinner from './Spinner'

const sevBadge = {
  Critical: 'bg-red-500/15 text-red-300 ring-red-500/30',
  High: 'bg-amber-500/15 text-amber-200 ring-amber-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-300 ring-yellow-500/30',
  Low: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
}

function AlertDetailModal({ alert: a, onClose, onEscalate }) {
  const [insight, setInsight] = useState('')
  const [insightLoading, setInsightLoading] = useState(false)
  const [insightErr, setInsightErr] = useState('')
  const [escalateDone, setEscalateDone] = useState(false)

  useEffect(() => {
    setEscalateDone(false)
    setInsight('')
    setInsightErr('')
  }, [a?.id])

  if (!a) return null

  const handleEscalate = () => {
    onEscalate?.(a)
    setEscalateDone(true)
  }

  const loadInsight = async () => {
    setInsightLoading(true)
    setInsightErr('')
    setInsight('')
    try {
      if (!hasGroqConfigured()) {
        setInsight(
          'Model triage needs VITE_GROQ_API_KEY in .env. Interim playbook: confirm scope, isolate affected assets if malware or exfiltration, preserve evidence, notify the assignee, and escalate if customer data or production is impacted.',
        )
        return
      }
      const text = await alertTriageInsight(a)
      setInsight(text)
    } catch (e) {
      setInsightErr(e instanceof Error ? e.message : 'Failed')
    } finally {
      setInsightLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700/80 bg-[#111827] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${sevBadge[a.severity] || ''}`}>
            {a.severity}
          </span>
          <h2 className="text-lg font-semibold text-white">{a.type}</h2>
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          <Row label="Ticket" value={a.ticket} accent />
          <Row label="Source" value={a.source} mono />
          <Row label="Assigned" value={a.assignee} />
          <Row label="Status" value={a.status} />
          <Row label="Time" value={a.time} />
        </dl>

        {a.description && (
          <div className="mt-5 rounded-lg border border-slate-800/80 bg-slate-950/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Description</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{a.description}</p>
          </div>
        )}

        <div className="mt-5 rounded-lg border border-violet-500/20 bg-violet-500/5 p-4 ring-1 ring-violet-500/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-300/90">Copilot triage</p>
            <button
              type="button"
              onClick={loadInsight}
              disabled={insightLoading}
              className="inline-flex items-center gap-2 rounded-md bg-violet-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
            >
              {insightLoading && <Spinner className="h-3.5 w-3.5 text-white" />}
              {insight || insightErr ? 'Refresh' : 'Get insight'}
            </button>
          </div>
          {insightErr && <p className="mt-2 text-xs text-red-300">{insightErr}</p>}
          {insight && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{insight}</p>}
          {!insight && !insightErr && !insightLoading && (
            <p className="mt-2 text-xs text-slate-500">Run a quick model pass on this alert for impact and next steps.</p>
          )}
        </div>

        {escalateDone && (
          <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {a.ticket || 'Ticket'} escalated to Tier 3 — on-call notified (demo).
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleEscalate}
            disabled={escalateDone}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {escalateDone ? 'Escalated' : 'Escalate'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, mono, accent }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-800/40 pb-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className={`text-right ${mono ? 'font-mono text-xs' : ''} ${accent ? 'text-cyan-300' : 'text-slate-200'}`}>
        {value || '—'}
      </dd>
    </div>
  )
}

export default AlertDetailModal
