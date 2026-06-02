import { useState } from 'react'
import { Card } from '../UI'
import { TEMPLATES } from '../../Templates'
import type { TemplateDefinition, TemplateCategory } from '../../Templates'
import useResumeStore from '../../store/useResumeStore'

const CATEGORIES: { key: 'all' | TemplateCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'design', label: 'Design' },
  { key: 'minimal', label: 'Minimal' },
]

function LayoutPreview({ template }: { template: TemplateDefinition }) {
  const { layout, colors } = template.theme

  if (layout === 'two-col') {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: '35%', height: '100%', background: colors.accent }}>
          <div style={{ padding: '6px 3px' }}>
            <div style={{ height: '4px', width: '70%', background: 'rgba(255,255,255,0.2)', borderRadius: '1px', marginBottom: '4px' }} />
            <div style={{ height: '2px', width: '50%', background: 'rgba(255,255,255,0.15)', borderRadius: '1px', marginBottom: '6px' }} />
            <div style={{ height: '2px', width: '90%', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '2px' }} />
            <div style={{ height: '2px', width: '90%', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '2px' }} />
            <div style={{ height: '2px', width: '60%', background: 'rgba(255,255,255,0.1)', borderRadius: '1px' }} />
          </div>
        </div>
        <div style={{ flex: 1, height: '100%', background: '#f5f3f0', padding: '6px' }}>
          <div style={{ height: '3px', width: '80%', background: colors.secondary + '40', borderRadius: '1px', marginBottom: '4px' }} />
          <div style={{ height: '2px', width: '100%', background: '#ddd', borderRadius: '1px', marginBottom: '4px' }} />
          <div style={{ height: '2px', width: '100%', background: '#ddd', borderRadius: '1px', marginBottom: '4px' }} />
          <div style={{ height: '2px', width: '60%', background: '#ddd', borderRadius: '1px' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', background: '#ffffff', overflow: 'hidden', padding: '8px 6px' }}>
      <div style={{ height: '6px', width: '60%', background: colors.accent, borderRadius: '1px', marginBottom: '4px' }} />
      <div style={{ height: '2px', width: '90%', background: colors.secondary + '50', borderRadius: '1px', marginBottom: '8px' }} />
      <div style={{ height: '2px', width: '100%', background: '#eee', borderRadius: '1px', marginBottom: '3px' }} />
      <div style={{ height: '6px', width: '40%', background: colors.accent + '30', borderRadius: '1px', marginTop: '6px', marginBottom: '4px' }} />
      <div style={{ height: '2px', width: '100%', background: '#eee', borderRadius: '1px', marginBottom: '3px' }} />
      <div style={{ height: '2px', width: '100%', background: '#eee', borderRadius: '1px', marginBottom: '3px' }} />
      <div style={{ height: '2px', width: '70%', background: '#eee', borderRadius: '1px', marginBottom: '3px' }} />
      <div style={{ height: '6px', width: '30%', background: colors.accent + '30', borderRadius: '1px', marginTop: '6px', marginBottom: '4px' }} />
      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ height: '4px', width: '12px', background: colors.accent + '20', borderRadius: '2px' }} />
        ))}
      </div>
    </div>
  )
}

function TemplateCard({ template, isSelected, onClick }: {
  template: TemplateDefinition
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-stretch gap-2 rounded-xl border-2 p-0 overflow-hidden transition-all duration-200 ${
        isSelected
          ? 'border-terracotta bg-terracotta-dim shadow-soft'
          : 'border-warm-border-strong bg-paper hover:border-terracotta/40 hover:shadow-soft'
      }`}
    >
      <div className="h-24 w-full overflow-hidden bg-white border-b border-warm-border">
        <LayoutPreview template={template} />
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
