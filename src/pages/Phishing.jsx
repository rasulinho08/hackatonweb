import EmailQuarantine from '../components/EmailQuarantine'
import PhishingChecker from '../components/PhishingChecker'
import { quarantinedEmails } from '../data/mockData'

function Phishing() {
  return (
    <div className="space-y-6 p-4 pb-12 lg:p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Email security</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Phishing detection center</h2>
        <p className="mt-1 text-sm text-slate-400">Analyze suspicious emails and manage quarantine.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PhishingChecker />
        <EmailQuarantine data={quarantinedEmails} />
      </div>
    </div>
  )
}

export default Phishing
