import { useAiFeaturesForm } from './AiFeaturesForm'

interface FormStatusProps {
  /** Message to show on success */
  successMessage?: string
  /** Custom class name for success state */
  successClassName?: string
  /** Custom class name for error state */
  errorClassName?: string
}

export function FormStatus({
  successMessage = 'Thank you! Your message has been sent.',
  successClassName,
  errorClassName,
}: FormStatusProps) {
  const { formState } = useAiFeaturesForm()

  if (formState.isSuccess) {
    return (
      <div className={successClassName}>
        {successMessage}
      </div>
    )
  }

  if (formState.isError && formState.error) {
    return (
      <div className={errorClassName}>
        {formState.error.message}
      </div>
    )
  }

  return null
}
