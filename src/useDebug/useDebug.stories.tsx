import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Box, Button, Typography, Monospace } from '@committed/components'
import { useDebug } from '.'
import { useBoolean } from '../useBoolean/useBoolean'

export interface UseDebugDocsProps {
  /** the name for this component instance */
  name: string
  /** the props for the component */
  props: Record<string, any>
  /**  state the state for the component */
  state: Record<string, any>
}

/**
 * useDebug hook will log props and state changes to help identify the cause and frequency of component updates, when not in `production`.
 */
export const UseDebugDocs: React.FC<UseDebugDocsProps> = () => null

export default {
  title: 'Hooks/useDebug',
  component: UseDebugDocs,
  excludeStories: ['UseDebugDocs'],
  argTypes: {
    name: { control: null },
    props: { control: null },
    state: { control: null },
  },
} as Meta

const Debugged: React.FC<{ token: boolean }> = (props) => {
  const [flag, { toggle }] = useBoolean()
  const state = { flag }
  useDebug('Default story', props, state)
  return (
    <>
      <Typography>
        Change will cause console log messages similar to:
      </Typography>
      <Monospace>
        {`Default story updated: props ${JSON.stringify(
          props
        )} state ${JSON.stringify(state)}`}
      </Monospace>
      <Box display="inline">
        <Button mt={2} color="primary" onClick={toggle}>
          Change State
        </Button>
      </Box>
    </>
  )
}

const Template: Story<UseDebugDocsProps> = ({}) => {
  // const Debugged: React.FC<{ token: boolean }> = (props) => {
  //   const [flag, { toggle }] = useBoolean()
  //   const state = { flag }
  //   useDebug('Default story', props, state)
  //   return (
  //     <>
  //       <Typography>Props:</Typography>
  //       <Monospace>{JSON.stringify(props)}</Monospace>
  //       <Typography>State:</Typography>
  //       <Monospace>{JSON.stringify(state)}</Monospace>

  //       <Box display="inline">
  //         <Button m={2} color="primary" onClick={toggle}>
  //           Change State
  //         </Button>
  //       </Box>
  //     </>
  //   )
  // }

  const [token, { toggle }] = useBoolean()
  return (
    <>
      <Debugged token={token} />
      <Box display="inline">
        <Button ml={2} mt={2} color="primary" onClick={toggle}>
          Change Props
        </Button>
      </Box>
    </>
  )
}

export const Default = Template.bind({})
Default.args = {}
