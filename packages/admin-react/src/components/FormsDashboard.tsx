import * as React from 'react'
import { ArrowLeft, Settings, Inbox } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { FormsList } from './FormsList'
import { FormSubmissions } from './FormSubmissions'
import { FormSettings } from './FormSettings'
import { useAifeaturesContext } from '../provider/AifeaturesProvider'
import type { Form } from '../types'

export interface FormsDashboardProps {
  /** Optional className */
  className?: string
  /** Submission ID to deep link to (opens form and shows submission detail) */
  submissionId?: string
}

type View = 'list' | 'detail'

export function FormsDashboard({ className, submissionId }: FormsDashboardProps) {
  const { api } = useAifeaturesContext()
  const [view, setView] = React.useState<View>('list')
  const [selectedForm, setSelectedForm] = React.useState<Form | null>(null)
  const [activeTab, setActiveTab] = React.useState<'submissions' | 'settings'>(
    'submissions'
  )
  const [deepLinkSubmissionId, setDeepLinkSubmissionId] = React.useState<string | undefined>(submissionId)
  const [isLoadingDeepLink, setIsLoadingDeepLink] = React.useState(!!submissionId)

  // Handle deep linking to a submission
  React.useEffect(() => {
    if (!submissionId) return

    async function loadSubmission() {
      try {
        // Fetch the submission to get its form_id
        const submission = await api.getSubmission(submissionId!)
        // Fetch the form
        const form = await api.getForm(submission.form_id)
        // Navigate to the form with the submission selected
        setSelectedForm(form)
        setView('detail')
        setActiveTab('submissions')
        setDeepLinkSubmissionId(submissionId)
      } catch (error) {
        console.error('Failed to load submission for deep link:', error)
      } finally {
        setIsLoadingDeepLink(false)
      }
    }

    loadSubmission()
  }, [submissionId, api])

  const handleSelectForm = (form: Form, tab: 'submissions' | 'settings') => {
    setSelectedForm(form)
    setView('detail')
    setActiveTab(tab)
    setDeepLinkSubmissionId(undefined) // Clear deep link when manually selecting
  }

  const handleBack = () => {
    setView('list')
    setSelectedForm(null)
    setDeepLinkSubmissionId(undefined)
  }

  const handleFormSaved = (updatedForm: Form) => {
    setSelectedForm(updatedForm)
  }

  if (isLoadingDeepLink) {
    return (
      <div className={`af-flex af-items-center af-justify-center af-py-8 ${className || ''}`}>
        <div className="af-text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className={className}>
      {view === 'list' && (
        <div>
          <div className="af-mb-6">
            <h2 className="af-text-lg af-font-semibold">Forms</h2>
            <p className="af-text-sm af-text-muted-foreground">
              Manage your contact forms and view submissions.
            </p>
          </div>
          <FormsList onSelectForm={handleSelectForm} />
        </div>
      )}

      {view === 'detail' && selectedForm && (
        <div>
          {/* Header with back button */}
          <div className="af-mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="af-mb-2 af--ml-2"
            >
              <ArrowLeft className="af-h-4 af-w-4 af-mr-1" />
              Back to Forms
            </Button>
            <h2 className="af-text-lg af-font-semibold">{selectedForm.name}</h2>
            <p className="af-text-sm af-text-muted-foreground">
              <code className="af-text-xs af-bg-muted af-px-1.5 af-py-0.5 af-rounded">
                {selectedForm.endpoint_url}
              </code>
            </p>
          </div>

          {/* Tabs for submissions and settings */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'submissions' | 'settings')}
          >
            <TabsList className="af-mb-4">
              <TabsTrigger value="submissions" className="af-gap-2">
                <Inbox className="af-h-4 af-w-4" />
                Submissions
              </TabsTrigger>
              <TabsTrigger value="settings" className="af-gap-2">
                <Settings className="af-h-4 af-w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submissions">
              <FormSubmissions formId={selectedForm.id} defaultSubmissionId={deepLinkSubmissionId} />
            </TabsContent>

            <TabsContent value="settings">
              <FormSettings form={selectedForm} onSaved={handleFormSaved} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
