import type { Meta, StoryObj } from '@storybook/react'
import { AifeaturesProvider } from '../provider/AifeaturesProvider'
import { FormSettings } from './FormSettings'
import { handlers, mockForms } from '../../.storybook/mocks/handlers'

const meta: Meta<typeof FormSettings> = {
  title: 'Components/FormSettings',
  component: FormSettings,
  decorators: [
    (Story) => (
      <AifeaturesProvider siteToken="st_mock_token">
        <div className="max-w-xl mx-auto p-6">
          <Story />
        </div>
      </AifeaturesProvider>
    ),
  ],
  parameters: {
    msw: {
      handlers,
    },
  },
}

export default meta
type Story = StoryObj<typeof FormSettings>

export const Default: Story = {
  args: {
    form: mockForms[0],
  },
}

export const WithMultipleRecipients: Story = {
  args: {
    form: mockForms[1],
  },
}

export const WithNoRedirect: Story = {
  args: {
    form: {
      ...mockForms[0],
      redirect_url: null,
    },
  },
}

export const CaptchaDisabled: Story = {
  args: {
    form: {
      ...mockForms[0],
      captcha: { enabled: false },
    },
  },
}

export const NoRecipients: Story = {
  args: {
    form: {
      ...mockForms[0],
      email_recipients: [],
    },
  },
}
