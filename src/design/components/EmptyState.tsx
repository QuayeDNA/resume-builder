import type { ReactNode, ElementType } from 'react'
import { cn } from '../../utils/classNames'

type EmptyStateProps = {
  icon?: ElementType
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-6 text-center space-y-2',
      className,
    )}>
      {Icon && <Icon size={28} className="text-text-muted mb-1" />}
      {title && <p className="text-body text-secondary">{title}</p>}
      {description && <p className="text-caption text-text-muted max-w-[200px]">{description}</p>}
      {action && <div className="pt-1">{action}</div>}
    </div>
  )
}
