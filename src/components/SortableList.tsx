import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { ReactNode } from 'react'

function DragHandle() {
  return (
    <div className="flex cursor-grab touch-none items-center text-ink-muted hover:text-ink active:cursor-grabbing">
      <GripVertical size={12} />
    </div>
  )
}

type SortableItemProps = {
  id: number | string
  children: ReactNode
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className="flex items-start gap-1.5">
        <div className="mt-1.5 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" {...attributes} {...listeners}>
          <DragHandle />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}

type SortableListProps<T> = {
  items: T[]
  getId: (item: T, index: number) => number | string
  onReorder: (from: number, to: number) => void
  children: (item: T, index: number) => ReactNode
}

export default function SortableList<T>({ items, getId, onReorder, children }: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const ids = items.map(getId)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = ids.indexOf(active.id as never)
    const to = ids.indexOf(over.id as never)
    if (from !== -1 && to !== -1) onReorder(from, to)
  }

  if (items.length === 0) return null

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids as unknown as string[]} strategy={verticalListSortingStrategy}>
        {items.map((item, i) => (
          <SortableItem key={getId(item, i)} id={getId(item, i)}>
            {children(item, i)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}
