import { Column, Input, Text } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React, { useRef } from 'react'
import { useBoolean, useHover, useKeyboard } from '../'
import { useMergedRefs } from './useMergedRefs'

export interface UseMergedRefsDocsProps<T> {
  /** spread array of refs to be merged, T extends `HTMLElement` */
  refs?: Array<
    React.RefCallback<T> | React.MutableRefObject<T> | undefined | null
  >
}

/**
 * useMergedRefs merges the passed refs into a single memoized ref function.
 *
 * ```ts
 * const ExampleComponent = React.forwardRef((props, forwardedRef) => {
 *   const ref = React.useRef();
 *   return <div {...props} ref={useMergeRefs(ref, forwardedRef)} />;
 * });
 * ```
 *
 * @param refs spread array of refs to be merged
 */
export const UseMergedRefsDocs = <T extends HTMLElement>(
  props: UseMergedRefsDocsProps<T>
) => null

export default {
  title: 'Hooks/useMergedRefs',
  component: UseMergedRefsDocs,
  excludeStories: ['UseMergedRefsDocs'],
} as Meta

const ExampleComponent = React.forwardRef<HTMLInputElement>(
  (props, forwardedRef) => {
    const internalRef = React.useRef<HTMLInputElement>(null)
    const [isHovered] = useHover(internalRef)
    const mergedRef = useMergedRefs<HTMLInputElement>(forwardedRef, internalRef)

    return (
      <Input
        css={{
          color: isHovered ? '$primary' : '$primaryContrast',
        }}
        ref={mergedRef}
      />
    )
  }
)

const Template: Story = () => {
  // const ExampleComponent = React.forwardRef<HTMLInputElement>(
  //   (props, forwardedRef) => {
  //     const internalRef = React.useRef<HTMLInputElement>(null)
  //     const [isHovered] = useHover(internalRef)
  //     const mergedRef = useMergedRefs<HTMLInputElement>(forwardedRef, internalRef)
  //
  //     return (
  //       <Input
  //         css={{
  //           color: isHovered ? '$primary' : '$primaryContrast',
  //         }}
  //         ref={mergedRef}
  //       />
  //     )
  //   }
  // )

  const externalRef = useRef<HTMLInputElement>(null)

  const [typing, { setTrue, setFalse }] = useBoolean(false)
  useKeyboard('', setFalse, { event: 'keyup', element: externalRef })
  useKeyboard('', setTrue, { event: 'keydown', element: externalRef })

  return (
    <Column gap>
      <ExampleComponent ref={externalRef} />
      <Text>{typing ? 'Typing...' : ``}</Text>
    </Column>
  )
}

export const Default = Template.bind({})
