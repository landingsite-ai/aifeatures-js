import { useAiFeaturesForm } from './AiFeaturesForm'
import type { SubmitButtonProps } from './types'

export function SubmitButton({
  children,
  loadingText = 'Sending...',
  className,
}: SubmitButtonProps) {
  const { formState } = useAiFeaturesForm()

  return (
    <button
      type="submit"
      disabled={formState.isSubmitting}
      className={className}
    >
      {formState.isSubmitting ? loadingText : children}
    </button>
  )
}
