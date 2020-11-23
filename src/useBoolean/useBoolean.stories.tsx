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
import { useBoolean } from '.'

export interface UseBooleanDocsProps {
  /** The start state for the toggle */
  defaultValue: boolean
}

/**
 * Utility hook for boolean state
 *
 * returns the value, an object containing function for toggle, setTrue and setFalse.
 *
 * __Use `toggle` with caution__, attaching to buttons can cause unintended consequences from double clicks.
 */
export const UseBooleanDocs: React.FC<UseBooleanDocsProps> = (
  _props: UseBooleanDocsProps
) => null
UseBooleanDocs.defaultProps = { defaultValue: true }

export default {
  title: 'Hooks/useBoolean',
  component: UseBooleanDocs,
  excludeStories: ['UseBooleanDocs'],
} as Meta

const Template: Story<UseBooleanDocsProps> = ({ defaultValue }) => {
  const [spin, { toggle, setTrue, setFalse }] = useBoolean(defaultValue)
  return (
    <>
      <Button color="primary" onClick={toggle}>
        Toggle
      </Button>
      <Button disabled={spin} ml={2} color="secondary" onClick={setTrue}>
        Start
      </Button>
      <Button disabled={!spin} ml={2} color="secondary" onClick={setFalse}>
        Stop
      </Button>
      <Loader variant="spin" loading={spin} />
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
  const [animate, { setTrue: start, setFalse: stop }] = useBoolean(false)

  const [variant, setVariant] = React.useState<Variants>('spin' as Variants)

  return (
    <>
      <Row>
        <Button disabled={animate} color="primary" onClick={start}>
          Start
        </Button>
        <Button disabled={!animate} ml={2} color="primary" onClick={stop}>
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
        'The `setTrue` and `setFalse` functions can be used in `onClick` directly',
    },
  },
}
