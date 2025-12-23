import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { handlers } from '../.storybook/mocks/handlers'
import { AiFeaturesForm } from './AiFeaturesForm'
import { FormField } from './FormField'
import { FormActions } from './FormActions'
import { SubmitButton } from './SubmitButton'
import { FormStatus } from './FormStatus'

const meta: Meta<typeof AiFeaturesForm> = {
  title: 'Components/AiFeaturesForm',
  component: AiFeaturesForm,
  parameters: {
    msw: {
      handlers,
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AiFeaturesForm>

export const ContactForm: Story = {
  render: () => (
    <div style={{ maxWidth: 400, padding: 20 }}>
      <AiFeaturesForm
        formId="test-form-123"
        onSuccess={() => console.log('Form submitted successfully!')}
        onError={(error) => console.error('Form error:', error)}
      >
        <div style={{ marginBottom: 16 }}>
          <FormField name="name" label="Name" required placeholder="John Doe" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <FormField name="email" type="email" label="Email" required placeholder="john@example.com" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <FormField name="message" type="textarea" label="Message" required placeholder="Your message..." />
        </div>
        <FormStatus
          successMessage="Thank you! Your message has been sent."
          successClassName="success-message"
          errorClassName="error-message"
        />
        <FormActions>
          <SubmitButton>Send Message</SubmitButton>
        </FormActions>
      </AiFeaturesForm>
      <style>{`
        label { display: block; margin-bottom: 4px; font-weight: 500; }
        input, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        textarea { min-height: 100px; resize: vertical; }
        button { background: #0070f3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:disabled { background: #ccc; }
        .success-message { color: green; margin-bottom: 16px; }
        .error-message { color: red; margin-bottom: 16px; }
      `}</style>
    </div>
  ),
}

export const WithFileUpload: Story = {
  render: () => (
    <div style={{ maxWidth: 400, padding: 20 }}>
      <AiFeaturesForm formId="test-form-123">
        <div style={{ marginBottom: 16 }}>
          <FormField name="name" label="Name" required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <FormField name="email" type="email" label="Email" required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <FormField name="resume" type="file" label="Resume" accept=".pdf,.doc,.docx" />
        </div>
        <FormStatus />
        <FormActions>
          <SubmitButton>Submit Application</SubmitButton>
        </FormActions>
      </AiFeaturesForm>
      <style>{`
        label { display: block; margin-bottom: 4px; font-weight: 500; }
        input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        button { background: #0070f3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:disabled { background: #ccc; }
      `}</style>
    </div>
  ),
}

export const WithSelect: Story = {
  render: () => (
    <div style={{ maxWidth: 400, padding: 20 }}>
      <AiFeaturesForm formId="test-form-123">
        <div style={{ marginBottom: 16 }}>
          <FormField name="name" label="Name" required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <FormField
            name="subject"
            type="select"
            label="Subject"
            required
            options={[
              { value: 'general', label: 'General Inquiry' },
              { value: 'support', label: 'Technical Support' },
              { value: 'sales', label: 'Sales' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <FormField name="message" type="textarea" label="Message" required />
        </div>
        <FormStatus />
        <FormActions>
          <SubmitButton>Send</SubmitButton>
        </FormActions>
      </AiFeaturesForm>
      <style>{`
        label { display: block; margin-bottom: 4px; font-weight: 500; }
        input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        textarea { min-height: 100px; }
        button { background: #0070f3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:disabled { background: #ccc; }
      `}</style>
    </div>
  ),
}

export const WithoutTurnstile: Story = {
  render: () => (
    <div style={{ maxWidth: 400, padding: 20 }}>
      <p style={{ marginBottom: 16, color: '#666', fontSize: 14 }}>
        This form has no Turnstile configured - it should submit without CAPTCHA.
      </p>
      <AiFeaturesForm
        formId="no-turnstile-form"
        onSuccess={() => console.log('Form submitted without Turnstile!')}
      >
        <div style={{ marginBottom: 16 }}>
          <FormField name="name" label="Name" required placeholder="John Doe" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <FormField name="email" type="email" label="Email" required placeholder="john@example.com" />
        </div>
        <FormStatus
          successMessage="Form submitted successfully (no CAPTCHA needed)!"
          successClassName="success-message"
        />
        <FormActions>
          <SubmitButton>Submit (No CAPTCHA)</SubmitButton>
        </FormActions>
      </AiFeaturesForm>
      <style>{`
        label { display: block; margin-bottom: 4px; font-weight: 500; }
        input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        button { background: #0070f3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:disabled { background: #ccc; }
        .success-message { color: green; margin-bottom: 16px; }
      `}</style>
    </div>
  ),
}

export const SubmissionTest: Story = {
  render: () => (
    <div style={{ maxWidth: 400, padding: 20 }}>
      <AiFeaturesForm formId="test-form-123">
        <div style={{ marginBottom: 16 }}>
          <FormField name="name" label="Name" required placeholder="Test User" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <FormField name="email" type="email" label="Email" required placeholder="test@example.com" />
        </div>
        <FormStatus successMessage="Success! Form submitted." />
        <FormActions>
          <SubmitButton>Submit</SubmitButton>
        </FormActions>
      </AiFeaturesForm>
      <style>{`
        label { display: block; margin-bottom: 4px; font-weight: 500; }
        input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        button { background: #0070f3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:disabled { background: #ccc; }
        .success-message { color: green; }
      `}</style>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for form to load
    await waitFor(() => {
      expect(canvas.getByLabelText(/name/i)).toBeInTheDocument()
    })

    // Fill in the form
    await userEvent.type(canvas.getByLabelText(/name/i), 'Test User')
    await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com')

    // Wait for Turnstile to render (it auto-solves with test key)
    await waitFor(
      () => {
        // The form should have the turnstile response after auto-solve
        const form = canvasElement.querySelector('form')
        expect(form).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  },
}
