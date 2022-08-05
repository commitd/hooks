import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { useMergedRefs } from '.'

test('Should provide initial null', () => {
  const { result: first } = renderHook(() => useMergedRefs())
  expect(first.current).toBeNull()
})
test('Should be null if all supplied null', () => {
  const { result: first } = renderHook(() => useMergedRefs(null, null))
  expect(first.current).toBeNull()
})

test('useMergedRefs should merge the refs', () => {
  const testVal = true
  const refAsFunc = jest.fn()
  const refAsObj = { current: undefined }

  const { result: first } = renderHook(() => useMergedRefs(refAsFunc, refAsObj))
  expect(first.current).not.toBeNull()

  first.current?.(testVal)

  expect(refAsFunc).toHaveBeenCalledTimes(1)
  expect(refAsFunc).toHaveBeenCalledWith(testVal)
  expect(refAsObj.current).toBe(testVal)
})

test('useMergedRefs should not fail if invalid values', () => {
  const refAsInvalid = { invalid: undefined }

  const { result: first } = renderHook(() =>
    useMergedRefs(null, (refAsInvalid as unknown) as React.Ref<string>)
  )
  // Would be valid if null here
  expect(first.current).not.toBeNull()

  // should not throw
  first.current?.('testVal')
})
