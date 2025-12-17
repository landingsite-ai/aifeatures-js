import * as React from 'react'
import { createApiClient, type AifeaturesApiClient } from '../lib/api'

export interface AifeaturesContextValue {
  siteToken: string
  apiUrl: string
  api: AifeaturesApiClient
}

const AifeaturesContext = React.createContext<AifeaturesContextValue | null>(
  null
)

export interface AifeaturesProviderProps {
  /** Site-scoped API token from aifeatures */
  siteToken: string
  /** API URL (defaults to https://aifeatures.dev) */
  apiUrl?: string
  /** Optional dark mode */
  dark?: boolean
  /** Optional className for the wrapper */
  className?: string
  children: React.ReactNode
}

export function AifeaturesProvider({
  siteToken,
  apiUrl = 'https://aifeatures.dev',
  dark = false,
  className,
  children,
}: AifeaturesProviderProps) {
  const api = React.useMemo(
    () => createApiClient(siteToken, apiUrl),
    [siteToken, apiUrl]
  )

  const value = React.useMemo(
    () => ({
      siteToken,
      apiUrl,
      api,
    }),
    [siteToken, apiUrl, api]
  )

  return (
    <AifeaturesContext.Provider value={value}>
      <div className={`aifeatures-admin ${dark ? 'dark' : ''} ${className || ''}`}>
        {children}
      </div>
    </AifeaturesContext.Provider>
  )
}

export function useAifeaturesContext(): AifeaturesContextValue {
  const context = React.useContext(AifeaturesContext)
  if (!context) {
    throw new Error(
      'useAifeaturesContext must be used within an AifeaturesProvider'
    )
  }
  return context
}

export { AifeaturesContext }
