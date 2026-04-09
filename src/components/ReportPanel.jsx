import { useEffect, useRef, useState } from 'react'
import { mockAiReport } from '../data/mockData'
import { generateReportWithGroq, hasGroqConfigured } from '../services/groqAi'
import { buildReportContextBlock } from '../utils/socContext'
import Spinner from './Spinner'
import { useTypewriter } from '../hooks/useTypewriter'
import { exportIncidentReportPdf } from '../utils/exportIncidentReportPdf'
import { hasEmailJsConfigured, sendIncidentReportEmail } from '../services/emailJsReport'

function sourceLabelFor(source) {
  if (source === 'groq') return 'Groq model'
  if (source === 'mock') return 'Bundled snapshot'
  return '—'
}

const REPORT_EMAIL_STORAGE = 'soc_report_email'

function ReportPanel() {
  const mailReady = hasEmailJsConfigured()
  const live = hasGroqConfigured()
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState('')
  const [source, setSource] = useState('')
  const [error, setError] = useState('')
  const [animate, setAnimate] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [mailSending, setMailSending] = useState(false)
  const [mailFeedback, setMailFeedback] = useState(null)
  const timerRef = useRef(null)
  const typed = useTypewriter(report, animate && Boolean(report), 2, 14)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REPORT_EMAIL_STORAGE)
      if (saved) setRecipientEmail(saved)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const generate = async () => {
    setLoading(true)
    setReport('')
    setError('')
    setSource('')
    setAnimate(false)
    clearTimeout(timerRef.current)

    if (live) {
      try {
        const ctx = buildReportContextBlock()
        const { report: text, source: src } = await generateReportWithGroq(ctx)
        setReport(text)
        setSource(src)
        setAnimate(true)
        setLoading(false)
        return
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Generation failed')
        setReport(mockAiReport)
        setSource('mock')
        setAnimate(true)
        setLoading(false)
        return
      }
    }

    timerRef.current = setTimeout(() => {
      setReport(mockAiReport)
      setSource('mock')
      setAnimate(true)
      setLoading(false)
    }, 1200)
  }

  const sendEmail = async () => {
    if (!mailReady || !report) return
    const to = recipientEmail.trim()
    if (!to) {
      setMailFeedback({ type: 'err', text: 'Enter an email address.' })
      return
    }
    setMailSending(true)
    setMailFeedback(null)
    try {
      await sendIncidentReportEmail({
        toEmail: to,
        reportText: report,
        sourceLabel: sourceLabelFor(source),
      })
      try {
        localStorage.setItem(REPORT_EMAIL_STORAGE, to)
      } catch {
        /* ignore */
      }
      setMailFeedback({ type: 'ok', text: 'Report sent. Check your inbox.' })
    } catch (e) {
      setMailFeedback({
        type: 'err',
        text: e instanceof Error ? e.message : 'Could not send email.',
      })
    } finally {
      setMailSending(false)
    }
  }

  const display = animate ? typed : report

  return (
    <section
      id="reports"
      className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <h2 className="text-base font-semibold text-white">Incident report</h2>
            <p className="text-xs text-slate-500">Auto-generated narrative summary</p>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${live ? 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30' : 'bg-slate-600/20 text-slate-400'}`}
          >
            {live ? 'Groq' : 'Snapshot'}
          </span>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-500/40 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Spinner className="h-4 w-4" /> : null}
          Generate report
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-700 bg-slate-950/40 px-4 py-8 text-slate-400">
          <Spinner />
          <span className="text-sm">Synthesizing findings…</span>
        </div>
      )}

      {!loading && report && (
        <div className="space-y-2">
          {error && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">{error}</p>
          )}
          <pre className="max-h-[320px] overflow-auto whitespace-pre-wrap rounded-lg border border-slate-800/80 bg-slate-950/60 p-4 font-sans text-sm leading-relaxed text-slate-300 transition-opacity duration-300">
            {display}
          </pre>
          <div className="space-y-3 border-t border-slate-800/60 pt-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] text-slate-600">Source: {sourceLabelFor(source)}</p>
              <button
                type="button"
                onClick={() => exportIncidentReportPdf(report, sourceLabelFor(source))}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/40 hover:bg-slate-800"
              >
                <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export PDF
              </button>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Email report</p>
              {mailReady ? (
                <>
                  <div className="flex flex-wrap items-stretch gap-2">
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(ev) => setRecipientEmail(ev.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="min-w-[200px] flex-1 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                    />
                    <button
                      type="button"
                      onClick={sendEmail}
                      disabled={mailSending}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-500/40 bg-violet-600/20 px-4 py-2 text-xs font-semibold text-violet-200 transition hover:bg-violet-600/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {mailSending ? <Spinner className="h-4 w-4" /> : null}
                      Send to inbox
                    </button>
                  </div>
                  {mailFeedback ? (
                    <p
                      className={`mt-2 text-xs ${mailFeedback.type === 'ok' ? 'text-emerald-400' : 'text-rose-400'}`}
                      role="status"
                    >
                      {mailFeedback.text}
                    </p>
                  ) : (
                    <p className="mt-2 text-[10px] text-slate-600">
                      Sends the full report as plain text in the email (not the typewriter preview). Use Export PDF for a file.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-500">
                  Add{' '}
                  <code className="rounded bg-slate-900 px-1 text-[10px] text-slate-400">VITE_EMAILJS_PUBLIC_KEY</code>,{' '}
                  <code className="rounded bg-slate-900 px-1 text-[10px] text-slate-400">VITE_EMAILJS_SERVICE_ID</code>,{' '}
                  <code className="rounded bg-slate-900 px-1 text-[10px] text-slate-400">VITE_EMAILJS_TEMPLATE_ID</code>{' '}
                  to <code className="text-[10px] text-slate-400">.env</code> and restart the dev server. Template: To ={' '}
                  <code className="text-[10px] text-violet-300/90">{'{{to_email}}'}</code>, body ={' '}
                  <code className="text-[10px] text-violet-300/90">{'{{report_text}}'}</code> (plain text, no attachment).
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!loading && !report && (
        <p className="rounded-lg border border-dashed border-slate-800 bg-slate-950/30 px-4 py-6 text-center text-sm text-slate-500">
          Click <span className="text-slate-400">Generate report</span> to create an automated summary.
        </p>
      )}
    </section>
  )
}

export default ReportPanel
