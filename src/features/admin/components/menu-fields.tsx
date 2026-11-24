import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Category } from '../api/types'
import type { MenuValues } from '../lib/menu-form'

interface MenuFieldsProps {
  form: UseFormReturn<MenuValues>
  categories: Category[]
  onImageFileChange: (file: File | null) => void
  previewUrl: string | null | undefined
}

export function MenuFields({
  form,
  categories,
  onImageFileChange,
  previewUrl,
}: MenuFieldsProps) {
  const categoryId = useWatch({ control: form.control, name: 'categoryId' })

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="menu-name">Nama menu</Label>
          <Input
            id="menu-name"
            placeholder="Contoh: Nasi Goreng Rembuk"
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register('name')}
          />
          {form.formState.errors.name ? (
            <p className="text-destructive text-sm">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Kategori</Label>
          <Select
            value={categoryId}
            onValueChange={(value) => form.setValue('categoryId', value)}
          >
            <SelectTrigger
              aria-invalid={Boolean(form.formState.errors.categoryId)}
            >
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                    {!category.isActive ? ' · nonaktif' : ''}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {form.formState.errors.categoryId ? (
            <p className="text-destructive text-sm">
              {form.formState.errors.categoryId.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="menu-price">Harga</Label>
          <Input
            id="menu-price"
            type="number"
            min={0}
            aria-invalid={Boolean(form.formState.errors.price)}
            {...form.register('price', { valueAsNumber: true })}
          />
          {form.formState.errors.price ? (
            <p className="text-destructive text-sm">
              {form.formState.errors.price.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="menu-description">Deskripsi</Label>
          <Textarea
            id="menu-description"
            rows={3}
            placeholder="Deskripsi singkat menu"
            aria-invalid={Boolean(form.formState.errors.description)}
            {...form.register('description')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="menu-order">Urutan</Label>
          <Input
            id="menu-order"
            type="number"
            min={0}
            {...form.register('sortOrder', { valueAsNumber: true })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="menu-image">Foto menu</Label>
          <Input
            id="menu-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              onImageFileChange(event.target.files?.[0] ?? null)
            }
          />
          <p className="text-muted-foreground text-xs">
            JPEG/PNG/WebP, maksimal 2 MB.
          </p>
        </div>
      </div>

      {previewUrl ? (
        <div className="bg-muted overflow-hidden rounded-2xl border">
          <img
            src={previewUrl}
            alt="Preview menu"
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : null}
    </>
  )
}
