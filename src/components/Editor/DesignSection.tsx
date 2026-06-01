import { Card } from '../UI'
import { Hint } from '../../design/components'
import { TEMPLATES } from '../../Templates'
import useResumeStore from '../../store/useResumeStore'

const ATS_KEYWORD_HINTS = [
  { label: 'Use standard section headings', detail: '"Experience", "Education", "Skills" — avoid creative names' },
  { label: 'Include job-specific keywords', detail: 'Match terms from the job description you are applying to' },
  { label: 'Spell out acronyms', detail: 'Write "Search Engine Optimization" before using "SEO"' },
  { label: 'Use simple bullet points', detail: 'Avoid special characters, icons, or custom symbols' },
  { label: 'Avoid tables and columns', detail: 'ATS parsers cannot read multi-column layouts reliably' },
  { label: 'Include measurable results', detail: 'Use numbers: "Increased revenue by 25%" not "Improved revenue"' },
]

const templateEntries = Object.entries(TEMPLATES)

function TemplateThumb({ id, template, selected, onClick }: {
  id: string
  template: typeof TEMPLATES[keyof typeof TEMPLATES]
  selected: boolean
  onClick: () => void
}) {
  const isTwoCol = template.layout === 'two-col'
  const isATS = template.layout === 'ats'
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-100 ${
        selected
          ? 'bg-brand-subtle border-brand'
          : 'bg-elevated border-subtle hover:border-active'
      }`}
    >
      <div className="w-10 h-7 rounded-md overflow-hidden relative flex flex-shrink-0">
        {isATS ? (
          <div style={{ width: '100%', background: '#fff', position: 'relative', border: '1px solid #ddd' }}>
            <div style={{ position: 'absolute', top: '2px', left: '3px', right: '3px', height: '1px', background: template.accent }} />
            <div style={{ position: 'absolute', top: '5px', left: '3px', right: '3px', height: '0.5px', background: template.secondary }} />
            <div style={{ position: 'absolute', bottom: '2px', left: '3px', right: '3px', height: '0.5px', background: template.secondary }} />
          </div>
        ) : isTwoCol ? (
          <>
            <div style={{ width: '35%', background: template.accent }} />
            <div style={{ flex: 1, background: '#e8e8f0' }} />
          </>
        ) : (
          <div style={{ width: '100%', background: template.accent, position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5px', background: template.secondary }} />
            <div style={{ position: 'absolute', top: '4px', left: '4px', right: '4px', height: '1.5px', background: 'rgba(255,255,255,0.15)' }} />
          </div>
        )}
      </div>
      <span className={`text-[8px] font-medium leading-none ${selected ? 'text-primary' : 'text-text-muted'}`}>
        {template.label}
      </span>
    </button>
  )
}

export default function DesignSection() {
  const currentTemplate = useResumeStore((s) => s.data.template)
  const setTemplate = useResumeStore((s) => s.setTemplate)
  const currentT = TEMPLATES[currentTemplate as keyof typeof TEMPLATES]
  const isATS = currentT?.layout === 'ats'

  const design = templateEntries.filter(([, t]) => t.category === 'design')
  const twoCol = templateEntries.filter(([, t]) => t.layout === 'two-col')
  const ats = templateEntries.filter(([, t]) => t.category === 'ats')

  return (
    <Card title="Resume Templates">
      <div className="mb-3 p-2 rounded-lg bg-success-subtle border border-success/20">
        <p className="text-caption text-success font-medium uppercase">ATS-Optimized</p>
        <p className="text-caption text-success/80">Maximum compatibility with Applicant Tracking Systems</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 sm:grid-cols-3">
        {ats.map(([id, t]) => (
          <TemplateThumb key={id} id={id} template={t} selected={currentTemplate === id} onClick={() => setTemplate(id)} />
        ))}
      </div>

      {isATS && (
        <div className="mb-4 p-3 rounded-lg bg-info-subtle border border-info/20 space-y-1.5">
          <p className="text-caption text-info font-medium uppercase">ATS Optimization Tips</p>
          {ATS_KEYWORD_HINTS.map((hint, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-success text-[9px] mt-px flex-shrink-0">✓</span>
              <div>
                <span className="text-caption text-primary font-medium block">{hint.label}</span>
                <span className="text-caption text-text-muted">{hint.detail}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-label uppercase text-text-muted mb-2">Single Column</p>
      <div className="grid grid-cols-1 gap-2 mb-4 sm:grid-cols-2 xl:grid-cols-3">
        {design.filter(([, t]) => t.layout === 'single').map(([id, t]) => (
          <TemplateThumb key={id} id={id} template={t} selected={currentTemplate === id} onClick={() => setTemplate(id)} />
        ))}
      </div>

      <p className="text-label uppercase text-text-muted mb-2">Two Column</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {twoCol.map(([id, t]) => (
          <TemplateThumb key={id} id={id} template={t} selected={currentTemplate === id} onClick={() => setTemplate(id)} />
        ))}
      </div>
    </Card>
  )
}
