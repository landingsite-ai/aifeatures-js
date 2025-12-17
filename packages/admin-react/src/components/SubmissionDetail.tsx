import * as React from 'react'
import { Download, Mail, Globe, Clock, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import type { Submission } from '../types'

export interface SubmissionDetailProps {
  submission: Submission | null
  open: boolean
  onOpenChange: (open: boolean) => void
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
  open,
  onOpenChange,
}: SubmissionDetailProps) {
  if (!submission) return null

  const dataEntries = Object.entries(submission.data).filter(
    ([key]) => !key.startsWith('_') // Filter out internal fields
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Submission Details
            {!submission.is_read && (
              <Badge variant="default" className="ml-2">New</Badge>
            )}
            {submission.is_spam && (
              <Badge variant="destructive" className="ml-2">Spam</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Submitted {formatDate(submission.metadata.submitted_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form Data */}
          <div>
            <h4 className="text-sm font-medium mb-3">Form Data</h4>
            <div className="space-y-3">
              {dataEntries.map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="col-span-2 text-sm break-words">
                    {typeof value === 'string' && value.includes('\n') ? (
                      <pre className="whitespace-pre-wrap font-sans bg-muted p-2 rounded text-xs">
                        {value}
                      </pre>
                    ) : (
                      String(value)
                    )}
                  </div>
                </div>
              ))}
              {dataEntries.length === 0 && (
                <p className="text-sm text-muted-foreground">No data submitted</p>
              )}
            </div>
          </div>

          {/* Attachments */}
          {submission.attachments.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Attachments</h4>
              <div className="space-y-2">
                {submission.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{attachment.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({formatBytes(attachment.size)})
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" disabled>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div>
            <h4 className="text-sm font-medium mb-3">Metadata</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatDate(submission.metadata.submitted_at)}</span>
              </div>
              {submission.metadata.ip_address && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>IP: {submission.metadata.ip_address}</span>
                </div>
              )}
              {submission.metadata.user_agent && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 mt-0.5" />
                  <span className="text-xs break-all">
                    {submission.metadata.user_agent}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
