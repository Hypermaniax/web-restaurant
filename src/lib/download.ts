import { apiRequest } from '@/lib/api/client'

export async function downloadFile(
  path: string,
  filename: string,
): Promise<void> {
  const blob = await apiRequest<Blob>(path, { responseType: 'blob' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
