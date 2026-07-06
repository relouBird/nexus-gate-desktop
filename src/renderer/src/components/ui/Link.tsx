import { linkStyles } from '@/constants/ui/link.constant'
import { cn } from '@/utils/cn'
import { type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

type PropsType = ComponentProps<'a'> & VariantProps<typeof linkStyles> & { href: string }

export function Link({ className, variant, size, ...props }: PropsType): React.JSX.Element {
  return <a className={cn(linkStyles({ variant, size }), className)} {...props} />
}
