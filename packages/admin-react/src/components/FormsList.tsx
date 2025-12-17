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
      <div className={`flex items-center justify-center py-8 ${className || ''}`}>
        <div className="text-muted-foreground">Loading forms...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center py-8 ${className || ''}`}>
        <div className="text-destructive">Error: {error.message}</div>
      </div>
    )
  }

  if (forms.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className || ''}`}>
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <TableRow key={form.id}>
              <TableCell className="font-medium">{form.name}</TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  {form.endpoint_url.replace('https://aifeatures.dev', '')}
                </code>
              </TableCell>
              <TableCell>
                <Badge variant={form.captcha.enabled ? 'success' : 'secondary'}>
                  {form.captcha.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(form.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
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
                      <ExternalLink className="h-4 w-4" />
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
