import { act, renderHook } from '@testing-library/react-hooks'
import { usePagination } from './usePagination'

test('should start in given state', () => {
  const { result } = renderHook(() => usePagination())
  const {
    page,
    totalPages,
    startIndex,
    endIndex,
    pageSize,
    isPreviousDisabled,
    isNextDisabled,
  } = result.current
  expect(page).toBe(1)
  expect(totalPages).toBe(0)
  expect(startIndex).toBe(0)
  expect(endIndex).toBe(0)
  expect(pageSize).toBe(20)
  expect(isNextDisabled).toBe(false)
  expect(isPreviousDisabled).toBe(true)
})

test('should start using the provided start state', () => {
  const { result } = renderHook(() =>
    usePagination({ page: 5, totalItems: 100, pageSize: 10 })
  )
  const {
    page,
    totalPages,
    startIndex,
    endIndex,
    pageSize,
    isPreviousDisabled,
    isNextDisabled,
  } = result.current
  expect(page).toBe(5)
  expect(totalPages).toBe(10)
  expect(startIndex).toBe(40)
  expect(endIndex).toBe(50)
  expect(pageSize).toBe(10)
  expect(isNextDisabled).toBe(false)
  expect(isPreviousDisabled).toBe(false)
})

test('can set page', () => {
  const { result } = renderHook(() =>
    usePagination({ totalItems: 100, pageSize: 10 })
  )

  act(() => {
    result.current.setNextPage()
  })

  expect(result.current.page).toBe(2)
  expect(result.current.startIndex).toBe(10)
  expect(result.current.endIndex).toBe(20)

  act(() => {
    result.current.setPage(5)
  })

  expect(result.current.page).toBe(5)
  expect(result.current.startIndex).toBe(40)
  expect(result.current.endIndex).toBe(50)

  act(() => {
    result.current.setPreviousPage()
  })

  expect(result.current.page).toBe(4)
  expect(result.current.startIndex).toBe(30)
  expect(result.current.endIndex).toBe(40)
})

test('can not set page too high', () => {
  const { result } = renderHook(() =>
    usePagination({ page: 10, totalItems: 100, pageSize: 10 })
  )
  expect(result.current.page).toBe(10)

  act(() => {
    result.current.setNextPage()
  })
  expect(result.current.page).toBe(10)

  act(() => {
    result.current.setPage(20)
  })
  expect(result.current.page).toBe(10)
})

test('can not set page too low', () => {
  const { result } = renderHook(() =>
    usePagination({ page: 1, totalItems: 100, pageSize: 10 })
  )
  expect(result.current.page).toBe(1)

  act(() => {
    result.current.setPreviousPage()
  })
  expect(result.current.page).toBe(1)

  act(() => {
    result.current.setPage(-20)
  })
  expect(result.current.page).toBe(1)
})

test('can set page size', () => {
  const { result } = renderHook(() =>
    usePagination({ page: 10, totalItems: 100, pageSize: 10 })
  )

  act(() => {
    result.current.setPageSize(20)
  })

  expect(result.current.page).toBe(5)
  expect(result.current.pageSize).toBe(20)
})

test('can set total items', () => {
  const { result } = renderHook(() =>
    usePagination({ page: 10, totalItems: 100, pageSize: 10 })
  )

  act(() => {
    result.current.setTotalItems(200)
  })

  expect(result.current.page).toBe(10)
  expect(result.current.totalPages).toBe(20)
})
