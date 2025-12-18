import type { Meta, StoryObj } from '@storybook/react'
import { AifeaturesProvider } from './AifeaturesProvider'
import { FormsDashboard } from '../components/FormsDashboard'
import { handlers } from '../../.storybook/mocks/handlers'

const meta: Meta<typeof AifeaturesProvider> = {
  title: 'Provider/AifeaturesProvider',
  component: AifeaturesProvider,
  parameters: {
    msw: {
      handlers,
    },
  },
}

export default meta
type Story = StoryObj<typeof AifeaturesProvider>

export const ValidSiteToken: Story = {
  args: {
    siteToken: 'st_mock_token',
    children: (
      <div className="af-p-4">
        <p className="af-text-sm af-text-muted-foreground">
          Provider initialized successfully with a valid site token.
        </p>
      </div>
    ),
  },
}

export const InvalidOrgApiKey: Story = {
  args: {
    siteToken: 'sk_1234567890abcdef1234567890abcdef',
    children: <FormsDashboard />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the error when an organization API key (sk_xxx) is used instead of a site token (st_xxx).',
      },
    },
  },
}

export const NoTokenProvided: Story = {
  args: {
    siteToken: '',
    children: <FormsDashboard />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the error when no token is provided to the provider.',
      },
    },
  },
}

export const InvalidTokenFormat: Story = {
  args: {
    siteToken: 'invalid_token_format_12345',
    children: <FormsDashboard />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the error when a token with an unrecognized format is provided.',
      },
    },
  },
}

export const InvalidOrgApiKeyDarkMode: Story = {
  args: {
    siteToken: 'sk_1234567890abcdef1234567890abcdef',
    dark: true,
    children: <FormsDashboard />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state in dark mode.',
      },
    },
  },
}
