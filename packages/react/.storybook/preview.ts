import type { Preview } from '@storybook/react'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { handlers } from './mocks/handlers'

// Initialize MSW
initialize({
  onUnhandledRequest: 'bypass',
})

// Export handlers for use in stories
export { handlers }

const preview: Preview = {
  parameters: {
    msw: {
      handlers,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
}

export default preview
