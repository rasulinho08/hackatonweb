import { useCallback, useEffect, useRef, useState } from 'react'
import { hasGroqConfigured, threatHuntChatWithActions } from '../services/groqAi'
import { buildSocContextJson, getKnownBlockableIps } from '../utils/socContext'
import { applyCopilotBlockActions, extractBlockIpFromUserText } from '../utils/perimeterActions'
import { useSecurityActions } from '../hooks/useSecurityActions'
import Spinner from './Spinner'
import { useTypewriter } from '../hooks/useTypewriter'

const SUGGESTIONS = [
  'Summarize critical and active alerts.',
  'Which IPs should we block first and why?',
  'Block IP 45.23.11.2 at the perimeter.',
  'What should Tier 1 do in the next 30 minutes?',
  'List phishing-related incidents from the snapshot.',
]

function AiChat() {
  const { blockIp, isBlocked } = useSecurityActions()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [streamingId, setStreamingId] = useState(null)
  const listRef = useRef(null)
  const live = hasGroqConfigured()

  useEffect(() => {
    if (!open) return
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, open, loading])

  const send = useCallback(
    async (text) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return
      setError('')
      setInput('')
      const userMsg = { id: `u-${Date.now()}`, role: 'user', content: trimmed }
      setMessages((m) => [...m, userMsg])
      setLoading(true)

      const known = getKnownBlockableIps()

      const runLocalBlock = (ip, prefix) => {
        if (!known.has(ip)) {
          return `**${ip}** is not in the current snapshot (blockable IPs list). I can only automate blocks for known attacker/IOC IPs in this demo.`
        }
        blockIp(ip)
        return `${prefix}\n\n**Executed:** Perimeter block applied for **${ip}** (demo). Top attackers and IOC tables update to BLOCKED.`
      }

      if (!live) {
        const ip = extractBlockIpFromUserText(trimmed)
        if (ip) {
          const id = `a-${Date.now()}`
          const body = runLocalBlock(ip, 'Parsed your block request locally (no Groq key).')
          setMessages((m) => [...m, { id, role: 'assistant', content: body }])
          setStreamingId(id)
          setLoading(false)
          return
        }
        const fallback =
          'Groq API key is not set. Add VITE_GROQ_API_KEY to your .env file and restart the dev server. You can still type a command like **block 45.23.11.2** for local perimeter automation.'
        const id = `a-${Date.now()}`
        setMessages((m) => [...m, { id, role: 'assistant', content: fallback }])
        setStreamingId(id)
        setLoading(false)
        return
      }

      try {
        const ctx = buildSocContextJson()
        const prior = messages.map((x) => ({ role: x.role, content: x.content }))
        const data = await threatHuntChatWithActions(trimmed, prior, ctx)

        let executed = applyCopilotBlockActions(data.actions, known, blockIp)

        const spokenIp = extractBlockIpFromUserText(trimmed)
        if (spokenIp && known.has(spokenIp) && executed.length === 0 && !isBlocked(spokenIp)) {
          if (blockIp(spokenIp)) {
            executed = [`Perimeter block applied for ${spokenIp} (parsed from your message).`]
          }
        }

        let content = data.reply
        if (executed.length) {
          content += `\n\n**Executed:**\n${executed.map((l) => `- ${l}`).join('\n')}`
        }

        const id = `a-${Date.now()}`
        setMessages((m) => [...m, { id, role: 'assistant', content }])
        setStreamingId(id)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Request failed')
        const ip = extractBlockIpFromUserText(trimmed)
        if (ip && known.has(ip)) {
          blockIp(ip)
          const id = `a-${Date.now()}`
          setMessages((m) => [
            ...m,
            {
              id,
              role: 'assistant',
              content: `Groq request failed, but your **block ${ip}** command was applied locally (demo).`,
            },
          ])
          setStreamingId(id)
        }
      } finally {
        setLoading(false)
      }
    },
    [live, loading, messages, blockIp, isBlocked],
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400/30 transition hover:bg-emerald-500 lg:bottom-8 lg:right-8"
        aria-label={open ? 'Close SOC copilot' : 'Open SOC copilot'}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-5 z-[60] flex h-[min(520px,70vh)] w-[min(100vw-2.5rem,400px)] flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-[#111827] shadow-2xl ring-1 ring-slate-800/80 lg:bottom-28 lg:right-8"
          role="dialog"
          aria-label="SOC copilot"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">SOC copilot</p>
              <p className="text-[10px] text-slate-500">
                {live ? 'Groq + auto perimeter (demo)' : 'Local block commands + add API key'}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${live ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-600/30 text-slate-400'}`}
            >
              {live ? 'Live' : 'Offline'}
            </span>
          </div>

          <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="text-xs text-slate-500">
                Ask questions or say <span className="text-slate-400">block 45.23.11.2</span> — known attacker/IOC IPs
                are blocked automatically in this demo (no extra clicks).
              </p>
            )}
            {messages.map((m) => (
              <ChatBubble key={m.id} msg={m} animate={m.id === streamingId && m.role === 'assistant'} />
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400">
                <Spinner className="h-4 w-4" />
                <span className="text-xs">Thinking…</span>
              </div>
            )}
            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
            )}
          </div>

          <div className="border-t border-slate-800/80 px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={loading}
                  className="rounded-full border border-slate-700/80 bg-slate-900/60 px-2 py-1 text-[10px] text-slate-400 transition hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-50"
                >
                  {s.length > 36 ? `${s.slice(0, 36)}…` : s}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask or: block 45.23.11.2"
                className="min-w-0 flex-1 rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function ChatBubble({ msg, animate }) {
  const isUser = msg.role === 'user'
  const typed = useTypewriter(msg.content, animate && !isUser, 3, 12)

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
          isUser ? 'bg-emerald-600/20 text-emerald-100 ring-1 ring-emerald-500/25' : 'bg-slate-900/80 text-slate-300 ring-1 ring-slate-700/60'
        }`}
      >
        {isUser ? msg.content : typed}
      </div>
    </div>
  )
}

export default AiChat
