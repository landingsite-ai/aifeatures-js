import * as React from 'react'
import { Save, Plus, X, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { useForms } from '../hooks/useForms'
import type { Form } from '../types'

export interface FormSettingsProps {
  /** The form to edit */
  form: Form
  /** Called when settings are saved */
  onSaved?: (form: Form) => void
  /** Optional className */
  className?: string
}

export function FormSettings({ form, onSaved, className }: FormSettingsProps) {
  const { updateForm } = useForms()
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Local form state
  const [name, setName] = React.useState(form.name)
  const [redirectUrl, setRedirectUrl] = React.useState(form.redirect_url || '')
  const [emailRecipients, setEmailRecipients] = React.useState<string[]>(
    form.email_recipients
  )
  const [newEmail, setNewEmail] = React.useState('')

  // Reset state when form changes
  React.useEffect(() => {
    setName(form.name)
    setRedirectUrl(form.redirect_url || '')
    setEmailRecipients(form.email_recipients)
    setError(null)
  }, [form])

  const handleAddEmail = () => {
    const email = newEmail.trim().toLowerCase()
    if (!email) return
    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (emailRecipients.includes(email)) {
      setError('This email is already added')
      return
    }
    setEmailRecipients([...emailRecipients, email])
    setNewEmail('')
    setError(null)
  }

  const handleRemoveEmail = (email: string) => {
    setEmailRecipients(emailRecipients.filter((e) => e !== email))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)

      const updatedForm = await updateForm(form.id, {
        name: name !== form.name ? name : undefined,
        redirect_url: redirectUrl !== (form.redirect_url || '')
          ? redirectUrl || null
          : undefined,
        email_recipients:
          JSON.stringify(emailRecipients) !==
          JSON.stringify(form.email_recipients)
            ? emailRecipients
            : undefined,
      })

      onSaved?.(updatedForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges =
    name !== form.name ||
    redirectUrl !== (form.redirect_url || '') ||
    JSON.stringify(emailRecipients) !== JSON.stringify(form.email_recipients)

  return (
    <div className={`af-space-y-6 ${className || ''}`}>
      {/* Form Name */}
      <div className="af-space-y-2">
        <Label htmlFor="form-name">Form Name</Label>
        <Input
          id="form-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contact Form"
        />
        <p className="af-text-xs af-text-muted-foreground">
          A name to identify this form in your dashboard.
        </p>
      </div>

      {/* Email Recipients */}
      <div className="af-space-y-2">
        <Label>Email Recipients</Label>
        <p className="af-text-xs af-text-muted-foreground af-mb-2">
          Form submissions will be sent to these email addresses.
        </p>
        <div className="af-flex af-flex-wrap af-gap-2 af-mb-2">
          {emailRecipients.map((email) => (
            <Badge key={email} variant="secondary" className="af-gap-1">
              {email}
              <button
                type="button"
                onClick={() => handleRemoveEmail(email)}
                className="af-ml-1 hover:af-text-destructive"
              >
                <X className="af-h-3 af-w-3" />
              </button>
            </Badge>
          ))}
          {emailRecipients.length === 0 && (
            <span className="af-text-sm af-text-muted-foreground af-italic">
              No recipients configured
            </span>
          )}
        </div>
        <div className="af-flex af-gap-2">
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Add email address"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddEmail()
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddEmail}
            disabled={!newEmail.trim()}
          >
            <Plus className="af-h-4 af-w-4" />
          </Button>
        </div>
      </div>

      {/* Redirect URL */}
      <div className="af-space-y-2">
        <Label htmlFor="redirect-url">Redirect URL</Label>
        <Input
          id="redirect-url"
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
          placeholder="/thank-you"
        />
        <p className="af-text-xs af-text-muted-foreground">
          URL to redirect visitors to after successful submission. Leave empty
          for a default success page.
        </p>
      </div>

      {/* Form Endpoint (read-only) */}
      <div className="af-space-y-2">
        <Label>Form Endpoint</Label>
        <div className="af-flex af-items-center af-gap-2">
          <code className="af-flex-1 af-text-xs af-bg-muted af-px-3 af-py-2 af-rounded af-border">
            {form.endpoint_url}
          </code>
        </div>
        <p className="af-text-xs af-text-muted-foreground">
          Use this URL as the form action attribute.
        </p>
      </div>

      {/* Captcha Status (read-only for now) */}
      <div className="af-space-y-2">
        <Label>Captcha Protection</Label>
        <div className="af-flex af-items-center af-gap-2">
          <Badge variant={form.captcha.enabled ? 'success' : 'secondary'}>
            {form.captcha.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
          {form.captcha.enabled && form.captcha.provider && (
            <span className="af-text-xs af-text-muted-foreground">
              ({form.captcha.provider})
            </span>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="af-text-sm af-text-destructive af-bg-destructive/10 af-px-3 af-py-2 af-rounded">
          {error}
        </div>
      )}

      {/* Save button */}
      <div className="af-flex af-justify-end">
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="af-h-4 af-w-4 af-mr-2 af-animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="af-h-4 af-w-4 af-mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
