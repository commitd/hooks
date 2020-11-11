import React from 'react'
import { ThemeProvider } from '@committed/components'

/**
 * Wrap a component with the default ThemeProvider
 *
 * @param {*} Story storybook component to wrap
 */
export const withTheme = (Story) => {
  return (
    <ThemeProvider choice="light">
      <Story />
    </ThemeProvider>
  )
}
