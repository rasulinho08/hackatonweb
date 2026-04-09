import emailjs from '@emailjs/browser'

const publicKey = String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '').trim()
const serviceId = String(import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '').trim()
const templateId = String(import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '').trim()

export function hasEmailJsConfigured() {
  return Boolean(publicKey && serviceId && templateId)
}

/** Free tier friendly — long bodies may need trimming for provider limits. */
const REPORT_TEXT_MAX = 20000

/**
 * Sends the incident report as plain text in the email (no attachment — works on free EmailJS).
 * Template: To = {{to_email}}; put the report in the body with {{report_text}} (and optional {{subject}}, {{source}}).
 *
 * @param {{ toEmail: string; reportText: string; sourceLabel: string }} params
 */
export async function sendIncidentReportEmail({ toEmail, reportText, sourceLabel }) {
  if (!hasEmailJsConfigured()) {
    throw new Error('EmailJS is not configured. Set VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID in .env')
  }

  const text = String(reportText || '')
  const truncated =
    text.length > REPORT_TEXT_MAX
      ? `${text.slice(0, REPORT_TEXT_MAX)}\n\n…(truncated — report exceeded length limit.)`
      : text

  const dateStr = new Date().toISOString().slice(0, 10)
  const to = toEmail.trim()

  const templateParams = {
    to_email: to,
    report_text: truncated,
    source: sourceLabel,
    subject: `SOC Sentinel — Incident report (${dateStr})`,
    // “Contact Us” preset expects these names — same content avoids 400 if template still uses them
    message: truncated,
    from_name: 'SOC Sentinel',
    from_email: to,
  }

  try {
    await emailjs.send(serviceId, templateId, templateParams, { publicKey })
  } catch (err) {
    const apiText = err && typeof err.text === 'string' ? err.text.trim() : ''
    const hint =
      apiText ||
      (err instanceof Error ? err.message : '') ||
      'EmailJS sorğusu uğursuz oldu (400). Service ID = service_… olmalıdır (Private Key yox). Şablonda To = {{to_email}} və mətn üçün {{report_text}} və ya {{message}} istifadə edin.'
    throw new Error(hint)
  }
}
