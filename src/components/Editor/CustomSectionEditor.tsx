import { useState } from 'react'
import { Plus, X, Settings, ChevronDown, ChevronUp, GripVertical, Sparkles, Loader2 } from 'lucide-react'
import { Input, TextArea, Button, IconButton, EntryCard } from '../UI'
import SortableList from '../SortableList'
import BulletFormatToolbar from './BulletFormatToolbar'
import { useAi } from '../../hooks/useAi'
import { aiImproveBullet, aiSuggestBullets } from '../../api/ai'
import useResumeStore from '../../store/useResumeStore'
import type { CustomSection } from '../../types'
import { useRef } from 'react'

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
        <button onClick={() => setOpen(false)} className="text-ink-muted hover:text-ink transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-1">
        {section.fields.map((f) => (
          <div key={f.key} className="flex items-center gap-2 py-1">
            <input
              value={f.label}
              onChange={(e) => updateCustomField(section.id, f.key, { label: e.target.value })}
              className="flex-1 min-w-0 bg-white border border-warm-border-strong rounded-lg px-2 py-1 text-caption text-ink"
            />
            <select
              value={f.type}
              onChange={(e) => updateCustomField(section.id, f.key, { type: e.target.value as 'text' | 'textarea' })}
              className="appearance-none bg-white border border-warm-border-strong rounded-lg px-2 py-1 text-caption text-ink cursor-pointer"
            >
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
            </select>
            <button
              onClick={() => removeCustomField(section.id, f.key)}
              className="text-ink-muted hover:text-error transition-colors"
              aria-label={`Remove field ${f.label}`}
            >
              <X size={12} />
            </button>
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
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value as 'text' | 'textarea')}
          className="appearance-none bg-white border border-warm-border-strong rounded-lg px-2 py-1 text-caption text-ink cursor-pointer"
        >
          <option value="text">Text</option>
          <option value="textarea">Textarea</option>
        </select>
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div>
      <BulletFormatToolbar textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement | null>} onUpdate={(v) => updateBullet(sectionId, entryId, idx, v)} />
      <div className="flex gap-1.5 items-start">
        <textarea
          ref={textareaRef}
          value={bullet}
          onChange={(e) => updateBullet(sectionId, entryId, idx, e.target.value)}
          placeholder="Enter a bullet point..."
          rows={2}
          className="flex-1 bg-white border border-warm-border-strong rounded-lg px-2.5 py-1.5 text-body text-ink resize-y placeholder:text-ink-muted/60 transition-all duration-200 focus:border-terracotta focus:ring-2 focus:ring-terracotta-dim focus:outline-none"
        />
        <IconButton onClick={() => removeBullet(sectionId, entryId, idx)} title="Remove bullet" variant="danger" size="sm">
          <X size={10} />
        </IconButton>
      </div>
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

  return (
    <div className="space-y-3 animate-fade-up">
      <Input label="Section Name" value={section.name} onChange={(v) => updateSectionName(section.id, v)} placeholder="e.g. References, Publications" />
      <div className="flex items-center gap-2">
        <Input label="Entry Label" value={section.entryLabel} onChange={(v) => updateSectionEntryLabel(section.id, v)} placeholder="e.g. Reference, Item" className="flex-1" />
        <FieldManager section={section} />
      </div>

      <SortableList
        items={section.entries}
        getId={(e) => e.id}
        onReorder={(from, to) => reorderEntries(section.id, from, to)}
      >
        {(entry) => <CustomEntry section={section} entry={entry} />}
      </SortableList>

      <Button onClick={() => addEntry(section.id)} variant="ghost" size="sm" className="border-dashed w-full" icon={<Plus size={12} />}>
        Add {section.entryLabel}
      </Button>
    </div>
  )
}
