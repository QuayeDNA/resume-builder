import { Card } from '../UI'
import { TEMPLATES } from '../../Templates'
import useResumeStore from '../../store/useResumeStore'

function TemplateThumb({ id, template, selected, onClick }) {
  const isTwoCol = template.layout === 'two-col'
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all ${
        selected
          ? 'bg-[#18183a] border-brand-500'
          : 'bg-[#0f0f1e] border-[#1e1e34] hover:border-[#2e2e4e]'
      }`}
    >
      <div className="w-9 h-6 rounded overflow-hidden relative flex">
        {isTwoCol ? (
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
      <span className={`text-[8px] font-medium ${selected ? 'text-[#c0c0e0]' : 'text-[#383858]'}`}>
        {template.label}
      </span>
    </button>
  )
}

export default function DesignSection() {
  const currentTemplate = useResumeStore((s) => s.data.template)
  const setTemplate     = useResumeStore((s) => s.setTemplate)

  const single = Object.entries(TEMPLATES).filter(([, t]) => t.layout === 'single')
  const twoCol = Object.entries(TEMPLATES).filter(([, t]) => t.layout === 'two-col')

  return (
    <Card title="Resume Templates">
      <p className="text-[9.5px] text-gray-600 mb-3 uppercase tracking-[1px]">Single Column</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {single.map(([id, t]) => (
          <TemplateThumb key={id} id={id} template={t} selected={currentTemplate === id} onClick={() => setTemplate(id)} />
        ))}
      </div>

      <p className="text-[9.5px] text-gray-600 mb-3 uppercase tracking-[1px]">Two Column</p>
      <div className="grid grid-cols-2 gap-2">
        {twoCol.map(([id, t]) => (
          <TemplateThumb key={id} id={id} template={t} selected={currentTemplate === id} onClick={() => setTemplate(id)} />
        ))}
      </div>
    </Card>
  )
}
