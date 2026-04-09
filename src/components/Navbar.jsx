import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LivePulse from './LivePulse'

const roleBadge = {
  admin: 'bg-purple-500/15 text-purple-300',
  analyst: 'bg-cyan-500/15 text-cyan-300',
  viewer: 'bg-slate-600/20 text-slate-300',
}

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const fmt = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return <span className="font-mono text-xs tabular-nums text-slate-400">{fmt}</span>
}

function Navbar({ onToggleSidebar }) {
  const { user, logout, hasPermission } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#0B0F19]/95 px-4 backdrop-blur-md lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden h-8 w-1 rounded-full bg-emerald-500/80 sm:block" aria-hidden />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-widest text-slate-500">
            Live operations
          </p>
          <h1 className="truncate text-sm font-semibold text-slate-100 sm:text-base">
            SOC + Phishing Detector
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <LivePulse />
          <Clock />
        </div>

        <div className="hidden h-6 w-px bg-slate-700/60 sm:block" />

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/60 text-slate-300 transition hover:border-emerald-500/40 hover:text-white"
          aria-label="Notifications"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0B0F19]" />
        </button>

        {/* User dropdown */}
        {user && (
          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/60 py-1 pl-1 pr-3 transition hover:border-slate-600"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 text-xs font-bold text-emerald-200">
                {user.avatar}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-medium text-slate-200">{user.name}</p>
                <p className="text-[10px] text-slate-500">{user.role}</p>
              </div>
              <svg className="hidden h-4 w-4 text-slate-500 sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-700/80 bg-[#111827] shadow-2xl ring-1 ring-slate-800/50">
                {/* User info */}
                <div className="border-b border-slate-800/80 p-4">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>
                  <span className={`mt-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${roleBadge[user.role]}`}>
                    {user.role}
                  </span>
                </div>

                <div className="py-1">
                  <DropdownLink to="/profile" label="Profile" onClick={() => setDropdownOpen(false)} />
                  {hasPermission('blocked') && (
                    <DropdownLink to="/blocked" label="Blocked" onClick={() => setDropdownOpen(false)} />
                  )}
                  {hasPermission('admin') && (
                    <DropdownLink to="/admin" label="Admin Panel" onClick={() => setDropdownOpen(false)} />
                  )}
                  {hasPermission('settings') && (
                    <DropdownLink to="/settings" label="Settings" onClick={() => setDropdownOpen(false)} />
                  )}
                </div>

                <div className="border-t border-slate-800/80 p-2">
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); logout() }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

function DropdownLink({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/60 hover:text-white"
    >
      {label}
    </Link>
  )
}

export default Navbar
