import { useEffect, useState, createContext, useContext } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import type { FormConfig, AiFeaturesFormProps, FormState } from './types'

const AIFEATURES_API_URL = 'https://aifeatures.dev'

interface FormContextValue {
  formState: FormState
  config: FormConfig | null
}

const FormContext = createContext<FormContextValue | null>(null)

export function useAiFeaturesForm() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useAiFeaturesForm must be used within an AiFeaturesForm')
  }
  return context
}

export function AiFeaturesForm({
  formId,
  onSuccess,
  onError,
  className,
  children,
}: AiFeaturesFormProps) {
  const [config, setConfig] = useState<FormConfig | null>(null)
  const [configError, setConfigError] = useState<Error | null>(null)
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    error: null,
  })

  const form = useForm()

  // Fetch form config on mount
  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch(`${AIFEATURES_API_URL}/f/${formId}/config`)
        if (!response.ok) {
          throw new Error(`Failed to load form: ${response.status}`)
        }
        const data = await response.json()
        setConfig(data)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load form config')
        setConfigError(error)
        onError?.(error)
      }
    }
    fetchConfig()
  }, [formId, onError])

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!config) return

    setFormState({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      error: null,
    })

    try {
      const formData = new FormData()

      for (const [key, value] of Object.entries(data)) {
        if (value instanceof FileList) {
          for (const file of Array.from(value)) {
            formData.append(key, file)
          }
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      }

      const response = await fetch(config.endpoint_url, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Submission failed: ${response.status}`)
      }

      setFormState({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        error: null,
      })

      form.reset()
      // Reset Turnstile widget
      if (typeof window !== 'undefined' && (window as unknown as { turnstile?: { reset: () => void } }).turnstile) {
        (window as unknown as { turnstile: { reset: () => void } }).turnstile.reset()
      }

      onSuccess?.(data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Form submission failed')
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        error,
      })
      onError?.(error)
    }
  }

  // Show loading state while fetching config
  if (!config && !configError) {
    return <div className={className}>Loading form...</div>
  }

  // Show error if config fetch failed
  if (configError) {
    return (
      <div className={className}>
        <p>Failed to load form. Please try again later.</p>
      </div>
    )
  }

  return (
    <FormContext.Provider value={{ formState, config }}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
          {children}

          {/* Hidden field for Turnstile token - registered for validation */}
          {/* The actual Turnstile widget is rendered by FormActions */}
          {config?.turnstile_sitekey && (
            <input
              type="hidden"
              {...form.register('cf-turnstile-response', {
                required: 'Please complete the CAPTCHA verification',
              })}
            />
          )}
        </form>
      </FormProvider>
    </FormContext.Provider>
  )
}
