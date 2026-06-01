import EntryCardBase from '../../design/components/EntryCard'

export default function EntryCard({ children, onDelete, className }) {
  return (
    <EntryCardBase onDelete={onDelete} className={className}>
      {children}
    </EntryCardBase>
  )
}
