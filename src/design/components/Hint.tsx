import type { ReactNode } from 'react'
import { cn } from '../../utils/classNames'

const colors = {
  default: 'text-text-muted',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
  ai: 'text-ai',
} as const

type HintProps = {
  children: ReactNode
  variant?: keyof typeof colors
  className?: string
}

export default function Hint({ children, variant = 'default', className }: HintProps) {
  return (
    <p className={cn('text-caption', colors[variant], className)}>
      {children}
    </p>
  )
}
