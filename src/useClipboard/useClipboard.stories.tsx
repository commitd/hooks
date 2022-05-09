import { Button, Row, Text, Tooltip } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { useClipboard } from '.'

export interface UseClipboardDocsProps {
  /** set to change the default timeout for notification of copy */
  timeout?: number
}

/**
 * useClipboard hook can be used to copy text to the clipboard and report.
 *
 * Returns a function to set the copied text
 */
export const UseClipboardDocs = ({ timeout = 2000 }: UseClipboardDocsProps) =>
  null

export default {
  title: 'Hooks/useClipboard',
  component: UseClipboardDocs,
  excludeStories: ['UseClipboardDocs'],
} as Meta

const Template: Story<UseClipboardDocsProps> = ({ timeout }) => {
  const { copy, copied } = useClipboard(timeout)
  const text = 'To be copied'
  return (
    <Row gap css={{ alignItems: 'baseline' }}>
      <Text>{text}</Text>
      <Tooltip open={copied} content={`Copied`}>
        <Button onClick={() => copy(text)}>Copy</Button>
      </Tooltip>
    </Row>
  )
}

export const Default = Template.bind({})
Default.args = {}
