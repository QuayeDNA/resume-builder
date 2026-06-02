import { useRef } from 'react'
import { Sparkles, Loader2, X } from 'lucide-react'
import { Input, TextArea, Button, IconButton } from '../UI'
import SortableList from '../SortableList'
import BulletFormatToolbar from './BulletFormatToolbar'
import { useAi } from '../../hooks/useAi'
import { aiImproveBullet, aiSuggestBullets } from '../../api/ai'
import useResumeStore from '../../store/useResumeStore'
import type { CustomSectionEntry } from '../../types'

function BulletRow({ bullet, sectionId, idx }: { bullet: string; sectionId: number; idx: number }) {
  const updateBullet = useResumeStore((s) => s.updateCustomBullet)
  const removeBullet = useResumeStore((s) => s.removeCustomBullet)
  const section = useResumeStore((s) => s.data.customSections.find((c) => c.id === sectionId))
  const { run, isLoading } = useAi()
  const key = `cb_${sectionId}_${idx}`
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div>
      <BulletFormatToolbar textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement | null>} onUpdate={(v) => updateBullet(sectionId, idx, v)} />
      <div className="flex gap-1.5 items-start">
        <textarea
          ref={textareaRef}
          value={bullet}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateBullet(sectionId, idx, e.target.value)}
          placeholder="Enter a bullet point…"
          rows={2}
          className="flex-1 bg-white border border-warm-border-strong rounded-lg px-2.5 py-1.5 text-body text-ink resize-y placeholder:text-ink-muted/60 transition-all duration-200 focus:border-terracotta focus:ring-2 focus:ring-terracotta-dim focus:outline-none"
        />
        {section && (
          <div className="flex flex-col gap-1 flex-shrink-0">
            <IconButton
              onClick={() =>
                run(key, () => aiImproveBullet(bullet, section.name, ''), (v) => updateBullet(sectionId, idx, v as string))
              }
              disabled={isLoading(key) || !bullet.trim()}
              title="AI improve this bullet"
              variant="ghost"
              size="sm"
            >
              {isLoading(key) ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
            </IconButton>
            <IconButton
              onClick={() => removeBullet(sectionId, idx)}
              title="Remove bullet"
              variant="danger"
              size="sm"
            >
              <X size={10} />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CustomSectionEditor({ section }: { section: CustomSectionEntry }) {
  const updateSection = useResumeStore((s) => s.updateCustomSection)
  const removeSection = useResumeStore((s) => s.removeCustomSection)
  const addBullet = useResumeStore((s) => s.addCustomBullet)
  const appendBullets = useResumeStore((s) => s.appendCustomBullets)
  const reorderBullets = useResumeStore((s) => s.reorderCustomBullets)
  const { run, isLoading } = useAi()
  const suggestKey = `suggest_cs_${section.id}`

  const handleDelete = () => {
    if (window.confirm(`Delete "${section.name || 'Untitled Section'}" and all its content?`)) {
      removeSection(section.id)
    }
  }

  return (
    <div className="space-y-3 animate-fade-up">
      <Input label="Section Name" value={section.name} onChange={(v) => updateSection(section.id, 'name', v as string)} placeholder="e.g. Publications, Volunteer Work" />
      <TextArea label="Description" value={section.description} onChange={(v) => updateSection(section.id, 'description', v as string)} placeholder="Brief overview of this section…" rows={3} />

      <p className="text-label uppercase text-ink-muted">Bullet Points</p>
      <SortableList
        items={section.bullets}
        getId={(_, i) => `cs-${section.id}-bullet-${i}`}
        onReorder={(from, to) => reorderBullets(section.id, from, to)}
      >
        {(b, i) => <BulletRow bullet={b} sectionId={section.id} idx={i} />}
      </SortableList>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          onClick={() => addBullet(section.id)}
          variant="ghost"
          size="sm"
          className="border-dashed"
        >
          + Bullet
        </Button>
        <Button
          onClick={() =>
            run(suggestKey, () => aiSuggestBullets(section.name, ''), (bullets) =>
              appendBullets(section.id, bullets as string[]),
            )
          }
          variant="ghost"
          size="sm"
          loading={isLoading(suggestKey)}
          icon={!isLoading(suggestKey) && <Sparkles size={10} />}
        >
          AI Suggest
        </Button>
      </div>

      <Button onClick={handleDelete} variant="danger" size="sm" className="!text-error !border-error/30 !hover:bg-error/10">
        Delete Section
      </Button>
    </div>
  )
}
