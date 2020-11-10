import { withTheme } from './committed/withTheme'
import { committedLight } from './committed/theme'

export const decorators = [withTheme]

export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  docs: {
    theme: committedLight,
    source: { type: 'code' },
  },
}
