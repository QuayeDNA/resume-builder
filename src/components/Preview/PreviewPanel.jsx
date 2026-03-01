import { FileDown } from 'lucide-react'
import { getTemplate } from '../../Templates'
import SingleColumnTemplate  from '../../Templates/SingleColumnTemplate'
import TwoColumnTemplate     from '../../Templates/TwoColumnTemplate'
import CoverLetterTemplate   from '../../Templates/CoverLetterTemplate'
import { exportToPdf }       from '../../utils/pdf'
import useResumeStore from '../../store/useResumeStore'
import { useMemo } from 'react'          // ← add this

export default function PreviewPanel() {
  const data          = useResumeStore((s) => s.data)
  const cl            = useResumeStore((s) => s.cl)
  const activeView    = useResumeStore((s) => s.activeView)
  const setActiveView = useResumeStore((s) => s.setActiveView)

  const t = getTemplate(data.template)

  const handleExport = () => exportToPdf('resume-preview', data.personal.name || 'resume')

  // compute the element once per render instead of defining a component inline
  const resumeContent = useMemo(() => {
    if (activeView === 'cover') {
      return <CoverLetterTemplate resume={data} cl={cl} />
    }
    return t.layout === 'two-col'
      ? <TwoColumnTemplate data={data} />
      : <SingleColumnTemplate data={data} />
  }, [activeView, data, cl, t.layout])

  return (
    <div className="flex-1 bg-[#040410] flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="h-10 bg-[#05050d] border-b border-[#0a0a18] flex items-center px-4 gap-3 flex-shrink-0">
        {/* View toggle */}
        <div className="flex gap-0.5 bg-[#090916] rounded-md p-0.5">
          {[['resume', 'Resume'], ['cover', 'Cover Letter']].map(([m, l]) => (
            <button
              key={m}
              onClick={() => setActiveView(m)}
              className={`px-3 py-1 rounded text-[9.5px] font-semibold transition-colors ${
                activeView === m
                  ? 'bg-[#151530] text-brand-400'
                  : 'text-[#282848] hover:text-[#484868]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex-1" />
        <span className="text-[8px] text-[#0e0e24] font-mono uppercase tracking-widest">A4 · Live</span>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 bg-gradient-to-br from-[#3a2a8a] to-[#5c54e0] text-white text-[10.5px] font-semibold px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
        >
          <FileDown size={12} /> Export PDF
        </button>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-y-auto p-5 flex justify-center items-start">
        <div
          className="bg-white w-full rounded-sm overflow-hidden"
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