import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Row, CheckToken, Column } from '@committed/components'
import { useFavicon } from '.'

export interface UseFaviconDocsProps {
  /** The href of the favicon */
  href: string
  /** The options for the favicon */
  options?: {
    /** Set true to keep the favicon even after the component has unmounted */
    retain?: boolean
  }
}

/**
 * useFavicon changes (or creates) the favicon for the given href.
 *
 * See __Example__  (<a href="iframe.html?id=hooks-usefavicon--example&viewMode=story" target="_blank" rel="noopener">Popout</a>) to see favicon changing!
 * See __Retain__ (<a href="iframe.html?id=hooks-usefavicon--retain&viewMode=story" target="_blank" rel="noopener">Popout</a>) to see favicon retained!
 */
export const UseFaviconDocs: React.FC<UseFaviconDocsProps> = () => null

export default {
  title: 'Hooks/useFavicon',
  component: UseFaviconDocs,
  excludeStories: ['UseFaviconDocs'],
  argTypes: {
    href: {},
    options: { control: null },
  },
} as Meta

const Template: Story<UseFaviconDocsProps> = ({ href }) => {
  useFavicon(href)
  return <img src={href} alt="favicon" />
}

export const Default = Template.bind({})
Default.args = {
  href: 'https://committed.io/Logo.svg',
}

const Favicon: React.FC<{ href: string; retain: boolean }> = ({
  href,
  retain,
}) => {
  useFavicon(href, { retain })
  return null
}

const RetainTemplate: Story<{ retain: boolean }> = ({ retain }) => {
  // const Favicon: React.FC<{ href: string, retain: boolean }> = ({ href, retain }) => {
  //   useFavicon(href, { retain })
  //   return null
  // }

  // Set parent with favicon
  useFavicon('https://storybook.js.org/images/logos/icon-storybook.png')
  const [href, setHref] = React.useState<string | null>(null)
  return (
    <>
      <Row justifyContent="center">
        <CheckToken
          selected={'https://committed.io/Logo.svg' === href}
          color="primary"
          mr={2}
          onClick={() => setHref('https://committed.io/Logo.svg')}
        >
          Committed
        </CheckToken>
        <CheckToken
          selected={
            'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/solid/cloud-upload-alt.svg' ===
            href
          }
          color="primary"
          mr={2}
          onClick={() =>
            setHref(
              'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/solid/cloud-upload-alt.svg'
            )
          }
        >
          FontAwesome
        </CheckToken>
        <CheckToken
          selected={null === href}
          color="primary"
          mr={2}
          onClick={() => setHref(null)}
        >
          Unmounted
        </CheckToken>
      </Row>
      <Column m={2} alignItems="center">
        {href == null ? (
          `No child useFavicon retain: ${retain}`
        ) : (
          <>
            <img src={href} alt="favicon" />
            <Favicon href={href} retain={retain} />
          </>
        )}
      </Column>
    </>
  )
}

export const Example = RetainTemplate.bind({})
Example.args = {
  retain: false,
}
Example.parameters = {
  docs: {
    description: {
      story:
        'This example shows how the icon is restored on unmount by default',
    },
  },
}
export const Retain = RetainTemplate.bind({})
Retain.args = {
  retain: true,
}
Retain.parameters = {
  docs: {
    description: {
      story:
        'This example shows how the icon is retained on unmount if `retain` is declared in the options',
    },
  },
}
