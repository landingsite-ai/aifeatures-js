import * as React from 'react'
import { useAifeaturesContext } from '../provider/AifeaturesProvider'
import type {
  Submission,
  PaginatedSubmissions,
  UpdateSubmissionInput,
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
  updateSubmission: (
    submissionId: string,
    input: UpdateSubmissionInput
  ) => Promise<Submission>
  deleteSubmission: (submissionId: string) => Promise<void>
  markAsRead: (submissionId: string) => Promise<void>
  markAsSpam: (submissionId: string) => Promise<void>
}

export interface UseSubmissionsOptions {
  formId: string
  initialPageSize?: number
  includeSpam?: boolean
}

export function useSubmissions({
  formId,
  initialPageSize = 25,
  includeSpam = false,
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
        include_spam: includeSpam,
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
  }, [api, formId, page, pageSize, includeSpam])

  React.useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  const updateSubmission = React.useCallback(
    async (
      submissionId: string,
      input: UpdateSubmissionInput
    ): Promise<Submission> => {
      const submission = await api.updateSubmission(submissionId, input)
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? submission : s))
      )
      return submission
    },
    [api]
  )

  const deleteSubmission = React.useCallback(
    async (submissionId: string): Promise<void> => {
      await api.deleteSubmission(submissionId)
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId))
      setTotal((prev) => prev - 1)
    },
    [api]
  )

  const markAsRead = React.useCallback(
    async (submissionId: string): Promise<void> => {
      await updateSubmission(submissionId, { is_read: true })
    },
    [updateSubmission]
  )

  const markAsSpam = React.useCallback(
    async (submissionId: string): Promise<void> => {
      await updateSubmission(submissionId, { is_spam: true })
    },
    [updateSubmission]
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
    updateSubmission,
    deleteSubmission,
    markAsRead,
    markAsSpam,
  }
}
