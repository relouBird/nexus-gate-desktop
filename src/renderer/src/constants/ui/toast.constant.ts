// constants/ui/toast.constant.ts
import { cn } from '@/utils/cn'

const variantClasses = {
  success: 'bg-success-500/10 text-success-500',
  error: 'bg-error-500/10 text-error-500',
  info: 'bg-info-500/10 text-info-500',
  warning: 'bg-warning-500/10 text-warning-500',
  default: 'bg-primary-500/10 text-primary-500'
} as const

export type ToastVariant = keyof typeof variantClasses

export function iconWrapperStyle({ variant = 'default' }: { variant?: ToastVariant }): string {
  return cn(
    'grid size-9 place-items-center rounded-md [&>svg]:size-6 [&>svg]:text-current',
    variantClasses[variant]
  )
}
