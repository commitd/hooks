import { Button, Column, Monospace, Row, Text } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React from 'react'
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

const Debugged: React.FC<{ token: boolean; toggleToken: () => void }> = (
  props
) => {
  const [flag, { toggle: toggleFlag }] = useBoolean()
  const state = { flag }
  const { token, toggleToken } = props
  useDebug('Default story', props, state)
  return (
    <Column gap>
      <Text>Change will cause console log messages similar to:</Text>
      <Monospace>
        {`Default story updated: props ${JSON.stringify({
          token,
        })} state ${JSON.stringify(state)}`}
      </Monospace>
      <Row gap>
        <Button variant="primary" onClick={toggleToken}>
          Change props
        </Button>
        <Button variant="primary" onClick={toggleFlag}>
          Change State
        </Button>
      </Row>
    </Column>
  )
}

const Template: Story<UseDebugDocsProps> = (props) => {
  // Shown inline so you can see it in the ShowCode
  // const Debugged: React.FC<{ token: boolean; toggleToken: () => void }> = (
  //   props
  // ) => {
  //   const [flag, { toggle: toggleFlag }] = useBoolean()
  //   const state = { flag }
  //   const { token, toggleToken } = props
  //   useDebug('Default story', props, state)
  //   return (
  //     <Column gap>
  //       <Text>Change will cause console log messages similar to:</Text>
  //       <Monospace>
  //         {`Default story updated: props ${JSON.stringify({
  //           token,
  //         })} state ${JSON.stringify(state)}`}
  //       </Monospace>
  //       <Row gap>
  //         <Button variant="primary" onClick={toggleToken}>
  //           Change props
  //         </Button>
  //         <Button variant="primary" onClick={toggleFlag}>
  //           Change State
  //         </Button>
  //       </Row>
  //     </Column>
  //   )
  // }

  const [token, { toggle }] = useBoolean()
  return <Debugged token={token} toggleToken={toggle} />
}

export const Default = Template.bind({})
Default.args = {}
