import type { ReactNode } from 'react'
import { Card, EntryCard, Input, TextArea, Select, Button } from '../UI'
import { EmptyState } from '../../design/components'
import SortableList from '../SortableList'

export type FieldConfig = {
  key: string
  label: string
  type?: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: readonly { value: string; label: string }[] | readonly string[]
}

type BaseEntry = { id: number }

type SectionEntryListProps<T extends BaseEntry> = {
  title: string
  addLabel?: string
  items: T[]
  fields?: FieldConfig[]
  onAdd: () => void
  onRemove: (id: number) => void
  onUpdate: (id: number, field: string, value: string) => void
  onReorder: (from: number, to: number) => void
  children?: (item: T) => ReactNode
}

function FieldInput({ field, value, onChange }: {
  field: FieldConfig
  value: string
  onChange: (v: string) => void
}) {
  const common = { value, onChange, placeholder: field.placeholder }
  switch (field.type) {
    case 'textarea':
      return <TextArea label={field.label} rows={6} {...common} />
    case 'select':
      return       <Select label={field.label} options={(field.options ?? []) as unknown as { value: string; label: string }[]} {...common} />
    default:
      return <Input label={field.label} {...common} />
  }
}

export default function SectionEntryList<T extends BaseEntry>({
  title,
  addLabel,
  items,
  fields,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
  children,
}: SectionEntryListProps<T>) {
  const empty = items.length === 0
  return (
    <Card title={title} onAdd={empty ? undefined : onAdd} addLabel={addLabel}>
      {empty ? (
        <EmptyState
          title={`No ${title.toLowerCase()} yet`}
          description={`Add your first entry to get started.`}
          action={
            <Button onClick={onAdd} variant="primary" size="sm">
              + {addLabel || 'Add'}
            </Button>
          }
        />
      ) : (
        <SortableList items={items} getId={(item) => item.id} onReorder={onReorder}>
          {(item) => (
            <EntryCard onDelete={() => onRemove(item.id)}>
              {fields?.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={(item as unknown as Record<string, string>)[field.key] ?? ''}
                  onChange={(v) => onUpdate(item.id, field.key, v)}
                />
              ))}
              {children?.(item)}
            </EntryCard>
          )}
        </SortableList>
      )}
    </Card>
  )
}
