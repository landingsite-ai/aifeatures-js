import * as React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  Paperclip,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useSubmissions } from '../hooks/useSubmissions'
import { SubmissionDetail } from './SubmissionDetail'
import type { Submission } from '../types'

export interface FormSubmissionsProps {
  /** The form ID to show submissions for */
  formId: string
  /** Optional className */
  className?: string
  /** Submission ID to auto-open in detail view */
  defaultSubmissionId?: string
}

type View = 'list' | 'detail'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getEmailFromData(data: Record<string, unknown>): string | null {
  // Try common email field names
  const emailFields = ['email', 'Email', 'EMAIL', 'e-mail', 'mail']
  for (const field of emailFields) {
    if (typeof data[field] === 'string') {
      return data[field] as string
    }
  }
  return null
}

function getPreviewText(data: Record<string, unknown>): string {
  // Get first non-email, non-internal field as preview
  const entries = Object.entries(data).filter(
    ([key]) => !key.startsWith('_') && !key.toLowerCase().includes('email')
  )
  if (entries.length === 0) return ''

  const [, value] = entries[0]
  const text = String(value)
  return text.length > 50 ? text.slice(0, 50) + '...' : text
}

export function FormSubmissions({ formId, className, defaultSubmissionId }: FormSubmissionsProps) {
  const {
    submissions,
    total,
    isLoading,
    error,
    page,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    setPage,
    setPageSize,
  } = useSubmissions({ formId })

  const [view, setView] = React.useState<View>('list')
  const [selectedSubmission, setSelectedSubmission] =
    React.useState<Submission | null>(null)

  // Auto-open submission detail if defaultSubmissionId is provided
  React.useEffect(() => {
    if (defaultSubmissionId && submissions.length > 0) {
      const submission = submissions.find(s => s.id === defaultSubmissionId)
      if (submission) {
        setSelectedSubmission(submission)
        setView('detail')
      }
    }
  }, [defaultSubmissionId, submissions])

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission)
    setView('detail')
  }

  const handleBack = () => {
    setView('list')
    setSelectedSubmission(null)
  }

  // Show detail view
  if (view === 'detail' && selectedSubmission) {
    return (
      <div className={className}>
        <SubmissionDetail
          submission={selectedSubmission}
          onBack={handleBack}
        />
      </div>
    )
  }

  // Show list view
  if (isLoading) {
    return (
      <div className={`af-flex af-items-center af-justify-center af-py-8 ${className || ''}`}>
        <div className="af-text-muted-foreground">Loading submissions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`af-flex af-items-center af-justify-center af-py-8 ${className || ''}`}>
        <div className="af-text-destructive">Error: {error.message}</div>
      </div>
    )
  }

  if (submissions.length === 0 && page === 0) {
    return (
      <div className={`af-flex af-flex-col af-items-center af-justify-center af-py-12 ${className || ''}`}>
        <Inbox className="af-h-12 af-w-12 af-text-muted-foreground af-mb-4" />
        <p className="af-text-muted-foreground af-text-center">
          No submissions yet.
          <br />
          Submissions will appear here when visitors use your form.
        </p>
      </div>
    )
  }

  const startIndex = page * pageSize + 1
  const endIndex = Math.min((page + 1) * pageSize, total)

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="af-text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => {
            const email = getEmailFromData(submission.data)
            const preview = getPreviewText(submission.data)

            return (
              <TableRow key={submission.id}>
                <TableCell className="af-font-medium">
                  <div className="af-flex af-items-center af-gap-2">
                    {email || (
                      <span className="af-text-muted-foreground af-italic">No email</span>
                    )}
                    {submission.attachments.length > 0 && (
                      <span className="af-flex af-items-center af-gap-1 af-text-muted-foreground" title={`${submission.attachments.length} attachment(s)`}>
                        <Paperclip className="af-h-3 af-w-3" />
                        <span className="af-text-xs">{submission.attachments.length}</span>
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="af-text-muted-foreground af-max-w-[200px] af-truncate">
                  {preview || (
                    <span className="af-italic">No preview available</span>
                  )}
                </TableCell>
                <TableCell className="af-text-muted-foreground">
                  {formatDate(submission.metadata.submitted_at)}
                </TableCell>
                <TableCell className="af-text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewSubmission(submission)}
                    title="View details"
                  >
                    <Eye className="af-h-4 af-w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="af-flex af-items-center af-justify-between af-px-2 af-py-4">
        <div className="af-flex af-items-center af-gap-2 af-text-sm af-text-muted-foreground">
          <span>
            Showing {startIndex}-{endIndex} of {total}
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="af-w-[70px] af-h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>
        <div className="af-flex af-items-center af-gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={!hasPreviousPage}
          >
            <ChevronLeft className="af-h-4 af-w-4 af-mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={!hasNextPage}
          >
            Next
            <ChevronRight className="af-h-4 af-w-4 af-ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
