import { useEffect, useState } from 'react'
import { Menu, X, FileText, Eye, FileDown, User, Briefcase, GraduationCap, Wrench, FolderOpen, Award, Languages, Palette, Mail, Save, Settings } from 'lucide-react'
import { useAutoSave } from './hooks/useAutoSave'
import { useSupabaseSync } from './hooks/useSupabaseSync'
import SideNav from './components/Editor/SideNav'
import EditorPanel from './components/Editor/EditorPanel'
import PreviewPanel from './components/Preview/PreviewPanel'
import SplashScreen from './components/SplashScreen'
import useResumeStore from './store/useResumeStore'
import { exportToPdf } from './utils/pdf'
import { BUILTIN_SECTION_IDS, TOOL_SECTION_IDS } from './types'
import type { LucideIcon } from 'lucide-react'

const MOBILE_TABS = [
  { id: 'edit' as const, label: 'Edit', icon: FileText },
  { id: 'preview' as const, label: 'Preview', icon: Eye },
] as const

type MobileTabId = 'edit' | 'preview'

const BUILTIN_ICONS: Record<string, LucideIcon> = {
  personal:       User,
  experience:     Briefcase,
  education:      GraduationCap,
  skills:         Wrench,
  projects:       FolderOpen,
  certifications: Award,
  languages:      Languages,
}

const TOOL_ITEMS: { id: string; icon: LucideIcon; label: string }[] = [
  { id: 'templates',    icon: Palette, label: 'Templates' },
  { id: 'coverletter',  icon: Mail,    label: 'Cover' },
  { id: 'saved',        icon: Save,    label: 'Saved' },
  { id: 'settings',     icon: Settings,label: 'Settings' },
]

const SECTION_LABELS: Record<string, string> = {
  personal:       'Personal Info',
  experience:     'Experience',
  education:      'Education',
  skills:         'Skills',
  projects:       'Projects',
  certifications: 'Certifications',
  languages:      'Languages',
}

function MobileHeader({ onMenuToggle, mobileView, onViewChange }: {
  onMenuToggle: () => void
  mobileView: string
  onViewChange: (v: MobileTabId) => void
}) {
  const data = useResumeStore((s) => s.data)
  const handleExport = () => exportToPdf(data.personal.name || 'resume')

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

function BottomSheetNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const activeSection = useResumeStore((s) => s.activeSection)
  const setActiveSection = useResumeStore((s) => s.setActiveSection)
  const data = useResumeStore((s) => s.data)
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
      }, 300)
      return () => window.clearTimeout(timer)
    }
  }, [open, mounted])

  if (!mounted) return null

  const sectionOrder = data.sectionOrder || BUILTIN_SECTION_IDS

  const handleClick = (id: string) => {
    setActiveSection(id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={onClose}
      />

      <div
        className={`absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-paper border-t border-warm-border shadow-elevated transition-transform duration-300 ease-out-expo ${
          closing ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-warm-border">
          <span className="text-subheading text-ink font-medium">Navigate</span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-deep text-ink-muted hover:text-ink transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-3">
          {/* Sections */}
          <p className="text-label text-ink-muted uppercase mb-1.5 px-2">Sections</p>
          <div className="space-y-0.5 mb-3">
            {sectionOrder.map((id) => {
              const isCustom = id.startsWith('custom_')
              const cs = isCustom ? data.customSections.find((c) => `custom_${c.id}` === id) : null
              const Icon = isCustom ? FileText : (BUILTIN_ICONS[id] || FileText)
              const label = isCustom
                ? (cs?.name?.trim() || 'Custom Section')
                : (SECTION_LABELS[id] || id)
              return (
                <button
                  key={id}
                  onClick={() => handleClick(id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-body transition-all duration-150 ${
                    activeSection === id
                      ? 'bg-terracotta-dim text-terracotta font-medium'
                      : 'text-ink-soft hover:bg-paper-deep hover:text-ink'
                  }`}
                >
                  <Icon size={16} strokeWidth={activeSection === id ? 2 : 1.5} />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Tools */}
          <p className="text-label text-ink-muted uppercase mb-1.5 px-2">Tools</p>
          <div className="space-y-0.5">
            {TOOL_ITEMS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleClick(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-body transition-all duration-150 ${
                  activeSection === id
                    ? 'bg-terracotta-dim text-terracotta font-medium'
                    : 'text-ink-soft hover:bg-paper-deep hover:text-ink'
                }`}
              >
                <Icon size={16} strokeWidth={activeSection === id ? 2 : 1.5} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  useAutoSave()
  useSupabaseSync()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [mobileView, setMobileView] = useState<MobileTabId>('edit')

  useEffect(() => {
    const splashShown = sessionStorage.getItem('resume-builder:splash-shown')
    if (splashShown) {
      setShowSplash(false)
    } else {
      sessionStorage.setItem('resume-builder:splash-shown', 'true')
    }
  }, [])

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

  return (
    <>
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}

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
