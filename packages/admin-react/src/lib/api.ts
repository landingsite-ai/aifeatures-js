import type {
  Form,
  Submission,
  FormsListResponse,
  PaginatedSubmissions,
  CreateFormInput,
  UpdateFormInput,
  UpdateSubmissionInput,
  GetSubmissionsOptions,
  ApiError,
} from '../types'

export class AifeaturesApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: ApiError
  ) {
    super(message)
    this.name = 'AifeaturesApiError'
  }
}

export interface AifeaturesApiClient {
  // Forms
  getForms(): Promise<Form[]>
  getForm(formId: string): Promise<Form>
  createForm(input: CreateFormInput): Promise<Form>
  updateForm(formId: string, input: UpdateFormInput): Promise<Form>
  deleteForm(formId: string): Promise<void>

  // Submissions
  getSubmissions(
    formId: string,
    options?: GetSubmissionsOptions
  ): Promise<PaginatedSubmissions>
  getSubmission(submissionId: string): Promise<Submission>
  updateSubmission(
    submissionId: string,
    input: UpdateSubmissionInput
  ): Promise<Submission>
  deleteSubmission(submissionId: string): Promise<void>
}

export function createApiClient(
  siteToken: string,
  apiUrl: string = 'https://aifeatures.dev'
): AifeaturesApiClient {
  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${apiUrl}${path}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${siteToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      let details: ApiError | undefined
      try {
        details = await response.json()
      } catch {
        // Ignore JSON parse errors
      }
      throw new AifeaturesApiError(
        details?.error || `Request failed with status ${response.status}`,
        response.status,
        details
      )
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  }

  return {
    // Forms
    async getForms(): Promise<Form[]> {
      const data = await request<FormsListResponse>('/api/v1/forms')
      return data.forms
    },

    async getForm(formId: string): Promise<Form> {
      return request<Form>(`/api/v1/forms/${formId}`)
    },

    async createForm(input: CreateFormInput): Promise<Form> {
      return request<Form>('/api/v1/forms', {
        method: 'POST',
        body: JSON.stringify(input),
      })
    },

    async updateForm(formId: string, input: UpdateFormInput): Promise<Form> {
      return request<Form>(`/api/v1/forms/${formId}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      })
    },

    async deleteForm(formId: string): Promise<void> {
      await request<void>(`/api/v1/forms/${formId}`, {
        method: 'DELETE',
      })
    },

    // Submissions
    async getSubmissions(
      formId: string,
      options: GetSubmissionsOptions = {}
    ): Promise<PaginatedSubmissions> {
      const params = new URLSearchParams()
      if (options.limit !== undefined) {
        params.set('limit', String(options.limit))
      }
      if (options.offset !== undefined) {
        params.set('offset', String(options.offset))
      }
      if (options.include_spam) {
        params.set('include_spam', 'true')
      }
      const query = params.toString()
      const path = `/api/v1/forms/${formId}/submissions${query ? `?${query}` : ''}`
      return request<PaginatedSubmissions>(path)
    },

    async getSubmission(submissionId: string): Promise<Submission> {
      return request<Submission>(`/api/v1/submissions/${submissionId}`)
    },

    async updateSubmission(
      submissionId: string,
      input: UpdateSubmissionInput
    ): Promise<Submission> {
      return request<Submission>(`/api/v1/submissions/${submissionId}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      })
    },

    async deleteSubmission(submissionId: string): Promise<void> {
      await request<void>(`/api/v1/submissions/${submissionId}`, {
        method: 'DELETE',
      })
    },
  }
}
