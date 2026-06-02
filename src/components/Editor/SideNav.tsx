import { FileText, Palette, Mail, Save, Sliders, User, Target, LogIn } from 'lucide-react'
import useResumeStore from '../../store/useResumeStore'
import useAuthStore from '../../store/useAuthStore'
import type { LucideIcon } from 'lucide-react'

const NAV_ITEMS: { id: string; icon: LucideIcon; label: string }[] = [
  { id: 'editor',       icon: FileText,   label: 'Editor' },
  { id: 'templates',    icon: Palette,    label: 'Templates' },
  { id: 'coverletter',  icon: Mail,       label: 'Cover' },
  { id: 'customize',    icon: Sliders,    label: 'Customize' },
  { id: 'jobmatch',     icon: Target,     label: 'Match' },
  { id: 'saved',        icon: Save,       label: 'Saved' },
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
      className={`group relative flex w-16 flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 transition-all duration-200 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
        isActive
          ? 'border-terracotta/50 bg-terracotta-dim text-terracotta shadow-soft'
          : 'border-transparent bg-transparent text-ink-muted hover:border-terracotta/30 hover:bg-terracotta-dim/60 hover:text-terracotta'
      }`}
    >
      <Icon
        size={22}
        strokeWidth={isActive ? 2 : 1.5}
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:scale-110"
      />
      <span className="text-[10px] font-medium leading-none tracking-wide text-current">
        {label}
      </span>
    </button>
  )
}

type SideNavProps = {
  onProfileClick?: () => void
}

export default function SideNav({ onProfileClick }: SideNavProps) {
  const activeSection = useResumeStore((s) => s.activeSection)
  const setActiveSection = useResumeStore((s) => s.setActiveSection)
  const savedAt = useResumeStore((s) => s.savedAt)

  const { user } = useAuthStore()

  const handleNavClick = (id: string) => {
    setActiveSection(id)
  }

  return (
    <nav aria-label="Sections" className="hidden h-full min-h-0 w-24 shrink-0 flex-col items-center justify-start gap-2 overflow-y-auto border-r border-warm-border bg-paper px-0 py-4 md:flex">
      {/* Logo */}
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-terracotta/40 bg-terracotta-dim font-display text-xl font-bold tracking-tight text-terracotta shadow-soft transition-all duration-200 hover:scale-105 hover:shadow-card">
        R
      </div>

      {/* Divider */}
      <div className="h-px w-8 bg-gradient-to-r from-transparent via-warm-border to-transparent" />

      {/* Main nav items */}
      <div className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto scrollbar-none">
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

      {/* Auth section */}
      {user ? (
        <button
          onClick={onProfileClick}
          aria-label="Open user settings"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-transparent bg-paper-deep text-ink-muted overflow-hidden transition-all duration-200 hover:border-terracotta/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <User size={16} />
          )}
        </button>
      ) : (
        <a
          href="/login"
          className="group relative flex w-16 flex-col items-center justify-center gap-1 rounded-xl border-2 border-transparent px-2 py-2 text-ink-muted transition-all duration-200 hover:border-terracotta/30 hover:bg-terracotta-dim/60 hover:text-terracotta"
        >
          <LogIn size={18} strokeWidth={1.5} className="transition-transform duration-200 group-hover:scale-110" />
          <span className="text-[9px] font-medium leading-none tracking-wide">Sign in</span>
        </a>
      )}
    </nav>
  )
}
