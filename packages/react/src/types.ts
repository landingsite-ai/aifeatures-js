export interface FormConfig {
  id: string
  name: string
  endpoint_url: string
  turnstile_sitekey: string | null
}

export interface AiFeaturesFormProps {
  /** Form ID from aifeatures.dev */
  formId: string
  /** Called on successful submission */
  onSuccess?: (data: Record<string, unknown>) => void
  /** Called on submission error */
  onError?: (error: Error) => void
  /** Custom class name for the form element */
  className?: string
  /** Children (FormField, SubmitButton, etc.) */
  children: React.ReactNode
}

export interface FormFieldProps {
  /** Field name - used as the form data key */
  name: string
  /** Field label */
  label?: string
  /** Field type */
  type?: 'text' | 'email' | 'tel' | 'url' | 'number' | 'textarea' | 'select' | 'file'
  /** Placeholder text */
  placeholder?: string
  /** Whether the field is required */
  required?: boolean
  /** Custom class name */
  className?: string
  /** Options for select fields */
  options?: { value: string; label: string }[]
  /** Accept attribute for file inputs */
  accept?: string
  /** Multiple files allowed */
  multiple?: boolean
}

export interface SubmitButtonProps {
  /** Button text (or children) */
  children: React.ReactNode
  /** Text to show while submitting */
  loadingText?: string
  /** Custom class name */
  className?: string
}

export interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  isError: boolean
  error: Error | null
}
