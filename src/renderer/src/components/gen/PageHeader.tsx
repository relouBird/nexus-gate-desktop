import type { IconType } from '@/types/configuration.type'
import { Plus } from '@tailgrids/icons'
import type { ReactNode } from 'react'

export type HeaderProps = {
  title: string
  description: string
  buttonName?: string
  disabled?: boolean
  icon?: IconType | ReactNode
  children?: ReactNode
  onView?: () => void
}

export function PageHeader({
  title,
  description,
  onView,
  icon,
  buttonName,
  disabled,
  children
}: HeaderProps): React.JSX.Element {
  const IconComp = icon
  return (
    <div className="relative mb-8 rounded-2xl bg-linear-to-br from-slate-50 via-white to-slate-100 px-5 py-4 border border-slate-200">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        {/* Title Section */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-900">{title}</h1>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{description}</p>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Optional children (extra buttons) */}
          {children && <div className="flex items-center gap-2 mr-2">{children}</div>}

          {/* Main Create Button */}
          {!disabled && (
            <button
              type="button"
              onClick={onView}
              className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                {IconComp && typeof IconComp === 'function' ? (
                  <IconComp size={20} className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                )}
              </span>
              <span className="tracking-wide">{buttonName ? buttonName : 'Créer'}</span>
              <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
