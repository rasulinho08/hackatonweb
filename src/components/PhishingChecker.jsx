import { useCallback, useEffect, useRef, useState } from 'react'
import { phishingKeywords } from '../data/mockData'
import { analyzePhishingWithGroq, hasGroqConfigured } from '../services/groqAi'
import Spinner from './Spinner'

const verdictStyles = {
  Phishing: 'bg-red-500/15 text-red-300 ring-red-500/35',
  Safe: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/35',
}

function scoreTextAgainstKeywords(text) {
  const lower = text.toLowerCase()
  const hits = phishingKeywords.filter((k) => lower.includes(k))
  const urgency = /\b(urgent|immediately|act now|within 24 hours)\b/i.test(text) ? 1 : 0
  const links = (text.match(/https?:\/\//gi) || []).length
  const score = Math.min(100, hits.length * 18 + urgency * 22 + Math.min(links, 3) * 8)
  return { hits, score }
}

function analyzeLocal(text) {
  const { hits, score } = scoreTextAgainstKeywords(text)
  const isPhishing = score >= 40 || hits.length >= 2
  const confidence = Math.min(
    99,
    Math.max(72, isPhishing ? 70 + score * 0.35 + hits.length * 3 : 88 + (100 - score) * 0.08),
  )
  let explanation =
    'Heuristic scan: no strong phishing signals detected. Short copy and lack of credential harvesting language suggest lower risk.'
  if (isPhishing) {
    explanation = `Heuristic scan: matched ${hits.length} suspicious phrase(s) (${hits.slice(0, 4).join(', ') || 'pattern analysis'}). Combined with tone and link density, this resembles credential harvesting.`
  }
  return {
    verdict: isPhishing ? 'Phishing' : 'Safe',
    confidence: Math.round(confidence),
    explanation,
    indicators: hits.slice(0, 6),
    source: 'local',
  }
}

function PhishingChecker() {
  const live = hasGroqConfigured()
  const [input, setInput] = useState(
    'URGENT: Your account will be suspended. Verify your account at http://secure-docusign.support.xyz/login',
  )
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const analyze = useCallback(async () => {
    setLoading(true)
    setResult(null)
    setError('')
    clearTimeout(timerRef.current)

    if (live) {
      try {
        const out = await analyzePhishingWithGroq(input)
        setResult(out)
        setLoading(false)
        return
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Analysis failed')
        setResult(analyzeLocal(input))
        setLoading(false)
        return
      }
    }

    timerRef.current = setTimeout(() => {
      setResult(analyzeLocal(input))
      setLoading(false)
    }, 900)
  }, [input, live])

  return (
    <section
      id="phishing"
      className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-white">Phishing analyzer</h2>
          <p className="text-xs text-slate-500">Paste email body or headers for classification</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${live ? 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30' : 'bg-slate-600/20 text-slate-400'}`}
        >
          {live ? 'Model' : 'Heuristic'}
        </span>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={5}
        className="w-full resize-y rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        placeholder="Paste suspicious email content..."
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={analyze}
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Spinner className="h-4 w-4 text-white" />}
          Analyze
        </button>
        <span className="text-xs text-slate-500">{live ? 'Powered by Groq' : 'Add VITE_GROQ_API_KEY for full model'}</span>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          {error} — showing heuristic fallback below.
        </p>
      )}

      {result && (
        <div className="mt-5 space-y-3 rounded-lg border border-slate-800/80 bg-slate-950/50 p-4 opacity-100 transition-opacity duration-300">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Result</span>
            <span
              className={`rounded-md px-2.5 py-1 text-sm font-bold ring-1 ${verdictStyles[result.verdict]}`}
            >
              {result.verdict}
            </span>
            <span className="text-sm text-slate-400">
              Confidence: <span className="font-semibold tabular-nums text-white">{result.confidence}%</span>
            </span>
            <span className="text-[10px] font-semibold uppercase text-slate-500">
              {result.source === 'groq' ? 'Groq' : 'Local'}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{result.explanation}</p>
          {result.indicators?.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Indicators</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-400">
                {result.indicators.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default PhishingChecker
