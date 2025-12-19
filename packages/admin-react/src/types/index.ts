/**
 * Form object from aifeatures API
 */
export interface Form {
  id: string
  name: string
  endpoint_url: string
  email_recipients: string[]
  redirect_url: string | null
  webhook_url: string | null
  domains: string[]
  captcha: {
    enabled: boolean
    provider?: 'turnstile'
    site_key?: string
  }
  created_at: string
  updated_at: string
}

/**
 * Attachment object for form submissions
 */
export interface Attachment {
  name: string
  size: number
  r2_key: string
  content_type: string
}

/**
 * Submission metadata
 */
export interface SubmissionMetadata {
  ip_address: string | null
  user_agent: string | null
  submitted_at: string
}

/**
 * Form submission object from aifeatures API
 */
export interface Submission {
  id: string
  data: Record<string, unknown>
  attachments: Attachment[]
  metadata: SubmissionMetadata
  resend_id: string | null
}

/**
 * Paginated submissions response
 */
export interface PaginatedSubmissions {
  submissions: Submission[]
  total: number
  limit: number
  offset: number
}

/**
 * Forms list response
 */
export interface FormsListResponse {
  forms: Form[]
}

/**
 * Input for creating a new form
 */
export interface CreateFormInput {
  name: string
  email_recipients?: string[]
  redirect_url?: string
  webhook_url?: string
  domains?: string[]
}

/**
 * Input for updating a form
 */
export interface UpdateFormInput {
  name?: string
  email_recipients?: string[]
  redirect_url?: string | null
  webhook_url?: string | null
  domains?: string[]
}

/**
 * Options for fetching submissions
 */
export interface GetSubmissionsOptions {
  limit?: number
  offset?: number
}

/**
 * API error response
 */
export interface ApiError {
  error: string
  message?: string
}
