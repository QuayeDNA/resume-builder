import { cn } from '../../utils/classNames'

export default function Hint({ children, variant = 'default', className }) {
  const colors = {
    default: 'text-text-muted',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
    ai: 'text-ai',
  }

  return (
    <p className={cn('text-caption', colors[variant], className)}>
      {children}
    </p>
  )
}
