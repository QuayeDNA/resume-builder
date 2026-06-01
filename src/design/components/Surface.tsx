import { cn } from '../../utils/classNames'

const variants = {
  default: 'border border-subtle bg-surface',
  elevated: 'border border-hairline bg-elevated',
  ghost: 'border border-transparent bg-transparent',
  ai: 'border border-ai/20 bg-ai-subtle',
  success: 'border border-success/20 bg-success-subtle',
  warning: 'border border-warning/20 bg-warning-subtle',
}

export default function Surface({ children, variant = 'default', className, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn('rounded-xl transition-all duration-150', variants[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
