<p align="center">
  <strong>aifeatures</strong>
</p>

<p align="center">
  Backend features your AI can provision
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@aifeatures/admin-react">
    <img alt="npm" src="https://img.shields.io/npm/v/@aifeatures/admin-react?color=blue" />
  </a>
  <a href="https://github.com/landingsite-ai/aifeatures-js/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-blue" />
  </a>
</p>

---

## What is aifeatures?

When AI generates a website, it shouldn't stop at the frontend. **aifeatures** provides the backend APIs that AI agents can call to provision real functionality—form endpoints, email forwarding, spam protection—without users signing up for third-party services.

This monorepo contains the official JavaScript/TypeScript SDKs for aifeatures.

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`@aifeatures/admin-react`](./packages/admin-react) | React components for managing forms and submissions | [![npm](https://img.shields.io/npm/v/@aifeatures/admin-react?color=blue)](https://www.npmjs.com/package/@aifeatures/admin-react) |

## Getting Started

### 1. Install the package

```bash
npm install @aifeatures/admin-react
```

### 2. Import the styles

```tsx
import '@aifeatures/admin-react/styles.css'
```

### 3. Add the provider and components

```tsx
import { AifeaturesProvider, FormsDashboard } from '@aifeatures/admin-react'

function FormsSettings({ siteToken }) {
  return (
    <AifeaturesProvider siteToken={siteToken}>
      <FormsDashboard />
    </AifeaturesProvider>
  )
}
```

That's it! The `FormsDashboard` component handles everything: listing forms, viewing submissions, editing settings, and more.

## Components

### FormsDashboard

All-in-one dashboard for managing forms and submissions.

```tsx
<AifeaturesProvider siteToken={siteToken}>
  <FormsDashboard />
</AifeaturesProvider>
```

### Individual Components

For more control, use the individual components:

```tsx
import {
  AifeaturesProvider,
  FormsList,
  FormSubmissions,
  FormSettings,
  SubmissionDetail,
} from '@aifeatures/admin-react'

// List all forms
<FormsList onSelectForm={(form) => setSelectedForm(form)} />

// Show submissions for a form
<FormSubmissions formId={selectedForm.id} />

// Edit form settings
<FormSettings formId={selectedForm.id} />

// View a single submission
<SubmissionDetail
  submission={selectedSubmission}
  open={!!selectedSubmission}
  onOpenChange={() => setSelectedSubmission(null)}
/>
```

## Hooks

Access the aifeatures API directly with hooks:

```tsx
import { useForms, useSubmissions, useAifeatures } from '@aifeatures/admin-react'

function MyComponent() {
  // Fetch forms
  const { forms, isLoading, error, refetch } = useForms()

  // Fetch submissions for a form
  const { submissions, total, fetchMore } = useSubmissions(formId, {
    limit: 25,
    includeSpam: false,
  })

  // Access the API client directly
  const { api } = useAifeatures()
  const handleDelete = () => api.deleteSubmission(submissionId)
}
```

## Theming

Components use CSS variables and work with any design system. They're built on shadcn/ui patterns.

### Dark Mode

```tsx
<AifeaturesProvider siteToken={siteToken} dark>
  <FormsDashboard />
</AifeaturesProvider>
```

### Custom Styling

Pass className to customize:

```tsx
<AifeaturesProvider siteToken={siteToken} className="my-custom-theme">
  <FormsDashboard />
</AifeaturesProvider>
```

## Development

### Prerequisites

- Node.js 20+
- pnpm 8+

### Setup

```bash
# Clone the repo
git clone https://github.com/landingsite-ai/aifeatures-js.git
cd aifeatures-js

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Working on admin-react

```bash
cd packages/admin-react

# Start Storybook for isolated development
pnpm storybook

# Run type checking
pnpm typecheck

# Build the package
pnpm build
```

### Linking for Local Development

To test changes in another project (like landingsite-app):

```bash
# In aifeatures-js/packages/admin-react
pnpm build
pnpm link --global

# In your consuming project
pnpm link --global @aifeatures/admin-react
```

### Publishing

```bash
cd packages/admin-react

# Build and publish
pnpm build
npm publish --access public
```

## API Reference

The SDK talks to the aifeatures API at `https://aifeatures.dev` (configurable via `apiUrl` prop).

### Authentication

Pass a site token (`st_xxx`) to the provider. Site tokens are scoped to a single site and can only access that site's forms and submissions.

```tsx
<AifeaturesProvider
  siteToken="st_xxx"
  apiUrl="https://aifeatures.dev"  // Optional, this is the default
>
  {children}
</AifeaturesProvider>
```

### Token Validation

The provider validates tokens and shows helpful errors:

- No token provided
- Organization API key (`sk_xxx`) used instead of site token
- Invalid token format

## License

MIT
