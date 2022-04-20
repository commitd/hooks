import { Checkbox, Column, Monospace, Paragraph } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { useTitle } from '.'
import { useBoolean } from '../useBoolean'

export interface UseTitleDocsProps {
  /** The string to set the title to or to be appended. */
  title: string
  options?: {
    /** Set true to append the given string to the current title */
    append?: boolean
    /** Set true to keep the title even after the component has unmounted */
    retain?: boolean
    /** The separator to use when appending */
    separator?: string
  }
}

/**
 * useTitle hook allows you to control the document title from your component.
 *
 * ### POPOUT !
 *
 * >  You need to <a href="iframe.html?id=hooks-usetitle--default&viewMode=story" target="_blank" rel="noopener">popout</a> the stories so they are not in a nested iFrame to see the title changes.
 */
export const UseTitleDocs: React.FC<UseTitleDocsProps> = () => null

export default {
  title: 'Hooks/useTitle',
  component: UseTitleDocs,
  excludeStories: ['UseTitleDocs'],
  argTypes: {
    title: {},
    options: { control: null },
  },
} as Meta

const Template: Story<UseTitleDocsProps> = ({ title, options }) => {
  const TitleDemo: React.FC<UseTitleDocsProps> = ({ title, options }) => {
    useTitle(title, options)
    return (
      <Paragraph>
        {options?.append ? (
          <>
            Appending "
            <Monospace>
              {options?.separator ?? ''}${title}
            </Monospace>
            " to title
          </>
        ) : (
          <>
            Setting title to "<Monospace>{title}</Monospace>"
          </>
        )}
      </Paragraph>
    )
  }

  const [show, { toggle }] = useBoolean(false)
  return (
    <>
      <Checkbox
        variant="primary"
        checked={show}
        onCheckedChange={toggle}
        label={show ? 'Unmount' : 'Mount to change title'}
      />
      {show && <TitleDemo title={title} options={options} />}
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  title: 'useTitle Demo',
}

export const Append = Template.bind({})
Append.args = {
  title: 'useTitle Append',
  options: {
    append: true,
    separator: ' > ',
  },
}
Append.parameters = {
  docs: {
    description: {
      story:
        'Use the append and separator options to append the given string to the current title (<a href="iframe.html?id=hooks-usetitle--append&viewMode=story" target="_blank" rel="noopener">Popout</a>).',
    },
  },
}

export const Retain = Template.bind({})
Retain.args = {
  title: 'useTitle Retain',
  options: {
    retain: true,
  },
}
Retain.parameters = {
  docs: {
    description: {
      story:
        'Use the retain option to keep the title setting even after the component has unmounted (<a href="iframe.html?id=hooks-usetitle--retain&viewMode=story" target="_blank" rel="noopener">Popout</a>).',
    },
  },
}

const Breadcrumb: React.FC<{ title: string }> = ({ title, children }) => {
  useTitle(title, { append: true, separator: ' > ' })
  return (
    <span>
      {` > ${title}`}
      {children}
    </span>
  )
}

export const Breadcrumbs: Story = () => {
  useTitle('useTitle')
  const [showOne, { toggle: toggleOne }] = useBoolean(false)
  const [showTwo, { toggle: toggleTwo }] = useBoolean(false)
  const [showThree, { toggle: toggleThree }] = useBoolean(false)
  return (
    <Column gap>
      <Checkbox
        disabled={showTwo}
        variant="primary"
        checked={showOne}
        onCheckedChange={toggleOne}
        label={showOne ? 'Unmount' : 'Mount One'}
      />
      <Checkbox
        disabled={!showOne || (showOne && showThree)}
        variant="primary"
        checked={showTwo}
        onCheckedChange={toggleTwo}
        label={showTwo ? 'Unmount' : 'Mount Two'}
      />
      <Checkbox
        disabled={!showTwo}
        variant="primary"
        checked={showThree}
        onCheckedChange={toggleThree}
        label={showThree ? 'Unmount' : 'Mount Three'}
      />
      <Paragraph>
        useTitle
        {showOne && (
          <Breadcrumb title="First">
            {showTwo && (
              <Breadcrumb title="Second">
                {showThree && <Breadcrumb title="Third" />}
              </Breadcrumb>
            )}
          </Breadcrumb>
        )}
      </Paragraph>
    </Column>
  )
}
Breadcrumbs.parameters = {
  docs: {
    description: {
      story: `Can be used with append to create breadcrumbs (<a href="iframe.html?id=hooks-usetitle--breadcrumbs&viewMode=story" target="_blank" rel="noopener">Popout</a>).

__Note__ mount order is important. Use a context if mount order can not be controlled properly.`,
    },
  },
}
