import type { Meta, StoryObj } from '@storybook/react'
import { AifeaturesProvider } from '../provider/AifeaturesProvider'
import { FormSubmissions } from './FormSubmissions'
import { handlers, mockSubmissions } from '../../.storybook/mocks/handlers'
import { http, HttpResponse, delay } from 'msw'

const meta: Meta<typeof FormSubmissions> = {
  title: 'Components/FormSubmissions',
  component: FormSubmissions,
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
  args: {
    formId: 'form_1',
  },
}

export default meta
type Story = StoryObj<typeof FormSubmissions>

export const Default: Story = {}

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(
          'https://aifeatures.dev/api/v1/forms/:formId/submissions',
          async () => {
            await delay(500)
            return HttpResponse.json({
              submissions: [],
              total: 0,
              limit: 25,
              offset: 0,
            })
          }
        ),
      ],
    },
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(
          'https://aifeatures.dev/api/v1/forms/:formId/submissions',
          async () => {
            await delay(999999)
            return HttpResponse.json({
              submissions: [],
              total: 0,
              limit: 25,
              offset: 0,
            })
          }
        ),
      ],
    },
  },
}

export const ManySubmissions: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(
          'https://aifeatures.dev/api/v1/forms/:formId/submissions',
          async ({ request }) => {
            await delay(500)
            const url = new URL(request.url)
            const limit = parseInt(url.searchParams.get('limit') || '25', 10)
            const offset = parseInt(url.searchParams.get('offset') || '0', 10)

            // Generate 50 mock submissions
            const allSubmissions = Array.from({ length: 50 }, (_, i) => ({
              id: `sub_${i + 1}`,
              data: {
                name: `User ${i + 1}`,
                email: `user${i + 1}@example.com`,
                message: `This is message number ${i + 1} from a user.`,
              },
              attachments: [],
              metadata: {
                ip_address: `192.168.1.${i + 1}`,
                user_agent: 'Mozilla/5.0',
                submitted_at: new Date(
                  Date.now() - i * 24 * 60 * 60 * 1000
                ).toISOString(),
              },
            }))

            return HttpResponse.json({
              submissions: allSubmissions.slice(offset, offset + limit),
              total: allSubmissions.length,
              limit,
              offset,
            })
          }
        ),
        ...handlers.filter(
          (h) =>
            !h.info.path.toString().includes('/forms/:formId/submissions')
        ),
      ],
    },
  },
}

export const WithAttachments: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(
          'https://aifeatures.dev/api/v1/forms/:formId/submissions',
          async () => {
            await delay(500)
            return HttpResponse.json({
              submissions: mockSubmissions,
              total: mockSubmissions.length,
              limit: 25,
              offset: 0,
            })
          }
        ),
        ...handlers.filter(
          (h) =>
            !h.info.path.toString().includes('/forms/:formId/submissions')
        ),
      ],
    },
  },
}
