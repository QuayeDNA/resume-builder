import { FileDown, FileText, FileSignature } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { TemplateRenderer, CoverLetterRenderer } from '../../Templates'
import { exportToPdf } from '../../utils/pdf'
import useResumeStore from '../../store/useResumeStore'
import PageComposer from './PageComposer'
import ZoomControls, { ZOOM_FIT } from './ZoomControls'
import '../../design/textures/desk.css'

export default function PreviewPanel() {
  const data = useResumeStore((s) => s.data)
  const cl = useResumeStore((s) => s.cl)
  const activeView = useResumeStore((s) => s.activeView)
  const setActiveView = useResumeStore((s) => s.setActiveView)
  const [zoom, setZoom] = useState<number>(ZOOM_FIT)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleExport = () => exportToPdf(data.personal.name || 'resume')

  const resumeContent = useMemo(() => {
    if (activeView === 'cover') return <CoverLetterRenderer resume={data} cl={cl} />
    return <TemplateRenderer data={data} />
  }, [activeView, data, cl])

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-paper">
      <div className="flex min-h-12 flex-wrap items-center gap-2 border-b border-warm-border bg-paper-warm px-3 py-2 sm:flex-nowrap">
        <div className="flex gap-0.5 rounded-lg border border-warm-border bg-paper p-0.5 shadow-soft">
          <button
            onClick={() => setActiveView('resume')}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-caption font-medium transition-all duration-150 ${
              activeView === 'resume'
                ? 'bg-terracotta text-white shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <FileText size={12} />
            Resume
          </button>
          <button
            onClick={() => setActiveView('cover')}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-caption font-medium transition-all duration-150 ${
              activeView === 'cover'
                ? 'bg-terracotta text-white shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <FileSignature size={12} />
            Cover
          </button>
        </div>

        <ZoomControls zoom={zoom} onChange={setZoom} />

        <div className="flex-1" />

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-full border border-sage/30 bg-sage-dim px-3 py-1.5 text-caption font-medium text-sage transition-all duration-200 hover:bg-sage/20"
        >
          <FileDown size={12} /> Export PDF
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto desk-surface p-4 sm:p-6">
        <div
          className="transition-transform duration-300 ease-out-expo origin-top"
          style={{
            transform: zoom === ZOOM_FIT ? 'none' : `scale(${zoom})`,
            transformOrigin: 'top center',
            margin: '0 auto',
            width: zoom === ZOOM_FIT ? 'fit-content' : undefined,
          }}
        >
          <PageComposer key={`${activeView}-${data.template}`}>
            {resumeContent}
          </PageComposer>
        </div>
      </div>
    </div>
  )
}
