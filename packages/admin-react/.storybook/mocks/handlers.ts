import { http, HttpResponse, delay } from 'msw'
import type { Form, Submission, PaginatedSubmissions } from '../../src/types'

// Mock data
export const mockForms: Form[] = [
  {
    id: 'form_1',
    name: 'Contact Form',
    endpoint_url: 'https://aifeatures.dev/f/form_1',
    email_recipients: ['hello@example.com'],
    redirect_url: '/thank-you',
    webhook_url: null,
    domains: ['example.com', 'www.example.com'],
    captcha: { enabled: true, provider: 'turnstile', site_key: '0x4AAA...' },
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'form_2',
    name: 'Newsletter Signup',
    endpoint_url: 'https://aifeatures.dev/f/form_2',
    email_recipients: ['marketing@example.com', 'newsletter@example.com'],
    redirect_url: null,
    webhook_url: 'https://example.com/webhook',
    domains: ['example.com'],
    captcha: { enabled: false },
    created_at: '2024-02-20T14:00:00Z',
    updated_at: '2024-03-01T09:15:00Z',
  },
]

export const mockSubmissions: Submission[] = [
  {
    id: 'sub_1',
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello! I would like to learn more about your services. Please find my resume attached.',
    },
    attachments: [
      {
        name: 'resume.pdf',
        size: 156000,
        r2_key: 'form_1/sub_1/resume.pdf',
        content_type: 'application/pdf',
      },
      {
        name: 'cover-letter.docx',
        size: 24500,
        r2_key: 'form_1/sub_1/cover-letter.docx',
        content_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    ],
    metadata: {
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      submitted_at: '2024-03-10T15:30:00Z',
    },
    resend_id: 're_abc123def456',
  },
  {
    id: 'sub_2',
    data: {
      name: 'Jane Smith',
      email: 'jane@company.com',
      phone: '+1 555-123-4567',
      message:
        'We are interested in partnering with you. Could we schedule a call this week?',
    },
    attachments: [
      {
        name: 'proposal.pdf',
        size: 245000,
        r2_key: 'form_1/sub_2/proposal.pdf',
        content_type: 'application/pdf',
      },
    ],
    metadata: {
      ip_address: '10.0.0.42',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      submitted_at: '2024-03-09T09:15:00Z',
    },
    resend_id: 're_xyz789ghi012',
  },
  {
    id: 'sub_3',
    data: {
      name: 'Test User',
      email: 'test@test.com',
      message: 'This is a test submission',
    },
    attachments: [],
    metadata: {
      ip_address: '1.2.3.4',
      user_agent: 'curl/7.64.1',
      submitted_at: '2024-03-08T20:00:00Z',
    },
    resend_id: null,
  },
  {
    id: 'sub_4',
    data: {
      name: 'Alice Johnson',
      email: 'alice@startup.io',
      company: 'TechStartup Inc',
      message:
        'Looking for a website builder for our new product launch. What pricing options do you have?',
    },
    attachments: [
      {
        name: 'mockup.png',
        size: 1240000,
        r2_key: 'form_1/sub_4/mockup.png',
        content_type: 'image/png',
      },
    ],
    metadata: {
      ip_address: '203.0.113.50',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
      submitted_at: '2024-03-07T11:45:00Z',
    },
    resend_id: 're_mno345pqr678',
  },
  {
    id: 'sub_5',
    data: {
      name: 'Bob Williams',
      email: 'bob.w@enterprise.com',
      message: 'Need enterprise features - SSO, custom branding, dedicated support.',
    },
    attachments: [],
    metadata: {
      ip_address: '198.51.100.25',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
      submitted_at: '2024-03-06T16:20:00Z',
    },
    resend_id: 're_stu901vwx234',
  },
]

const API_URL = 'https://aifeatures.dev'

export const handlers = [
  // List forms
  http.get(`${API_URL}/api/v1/forms`, async () => {
    await delay(500)
    return HttpResponse.json({ forms: mockForms })
  }),

  // Get single form
  http.get(`${API_URL}/api/v1/forms/:formId`, async ({ params }) => {
    await delay(300)
    const form = mockForms.find((f) => f.id === params.formId)
    if (!form) {
      return HttpResponse.json({ error: 'Form not found' }, { status: 404 })
    }
    return HttpResponse.json(form)
  }),

  // Update form
  http.patch(`${API_URL}/api/v1/forms/:formId`, async ({ params, request }) => {
    await delay(500)
    const form = mockForms.find((f) => f.id === params.formId)
    if (!form) {
      return HttpResponse.json({ error: 'Form not found' }, { status: 404 })
    }
    const body = (await request.json()) as Partial<Form>
    const updatedForm = { ...form, ...body, updated_at: new Date().toISOString() }
    return HttpResponse.json(updatedForm)
  }),

  // List submissions
  http.get(`${API_URL}/api/v1/forms/:formId/submissions`, async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '25', 10)
    const offset = parseInt(url.searchParams.get('offset') || '0', 10)

    const paginatedSubmissions = mockSubmissions.slice(offset, offset + limit)

    const response: PaginatedSubmissions = {
      submissions: paginatedSubmissions,
      total: mockSubmissions.length,
      limit,
      offset,
    }
    return HttpResponse.json(response)
  }),

  // Get single submission
  http.get(`${API_URL}/api/v1/submissions/:submissionId`, async ({ params }) => {
    await delay(300)
    const submission = mockSubmissions.find((s) => s.id === params.submissionId)
    if (!submission) {
      return HttpResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    return HttpResponse.json(submission)
  }),

  // Delete submission
  http.delete(`${API_URL}/api/v1/submissions/:submissionId`, async () => {
    await delay(300)
    return new HttpResponse(null, { status: 204 })
  }),

  // Download attachment
  http.get(
    `${API_URL}/api/v1/submissions/:submissionId/attachments/:filename`,
    async ({ params }) => {
      await delay(500)

      // Find the submission and attachment
      const submission = mockSubmissions.find((s) => s.id === params.submissionId)
      if (!submission) {
        return HttpResponse.json({ error: 'Submission not found' }, { status: 404 })
      }

      const attachment = submission.attachments.find(
        (a) => a.name === params.filename
      )
      if (!attachment) {
        return HttpResponse.json({ error: 'Attachment not found' }, { status: 404 })
      }

      // Return a mock file (in real usage this would be the actual file)
      const mockFileContent = `Mock file content for ${attachment.name}`
      return new HttpResponse(mockFileContent, {
        status: 200,
        headers: {
          'Content-Type': attachment.content_type,
          'Content-Disposition': `attachment; filename="${attachment.name}"`,
        },
      })
    }
  ),
]
