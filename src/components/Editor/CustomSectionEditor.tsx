import { useState, useRef, useEffect } from 'react'
import { Plus, X, Settings, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { Input, TextArea, Button, IconButton, EntryCard, Select } from '../UI'
import SortableList from '../SortableList'
import RichTextEditor from './RichTextEditor'
import { useDragHandle } from './DragHandleContext'
import useResumeStore from '../../store/useResumeStore'
import type { CustomSection } from '../../types'

/* ─── Field Manager Modal ─── */

function FieldManager({ section }: { section: CustomSection }) {
  const [open, setOpen] = useState(false)
  const addCustomField = useResumeStore((s) => s.addCustomField)
  const removeCustomField = useResumeStore((s) => s.removeCustomField)
  const updateCustomField = useResumeStore((s) => s.updateCustomField)
  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState<'text' | 'textarea'>('text')

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="ghost" size="sm" icon={<Settings size={12} />}>
        Manage Fields
      </Button>
    )
  }

  const handleAdd = () => {
    if (!newLabel.trim()) return
    const key = newLabel.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    if (!key) return
    addCustomField(section.id, { key, label: newLabel.trim(), type: newType })
    setNewLabel('')
  }

  return (
    <div className="border border-warm-border rounded-xl bg-paper-deep/30 p-3 space-y-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-label text-ink font-medium">Manage Fields</p>
        <IconButton onClick={() => setOpen(false)} variant="ghost" size="sm" aria-label="Close">
          <X size={12} />
        </IconButton>
      </div>

      <div className="space-y-1">
        {section.fields.map((f) => (
          <div key={f.key} className="flex items-center gap-2 py-1">
            <input
              value={f.label}
              onChange={(e) => updateCustomField(section.id, f.key, { label: e.target.value })}
              className="flex-1 min-w-0 bg-white border border-warm-border-strong rounded-lg px-2 py-1 text-caption text-ink"
            />
            <div className="w-28">
              <Select
                value={f.type}
                onChange={(v) => updateCustomField(section.id, f.key, { type: v as 'text' | 'textarea' })}
                options={[
                  { value: 'text', label: 'Text' },
                  { value: 'textarea', label: 'Textarea' },
                ]}
              />
            </div>
            <IconButton
              onClick={() => removeCustomField(section.id, f.key)}
              variant="danger"
              size="sm"
              aria-label={`Remove field ${f.label}`}
            >
              <X size={10} />
            </IconButton>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-warm-border">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Field label..."
          className="flex-1 min-w-0 bg-white border border-warm-border-strong rounded-lg px-2 py-1 text-caption text-ink"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <div className="w-28">
          <Select
            value={newType}
            onChange={(v) => setNewType(v as 'text' | 'textarea')}
            options={[
              { value: 'text', label: 'Text' },
              { value: 'textarea', label: 'Textarea' },
            ]}
          />
        </div>
        <IconButton onClick={handleAdd} variant="ghost" size="sm" title="Add field">
          <Plus size={12} />
        </IconButton>
      </div>
    </div>
  )
}

/* ─── Bullet Row ─── */

function BulletRow({ bullet, sectionId, entryId, idx }: { bullet: string; sectionId: number; entryId: number; idx: number }) {
  const updateBullet = useResumeStore((s) => s.updateCustomBullet)
  const removeBullet = useResumeStore((s) => s.removeCustomBullet)

  return (
    <div>
      <div className="flex gap-1.5 items-start">
        <div className="flex-1 min-w-0">
          <RichTextEditor
            value={bullet}
            onChange={(v) => updateBullet(sectionId, entryId, idx, v)}
            placeholder="Enter a bullet point..."
            minHeight={96}
          />
        </div>
        <IconButton onClick={() => removeBullet(sectionId, entryId, idx)} title="Remove bullet" variant="danger" size="sm">
          <X size={10} />
        </IconButton>
      </div>
    </div>
  )
}

/* ─── Editable Section Header ─── */

function EditableHeader({ name, onSave }: { name: string; onSave: (name: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commit = () => {
    const trimmed = value.trim()
    if (trimmed && trimmed !== name) onSave(trimmed)
    else setValue(name)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPointerDown={(e) => e.stopPropagation()}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') { setValue(name); setEditing(false) }
        }}
        className="min-w-0 flex-1 bg-transparent text-subheading text-ink font-medium outline-none border-b-2 border-terracotta"
        onClick={(e) => e.stopPropagation()}
      />
    )
  }

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <h3 className="text-subheading text-ink font-medium truncate">{name}</h3>
      <span
        onClick={(e) => { e.stopPropagation(); setEditing(true) }}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setEditing(true) } }}
        role="button"
        tabIndex={0}
        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md text-ink-muted opacity-0 group-hover/header:opacity-100 hover:bg-paper-deep hover:text-ink transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        aria-label="Edit section name"
      >
        <Pencil size={11} />
      </span>
    </div>
  )
}

