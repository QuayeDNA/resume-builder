import { useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/classNames'
import IconButton from '../../components/UI/IconButton'

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
        <div className="absolute -top-2.5 -right-2.5 z-10">
          <IconButton onClick={handleDelete} variant="danger" size="sm" aria-label="Delete entry">
            <X size={10} />
          </IconButton>
        </div>
      )}
      <div className="p-3 space-y-2">
        {children}
      </div>
    </div>
  )
}
