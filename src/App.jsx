import { useEffect, useState } from 'react'
import { Menu, X, FileText, Eye, FileDown } from 'lucide-react'
import { useAutoSave } from './hooks/useAutoSave'
import SideNav, { NAV_ITEMS } from './components/Editor/SideNav'
import EditorPanel from './components/Editor/EditorPanel'
import PreviewPanel from './components/Preview/PreviewPanel'
import useResumeStore from './store/useResumeStore'
import { exportToPdf } from './utils/pdf'

function MobileHeader({ onMenuToggle, mobileView, onViewChange }) {
  const data = useResumeStore((s) => s.data)
  const handleExport = () => exportToPdf('resume-preview', data.personal.name || 'resume')

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-hairline bg-obsidian/95 backdrop-blur-md lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-elevated/60 text-text-muted transition-colors hover:bg-elevated hover:text-primary"
            aria-label="Open navigation"
          >
            <Menu size={16} />
          </button>
          <span className="truncate font-display text-base font-bold tracking-tight text-brand">Resume Builder</span>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-xl border border-success/20 bg-success-subtle px-3 py-2 text-caption font-medium text-success transition-all hover:bg-success/15"
        >
          <FileDown size={12} />
          <span>Export</span>
        </button>
      </div>

      <div className="flex border-t border-hairline bg-surface/80">
        {[
          { id: 'edit', label: 'Edit', icon: FileText },
          { id: 'preview', label: 'Preview', icon: Eye },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-2 text-caption font-medium transition-all duration-100 ${
              mobileView === view.id
                ? 'border-brand text-brand'
                : 'border-transparent text-text-muted hover:text-primary'
            }`}
          >
            <view.icon size={12} />
            {view.label}
          </button>
        ))}
      </div>
    </header>
  )
}

function RadialNavOverlay({ open, onClose }) {
  const activeSection = useResumeStore((s) => s.activeSection)
  const setActiveSection = useResumeStore((s) => s.setActiveSection)
  const setMobileView = useResumeStore((s) => s.setActiveView)
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => setClosing(false))
      return
    }

    if (mounted) {
      setClosing(true)
      const timer = window.setTimeout(() => {
        setMounted(false)
        setClosing(false)
      }, 220)

      return () => window.clearTimeout(timer)
    }
  }, [open, mounted])

  if (!mounted) return null

  const radius = 108
  const startAngle = -90
  const step = 360 / NAV_ITEMS.length
  const ringMask = {
    WebkitMaskImage: 'radial-gradient(circle, transparent 0 41%, #000 42% 61%, transparent 62% 100%)',
    maskImage: 'radial-gradient(circle, transparent 0 41%, #000 42% 61%, transparent 62% 100%)',
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation overlay"
        className={`absolute inset-0 bg-void/80 backdrop-blur-[2px] transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`relative h-[min(24rem,86vw)] w-[min(24rem,86vw)] max-h-[24rem] max-w-[24rem] overflow-visible transition-all duration-200 ease-out ${
            closing ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-full border border-hairline bg-[radial-gradient(circle_at_center,rgba(124,111,255,0.18)_0_38%,rgba(124,111,255,0.12)_39_46%,rgba(124,111,255,0.06)_47_53%,rgba(15,15,24,0.94)_54_100%)] shadow-preview transition-all duration-300 ease-out"
            style={{
              transform: closing ? 'scale(0.94) rotate(-8deg)' : 'scale(1) rotate(0deg)',
              ...ringMask,
            }}
          />

          <button
            type="button"
            onClick={onClose}
            className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface/95 text-primary shadow-preview transition-all duration-200 hover:scale-105 hover:border-brand/30"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>

          {NAV_ITEMS.map((item, index) => {
            const angle = startAngle + index * step
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveSection(item.id)
                  setMobileView('edit')
                  onClose()
                }}
                title={item.label}
                aria-label={item.label}
                className={`group absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[9px] font-medium shadow-preview transition-[transform,opacity,border-color,background-color,box-shadow] duration-200 ease-out hover:[--radial-scale:1.08] ${
                  isActive
                    ? 'border-brand/40 bg-brand-subtle text-brand'
                    : 'border-hairline bg-surface/95 text-secondary hover:border-subtle hover:text-primary'
                }`}
                style={{
                  '--radial-scale': closing ? 0.92 : isActive ? 1.08 : 1,
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg) scale(var(--radial-scale))`,
                }}
              >
                <item.icon size={14} strokeWidth={isActive ? 2 : 1.5} className="transition-transform duration-200 group-hover:scale-110" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  useAutoSave()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mobileView = useResumeStore((s) => s.activeView)
  const setMobileView = useResumeStore((s) => s.setActiveView)

  return (
    <div className="min-h-dvh bg-void font-sans text-primary lg:grid lg:h-dvh lg:grid-cols-[max-content_minmax(20rem,24rem)_minmax(0,1fr)] lg:overflow-hidden">
      <MobileHeader
        onMenuToggle={() => setMobileNavOpen(true)}
        mobileView={mobileView}
        onViewChange={setMobileView}
      />

      <RadialNavOverlay open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="hidden border-r border-hairline lg:block">
        <SideNav />
      </div>

      <div className="min-h-0 pt-28 lg:hidden">
        {mobileView === 'edit' ? <EditorPanel /> : <PreviewPanel />}
      </div>

      <div className="hidden min-h-0 lg:block lg:overflow-hidden">
        <EditorPanel />
      </div>

      <div className="hidden min-h-0 lg:block lg:overflow-hidden">
        <PreviewPanel />
      </div>
    </div>
  )
}