import { http, HttpResponse, delay } from 'msw'

// Mock form config
const mockFormConfig = {
  id: 'test-form-123',
  name: 'Contact Form',
  endpoint_url: 'https://aifeatures.dev/f/test-form-123',
  turnstile_sitekey: '1x00000000000000000000AA', // Cloudflare's always-pass test key
}

export const handlers = [
  // GET /f/:formId/config - Return form config
  http.get('https://aifeatures.dev/f/:formId/config', async ({ params }) => {
    await delay(300) // Simulate network delay

    return HttpResponse.json({
      ...mockFormConfig,
      id: params.formId,
    })
  }),

  // POST /f/:formId - Handle form submission
  http.post('https://aifeatures.dev/f/:formId', async ({ request }) => {
    await delay(500) // Simulate network delay

    const formData = await request.formData()
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        data[key] = value
      }
    })

    console.log('Form submission received:', data)

    // Check for Turnstile token
    if (!data['cf-turnstile-response']) {
      return HttpResponse.json(
        { error: 'Captcha required' },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      success: true,
      id: 'submission-' + Date.now(),
    })
  }),
]
