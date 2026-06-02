import { useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/classNames'

type EntryCardProps = {
  children: ReactNode
  onDelete?: () => void
  className?: string
}

export default function EntryCard({ children, onDelete, className }: EntryCardProps) {
  const [exiting, setExiting] = useState(false)

  const handleDelete = () => {
    setExiting(true)
    setTimeout(() => onDelete?.(), 150)
  }

  return (
    <div className={cn(
      'relative rounded-xl border border-warm-border bg-paper-deep/60 transition-all duration-200 shadow-soft',
      'hover:border-warm-border-strong',
      exiting && 'animate-scale-out',
      className,
    )}>
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute -top-2.5 -right-2.5 w-5 h-5 flex items-center justify-center rounded-full bg-error-subtle border border-error/30 text-error hover:bg-error/20 transition-all duration-150 z-10"
          aria-label="Delete entry"
        >
          <X size={10} />
        </button>
      )}
      <div className="p-3 space-y-2">
        {children}
      </div>
    </div>
  )
}
