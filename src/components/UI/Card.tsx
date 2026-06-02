import type { ReactNode } from 'react'
import CardBase from '../../design/components/Card'

type CardProps = {
  title?: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
  headerRight?: ReactNode
  onAdd?: () => void
  addLabel?: string
}

export default function Card({ title, children, defaultOpen, className, headerRight, onAdd, addLabel }: CardProps) {
  return (
    <CardBase
      title={title}
      defaultOpen={defaultOpen}
      className={className}
      headerRight={headerRight}
    >
      {children}
      {onAdd && (
        <button
          onClick={onAdd}
          className="w-full border border-dashed border-warm-border-strong text-ink-muted rounded-lg py-1.5 text-caption hover:border-terracotta hover:text-terracotta transition-all duration-150"
        >
          + {addLabel || 'Add'}
        </button>
      )}
    </CardBase>
  )
}