/* ─── Custom Entry ─── */

function CustomEntry({ section, entry }: { section: CustomSection; entry: CustomSection['entries'][number] }) {
  const updateEntryValue = useResumeStore((s) => s.updateCustomEntryValue)
  const addBullet = useResumeStore((s) => s.addCustomBullet)
  const removeEntry = useResumeStore((s) => s.removeCustomEntry)

  return (
    <EntryCard onDelete={() => removeEntry(section.id, entry.id)}>
      {section.fields.map((field) =>
        field.type === 'textarea' ? (
          <TextArea
            key={field.key}
            label={field.label}
            value={entry.values[field.key] ?? ''}
            onChange={(v) => updateEntryValue(section.id, entry.id, field.key, v)}
            rows={3}
          />
        ) : (
          <Input
            key={field.key}
            label={field.label}
            value={entry.values[field.key] ?? ''}
            onChange={(v) => updateEntryValue(section.id, entry.id, field.key, v)}
          />
        ),
      )}

      <p className="text-label uppercase text-ink-muted mt-3">Bullet Points</p>
      {entry.bullets.map((b, i) => (
        <BulletRow key={i} bullet={b} sectionId={section.id} entryId={entry.id} idx={i} />
      ))}
      <Button onClick={() => addBullet(section.id, entry.id)} variant="ghost" size="sm" className="border-dashed mt-1">
        + Bullet
      </Button>
    </EntryCard>
  )
}

/* ─── Main Component ─── */

export default function CustomSectionEditor({ section }: { section: CustomSection }) {
  const updateSectionName = useResumeStore((s) => s.updateCustomSectionName)
  const updateSectionEntryLabel = useResumeStore((s) => s.updateCustomSectionEntryLabel)
  const addEntry = useResumeStore((s) => s.addCustomEntry)
  const reorderEntries = useResumeStore((s) => s.reorderCustomEntries)
  const removeCustomSection = useResumeStore((s) => s.removeCustomSection)
  const [open, setOpen] = useState(true)
  const dragHandle = useDragHandle()

  return (
    <div className="overflow-hidden rounded-xl bg-paper-warm shadow-soft border border-warm-border transition-all duration-200 animate-fade-up">
      {/* Accordion header */}
      <button
        ref={dragHandle?.setActivatorNodeRef}
        {...dragHandle?.attributes}
        {...(dragHandle?.listeners as Record<string, any> | undefined)}
        onClick={() => setOpen(!open)}
        className="group/header flex w-full cursor-grab items-center justify-between px-3 py-3 transition-colors duration-150 hover:bg-paper-deep/50 active:cursor-grabbing"
        aria-expanded={open}
      >
        <EditableHeader name={section.name} onSave={(v) => updateSectionName(section.id, v)} />
        <div className="flex items-center gap-2 shrink-0">
          <span
            onClick={(e) => { e.stopPropagation(); removeCustomSection(section.id) }}
            onPointerDown={(e) => e.stopPropagation()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); removeCustomSection(section.id) } }}
            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md text-ink-muted opacity-0 group-hover/header:opacity-100 hover:bg-error-subtle hover:text-error transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            aria-label="Delete section"
          >
            <Trash2 size={11} />
          </span>
          {open
            ? <ChevronUp size={14} className="text-ink-muted transition-transform duration-200" />
            : <ChevronDown size={14} className="text-ink-muted transition-transform duration-200" />
          }
        </div>
      </button>

      {/* Accordion body */}
      {open && (
        <div className="space-y-2.5 border-t border-warm-border px-3 py-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <Input
              label="Entry Label"
              value={section.entryLabel}
              onChange={(v) => updateSectionEntryLabel(section.id, v)}
              placeholder="e.g. Reference, Item"
              className="flex-1"
            />
            <FieldManager section={section} />
          </div>

          <SortableList
            items={section.entries}
            getId={(e) => e.id}
            onReorder={(from, to) => reorderEntries(section.id, from, to)}
          >
            {(entry) => <CustomEntry section={section} entry={entry} />}
          </SortableList>

          <Button
            onClick={() => addEntry(section.id)}
            variant="ghost"
            size="sm"
            className="border-dashed w-full"
            icon={<Plus size={12} />}
          >
            Add {section.entryLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
