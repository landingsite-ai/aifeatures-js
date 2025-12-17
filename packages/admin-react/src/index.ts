// Provider
export {
  AifeaturesProvider,
  useAifeaturesContext,
  type AifeaturesProviderProps,
  type AifeaturesContextValue,
} from './provider/AifeaturesProvider'

// Components
export {
  FormsDashboard,
  FormsList,
  FormSubmissions,
  FormSettings,
  SubmissionDetail,
  type FormsDashboardProps,
  type FormsListProps,
  type FormSubmissionsProps,
  type FormSettingsProps,
  type SubmissionDetailProps,
} from './components'

// Hooks
export {
  useAifeatures,
  useForms,
  useSubmissions,
  type UseFormsReturn,
  type UseSubmissionsReturn,
  type UseSubmissionsOptions,
} from './hooks'

// Types
export type {
  Form,
  Submission,
  Attachment,
  SubmissionMetadata,
  PaginatedSubmissions,
  FormsListResponse,
  CreateFormInput,
  UpdateFormInput,
  UpdateSubmissionInput,
  GetSubmissionsOptions,
  ApiError,
} from './types'

// API Client (for advanced use cases)
export {
  createApiClient,
  AifeaturesApiError,
  type AifeaturesApiClient,
} from './lib/api'
