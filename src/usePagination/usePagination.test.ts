import { act, renderHook } from '@testing-library/react-hooks'
import { PaginationData, usePagination } from './usePagination'

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
    usePagination({ totalItems: 100, pageSize: 10 })
  )
  const {
    page,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    pageSize,
    isPreviousDisabled,
    isNextDisabled,
  } = result.current
  expect(page).toBe(1)
  expect(pageSize).toBe(10)
  expect(totalItems).toBe(100)
  expect(totalPages).toBe(10)
  expect(startIndex).toBe(0)
  expect(endIndex).toBe(10)
  expect(isNextDisabled).toBe(false)
  expect(isPreviousDisabled).toBe(true)
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
    usePagination({ totalItems: 100, pageSize: 10 })
  )
  expect(result.current.page).toBe(1)

  act(() => {
    result.current.setPage(10)
  })

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
    usePagination({ totalItems: 100, pageSize: 10 })
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
    usePagination({ totalItems: 100, pageSize: 10 })
  )

  act(() => {
    result.current.setPageSize(20)
  })

  expect(result.current.page).toBe(1)
  expect(result.current.pageSize).toBe(20)
})

test('can set total items', () => {
  const { result } = renderHook(() =>
    usePagination({ totalItems: 100, pageSize: 10 })
  )

  act(() => {
    result.current.setTotalItems(200)
  })

  expect(result.current.page).toBe(1)
  expect(result.current.totalPages).toBe(20)
})

test('can update query', () => {
  const queryCallback = ({ pageSize, startIndex }: PaginationData) => ({
    take: pageSize,
    skip: startIndex,
  })
  const { result, rerender } = renderHook(() =>
    usePagination({
      totalItems: 100,
      pageSize: 10,
      queryCallback,
    })
  )

  expect(result.current.query).toStrictEqual({ take: 10, skip: 0 })

  act(() => {
    result.current.setPage(3)
  })

  const previous = result.current.query
  expect(previous).toStrictEqual({ take: 10, skip: 20 })

  // check rerender does not change the query
  rerender({
    totalItems: 100,
    pageSize: 10,
    queryCallback,
  })

  expect(result.current.query).toBe(previous)
})

test('can update total items', async () => {
  const { result, rerender } = renderHook(usePagination, {
    initialProps: { totalItems: 100, pageSize: 10 },
  })
  act(() => {
    result.current.setPage(2)
  })

  expect(result.current.page).toBe(2)
  expect(result.current.totalPages).toBe(10)
  expect(result.current.startIndex).toBe(10)
  expect(result.current.endIndex).toBe(20)

  act(() => rerender({ totalItems: 200, pageSize: 15 }))

  expect(result.current.page).toBe(2)
  expect(result.current.totalPages).toBe(14)
  expect(result.current.startIndex).toBe(15)
  expect(result.current.endIndex).toBe(30)
})
