import {
  Box,
  Button,
  Loader,
  LoaderProps,
  Row,
  CheckToken,
  ToggleButtonGroup,
} from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { useModal } from '.'

export interface UseModalDocsProps {
  /** The start state for the toggle */
  defaultValue: boolean
}

/**
 * Utility hook for modal state
 *
 * returns the visibility of the modal and functions to `show` and `hide`.
 *
 */
export const UseModalDocs: React.FC<UseModalDocsProps> = (
  _props: UseModalDocsProps
) => null
UseModalDocs.defaultProps = { defaultValue: true }

export default {
  title: 'Hooks/useModal',
  component: UseModalDocs,
  excludeStories: ['UseModalDocs'],
} as Meta

//TODO update story to use dialog
const Template: Story<UseModalDocsProps> = ({ defaultValue }) => {
  const [visibility, show, hide] = useModal(defaultValue)
  return (
    <>
      <Button disabled={visibility} ml={2} color="secondary" onClick={show}>
        Show
      </Button>
      <Button disabled={!visibility} ml={2} color="secondary" onClick={hide}>
        Hide
      </Button>
      {visibility && <Loader variant="spin" />}
    </>
  )
}

export const Default = Template.bind({})
Default.args = { defaultValue: false }

export const DefaultTrue = Template.bind({})
DefaultTrue.args = { defaultValue: true }

DefaultTrue.parameters = {
  docs: {
    description: {
      story: 'The default start state can be set, and defaults to `false`',
    },
  },
}

type Variants = Pick<LoaderProps, 'variant'>

export const SetState: Story = () => {
  const [animate, show, hide] = useModal(false)

  const [variant, setVariant] = React.useState<Variants>('spin' as Variants)

  return (
    <>
      <Row>
        <Button disabled={animate} color="primary" onClick={show}>
          Start
        </Button>
        <Button disabled={!animate} ml={2} color="primary" onClick={hide}>
          Stop
        </Button>
        <Box flexGrow={1} />
        <ToggleButtonGroup value={variant} exclusive>
          <CheckToken
            color="secondary"
            value="spin"
            onClick={() => setVariant('spin' as Variants)}
          >
            Spin
          </CheckToken>
          <CheckToken
            color="secondary"
            value="flip"
            onClick={() => setVariant('flip' as Variants)}
          >
            Flip
          </CheckToken>
          <CheckToken
            color="secondary"
            value="draw"
            onClick={() => setVariant('draw' as Variants)}
          >
            Draw
          </CheckToken>
          <CheckToken
            color="secondary"
            value="scale"
            onClick={() => setVariant('scale' as Variants)}
          >
            Scale
          </CheckToken>
        </ToggleButtonGroup>
      </Row>
      <Loader variant={variant} loading={animate} />
    </>
  )
}

SetState.parameters = {
  docs: {
    description: {
      story:
        'The `show` and `hide` functions can be used in `onClick` directly',
    },
  },
}
