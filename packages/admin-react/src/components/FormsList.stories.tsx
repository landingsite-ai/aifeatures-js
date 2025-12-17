import type { Meta, StoryObj } from '@storybook/react'
import { AifeaturesProvider } from '../provider/AifeaturesProvider'
import { FormsList } from './FormsList'
import { handlers, mockForms } from '../../.storybook/mocks/handlers'
import { http, HttpResponse, delay } from 'msw'

const meta: Meta<typeof FormsList> = {
  title: 'Components/FormsList',
  component: FormsList,
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
type Story = StoryObj<typeof FormsList>

export const Default: Story = {}

export const SingleForm: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://aifeatures.dev/api/v1/forms', async () => {
          await delay(500)
          return HttpResponse.json({ forms: [mockForms[0]] })
        }),
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

export const ManyForms: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://aifeatures.dev/api/v1/forms', async () => {
          await delay(500)
          const manyForms = Array.from({ length: 10 }, (_, i) => ({
            ...mockForms[0],
            id: `form_${i + 1}`,
            name: `Form ${i + 1}`,
            endpoint_url: `https://aifeatures.dev/f/form_${i + 1}`,
            captcha: { enabled: i % 2 === 0 },
            created_at: new Date(
              Date.now() - i * 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          }))
          return HttpResponse.json({ forms: manyForms })
        }),
      ],
    },
  },
}
