import { useEffect, useState, useRef, useCallback } from 'react'
import { FileText, X, User, Briefcase, GraduationCap, Wrench, FolderOpen, Award, Languages, Palette, Mail, Save } from 'lucide-react'
import useResumeStore from '../../store/useResumeStore'
import { BUILTIN_SECTION_IDS } from '../../types'
import type { LucideIcon } from 'lucide-react'

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
  { id: 'templates',    icon: Palette,  label: 'Templates' },
  { id: 'coverletter',  icon: Mail,     label: 'Cover' },
  { id: 'saved',        icon: Save,     label: 'Saved' },
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

export default function BottomSheetNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const activeSection = useResumeStore((s) => s.activeSection)
  const setActiveSection = useResumeStore((s) => s.setActiveSection)
  const data = useResumeStore((s) => s.data)
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key === 'Tab') {
      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [onClose])

  useEffect(() => {
    if (open) {
      setMounted(true)
      triggerRef.current = document.activeElement as HTMLElement
      requestAnimationFrame(() => {
        setClosing(false)
        panelRef.current?.focus()
      })
      return
    }

    if (mounted) {
      setClosing(true)
      const timer = window.setTimeout(() => {
        setMounted(false)
        setClosing(false)
        triggerRef.current?.focus()
      }, 300)
      return () => window.clearTimeout(timer)
    }
  }, [open, mounted])

  useEffect(() => {
    if (mounted && !closing) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mounted, closing, handleKeyDown])

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
        ref={panelRef}
        tabIndex={-1}
        className={`absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-paper border-t border-warm-border shadow-elevated transition-transform duration-300 ease-out-expo focus:outline-none ${
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
