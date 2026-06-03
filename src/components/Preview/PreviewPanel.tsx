import { FileDown, FileText, FileSignature, Monitor, Sun, Moon, Smartphone, ScrollText, Printer, Crosshair } from 'lucide-react'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { TemplateRenderer, CoverLetterRenderer } from '../../Templates'
import useResumeStore from '../../store/useResumeStore'
import PageComposer from './PageComposer'
import ZoomControls, { ZOOM_FIT } from './ZoomControls'
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../Templates/theme'
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
  const [bgMode, setBgMode] = useState<BgMode>(() => getStoredBg())
  const [previewMode, setPreviewMode] = useState<PreviewMode>('page')
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const panning = useRef(false)
  const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const [fitScale, setFitScale] = useState(1)

  // Compute effective zoom — always a number
  const effectiveZoom = zoom === ZOOM_FIT ? fitScale : zoom

  const handleBgChange = useCallback((mode: BgMode) => {
    setBgMode(mode)
    localStorage.setItem(BG_STORAGE_KEY, mode)
  }, [])

  const setExportDialogOpen = useResumeStore((s) => s.setExportDialogOpen)
  const handleExport = () => setExportDialogOpen(true)

  const handleFocusPage = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const w = PAGE_WIDTH * effectiveZoom
    const h = PAGE_HEIGHT * effectiveZoom
    // Disable transition briefly, set target, then re-enable on next frame
    // so the transition always fires from the current position
    panning.current = false
    setPanX((el.clientWidth - w) / 2)
    setPanY((el.clientHeight - h) / 2)
  }, [effectiveZoom])

  const handlePanStart = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    const el = scrollRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    panning.current = true
    panStart.current = { x: e.clientX, y: e.clientY, px: panX, py: panY }
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'
  }, [panX, panY])

  const handlePanMove = useCallback((e: React.PointerEvent) => {
    if (!panning.current) return
    e.preventDefault()
    const dx = e.clientX - panStart.current.x
    const dy = e.clientY - panStart.current.y
    setPanX(panStart.current.px + dx)
    setPanY(panStart.current.py + dy)
  }, [])

  const handlePanEnd = useCallback((e: React.PointerEvent) => {
    if (!panning.current) return
    panning.current = false
    const el = scrollRef.current
    if (el) {
      try { el.releasePointerCapture(e.pointerId) } catch { /* already released */ }
      el.style.cursor = ''
      el.style.userSelect = ''
    }
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.shiftKey) {
      setPanX(p => p - e.deltaY)
    } else {
      setPanY(p => p - e.deltaY)
    }
  }, [])

  // Recalculate fit zoom when container resizes
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const updateFit = () => {
      setFitScale(Math.min(1, (el.clientWidth - 48) / PAGE_WIDTH))
    }
    updateFit()
    const ro = new ResizeObserver(updateFit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const resumeContent = useMemo(() => {
    if (activeView === 'cover') return <CoverLetterRenderer resume={data} cl={cl} />
    return <TemplateRenderer data={data} />
  }, [activeView, data, cl])

  return (
    <section aria-label="Preview" className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-paper">
      {/* ── Toolbar: view toggle, preview mode, bg, zoom ── */}
      <div className="flex flex-col gap-1 sm:gap-1.5 border-b border-warm-border bg-paper-warm px-2 sm:px-3 py-1.5 sm:py-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex gap-0.5 rounded-lg border border-warm-border bg-paper p-0.5 shadow-soft">
            <button
              onClick={() => setActiveView('resume')}
              className={`inline-flex items-center gap-1 rounded-md px-1.5 sm:px-2.5 py-1 text-caption font-medium transition-all duration-150 ${
                activeView === 'resume'
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <FileText size={12} />
              <span className="hidden sm:inline">Resume</span>
            </button>
            <button
              onClick={() => setActiveView('cover')}
              className={`inline-flex items-center gap-1 rounded-md px-1.5 sm:px-2.5 py-1 text-caption font-medium transition-all duration-150 ${
                activeView === 'cover'
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <FileSignature size={12} />
              <span className="hidden sm:inline">Cover</span>
            </button>
          </div>

          <div className="flex-1" />

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-sage px-2.5 sm:px-4 py-1 sm:py-1.5 text-caption font-semibold text-white shadow-soft transition-all duration-200 hover:bg-sage/90 hover:shadow-card active:scale-95"
          >
            <FileDown size={14} />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden" aria-label="Export PDF">PDF</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <div className="flex gap-0.5 rounded-lg border border-warm-border bg-paper p-0.5 shadow-soft">
            {([
              { mode: 'page' as PreviewMode, icon: FileText, label: 'Page' },
              { mode: 'scroll' as PreviewMode, icon: ScrollText, label: 'Scroll' },
              { mode: 'mobile' as PreviewMode, icon: Smartphone, label: 'Mobile' },
            ]).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                aria-label={`${label} preview`}
                aria-pressed={previewMode === mode}
                className={`inline-flex items-center gap-1 rounded-md px-1.5 sm:px-2 py-1 text-caption font-medium transition-all duration-150 ${
                  previewMode === mode
                    ? 'bg-terracotta text-white shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Icon size={12} aria-hidden="true" />
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
                  aria-label={mode === 'desk' ? 'Desk background' : mode === 'paper' ? 'White background' : 'Dark background'}
                  aria-pressed={bgMode === mode}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption font-medium transition-all duration-150 ${
                    bgMode === mode
                      ? 'bg-terracotta text-white shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  title={mode === 'desk' ? 'Desk surface' : mode === 'paper' ? 'White background' : 'Dark background'}
                >
                  <Icon size={12} aria-hidden="true" />
                </button>
              )
            })}
          </div>

          <div className="flex-1" />

          <ZoomControls zoom={zoom} onChange={setZoom} />
        </div>
      </div>

      {/* ── Preview area (drag to pan, no scroll bounds) ── */}
      <div
        ref={scrollRef}
        onPointerDown={handlePanStart}
        onPointerMove={handlePanMove}
        onPointerUp={handlePanEnd}
        onPointerLeave={handlePanEnd}
        onWheel={handleWheel}
        className={`relative flex-1 overflow-hidden cursor-grab touch-none ${
          bgMode === 'desk' ? 'desk-surface' : bgMode === 'paper' ? 'bg-white' : 'bg-[#1a1816]'
        }`}
      >
        <div
          style={{
            transform: previewMode === 'mobile'
              ? `translate(${panX}px, ${panY}px)`
              : `translate(${panX}px, ${panY}px) scale(${effectiveZoom})`,
            transformOrigin: '0 0',
            transition: panning.current ? 'none' : 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            width: previewMode === 'mobile' ? undefined : PAGE_WIDTH,
          }}
        >
          {previewMode === 'mobile' ? (
            <div className="rounded-[32px] border-[3px] border-ink/10 bg-white shadow-card" style={{ width: 375 }}>
              <div className="flex items-center justify-center border-b border-ink/5 py-2 text-[9px] font-medium text-ink-muted">
                <Smartphone size={10} className="mr-1.5" />
                Mobile Preview
              </div>
              <div className="overflow-y-auto" style={{ height: 667 }}>
                {resumeContent}
              </div>
            </div>
          ) : previewMode === 'scroll' ? (
            <div className="bg-white shadow-card" style={{ width: PAGE_WIDTH }}>
              {resumeContent}
            </div>
          ) : (
            <PageComposer key={`${activeView}-${data.template}`}>
              {resumeContent}
            </PageComposer>
          )}
        </div>
      </div>

      {/* ── Focus page button ── */}
      <button
        onClick={handleFocusPage}
        className="absolute bottom-6 right-6 z-10 flex items-center gap-1.5 rounded-full border border-warm-border bg-paper-warm px-3 py-2 text-caption font-medium text-ink-muted shadow-card transition-all duration-200 hover:bg-paper-deep hover:text-ink hover:shadow-elevated active:scale-95"
        title="Center preview on page"
        aria-label="Focus on page"
      >
        <Crosshair size={12} />
        <span className="hidden sm:inline">Focus</span>
      </button>
    </section>
  )
}
