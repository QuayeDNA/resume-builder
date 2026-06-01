import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/classNames'

const variants = {
  default: 'bg-elevated border border-subtle text-secondary',
  brand: 'bg-brand-subtle border border-brand/30 text-brand',
  success: 'bg-success-subtle border border-success/30 text-success',
  warning: 'bg-warning-subtle border border-warning/30 text-warning',
  error: 'bg-error-subtle border border-error/30 text-error',
  ai: 'bg-ai-subtle border border-ai/20 text-ai',
} as const

type BadgeProps = {
  children: ReactNode
  variant?: keyof typeof variants
  onRemove?: () => void
  className?: string
}

export default function Badge({ children, variant = 'default', onRemove, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded text-label transition-all duration-100',
      variants[variant],
      className,
    )}>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          <X size={10} />
        </button>
      )}
    </span>
  )
}
