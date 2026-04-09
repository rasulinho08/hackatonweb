import { useCallback, useEffect, useState } from 'react'

const verdictColor = {
  Phishing: 'bg-red-500/15 text-red-300 ring-red-500/30',
  BEC: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  Spam: 'bg-slate-500/15 text-slate-300 ring-slate-500/30',
}

const actionBtn =
  'cursor-pointer rounded-md bg-slate-950/70 px-2.5 py-1 text-[11px] font-semibold ring-1 transition hover:bg-slate-900/80'

function EmailQuarantine({ data }) {
  const [items, setItems] = useState(data)

  useEffect(() => {
    setItems(data)
  }, [data])

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-5 shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
      <h2 className="text-base font-semibold text-white">Email quarantine</h2>
      <p className="mb-4 text-xs text-slate-500">Intercepted messages pending review</p>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-800/80 py-8 text-center text-xs text-slate-500">
            No messages in quarantine.
          </p>
        ) : null}
        {items.map((e) => (
          <div
            key={e.id}
            className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3 transition hover:border-slate-700/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{e.subject}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  From: <span className="text-slate-400">{e.from}</span> → <span className="text-slate-400">{e.to}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ring-1 ${verdictColor[e.verdict] || ''}`}>
                  {e.verdict}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-slate-500">{e.confidence}%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-600">{e.time}</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  className={`${actionBtn} text-red-300 ring-red-500/40 hover:ring-red-500/50`}
                  onClick={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    remove(e.id)
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className={`${actionBtn} text-emerald-300 ring-emerald-500/40 hover:ring-emerald-500/50`}
                  onClick={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    remove(e.id)
                  }}
                >
                  Release
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmailQuarantine
