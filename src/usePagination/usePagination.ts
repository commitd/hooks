import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface PaginationData {
  /** The current page */
  page: number
  /** The total number of pages */
  totalPages: number
  /** The start index of the page */
  startIndex: number
  /** The end index of the page */
  endIndex: number
  /** Is next button disabled */
  isNextDisabled: boolean
  /** Is previous button disabled */
  isPreviousDisabled: boolean
  /** The page size */
  pageSize: number
}

/**
 * Utility hook for handling pagination state
 *
 * returns the current page and functions to manipulate.
 *
 */
export function usePagination<T = void>({
  totalItems: startTotalItems = 0,
  pageSize: startPageSize = 20,
  page: startPage = 1,
  queryCallback = () => undefined as T,
}: Partial<{
  totalItems: number
  pageSize: number
  page: number
  queryCallback: (data: PaginationData) => T
}> = {}): PaginationData & {
  query: T
  /** Set the page */
  setPage: (page: number) => void
  /** Move to the next page */
  setNextPage: () => void
  /** Move to the previous */
  setPreviousPage: () => void
  /**  Set the page size */
  setPageSize: (pageSize: number) => void
  /** set the number of items */
  setTotalItems: (totalItemsSize: number) => void
} {
  const [totalItems, setTotalItemsInternal] = useState(startTotalItems)
  const [pageSize, setPageSizeInternal] = useState(Math.max(startPageSize, 1))
  const [page, setPageInternal] = useState(Math.max(startPage, 1))

  const {
    totalPages,
    startIndex,
    endIndex,
    isNextDisabled,
    isPreviousDisabled,
  } = useMemo(
    () => getDerivedData(totalItems, pageSize, page),
    [page, pageSize, totalItems]
  )

  const setTotalItems = useCallback((newTotalItems: number) => {
    setTotalItemsInternal(Math.max(0, newTotalItems))
  }, [])

  const setPageSize = useCallback((newPageSize: number) => {
    setPageSizeInternal(Math.max(1, newPageSize))
  }, [])

  const setPage = useCallback(
    (newPage: number) => {
      setPageInternal(Math.max(1, Math.min(newPage, totalPages)))
    },
    [totalPages]
  )

  const setNextPage = useCallback(() => {
    setPage(page + 1)
  }, [page, setPage])

  const setPreviousPage = useCallback(() => {
    setPage(page - 1)
  }, [page, setPage])

  useEffect(() => {
    return () => {
      setTotalItems(startTotalItems)
    }
  }, [startTotalItems, setTotalItems])

  useEffect(() => {
    return () => {
      setPageSize(startPageSize)
    }
  }, [startPageSize, setPageSize])

  useEffect(() => {
    setPageInternal((page) => Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const savedCallback = useRef<(data: PaginationData) => T>(queryCallback)

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = queryCallback
  }, [queryCallback])

  const query = useMemo(() => {
    const callback = savedCallback.current
    return callback({
      page,
      pageSize,
      totalPages,
      startIndex,
      endIndex,
      isNextDisabled,
      isPreviousDisabled,
    })
  }, [
    page,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    isNextDisabled,
    isPreviousDisabled,
  ])

  return {
    page,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    isNextDisabled,
    isPreviousDisabled,
    query,
    setPage,
    setNextPage,
    setPreviousPage,
    setPageSize,
    setTotalItems,
  }
}

function getDerivedData(totalItems: number, pageSize: number, page: number) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = pageSize * (page - 1)
  const endIndex = Math.min(totalItems, pageSize * page)
  const isNextDisabled = page === totalPages
  const isPreviousDisabled = page === 1
  return {
    totalPages,
    startIndex,
    endIndex,
    isNextDisabled,
    isPreviousDisabled,
  }
}
