import { FileDown, FileText, FileSignature, Monitor, Sun, Moon, Smartphone, ScrollText, Printer } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { TemplateRenderer, CoverLetterRenderer } from '../../Templates'
import useResumeStore from '../../store/useResumeStore'
import PageComposer from './PageComposer'
import ZoomControls, { ZOOM_FIT } from './ZoomControls'
import { PAGE_WIDTH } from '../../Templates/theme'
import '../../design/textures/desk.css'

type BgMode = 'desk' | 'paper' | 'dark'
type PreviewMode = 'page' | 'scroll' | 'mobile'

const BG_STORAGE_KEY = 'resume-builder:preview-bg'

function getStoredBg(): BgMode {
  const stored = localStorage.getItem(BG_STORAGE_KEY)
  if (stored === 'desk' || stored === 'paper' || stored === 'dark') return stored
  return 'desk'
}

const BG_ICONS: Record<BgMode, typeof Sun> = {
  desk: Sun,
  paper: Sun,
  dark: Moon,
}

export default function PreviewPanel() {
  const data = useResumeStore((s) => s.data)
  const cl = useResumeStore((s) => s.cl)
  const activeView = useResumeStore((s) => s.activeView)
  const setActiveView = useResumeStore((s) => s.setActiveView)
  const [zoom, setZoom] = useState<number>(ZOOM_FIT)
  const [bgMode, setBgMode] = useState<BgMode>(getStoredBg)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('page')
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleBgChange = useCallback((mode: BgMode) => {
    setBgMode(mode)
    localStorage.setItem(BG_STORAGE_KEY, mode)
  }, [])

  const setExportDialogOpen = useResumeStore((s) => s.setExportDialogOpen)
  const handleExport = () => setExportDialogOpen(true)

  const resumeContent = useMemo(() => {
    if (activeView === 'cover') return <CoverLetterRenderer resume={data} cl={cl} />
    return <TemplateRenderer data={data} />
  }, [activeView, data, cl])

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-paper">
      {/* ── Toolbar: view toggle, preview mode, bg, zoom ── */}
      <div className="flex flex-col gap-1.5 border-b border-warm-border bg-paper-warm px-3 py-2">
        <div className="flex items-center gap-2">
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

          <div className="flex-1" />

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-1.5 text-caption font-semibold text-white shadow-soft transition-all duration-200 hover:bg-sage/90 hover:shadow-card active:scale-95"
          >
            <FileDown size={14} />
            Export PDF
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 rounded-lg border border-warm-border bg-paper p-0.5 shadow-soft">
            {([
              { mode: 'page' as PreviewMode, icon: FileText, label: 'Page' },
              { mode: 'scroll' as PreviewMode, icon: ScrollText, label: 'Scroll' },
              { mode: 'mobile' as PreviewMode, icon: Smartphone, label: 'Mobile' },
            ]).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption font-medium transition-all duration-150 ${
                  previewMode === mode
                    ? 'bg-terracotta text-white shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-0.5 rounded-lg border border-warm-border bg-paper p-0.5 shadow-soft">
            {(['desk', 'paper', 'dark'] as BgMode[]).map((mode) => {
              const Icon = BG_ICONS[mode]
              return (
                <button
                  key={mode}
                  onClick={() => handleBgChange(mode)}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption font-medium transition-all duration-150 ${
                    bgMode === mode
                      ? 'bg-terracotta text-white shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  title={mode === 'desk' ? 'Desk surface' : mode === 'paper' ? 'White background' : 'Dark background'}
                >
                  <Icon size={12} />
                </button>
              )
            })}
          </div>

          <div className="flex-1" />

          <ZoomControls zoom={zoom} onChange={setZoom} />
        </div>
      </div>

      {/* ── Preview area ── */}
      <div ref={scrollRef} className={`relative flex-1 overflow-auto p-4 sm:p-6 ${
        bgMode === 'desk' ? 'desk-surface' : bgMode === 'paper' ? 'bg-white' : 'bg-[#1a1816]'
      }`}>
        {previewMode === 'mobile' ? (
          <div className="flex justify-center py-4">
            <div
              className="overflow-hidden rounded-[32px] border-[3px] border-ink/10 bg-white shadow-card"
              style={{ width: 375 }}
            >
              <div className="flex items-center justify-center border-b border-ink/5 py-2 text-[9px] font-medium text-ink-muted">
                <Smartphone size={10} className="mr-1.5" />
                Mobile Preview
              </div>
              <div className="overflow-y-auto" style={{ height: 667 }}>
                {resumeContent}
              </div>
            </div>
          </div>
        ) : previewMode === 'scroll' ? (
          <div
            className="mx-auto transition-transform duration-300 ease-out-expo origin-top"
            style={{
              width: PAGE_WIDTH,
              transform: zoom === ZOOM_FIT ? 'none' : `scale(${zoom})`,
              transformOrigin: 'top center',
            }}
          >
            <div className="bg-white shadow-card" style={{ width: PAGE_WIDTH }}>
              {resumeContent}
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
