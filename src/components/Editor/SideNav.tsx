import { FileText, Palette, Mail, Save, Settings, FileDown, Sliders, User } from 'lucide-react'
import { exportToPdf } from '../../utils/pdf'
import useResumeStore from '../../store/useResumeStore'
import type { LucideIcon } from 'lucide-react'

const NAV_ITEMS: { id: string; icon: LucideIcon; label: string }[] = [
  { id: 'editor',       icon: FileText,   label: 'Editor' },
  { id: 'templates',    icon: Palette,    label: 'Templates' },
  { id: 'coverletter',  icon: Mail,       label: 'Cover' },
  { id: 'customize',    icon: Sliders,    label: 'Customize' },
  { id: 'saved',        icon: Save,       label: 'Saved' },
  { id: 'settings',     icon: Settings,   label: 'Settings' },
]

function NavButton({ id, icon: Icon, label, isActive, onClick }: {
  id: string
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      key={id}
      onClick={onClick}
      aria-label={label}
      className={`group relative flex w-16 flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 transition-all duration-200 ease-out-expo ${
        isActive
          ? 'border-terracotta/50 bg-terracotta-dim text-terracotta shadow-soft'
          : 'border-transparent bg-transparent text-ink-muted hover:border-terracotta/30 hover:bg-terracotta-dim/60 hover:text-terracotta'
      }`}
    >
      <Icon
        size={22}
        strokeWidth={isActive ? 2 : 1.5}
        className="transition-transform duration-200 group-hover:scale-110"
      />
      <span className="text-[10px] font-medium leading-none tracking-wide text-current">
        {label}
      </span>
    </button>
  )
}

export default function SideNav() {
  const activeSection = useResumeStore((s) => s.activeSection)
  const setActiveSection = useResumeStore((s) => s.setActiveSection)
  const savedAt = useResumeStore((s) => s.savedAt)
  const data = useResumeStore((s) => s.data)
  const user = useResumeStore((s) => (s as any).user) as { email?: string } | null

  const handleExport = () => exportToPdf(data.personal.name || 'resume')

  const handleNavClick = (id: string) => {
    setActiveSection(id)
  }

  return (
    <nav className="hidden h-full min-h-0 w-24 shrink-0 flex-col items-center justify-start gap-2 overflow-y-auto border-r border-warm-border bg-paper px-0 py-4 lg:flex">
      {/* Logo */}
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-terracotta/40 bg-terracotta-dim font-display text-xl font-bold tracking-tight text-terracotta shadow-soft transition-all duration-200 hover:scale-105 hover:shadow-card">
        R
      </div>

      {/* Divider */}
      <div className="h-px w-8 bg-gradient-to-r from-transparent via-warm-border to-transparent" />

      {/* Main nav items */}
      <div className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => handleNavClick(item.id)}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px w-8 bg-gradient-to-r from-transparent via-warm-border to-transparent" />

      {/* Save indicator */}
      {savedAt && (
        <div className="text-center text-[9px] font-mono tracking-wide text-ink-muted/50 px-1">
          saved
        </div>
      )}

      {/* Export button */}
      <button
        onClick={handleExport}
        aria-label="Export as PDF"
        className="group relative flex w-16 flex-col items-center justify-center gap-1 rounded-xl border-2 border-sage/40 bg-sage-dim px-2 py-2 text-sage transition-all duration-200 hover:scale-105 hover:border-sage/60 hover:shadow-soft active:scale-95"
      >
        <FileDown size={18} strokeWidth={1.5} className="transition-transform duration-200 group-hover:scale-110" />
        <span className="text-[9px] font-medium leading-none tracking-wide">Export</span>
      </button>

      {/* Divider */}
      <div className="h-px w-8 bg-gradient-to-r from-transparent via-warm-border to-transparent" />

      {/* User profile */}
      <div className="flex flex-col items-center gap-1 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-deep border border-warm-border-strong text-ink-muted">
          <User size={16} />
        </div>
        {user?.email && (
          <span className="text-[8px] text-ink-muted truncate max-w-[72px] text-center leading-tight">
            {user.email.split('@')[0]}
          </span>
        )}
      </div>
    </nav>
  )
}
