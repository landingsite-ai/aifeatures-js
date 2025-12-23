import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { Turnstile } from '@marsidev/react-turnstile'
import { useAiFeaturesForm } from './AiFeaturesForm'

interface FormActionsProps {
  /** Children (typically SubmitButton) */
  children: React.ReactNode
  /** Custom class name for the container */
  className?: string
  /** Custom class name for the Turnstile container */
  turnstileClassName?: string
}

export function FormActions({
  children,
  className,
  turnstileClassName,
}: FormActionsProps) {
  const { config } = useAiFeaturesForm()
  const form = useFormContext()

  const handleTurnstileSuccess = useCallback((token: string) => {
    form.setValue('cf-turnstile-response', token, { shouldValidate: true })
  }, [form])

  const handleTurnstileError = useCallback(() => {
    form.setValue('cf-turnstile-response', '', { shouldValidate: true })
  }, [form])

  const handleTurnstileExpire = useCallback(() => {
    form.setValue('cf-turnstile-response', '', { shouldValidate: true })
  }, [form])

  return (
    <div className={className}>
      {/* Turnstile CAPTCHA - rendered above submit button */}
      {config?.turnstile_sitekey && (
        <div className={turnstileClassName}>
          <Turnstile
            siteKey={config.turnstile_sitekey}
            onSuccess={handleTurnstileSuccess}
            onError={handleTurnstileError}
            onExpire={handleTurnstileExpire}
            options={{
              theme: 'auto',
            }}
          />
        </div>
      )}

      {/* Submit button and any other actions */}
      {children}
    </div>
  )
}
