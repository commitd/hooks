import { committedDark, committedLight } from './committed/theme.js'
import { withTheme } from './committed/withTheme'
import { DocsContainer } from './components/DocsContainer'

export const decorators = [withTheme]

export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  options: {
    storySort: {
      order: ['Introduction', 'Hooks'],
    },
  },
  docs: {
    source: { type: 'code' },
    container: DocsContainer,
  },
  darkMode: {
    dark: committedDark,
    light: committedLight,
  },
}
