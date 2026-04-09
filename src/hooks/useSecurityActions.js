import { useContext } from 'react'
import { SecurityActionsContext } from '../context/securityActionsStore'

export function useSecurityActions() {
  const ctx = useContext(SecurityActionsContext)
  if (!ctx) throw new Error('useSecurityActions must be used inside SecurityActionsProvider')
  return ctx
}
