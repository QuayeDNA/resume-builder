import { useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/classNames'

const variants = {
  default: 'bg-paper-deep border border-warm-border-strong text-ink-soft',
  brand: 'bg-terracotta-dim border border-terracotta/30 text-terracotta',
  success: 'bg-success-subtle border border-success/30 text-success',
  warning: 'bg-warning-subtle border border-warning/30 text-warning',
  error: 'bg-error-subtle border border-error/30 text-error',
  ai: 'bg-sage-dim border border-sage/20 text-sage',
} as const

type BadgeProps = {
  children: ReactNode
  variant?: keyof typeof variants
  onRemove?: () => void
  className?: string
}

export default function Badge({ children, variant = 'default', onRemove, className }: BadgeProps) {
  const [exiting, setExiting] = useState(false)

  const handleRemove = () => {
    setExiting(true)
    setTimeout(() => onRemove?.(), 150)
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label transition-all duration-150',
      exiting && 'animate-scale-out',
      variants[variant],
      className,
    )}>
      {children}
      {onRemove && (
        <button
          onClick={handleRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          <X size={10} />
        </button>
      )}
    </span>
  )
}
