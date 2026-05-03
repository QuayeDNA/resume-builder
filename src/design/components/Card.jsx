import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/classNames'

export default function Card({ title, children, defaultOpen = true, className, headerRight }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cn('overflow-hidden rounded-xl border border-subtle bg-surface/70 transition-all duration-200 shadow-sm', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-surface/70 px-3 py-2.5 transition-colors duration-100 hover:bg-surface"
        aria-expanded={open}
      >
        <h3 className="text-heading text-primary">{title}</h3>
        <div className="flex items-center gap-2">
          {headerRight}
          {open
            ? <ChevronUp size={14} className="text-text-muted transition-transform duration-150" />
            : <ChevronDown size={14} className="text-text-muted transition-transform duration-150" />
          }
        </div>
      </button>

      {open && (
        <div className="space-y-2 border-t border-hairline p-3 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  )
}
