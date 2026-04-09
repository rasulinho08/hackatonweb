import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { auditLog, mockUsers } from '../data/users'

const roleBadge = {
  admin: 'bg-purple-500/15 text-purple-300 ring-purple-500/30',
  analyst: 'bg-cyan-500/15 text-cyan-300 ring-cyan-500/30',
  viewer: 'bg-slate-500/15 text-slate-300 ring-slate-500/30',
}

const statusDot = {
  active: 'bg-emerald-500',
  inactive: 'bg-slate-500',
}

const logLevel = {
  info: 'text-slate-400',
  warning: 'text-amber-300',
  danger: 'text-red-400',
}

function AdminPanel() {
  const { isAdmin } = useAuth()
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState(
    mockUsers.map(({ password: _p, ...rest }) => { void _p; return rest }),
  )
  const [editingId, setEditingId] = useState(null)
  const [editRole, setEditRole] = useState('')

  if (!isAdmin) return <Navigate to="/" replace />

  const startEdit = (u) => {
    setEditingId(u.id)
    setEditRole(u.role)
  }

  const saveEdit = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: editRole } : u)))
    setEditingId(null)
  }

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u,
      ),
    )
  }

  const tabs = [
    { key: 'users', label: 'User management' },
    { key: 'audit', label: 'Audit log' },
  ]

  return (
    <div className="space-y-6 p-4 pb-12 lg:p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Administration</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Admin panel</h2>
        <p className="mt-1 text-sm text-slate-400">Manage users, roles, and review audit trail.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-900/60 p-1 ring-1 ring-slate-800/80">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              tab === t.key
                ? 'bg-[#111827] text-white shadow ring-1 ring-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Users tab */}
      {tab === 'users' && (
        <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-[#111827] shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
          <div className="border-b border-slate-800/80 px-5 py-4">
            <h3 className="text-base font-semibold text-white">All users</h3>
            <p className="text-xs text-slate-500">{users.length} accounts</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800/80 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">MFA</th>
                  <th className="px-5 py-3 font-medium">Last login</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800/40 transition hover:bg-slate-800/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 text-xs font-bold text-slate-200">
                          {u.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {editingId === u.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-200"
                        >
                          <option value="admin">admin</option>
                          <option value="analyst">analyst</option>
                          <option value="viewer">viewer</option>
                        </select>
                      ) : (
                        <span className={`rounded-md px-2 py-0.5 text-xs font-bold ring-1 ${roleBadge[u.role]}`}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{u.department}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusDot[u.status]}`} />
                        <span className="text-xs text-slate-300">{u.status}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {u.mfa ? (
                        <span className="text-xs font-semibold text-emerald-400">Enabled</span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-400">Off</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{u.lastLogin}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-1">
                        {editingId === u.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEdit(u.id)}
                              className="rounded px-2 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/10"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded px-2 py-1 text-[11px] font-semibold text-slate-400 ring-1 ring-slate-600 hover:bg-slate-800"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(u)}
                              className="rounded px-2 py-1 text-[11px] font-semibold text-cyan-300 ring-1 ring-cyan-500/30 hover:bg-cyan-500/10"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleStatus(u.id)}
                              className={`rounded px-2 py-1 text-[11px] font-semibold ring-1 ${
                                u.status === 'active'
                                  ? 'text-red-300 ring-red-500/30 hover:bg-red-500/10'
                                  : 'text-emerald-300 ring-emerald-500/30 hover:bg-emerald-500/10'
                              }`}
                            >
                              {u.status === 'active' ? 'Disable' : 'Enable'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit log tab */}
      {tab === 'audit' && (
        <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-[#111827] shadow-lg shadow-black/20 ring-1 ring-slate-800/50">
          <div className="border-b border-slate-800/80 px-5 py-4">
            <h3 className="text-base font-semibold text-white">Audit trail</h3>
            <p className="text-xs text-slate-500">Recent administrative and security events</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800/80 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((e) => (
                  <tr key={e.id} className="border-b border-slate-800/40 transition hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-mono text-xs tabular-nums text-slate-500">{e.time}</td>
                    <td className="px-5 py-3 text-xs text-slate-300">{e.user}</td>
                    <td className={`px-5 py-3 text-xs font-semibold ${logLevel[e.level]}`}>{e.action}</td>
                    <td className="px-5 py-3 text-xs text-slate-400">{e.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
