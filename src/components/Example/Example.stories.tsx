import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Example } from '.'

export default {
  title: 'Components/Example',
  component: Example,
} as Meta

export const Default: React.FC = () => {
  return <Example />
}

const Template: Story = (args) => <Example {...args} />

export const Primary = Template.bind({})
Primary.args = {}
