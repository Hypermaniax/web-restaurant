import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from './page-header'

interface CategoriesHeaderProps {
  onCreate: () => void
}

export function CategoriesHeader({ onCreate }: CategoriesHeaderProps) {
  return (
    <PageHeader
      eyebrow="Katalog"
      title="Kategori menu"
      description="Atur urutan dan status kategori. Kategori nonaktif tidak tampil di menu customer."
      actions={
        <Button variant="accent" onClick={onCreate}>
          <Plus />
          Tambah kategori
        </Button>
      }
    />
  )
}
