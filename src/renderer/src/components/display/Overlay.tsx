import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { LoaderAreas } from '@/constants'

type Props = {
  visible: boolean
  text?: string
  isDeleting?: boolean
  area?: LoaderAreas
  className?: string
  children: ReactNode
}

function PulseLoader({ isDeleting }: { isDeleting?: boolean }): React.JSX.Element {
  return (
    <div className="flex items-end gap-1">
      <span
        className={cn(
          'h-2 w-2 rounded-full animate-bounce-smooth',
          isDeleting ? 'bg-red-500' : 'bg-primary-500'
        )}
        style={{ animationDelay: '0ms' }}
      />
      <span
        className={cn(
          'h-2 w-2 rounded-full animate-bounce-smooth',
          isDeleting ? 'bg-red-500' : 'bg-primary-500'
        )}
        style={{ animationDelay: '120ms' }}
      />
      <span
        className={cn(
          'h-2 w-2 rounded-full animate-bounce-smooth',
          isDeleting ? 'bg-red-500' : 'bg-primary-500'
        )}
        style={{ animationDelay: '240ms' }}
      />
    </div>
  )
}

export function Overlay({
  visible,
  text = 'Processing...',
  isDeleting = false,
  area = LoaderAreas.BODY,
  className,
  children
}: Props): React.JSX.Element {
  return (
    <>
      {/* BODY OVERLAY */}
      {visible && area === LoaderAreas.BODY && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center bg-foreground-100/30 backdrop-blur-xs',
            className
          )}
        >
          {/* Floating card */}
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-8 py-6 shadow-xl backdrop-blur-xl">
            <PulseLoader isDeleting={isDeleting} />

            <div className="h-px w-24 bg-white/10" />

            <p className="text-sm font-medium text-white/80">{text}</p>
          </div>
        </div>
      )}

      {/* SLOT MODE */}
      <div className="relative">
        {children}

        {visible && area === LoaderAreas.SLOT && (
          <div
            className={cn(
              'absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm',
              className
            )}
          >
            <div className="flex items-center gap-3 rounded-full border border-base-200 bg-white px-4 py-2 shadow-sm">
              <PulseLoader isDeleting={isDeleting} />

              <span className="text-xs font-medium text-title-50/70">{text}</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
