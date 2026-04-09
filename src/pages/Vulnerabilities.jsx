import VulnerabilityScanner from '../components/VulnerabilityScanner'

function Vulnerabilities() {
  return (
    <div className="space-y-6 p-4 pb-12 lg:p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Security posture</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Vulnerability management</h2>
        <p className="mt-1 text-sm text-slate-400">On-demand scanning and CVE tracking across your infrastructure.</p>
      </div>

      <VulnerabilityScanner />
    </div>
  )
}

export default Vulnerabilities
