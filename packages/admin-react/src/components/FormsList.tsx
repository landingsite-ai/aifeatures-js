import * as React from 'react'
import { ExternalLink, Inbox } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useForms } from '../hooks/useForms'
import type { Form } from '../types'

export interface FormsListProps {
  /** Called when a form is selected */
  onSelectForm?: (form: Form) => void
  /** Optional className */
  className?: string
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function FormsList({ onSelectForm, className }: FormsListProps) {
  const { forms, isLoading, error } = useForms()

  if (isLoading) {
    return (
      <div className={`af-flex af-items-center af-justify-center af-py-8 ${className || ''}`}>
        <div className="af-text-muted-foreground">Loading forms...</div>
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

  if (forms.length === 0) {
    return (
      <div className={`af-flex af-flex-col af-items-center af-justify-center af-py-12 ${className || ''}`}>
        <Inbox className="af-h-12 af-w-12 af-text-muted-foreground af-mb-4" />
        <p className="af-text-muted-foreground af-text-center">
          No forms yet.
          <br />
          Forms will appear here when the AI creates contact forms on your website.
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Captcha</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="af-text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <TableRow key={form.id}>
              <TableCell className="af-font-medium">{form.name}</TableCell>
              <TableCell>
                <code className="af-text-xs af-bg-muted af-px-1.5 af-py-0.5 af-rounded">
                  {form.endpoint_url.replace('https://aifeatures.dev', '')}
                </code>
              </TableCell>
              <TableCell>
                <Badge variant={form.captcha.enabled ? 'success' : 'secondary'}>
                  {form.captcha.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </TableCell>
              <TableCell className="af-text-muted-foreground">
                {formatDate(form.created_at)}
              </TableCell>
              <TableCell className="af-text-right">
                <div className="af-flex af-items-center af-justify-end af-gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectForm?.(form)}
                  >
                    View Submissions
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <a
                      href={form.endpoint_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open endpoint"
                    >
                      <ExternalLink className="af-h-4 af-w-4" />
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
