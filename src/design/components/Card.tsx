import type { ReactNode } from 'react'
import { useState } from 'react'
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { cn } from '../../utils/classNames'

type CardProps = {
  title?: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
  headerRight?: ReactNode
  onToggle?: (open: boolean) => void
  dragHandle?: boolean
}

export default function Card({ title, children, defaultOpen = true, className, headerRight, onToggle, dragHandle }: CardProps) {
  const [open, setOpen] = useState(defaultOpen)

  const toggle = () => {
    const next = !open
    setOpen(next)
    onToggle?.(next)
  }

  return (
    <div className={cn('overflow-hidden rounded-xl bg-paper-warm shadow-soft border border-warm-border transition-all duration-200', className)}>
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between px-3 py-3 transition-colors duration-150 hover:bg-paper-deep/50"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {dragHandle && (
            <GripVertical size={14} className="text-ink-muted cursor-grab active:cursor-grabbing" />
          )}
          {title && <h3 className="text-subheading text-ink font-medium">{title}</h3>}
        </div>
        <div className="flex items-center gap-2">
          {headerRight}
          {open
            ? <ChevronUp size={14} className="text-ink-muted transition-transform duration-200" />
            : <ChevronDown size={14} className="text-ink-muted transition-transform duration-200" />
          }
        </div>
      </button>

      {open && (
        <div className="space-y-2.5 border-t border-warm-border px-3 py-3 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  )
}
