import * as React from 'react'
import { ArrowLeft, Download, Globe, Clock, FileText, Loader2, Monitor, Mail } from 'lucide-react'
import { Button } from '../ui/button'
import { useAifeaturesContext } from '../provider/AifeaturesProvider'
import type { Submission } from '../types'

export interface SubmissionDetailProps {
  submission: Submission
  onBack: () => void
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function SubmissionDetail({
  submission,
  onBack,
}: SubmissionDetailProps) {
  const { api } = useAifeaturesContext()
  const [downloadingFile, setDownloadingFile] = React.useState<string | null>(null)

  const handleDownload = async (filename: string) => {
    setDownloadingFile(filename)
    try {
      await api.downloadAttachment(submission.id, filename)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloadingFile(null)
    }
  }

  const dataEntries = Object.entries(submission.data).filter(
    ([key]) => !key.startsWith('_')
  )

  return (
    <div>
      {/* Header with back button */}
      <div className="af-mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="af-mb-2 af--ml-2"
        >
          <ArrowLeft className="af-h-4 af-w-4 af-mr-1" />
          Back to Submissions
        </Button>
        <h3 className="af-text-lg af-font-semibold">Submission Details</h3>
        <p className="af-text-sm af-text-muted-foreground">
          Submitted {formatDate(submission.metadata.submitted_at)}
        </p>
      </div>

      <div className="af-space-y-6">
        {/* Form Data */}
        <div>
          <h4 className="af-text-sm af-font-medium af-mb-3">Form Data</h4>
          <div className="af-space-y-3">
            {dataEntries.map(([key, value]) => (
              <div key={key} className="af-grid af-grid-cols-3 af-gap-2">
                <div className="af-text-sm af-text-muted-foreground af-capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="af-col-span-2 af-text-sm af-break-words">
                  {typeof value === 'string' && value.includes('\n') ? (
                    <pre className="af-whitespace-pre-wrap af-font-sans af-bg-muted af-p-2 af-rounded af-text-xs">
                      {value}
                    </pre>
                  ) : (
                    String(value)
                  )}
                </div>
              </div>
            ))}
            {dataEntries.length === 0 && (
              <p className="af-text-sm af-text-muted-foreground">No data submitted</p>
            )}
          </div>
        </div>

        {/* Attachments */}
        {submission.attachments.length > 0 && (
          <div>
            <h4 className="af-text-sm af-font-medium af-mb-3">Attachments</h4>
            <div className="af-space-y-2">
              {submission.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="af-flex af-items-center af-justify-between af-p-2 af-bg-muted af-rounded"
                >
                  <div className="af-flex af-items-center af-gap-2">
                    <FileText className="af-h-4 af-w-4 af-text-muted-foreground" />
                    <span className="af-text-sm">{attachment.name}</span>
                    <span className="af-text-xs af-text-muted-foreground">
                      ({formatBytes(attachment.size)})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(attachment.name)}
                    disabled={downloadingFile === attachment.name}
                  >
                    {downloadingFile === attachment.name ? (
                      <Loader2 className="af-h-4 af-w-4 af-mr-1 af-animate-spin" />
                    ) : (
                      <Download className="af-h-4 af-w-4 af-mr-1" />
                    )}
                    {downloadingFile === attachment.name ? 'Downloading...' : 'Download'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div>
          <h4 className="af-text-sm af-font-medium af-mb-3">Metadata</h4>
          <div className="af-space-y-2 af-text-sm">
            <div className="af-flex af-items-center af-gap-2 af-text-muted-foreground">
              <Clock className="af-h-4 af-w-4" />
              <span>{formatDate(submission.metadata.submitted_at)}</span>
            </div>
            {submission.metadata.ip_address && (
              <div className="af-flex af-items-center af-gap-2 af-text-muted-foreground">
                <Globe className="af-h-4 af-w-4" />
                <span>IP: {submission.metadata.ip_address}</span>
              </div>
            )}
            {submission.metadata.user_agent && (
              <div className="af-flex af-items-start af-gap-2 af-text-muted-foreground">
                <Monitor className="af-h-4 af-w-4 af-mt-0.5" />
                <span className="af-text-xs af-break-all">
                  {submission.metadata.user_agent}
                </span>
              </div>
            )}
            {submission.resend_id && (
              <div className="af-flex af-items-center af-gap-2 af-text-muted-foreground">
                <Mail className="af-h-4 af-w-4" />
                <span>Email ID: {submission.resend_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
