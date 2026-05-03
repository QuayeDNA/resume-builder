import { FileDown } from 'lucide-react'
import { getTemplate } from '../../Templates'
import SingleColumnTemplate  from '../../Templates/SingleColumnTemplate'
import TwoColumnTemplate     from '../../Templates/TwoColumnTemplate'
import ATSTemplate           from '../../Templates/ATSTemplate'
import CoverLetterTemplate   from '../../Templates/CoverLetterTemplate'
import { exportToPdf }       from '../../utils/pdf'
import useResumeStore from '../../store/useResumeStore'
import { useMemo } from 'react'

export default function PreviewPanel() {
  const data          = useResumeStore((s) => s.data)
  const cl            = useResumeStore((s) => s.cl)
  const activeView    = useResumeStore((s) => s.activeView)
  const setActiveView = useResumeStore((s) => s.setActiveView)

  const t = getTemplate(data.template)

  const handleExport = () => exportToPdf('resume-preview', data.personal.name || 'resume')

  const resumeContent = useMemo(() => {
    if (activeView === 'cover') {
      return <CoverLetterTemplate resume={data} cl={cl} />
    }
    if (t.layout === 'ats') {
      return <ATSTemplate data={data} />
    }
    return t.layout === 'two-col'
      ? <TwoColumnTemplate data={data} />
      : <SingleColumnTemplate data={data} />
  }, [activeView, data, cl, t.layout])

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-void">
      <div className="flex min-h-12 flex-wrap items-center gap-2 border-b border-hairline bg-surface px-3 py-2 sm:flex-nowrap">
        <div className="flex gap-0.5 rounded-lg bg-elevated p-0.5">
          {[['resume', 'Resume'], ['cover', 'Cover Letter']].map(([m, l]) => (
            <button
              key={m}
              onClick={() => setActiveView(m)}
              className={`rounded-md px-2.5 py-1 text-caption font-medium transition-all duration-100 ${
                activeView === m
                  ? 'bg-elevated-2 text-brand shadow-sm'
                  : 'text-text-muted hover:text-primary'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex-1" />
        <span className="hidden font-mono text-ui uppercase tracking-widest text-text-muted/40 sm:block">A4 Preview</span>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-success/20 bg-success-subtle px-3 py-1.5 text-caption font-medium text-success transition-all duration-100 hover:bg-success/15"
        >
          <FileDown size={12} /> Export
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-5">
        <div
          className="mx-auto w-full max-w-full overflow-hidden rounded-sm bg-white"
          style={{
            maxWidth:   '640px',
            minHeight:  '900px',
            boxShadow:  '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          {resumeContent}
        </div>
      </div>
    </div>
  )
}
