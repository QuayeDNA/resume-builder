import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/classNames'

type EntryCardProps = {
  children: ReactNode
  onDelete?: () => void
  className?: string
}

export default function EntryCard({ children, onDelete, className }: EntryCardProps) {
  return (
    <div className={cn(
      'relative rounded-xl border border-subtle bg-elevated/90 transition-all duration-150',
      'hover:border-active',
      className,
    )}>
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-error-subtle border border-error/30 text-error hover:bg-error/20 transition-all duration-100 z-10"
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
