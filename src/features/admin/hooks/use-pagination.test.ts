import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePagination } from './use-pagination'

describe('usePagination', () => {
  it('starts on page 1 with the default page size', () => {
    const { result } = renderHook(() => usePagination())

    expect(result.current.page).toBe(1)
    expect(result.current.pageSize).toBe(20)
  })

  it('resets to page 1 when the page size changes', () => {
    const { result } = renderHook(() => usePagination())

    act(() => result.current.paginationProps.onPageChange(3))
    act(() => result.current.paginationProps.onPageSizeChange(50))

    expect(result.current.page).toBe(1)
    expect(result.current.pageSize).toBe(50)
  })

  it('exposes a reset function for filter changes', () => {
    const { result } = renderHook(() => usePagination(10))

    act(() => result.current.paginationProps.onPageChange(4))
    act(() => result.current.resetPage())

    expect(result.current.page).toBe(1)
    expect(result.current.pageSize).toBe(10)
  })
})
