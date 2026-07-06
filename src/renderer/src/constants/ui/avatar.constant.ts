import { cva } from 'class-variance-authority'

export const groupStyles = cva('flex items-center', {
  variants: {
    size: {
      xs: 'gap-2',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-3',
      xl: 'gap-4',
      xxl: 'gap-4'
    }
  }
})

export const avatarStyles = cva(
  'bg-primary-50 text-primary-500 relative grid place-items-center rounded-full',
  {
    variants: {
      size: {
        xs: 'size-6 text-xs font-medium',
        sm: 'size-8 text-sm font-medium',
        md: 'size-10 text-base font-semibold',
        lg: 'size-12 text-lg font-semibold',
        xl: 'size-14 text-xl font-semibold',
        xxl: 'size-16 text-2xl font-semibold'
      }
    }
  }
)
