import { jsPDF } from 'jspdf'

/**
 * @param {string} body
 * @param {string} sourceLabel
 * @returns {import('jspdf').jsPDF}
 */
export function createIncidentReportDoc(body, sourceLabel = '—') {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 14
  const maxW = pageW - margin * 2
  const lineH = 5.2
  const footerY = pageH - 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(30, 30, 30)
  doc.text('SOC Sentinel — Incident report', margin, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(90, 90, 90)
  const stamp = new Date().toISOString().slice(0, 19).replace('T', ' ')
  doc.text(`Generated: ${stamp}`, margin, 26)
  doc.text(`Source: ${sourceLabel}`, margin, 31)

  doc.setFontSize(10)
  doc.setTextColor(30, 30, 30)
  const text = String(body || '').replace(/\r\n/g, '\n')
  const lines = doc.splitTextToSize(text, maxW)
  let y = 40

  for (let i = 0; i < lines.length; i += 1) {
    if (y + lineH > footerY) {
      doc.addPage()
      y = 20
    }
    doc.text(lines[i], margin, y)
    y += lineH
  }

  const total = doc.getNumberOfPages()
  for (let p = 1; p <= total; p += 1) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text('SOC Sentinel — Confidential', margin, footerY)
  }

  return doc
}

/**
 * @param {string} body — full report text (not partial typewriter output)
 * @param {string} sourceLabel — e.g. "Groq model" | "Bundled snapshot"
 */
export function exportIncidentReportPdf(body, sourceLabel = '—') {
  const doc = createIncidentReportDoc(body, sourceLabel)
  const stamp = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const safe = stamp.replace(/[: ]/g, '-')
  doc.save(`incident-report-${safe}.pdf`)
}
