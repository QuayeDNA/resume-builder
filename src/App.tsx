import { useCallback, useEffect, useState } from 'react'
import { Menu, FileText, Eye, FileDown } from 'lucide-react'
import { useAutoSave } from './hooks/useAutoSave'
import { useSupabaseSync } from './hooks/useSupabaseSync'
import SideNav from './components/Editor/SideNav'
import EditorPanel from './components/Editor/EditorPanel'
import PreviewPanel from './components/Preview/PreviewPanel'
import SplashScreen from './components/SplashScreen'
import BottomSheetNav from './components/Mobile/BottomSheetNav'
import ExportDialog from './components/Export/ExportDialog'
import useResumeStore from './store/useResumeStore'

let splashCheckDone = false

const MOBILE_TABS = [
  { id: 'edit' as const, label: 'Edit', icon: FileText },
  { id: 'preview' as const, label: 'Preview', icon: Eye },
] as const

type MobileTabId = 'edit' | 'preview'

function MobileHeader({ onMenuToggle, mobileView, onViewChange }: {
  onMenuToggle: () => void
  mobileView: string
  onViewChange: (v: MobileTabId) => void
}) {
  const setExportDialogOpen = useResumeStore((s) => s.setExportDialogOpen)
  const handleExport = () => setExportDialogOpen(true)

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-warm-border bg-paper-warm/95 backdrop-blur-md lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-warm-border bg-paper-deep/60 text-ink-muted transition-colors hover:bg-paper-deep hover:text-ink"
            aria-label="Open navigation"
          >
            <Menu size={16} />
          </button>
          <span className="truncate font-display text-base font-bold tracking-tight text-terracotta">Resume Builder</span>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-full border border-sage/30 bg-sage-dim px-3 py-2 text-caption font-medium text-sage transition-all hover:bg-sage/20"
        >
          <FileDown size={12} />
          <span>Export</span>
        </button>
      </div>

      <div className="flex border-t border-warm-border bg-paper-warm/80">
        {MOBILE_TABS.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-2 text-caption font-medium transition-all duration-150 ${
              mobileView === view.id
                ? 'border-terracotta text-terracotta'
                : 'border-transparent text-ink-muted hover:text-ink'
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

export default function App() {
  useAutoSave()
  useSupabaseSync()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [mobileView, setMobileView] = useState<MobileTabId>('edit')

  useEffect(() => {
    if (splashCheckDone) return
    splashCheckDone = true
    const splashShown = sessionStorage.getItem('resume-builder:splash-shown')
    if (splashShown) {
      setShowSplash(false)
    } else {
      sessionStorage.setItem('resume-builder:splash-shown', 'true')
    }
  }, [])

  const handleSplashDismiss = useCallback(() => setShowSplash(false), [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          useResumeStore.getState().redo()
        } else {
          useResumeStore.getState().undo()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const exportDialogOpen = useResumeStore((s) => s.exportDialogOpen)
  const setExportDialogOpen = useResumeStore((s) => s.setExportDialogOpen)

  return (
    <>
      {showSplash && <SplashScreen onDismiss={handleSplashDismiss} />}

      <ExportDialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} />

      {/* Grain overlay */}
      <div className="grain-overlay" />

      <div className="min-h-dvh bg-paper font-body text-ink lg:grid lg:h-dvh lg:grid-cols-[max-content_minmax(20rem,24rem)_minmax(0,1fr)] lg:overflow-hidden">
        <MobileHeader
          onMenuToggle={() => setMobileNavOpen(true)}
          mobileView={mobileView}
          onViewChange={setMobileView}
        />

        <BottomSheetNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className="hidden border-r border-warm-border lg:block">
          <SideNav />
        </div>

        <div className="flex min-h-0 h-[calc(100dvh)] flex-col overflow-hidden pt-24 lg:hidden">
          {mobileView === 'edit' ? <EditorPanel /> : <PreviewPanel />}
        </div>

        <div className="hidden min-h-0 lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
          <EditorPanel />
        </div>

        <div className="hidden min-h-0 lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
          <PreviewPanel />
        </div>
      </div>
    </>
  )
}
