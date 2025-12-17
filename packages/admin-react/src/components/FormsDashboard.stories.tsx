import type { Meta, StoryObj } from '@storybook/react'
import { AifeaturesProvider } from '../provider/AifeaturesProvider'
import { FormsDashboard } from './FormsDashboard'
import { handlers, mockForms } from '../../.storybook/mocks/handlers'
import { http, HttpResponse, delay } from 'msw'

const meta: Meta<typeof FormsDashboard> = {
  title: 'Components/FormsDashboard',
  component: FormsDashboard,
  decorators: [
    (Story) => (
      <AifeaturesProvider siteToken="st_mock_token">
        <div className="max-w-4xl mx-auto p-6">
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
type Story = StoryObj<typeof FormsDashboard>

export const Default: Story = {}

export const WithSingleForm: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://aifeatures.dev/api/v1/forms', async () => {
          await delay(500)
          return HttpResponse.json({ forms: [mockForms[0]] })
        }),
        ...handlers.slice(1),
      ],
    },
  },
}

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://aifeatures.dev/api/v1/forms', async () => {
          await delay(500)
          return HttpResponse.json({ forms: [] })
        }),
      ],
    },
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://aifeatures.dev/api/v1/forms', async () => {
          await delay(999999)
          return HttpResponse.json({ forms: [] })
        }),
      ],
    },
  },
}

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://aifeatures.dev/api/v1/forms', async () => {
          await delay(500)
          return HttpResponse.json(
            { error: 'Failed to fetch forms' },
            { status: 500 }
          )
        }),
      ],
    },
  },
}

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <AifeaturesProvider siteToken="st_mock_token" dark>
        <div className="max-w-4xl mx-auto p-6">
          <Story />
        </div>
      </AifeaturesProvider>
    ),
  ],
}
