import React from 'react'
import { Story, Meta } from '@storybook/react'
import { FormControlLabel, Checkbox, Typography } from '@committed/components'
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
 * __Note:__ You need to popout the stories so they are not in a nested iFrame to see the title changes.
 */
export const UseTitleDocs = () => null

export default {
  title: 'Hooks/useTitle',
  component: UseTitleDocs,
  excludeStories: ['UseTitleDocs'],
} as Meta

const Template: Story<UseTitleDocsProps> = ({ title, options }) => {
  const TitleDemo: React.FC<UseTitleDocsProps> = ({ title, options }) => {
    useTitle(title, options)
    return (
      <Typography>
        {options?.append
          ? `Appending ${options?.separator ?? ''}${title} to title`
          : `Setting ${title} to title`}
      </Typography>
    )
  }

  const [show, { toggle }] = useBoolean(false)
  return (
    <>
      <FormControlLabel
        value="top"
        control={<Checkbox color="primary" value={show} onChange={toggle} />}
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
        'Use the append and separator options to append the given string to the current title',
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
        'Use the retain option to keep the title setting even after the component has unmounted.',
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
    <>
      <FormControlLabel
        value="top"
        disabled={showTwo}
        control={
          <Checkbox color="primary" value={showOne} onChange={toggleOne} />
        }
        label={showOne ? 'Unmount' : 'Mount One'}
      />
      <FormControlLabel
        value="top"
        disabled={!showOne || (showOne && showThree)}
        control={
          <Checkbox color="primary" value={showTwo} onChange={toggleTwo} />
        }
        label={showTwo ? 'Unmount' : 'Mount Two'}
      />
      <FormControlLabel
        value="top"
        disabled={!showTwo}
        control={
          <Checkbox color="primary" value={showThree} onChange={toggleThree} />
        }
        label={showThree ? 'Unmount' : 'Mount Three'}
      />
      <Typography>
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
      </Typography>
    </>
  )
}
Breadcrumbs.parameters = {
  docs: {
    description: {
      story: `Can be used with append to create breadcrumbs.

__Note__ mount order is important. Use a context if mount order can not be controlled properly.`,
    },
  },
}
