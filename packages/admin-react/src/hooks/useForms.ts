import * as React from 'react'
import { useAifeaturesContext } from '../provider/AifeaturesProvider'
import type { Form, CreateFormInput, UpdateFormInput } from '../types'

export interface UseFormsReturn {
  forms: Form[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  createForm: (input: CreateFormInput) => Promise<Form>
  updateForm: (formId: string, input: UpdateFormInput) => Promise<Form>
  deleteForm: (formId: string) => Promise<void>
}

export function useForms(): UseFormsReturn {
  const { api } = useAifeaturesContext()
  const [forms, setForms] = React.useState<Form[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  const fetchForms = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await api.getForms()
      setForms(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch forms'))
    } finally {
      setIsLoading(false)
    }
  }, [api])

  React.useEffect(() => {
    fetchForms()
  }, [fetchForms])

  const createForm = React.useCallback(
    async (input: CreateFormInput): Promise<Form> => {
      const form = await api.createForm(input)
      setForms((prev) => [...prev, form])
      return form
    },
    [api]
  )

  const updateForm = React.useCallback(
    async (formId: string, input: UpdateFormInput): Promise<Form> => {
      const form = await api.updateForm(formId, input)
      setForms((prev) => prev.map((f) => (f.id === formId ? form : f)))
      return form
    },
    [api]
  )

  const deleteForm = React.useCallback(
    async (formId: string): Promise<void> => {
      await api.deleteForm(formId)
      setForms((prev) => prev.filter((f) => f.id !== formId))
    },
    [api]
  )

  return {
    forms,
    isLoading,
    error,
    refetch: fetchForms,
    createForm,
    updateForm,
    deleteForm,
  }
}
