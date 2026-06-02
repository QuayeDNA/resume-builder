import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useState, type ReactNode } from 'react'

function DragHandle() {
  return (
    <div className="flex cursor-grab touch-none items-center text-ink-muted hover:text-ink active:cursor-grabbing" role="button" tabIndex={0} aria-label="Drag to reorder">
      <GripVertical size={14} />
    </div>
  )
}

type SortableItemProps = {
  id: number | string
  children: ReactNode
  isOver: boolean
}

function SortableItem({ id, children, isOver }: SortableItemProps) {
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
        <div className="mt-1 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" {...attributes} {...listeners}>
          <DragHandle />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      {/* Drop placeholder — visible when another item is dragged over this position */}
      {isOver && !isDragging && (
        <div className="h-0.5 rounded-full bg-terracotta/50 my-1 transition-all duration-200" />
      )}
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

  const [overId, setOverId] = useState<number | string | null>(null)

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setOverId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = ids.indexOf(active.id as never)
    const to = ids.indexOf(over.id as never)
    if (from !== -1 && to !== -1) onReorder(from, to)
  }

  if (items.length === 0) return null

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <SortableContext items={ids as unknown as string[]} strategy={verticalListSortingStrategy}>
        {items.map((item, i) => (
          <SortableItem key={getId(item, i)} id={getId(item, i)} isOver={overId === getId(item, i)}>
            {children(item, i)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}
