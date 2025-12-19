import * as React from 'react'
import { Plus, X, Loader2, Check } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { useForms } from '../hooks/useForms'
import type { Form, UpdateFormInput } from '../types'

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
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
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

  // Auto-save function
  const save = React.useCallback(
    async (updates: UpdateFormInput) => {
      try {
        setIsSaving(true)
        setError(null)
        const updatedForm = await updateForm(form.id, updates)
        setLastSaved(new Date())
        onSaved?.(updatedForm)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save')
      } finally {
        setIsSaving(false)
      }
    },
    [form.id, updateForm, onSaved]
  )

  // Clear "saved" indicator after 2 seconds
  React.useEffect(() => {
    if (lastSaved) {
      const timer = setTimeout(() => setLastSaved(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [lastSaved])

  const handleAddEmail = async () => {
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
    const newRecipients = [...emailRecipients, email]
    setEmailRecipients(newRecipients)
    setNewEmail('')
    setError(null)
    await save({ email_recipients: newRecipients })
  }

  const handleRemoveEmail = async (email: string) => {
    const newRecipients = emailRecipients.filter((e) => e !== email)
    setEmailRecipients(newRecipients)
    await save({ email_recipients: newRecipients })
  }

  // Save text fields on blur
  const handleNameBlur = async () => {
    if (name !== form.name) {
      await save({ name })
    }
  }

  const handleRedirectBlur = async () => {
    const newValue = redirectUrl || null
    if (newValue !== form.redirect_url) {
      await save({ redirect_url: newValue })
    }
  }

  return (
    <div className={`af-space-y-6 af-relative ${className || ''}`}>
      {/* Toast notification */}
      {(isSaving || lastSaved) && (
        <div className="aifeatures-admin af-fixed af-bottom-4 af-right-4 af-z-50">
          {isSaving ? (
            <div className="af-flex af-items-center af-gap-2 af-bg-background af-border af-shadow-lg af-rounded-lg af-px-4 af-py-3">
              <Loader2 className="af-h-4 af-w-4 af-animate-spin af-text-muted-foreground" />
              <span className="af-text-sm">Saving...</span>
            </div>
          ) : (
            <div className="af-flex af-items-center af-gap-2 af-bg-green-50 af-border af-border-green-200 af-shadow-lg af-rounded-lg af-px-4 af-py-3">
              <Check className="af-h-4 af-w-4 af-text-green-600" />
              <span className="af-text-sm af-text-green-800">Changes saved</span>
            </div>
          )}
        </div>
      )}

      {/* Form Name */}
      <div className="af-space-y-2">
        <Label htmlFor="form-name">Form Name</Label>
        <Input
          id="form-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
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
                disabled={isSaving}
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
            disabled={isSaving}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddEmail}
            disabled={!newEmail.trim() || isSaving}
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
          onBlur={handleRedirectBlur}
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
    </div>
  )
}
