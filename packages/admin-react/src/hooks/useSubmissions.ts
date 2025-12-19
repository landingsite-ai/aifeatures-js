import * as React from 'react'
import { useAifeaturesContext } from '../provider/AifeaturesProvider'
import type {
  Submission,
  PaginatedSubmissions,
  GetSubmissionsOptions,
} from '../types'

export interface UseSubmissionsReturn {
  submissions: Submission[]
  total: number
  isLoading: boolean
  error: Error | null
  page: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  refetch: () => Promise<void>
  deleteSubmission: (submissionId: string) => Promise<void>
}

export interface UseSubmissionsOptions {
  formId: string
  initialPageSize?: number
}

export function useSubmissions({
  formId,
  initialPageSize = 25,
}: UseSubmissionsOptions): UseSubmissionsReturn {
  const { api } = useAifeaturesContext()
  const [submissions, setSubmissions] = React.useState<Submission[]>([])
  const [total, setTotal] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(initialPageSize)

  const fetchSubmissions = React.useCallback(async () => {
    if (!formId) return

    try {
      setIsLoading(true)
      setError(null)
      const options: GetSubmissionsOptions = {
        limit: pageSize,
        offset: page * pageSize,
      }
      const data: PaginatedSubmissions = await api.getSubmissions(
        formId,
        options
      )
      setSubmissions(data.submissions)
      setTotal(data.total)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch submissions')
      )
    } finally {
      setIsLoading(false)
    }
  }, [api, formId, page, pageSize])

  React.useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  const deleteSubmission = React.useCallback(
    async (submissionId: string): Promise<void> => {
      await api.deleteSubmission(submissionId)
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId))
      setTotal((prev) => prev - 1)
    },
    [api]
  )

  const totalPages = Math.ceil(total / pageSize)

  return {
    submissions,
    total,
    isLoading,
    error,
    page,
    pageSize,
    hasNextPage: page < totalPages - 1,
    hasPreviousPage: page > 0,
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size)
      setPage(0) // Reset to first page when page size changes
    },
    refetch: fetchSubmissions,
    deleteSubmission,
  }
}
