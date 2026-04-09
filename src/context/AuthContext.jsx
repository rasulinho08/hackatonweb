import { useCallback, useMemo, useState } from 'react'
import { mockUsers, rolePermissions } from '../data/users'
import { AuthContext } from './authStore'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('soc_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = useCallback((email, password) => {
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password && u.status === 'active',
    )
    if (!found) return { ok: false, error: 'Invalid credentials or account disabled.' }
    const { password: _pw, ...safe } = found
    void _pw
    sessionStorage.setItem('soc_user', JSON.stringify(safe))
    setUser(safe)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('soc_user')
    setUser(null)
  }, [])

  const hasPermission = useCallback(
    (page) => {
      if (!user) return false
      const perms = rolePermissions[user.role] || []
      return perms.includes(page)
    },
    [user],
  )

  const value = useMemo(
    () => ({ user, login, logout, hasPermission, isAdmin: user?.role === 'admin' }),
    [user, login, logout, hasPermission],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
