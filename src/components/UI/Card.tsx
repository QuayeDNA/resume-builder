import CardBase from '../../design/components/Card'

export default function Card({ title, children, defaultOpen, className, headerRight, onAdd, addLabel }) {
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
          className="w-full border border-dashed border-subtle text-text-muted rounded-lg py-1.5 text-caption hover:border-brand hover:text-brand transition-all duration-100"
        >
          + {addLabel || 'Add'}
        </button>
      )}
    </CardBase>
  )
}
