import { buttonStyles } from '@/constants/ui/button.constant'
import { cn } from '@/utils/cn'
import type { ComponentProps } from 'react'

type PropsType = ComponentProps<'button'> & {
  variant?: 'primary' | 'danger' | 'success' | 'ghost'
  appearance?: 'fill' | 'outline'
  iconOnly?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export function Button({
  variant,
  appearance,
  iconOnly,
  size,
  children,
  className,
  ...props
}: PropsType): React.JSX.Element {
  return (
    <button
      type="button"
      className={cn(
        buttonStyles({
          variant,
          appearance,
          iconOnly,
          size
        }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
