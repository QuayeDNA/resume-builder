import { useState } from 'react'
import { Card } from '../UI'
import { TEMPLATES } from '../../Templates'
import type { TemplateDefinition, TemplateCategory } from '../../Templates'
import useResumeStore from '../../store/useResumeStore'
import TemplateThumbnail from './TemplateThumbnail'

const CATEGORIES: { key: 'all' | TemplateCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'design', label: 'Design' },
  { key: 'minimal', label: 'Minimal' },
]

function TemplateCard({ template, isSelected, onClick }: {
  template: TemplateDefinition
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-stretch gap-2 rounded-xl border-2 p-0 overflow-hidden transition-all duration-200 ${
        isSelected
          ? 'border-terracotta bg-terracotta-dim shadow-soft'
          : 'border-warm-border-strong bg-paper hover:border-terracotta/40 hover:shadow-soft'
      }`}
    >
      <div className="h-36 w-full overflow-hidden bg-white border-b border-warm-border">
        <TemplateThumbnail template={template} />
      </div>
      <div className="px-2.5 pb-2.5 pt-0.5">
        <div className="flex items-center justify-between">
          <span className={`text-caption font-semibold ${isSelected ? 'text-ink' : 'text-ink'}`}>
            {template.label}
          </span>
          <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full ${
            template.category === 'minimal'
              ? 'bg-sage-dim text-sage'
              : 'bg-terracotta-dim text-terracotta'
          }`}>
            {template.category === 'minimal' ? 'ATS' : 'Design'}
          </span>
        </div>
        <p className="text-[9px] text-ink-muted leading-tight mt-0.5 text-left">
          {template.description}
        </p>
      </div>
    </button>
  )
}

export default function DesignSection() {
  const currentTemplate = useResumeStore((s) => s.data.template)
  const atsMode = useResumeStore((s) => s.data.atsMode)
  const setTemplate = useResumeStore((s) => s.setTemplate)
  const setAtsMode = useResumeStore((s) => s.setAtsMode)
  const [category, setCategory] = useState<'all' | TemplateCategory>('all')

  const entries = Object.entries(TEMPLATES)
  const filtered = category === 'all' ? entries : entries.filter(([, t]) => t.category === category)

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex gap-1 rounded-lg border border-warm-border bg-paper p-0.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`flex-1 rounded-md px-2.5 py-1.5 text-caption font-medium transition-all duration-150 ${
              category === cat.key
                ? 'bg-terracotta text-white shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ATS Mode toggle */}
      <label className="flex items-center gap-3 p-3 rounded-xl bg-sage-dim border border-sage/20 cursor-pointer transition-all duration-200 hover:bg-sage/20">
        <div className="relative">
          <input
            type="checkbox"
            checked={atsMode}
            onChange={(e) => setAtsMode(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 rounded-full bg-paper-deep peer-checked:bg-sage transition-colors duration-200" />
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-soft transition-transform duration-200 ${atsMode ? 'translate-x-4' : ''}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-caption font-semibold text-ink">ATS Mode</p>
          <p className="text-[10px] text-ink-muted leading-tight">
            Strips colors, columns, and styling for maximum applicant tracking system compatibility
          </p>
        </div>
      </label>

      {/* ATS mode active indicator */}
      {atsMode && (
        <div className="p-3 rounded-lg bg-sage-dim border border-sage/20">
          <p className="text-caption text-sage font-medium">
            ATS Mode is active — any template will render in plain single-column format with ATS-safe styling.
          </p>
        </div>
      )}

      {/* Template grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map(([id, t]) => (
          <TemplateCard
            key={id}
            template={t}
            isSelected={!atsMode && currentTemplate === id}
            onClick={() => setTemplate(id)}
          />
        ))}
      </div>
    </div>
  )
}
