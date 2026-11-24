export interface PageParams {
  page?: number
  pageSize?: number
  all?: boolean
}

export function appendQuery(
  path: string,
  params: Record<string, string | number | boolean | undefined>,
): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  }

  const query = search.toString()
  return query ? `${path}?${query}` : path
}

export function toPageQuery(params: PageParams) {
  return {
    page: params.all ? undefined : (params.page ?? 1),
    pageSize: params.all ? undefined : params.pageSize,
    all: params.all,
  }
}
