import type { ReactNode } from 'react'
import EntryCardBase from '../../design/components/EntryCard'

type EntryCardProps = {
  children: ReactNode
  onDelete?: () => void
  className?: string
}

export default function EntryCard({ children, onDelete, className }: EntryCardProps) {
  return (
    <EntryCardBase onDelete={onDelete} className={className}>
      {children}
    </EntryCardBase>
  )
}
