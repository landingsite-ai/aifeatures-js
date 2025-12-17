import * as React from 'react'
import { ArrowLeft, Settings, Inbox } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { FormsList } from './FormsList'
import { FormSubmissions } from './FormSubmissions'
import { FormSettings } from './FormSettings'
import type { Form } from '../types'

export interface FormsDashboardProps {
  /** Optional className */
  className?: string
}

type View = 'list' | 'detail'

export function FormsDashboard({ className }: FormsDashboardProps) {
  const [view, setView] = React.useState<View>('list')
  const [selectedForm, setSelectedForm] = React.useState<Form | null>(null)
  const [activeTab, setActiveTab] = React.useState<'submissions' | 'settings'>(
    'submissions'
  )

  const handleSelectForm = (form: Form) => {
    setSelectedForm(form)
    setView('detail')
    setActiveTab('submissions')
  }

  const handleBack = () => {
    setView('list')
    setSelectedForm(null)
  }

  const handleFormSaved = (updatedForm: Form) => {
    setSelectedForm(updatedForm)
  }

  return (
    <div className={className}>
      {view === 'list' && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Forms</h2>
            <p className="text-sm text-muted-foreground">
              Manage your contact forms and view submissions.
            </p>
          </div>
          <FormsList onSelectForm={handleSelectForm} />
        </div>
      )}

      {view === 'detail' && selectedForm && (
        <div>
          {/* Header with back button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Forms
            </Button>
            <h2 className="text-lg font-semibold">{selectedForm.name}</h2>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {selectedForm.endpoint_url}
              </code>
            </p>
          </div>

          {/* Tabs for submissions and settings */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'submissions' | 'settings')}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="submissions" className="gap-2">
                <Inbox className="h-4 w-4" />
                Submissions
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submissions">
              <FormSubmissions formId={selectedForm.id} />
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
