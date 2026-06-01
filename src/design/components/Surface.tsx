import type { ReactNode, ElementType, HTMLAttributes } from 'react'
import { cn } from '../../utils/classNames'

const variants = {
  default: 'border border-warm-border bg-paper-warm',
  elevated: 'border border-warm-border bg-paper-deep',
  ghost: 'border border-transparent bg-transparent',
  ai: 'border border-sage/20 bg-sage-dim',
  success: 'border border-success/20 bg-success-subtle',
  warning: 'border border-warning/20 bg-warning-subtle',
} as const

type SurfaceProps = {
  children: ReactNode
  variant?: keyof typeof variants
  className?: string
  as?: ElementType
} & HTMLAttributes<HTMLElement>

export default function Surface({ children, variant = 'default', className, as: Tag = 'div', ...props }: SurfaceProps) {
  return (
    <Tag
      className={cn('rounded-xl transition-all duration-150', variants[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
