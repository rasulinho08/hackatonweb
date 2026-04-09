/**
 * Groq OpenAI-compatible API — free tier, fast inference.
 * Set VITE_GROQ_API_KEY in .env (never commit real keys).
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export function hasGroqConfigured() {
  return Boolean(String(import.meta.env.VITE_GROQ_API_KEY ?? '').trim())
}

function model() {
  return import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile'
}

async function chat(messages, options = {}) {
  const key = String(import.meta.env.VITE_GROQ_API_KEY ?? '').trim()
  if (!key) throw new Error('GROQ_KEY_MISSING')

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model(),
      messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.max_tokens ?? 2048,
    }),
  })

  if (!res.ok) {
    const t = await res.text()
    throw new Error(t || `Groq HTTP ${res.status}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (typeof content !== 'string') throw new Error('Empty Groq response')
  return content.trim()
}

function tryParseJsonObject(text) {
  const t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) return JSON.parse(fence[1].trim())
  const start = t.indexOf('{')
  const end = t.lastIndexOf('}')
  if (start >= 0 && end > start) return JSON.parse(t.slice(start, end + 1))
  throw new Error('No JSON object in model output')
}

/**
 * @param {string} emailText
 * @returns {Promise<{ verdict: string, confidence: number, explanation: string, indicators: string[], source: 'groq' }>}
 */
export async function analyzePhishingWithGroq(emailText) {
  const system = `You are an email security analyst. Analyze the message for phishing, BEC, credential harvesting, and social engineering.
Return ONLY a compact JSON object with keys: verdict ("Phishing" or "Safe"), confidence (integer 0-100), explanation (2-4 sentences, plain text), indicators (array of short strings, max 6 items, suspicious signals or empty if Safe).
Do not include markdown or prose outside JSON.`

  const raw = await chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: emailText.slice(0, 12000) },
    ],
    { temperature: 0.15, max_tokens: 600 },
  )

  const o = tryParseJsonObject(raw)
  const verdict = o.verdict === 'Safe' ? 'Safe' : 'Phishing'
  const confidence = Math.min(100, Math.max(0, Number(o.confidence) || 0))
  const explanation = String(o.explanation || '').trim() || 'No explanation returned.'
  const indicators = Array.isArray(o.indicators) ? o.indicators.map(String).slice(0, 8) : []

  return { verdict, confidence, explanation, indicators, source: 'groq' }
}

/**
 * @param {string} contextBlock — telemetry / stats text for the model
 * @returns {Promise<{ report: string, source: 'groq' }>}
 */
export async function generateReportWithGroq(contextBlock) {
  const system = `You are a senior SOC lead. Write a concise incident summary for executives and analysts.
Use markdown: short title, bullet findings, numbered recommended actions (max 5). No fluff. Under 400 words.`

  const report = await chat(
    [
      { role: 'system', content: system },
      {
        role: 'user',
        content: `Using this telemetry snapshot, produce the incident report:\n\n${contextBlock.slice(0, 14000)}`,
      },
    ],
    { temperature: 0.25, max_tokens: 1200 },
  )

  return { report, source: 'groq' }
}

/**
 * @param {string} userMessage
 * @param {{ role: string, content: string }[]} history
 * @param {string} socContextJson
 */
export async function threatHuntChat(userMessage, history, socContextJson) {
  const system = `You are a SOC copilot embedded in a security operations dashboard.
Rules:
- Answer using the provided SOC_CONTEXT JSON only for facts about alerts, stats, and attackers. Do not invent IPs or ticket numbers not present there.
- If the user asks for something not in context, say what is missing and suggest what to collect.
- Be concise: short paragraphs or bullets. Prefer actionable analyst steps.
- Never claim real-time data beyond what the context states.`

  const messages = [
    { role: 'system', content: `${system}\n\nSOC_CONTEXT:\n${socContextJson.slice(0, 16000)}` },
    ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage.slice(0, 4000) },
  ]

  return chat(messages, { temperature: 0.3, max_tokens: 900 })
}

/**
 * Same as chat but returns structured JSON so the UI can run perimeter actions (demo automation).
 * @returns {Promise<{ reply: string, actions: unknown[] }>}
 */
export async function threatHuntChatWithActions(userMessage, history, socContextJson) {
  const system = `You are a SOC copilot. SOC_CONTEXT JSON includes blockableIps (exact IPv4 strings you may block), topAttackers, recentAlerts, stats.

You MUST respond with ONLY valid JSON (no markdown fences) in this exact shape:
{"reply":"string — concise analyst-facing message","actions":[]}

The actions array may contain objects:
{"op":"block_ip","ip":"x.x.x.x"}

Rules for actions:
- Include block_ip ONLY when the user clearly asks to block, ban, deny, blacklist, or cut off traffic to that IP.
- The ip string MUST be identical to one entry in SOC_CONTEXT.blockableIps. If the user names an IP not in blockableIps, leave actions empty and explain in reply.
- If the user is only asking questions, actions must be [].
- Never invent IPs.`

  const raw = await chat(
    [
      { role: 'system', content: `${system}\n\nSOC_CONTEXT:\n${socContextJson.slice(0, 16000)}` },
      ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage.slice(0, 4000) },
    ],
    { temperature: 0.15, max_tokens: 1000 },
  )

  try {
    const o = tryParseJsonObject(raw)
    return {
      reply: String(o.reply ?? '').trim() || raw,
      actions: Array.isArray(o.actions) ? o.actions : [],
    }
  } catch {
    return { reply: raw, actions: [] }
  }
}

/**
 * @param {object} alert — row from alerts table
 * @returns {Promise<string>}
 */
export async function alertTriageInsight(alert) {
  const system = `You are a SOC tier-2 analyst. Given one alert record, output 3-5 bullet lines: likely impact, immediate containment steps, and what to verify next. No JSON. Under 120 words.`

  const payload = JSON.stringify({
    type: alert.type,
    severity: alert.severity,
    status: alert.status,
    source: alert.source,
    ticket: alert.ticket,
    assignee: alert.assignee,
    time: alert.time,
    description: alert.description,
  })

  return chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: payload },
    ],
    { temperature: 0.2, max_tokens: 400 },
  )
}
