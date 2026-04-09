import { useAuth } from '../hooks/useAuth'

const roleBadge = {
  admin: 'bg-purple-500/15 text-purple-300 ring-purple-500/30',
  analyst: 'bg-cyan-500/15 text-cyan-300 ring-cyan-500/30',
  viewer: 'bg-slate-500/15 text-slate-300 ring-slate-500/30',
}

function Profile() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6 p-4 pb-12 lg:p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Account</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Your profile</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-6 text-center ring-1 ring-slate-800/50">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-2xl font-bold text-emerald-300 ring-2 ring-emerald-500/30">
            {user.avatar}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">{user.name}</h3>
          <p className="mt-0.5 text-sm text-slate-500">{user.title}</p>
          <div className="mt-3 flex justify-center">
            <span className={`rounded-md px-3 py-1 text-xs font-bold ring-1 ${roleBadge[user.role]}`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-6 ring-1 ring-slate-800/50">
            <h3 className="mb-4 text-sm font-semibold text-white">Account details</h3>
            <dl className="space-y-3 text-sm">
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Department" value={user.department} />
              <InfoRow label="Role" value={user.role} />
              <InfoRow label="MFA" value={user.mfa ? 'Enabled' : 'Disabled'} accent={user.mfa ? 'emerald' : 'amber'} />
              <InfoRow label="Account created" value={user.created} />
              <InfoRow label="Last login" value={user.lastLogin} />
              <InfoRow label="User ID" value={user.id} mono />
            </dl>
          </div>

          <div className="rounded-xl border border-slate-800/90 bg-[#111827] p-6 ring-1 ring-slate-800/50">
            <h3 className="mb-4 text-sm font-semibold text-white">Security</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-slate-800"
              >
                Change password
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-slate-800"
              >
                {user.mfa ? 'Reconfigure MFA' : 'Enable MFA'}
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-slate-800"
              >
                Revoke sessions
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-slate-800"
              >
                Download activity log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono, accent }) {
  let cls = 'text-slate-200'
  if (mono) cls = 'font-mono text-xs text-cyan-300/80'
  if (accent === 'emerald') cls = 'font-semibold text-emerald-400'
  if (accent === 'amber') cls = 'font-semibold text-amber-400'

  return (
    <div className="flex justify-between gap-4 border-b border-slate-800/40 pb-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className={cls}>{value}</dd>
    </div>
  )
}

export default Profile
