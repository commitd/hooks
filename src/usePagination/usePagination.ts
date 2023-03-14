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
  /** The total items */
  totalItems: number
}

const defaultOptions = {
  totalItems: 0,
  pageSize: 20,
}

/**
 * Utility hook for handling pagination state
 *
 * returns the current page and functions to manipulate.
 *
 */
export function usePagination<T = void>({
  queryCallback,
  totalItems: propTotalItems = defaultOptions.totalItems,
  pageSize: propPageSize = defaultOptions.pageSize,
}: Partial<{
  totalItems: number
  pageSize: number
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
  const [page, setPageInternal] = useState(1)

  const [data, setDataInternal] = useState({
    totalItems: Math.max(propTotalItems, 0),
    pageSize: Math.max(propPageSize, 1),
  })

  const setData = useCallback(
    (
      newData: Partial<{
        totalItems: number
        pageSize: number
      }>
    ) => {
      setDataInternal((current) => ({
        pageSize: Math.max(1, newData.pageSize ?? current.pageSize),
        totalItems: Math.max(0, newData.totalItems ?? current.totalItems),
      }))
    },
    [setDataInternal]
  )
  const setTotalItems = useCallback(
    (totalItems: number) => {
      setData({ totalItems })
    },
    [setData]
  )

  const setPageSize = useCallback(
    (pageSize: number) => {
      setData({ pageSize })
    },
    [setData]
  )

  const savedCallback = useRef<(data: PaginationData) => T>(
    queryCallback ?? (() => undefined as T)
  )

  useEffect(() => {
    setData({
      totalItems: propTotalItems,
      pageSize: propPageSize,
    })
  }, [propTotalItems, propPageSize, setData])

  useEffect(() => {
    savedCallback.current = queryCallback ?? (() => undefined as T)
  }, [queryCallback])

  const {
    totalPages,
    startIndex,
    endIndex,
    isNextDisabled,
    isPreviousDisabled,
  } = useMemo(
    () => getDerivedData(data.totalItems, data.pageSize, page),
    [page, data]
  )

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
    setPageInternal((page) => Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const query = useMemo(() => {
    const callback = savedCallback.current
    return callback({
      page,
      ...data,
      totalPages,
      startIndex,
      endIndex,
      isNextDisabled,
      isPreviousDisabled,
    })
  }, [
    page,
    data,
    totalPages,
    startIndex,
    endIndex,
    isNextDisabled,
    isPreviousDisabled,
  ])

  return {
    page,
    pageSize: data.pageSize,
    totalItems: data.totalItems,
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
