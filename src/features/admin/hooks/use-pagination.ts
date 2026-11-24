import { useCallback, useState } from 'react'

export function usePagination(initialPageSize = 20) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const resetPage = useCallback(() => setPage(1), [])

  const changePageSize = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  return {
    page,
    pageSize,
    resetPage,
    paginationProps: {
      onPageChange: setPage,
      onPageSizeChange: changePageSize,
    },
  }
}
