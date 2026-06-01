import { FileDown } from 'lucide-react'
import { useMemo } from 'react'
import { getTemplate } from '../../Templates'
import SingleColumnTemplate  from '../../Templates/SingleColumnTemplate'
import TwoColumnTemplate     from '../../Templates/TwoColumnTemplate'
import ATSTemplate           from '../../Templates/ATSTemplate'
import CoverLetterTemplate   from '../../Templates/CoverLetterTemplate'
import { exportToPdf }       from '../../utils/pdf'
import useResumeStore        from '../../store/useResumeStore'

export default function PreviewPanel() {
  const data          = useResumeStore((s) => s.data)
  const cl            = useResumeStore((s) => s.cl)
  const activeView    = useResumeStore((s) => s.activeView)
  const setActiveView = useResumeStore((s) => s.setActiveView)

  const t = getTemplate(data.template)

  const handleExport = () => exportToPdf('resume-preview', data.personal.name || 'resume')

  const resumeContent = useMemo(() => {
    if (activeView === 'cover') return <CoverLetterTemplate resume={data} cl={cl} />
    if (t.layout === 'ats')    return <ATSTemplate data={data} />
    if (t.layout === 'two-col') return <TwoColumnTemplate data={data} />
    return <SingleColumnTemplate data={data} />
  }, [activeView, data, cl, t.layout])

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-void">

      {/* ── Toolbar ── */}
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
        <span className="hidden font-mono text-ui uppercase tracking-widest text-text-muted/40 sm:block">
          A4 Preview
        </span>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-success/20 bg-success-subtle px-3 py-1.5 text-caption font-medium text-success transition-all duration-100 hover:bg-success/15"
        >
          <FileDown size={12} /> Export PDF
        </button>
      </div>

      {/* ── Preview ──
          794px = A4 width at 96dpi (210mm × 96/25.4 ≈ 794px).
          The preview renders at exactly the same width as the print output,
          so "what you see" matches "what you get" 1-to-1.
      ── */}
      <div className="flex-1 overflow-y-auto bg-[#c8c8c8] p-4 sm:p-6">
        <div
          style={{
            width: '794px',
            maxWidth: '100%',
            margin: '0 auto',
            background: '#ffffff',
            boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
            overflow: 'hidden',
          }}
        >
          {resumeContent}
        </div>
      </div>
    </div>
  )
}