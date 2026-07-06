import { cva } from 'class-variance-authority'

export const linkStyles = cva(
  'inline-flex items-center font-medium transition [&>svg]:size-5 [&>svg]:text-current!',
  {
    variants: {
      variant: {
        primary: 'text-primary-500 hover:text-primary-600',
        dark: 'text-button-outline-text hover:text-text-100'
      },
      size: {
        sm: 'gap-1.5 text-sm',
        md: 'gap-2'
      }
    },
    defaultVariants: {
      variant: 'dark',
      size: 'sm'
    }
  }
)
