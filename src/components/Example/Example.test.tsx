import React from 'react'
import { render } from '../../setupTests'
import { Primary } from './Example.stories'

it('renders story', () => {
  const { asFragment } = render(<Primary />)
  expect(asFragment()).toMatchSnapshot()
})
