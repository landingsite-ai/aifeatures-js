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

/**
 * Validates the token and returns an error message if invalid
 */
function validateToken(token: string): string | null {
  if (!token) {
    return 'No siteToken provided to AifeaturesProvider'
  }

  if (token.startsWith('sk_')) {
    return 'Invalid token type: You passed an organization API key (sk_xxx) but AifeaturesProvider requires a site token (st_xxx). Site tokens are returned when you create a site via the API.'
  }

  if (!token.startsWith('st_')) {
    return `Invalid token format: Expected a site token starting with "st_" but got "${token.slice(0, 10)}...". Site tokens are returned when you create a site via the API.`
  }

  return null
}

export function AifeaturesProvider({
  siteToken,
  apiUrl = 'https://aifeatures.dev',
  dark = false,
  className,
  children,
}: AifeaturesProviderProps) {
  // Validate token on mount and when it changes
  const tokenError = React.useMemo(() => validateToken(siteToken), [siteToken])

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

  // Show error UI if token is invalid
  if (tokenError) {
    return (
      <div className={`aifeatures-admin ${dark ? 'dark' : ''} ${className || ''}`}>
        <div className="af-rounded-md af-border af-border-destructive af-bg-destructive/10 af-p-4">
          <h3 className="af-text-sm af-font-semibold af-text-destructive af-mb-2">
            AifeaturesProvider Configuration Error
          </h3>
          <p className="af-text-sm af-text-destructive">
            {tokenError}
          </p>
        </div>
      </div>
    )
  }

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
