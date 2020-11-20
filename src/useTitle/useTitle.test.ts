import { renderHook } from '@testing-library/react-hooks'
import { useTitle } from '.'

beforeEach(() => {
  document.title = 'Before'
})

test('Should Set the title when mounted', () => {
  const { unmount } = renderHook(() => useTitle('test'))
  expect(document.title).toEqual('test')

  unmount()

  expect(document.title).toEqual('Before')
})

test('Should Retain the title when mounted if set in options', () => {
  const { unmount } = renderHook(() => useTitle('test', { retain: true }))
  expect(document.title).toEqual('test')

  unmount()

  expect(document.title).toEqual('test')
})

test('Should Append to the title when mounted when using append option', () => {
  const { unmount } = renderHook(() => useTitle('test', { append: true }))
  expect(document.title).toEqual('Beforetest')

  unmount()

  expect(document.title).toEqual('Before')
})

test('Should Append with separator and retain with full options', () => {
  const { unmount } = renderHook(() =>
    useTitle('test', { retain: true, append: true, separator: ' > ' })
  )
  expect(document.title).toEqual('Before > test')

  unmount()

  expect(document.title).toEqual('Before > test')
})
