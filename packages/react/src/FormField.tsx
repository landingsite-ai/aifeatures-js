import { useFormContext } from 'react-hook-form'
import type { FormFieldProps } from './types'

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  className,
  options,
  accept,
  multiple,
}: FormFieldProps) {
  const { register, formState: { errors } } = useFormContext()

  const error = errors[name]
  const errorMessage = error?.message as string | undefined

  const inputClassName = className || ''

  const registerOptions = {
    required: required ? `${label || name} is required` : false,
  }

  // Textarea
  if (type === 'textarea') {
    return (
      <div>
        {label && <label htmlFor={name}>{label}{required && ' *'}</label>}
        <textarea
          id={name}
          placeholder={placeholder}
          className={inputClassName}
          {...register(name, registerOptions)}
        />
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    )
  }

  // Select
  if (type === 'select' && options) {
    return (
      <div>
        {label && <label htmlFor={name}>{label}{required && ' *'}</label>}
        <select
          id={name}
          className={inputClassName}
          {...register(name, registerOptions)}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    )
  }

  // File input
  if (type === 'file') {
    return (
      <div>
        {label && <label htmlFor={name}>{label}{required && ' *'}</label>}
        <input
          id={name}
          type="file"
          accept={accept}
          multiple={multiple}
          className={inputClassName}
          {...register(name, registerOptions)}
        />
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    )
  }

  // Standard input (text, email, tel, url, number)
  return (
    <div>
      {label && <label htmlFor={name}>{label}{required && ' *'}</label>}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={inputClassName}
        {...register(name, registerOptions)}
      />
      {errorMessage && <span>{errorMessage}</span>}
    </div>
  )
}
