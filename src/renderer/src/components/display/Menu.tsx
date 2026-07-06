// components/IndicatorMenu.tsx
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button' // Ajustez le chemin selon votre projet
import { Eye, MenuKebab1, Pencil1, Trash1 } from '@tailgrids/icons'
import { cn } from '@/utils/cn'

interface IndicatorMenuProps {
  onView: () => void
  onEdit?: () => void
  onDelete: () => void
  className?: string
}

export function IndicatorMenu({
  onView,
  onEdit,
  onDelete,
  className
}: IndicatorMenuProps): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <Button
        iconOnly
        variant="ghost"
        appearance="fill"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="size-8 rounded-lg grid place-items-center text-text-tertiary hover:bg-background-soft-100 hover:text-title-50 transition-colors"
      >
        <MenuKebab1 className="size-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-base-200 bg-background-50 shadow-md py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              onView()
              setOpen(false)
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground-soft-500 hover:bg-background-soft-100 hover:text-title-50 transition-colors"
          >
            <Eye className="size-3.5" />
            Voir
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onEdit()
                setOpen(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground-soft-500 hover:bg-background-soft-100 hover:text-title-50 transition-colors"
            >
              <Pencil1 className="size-3.5" />
              Modifier
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onDelete()
              setOpen(false)
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error-500 hover:bg-error-50 transition-colors"
          >
            <Trash1 className="size-3.5" />
            Supprimer
          </button>
        </div>
      )}
    </div>
  )
}
