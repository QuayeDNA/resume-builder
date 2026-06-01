import { FileDown, User, Briefcase, GraduationCap, Wrench, FolderOpen, Award, Languages, Mail, Palette, Save } from 'lucide-react'
import { exportToPdf } from '../../utils/pdf'
import useResumeStore from '../../store/useResumeStore'

export const NAV_ITEMS = [
  { id: 'personal',       icon: User,           label: 'Info'     },
  { id: 'experience',     icon: Briefcase,      label: 'Work'     },
  { id: 'education',      icon: GraduationCap,  label: 'Edu'      },
  { id: 'skills',         icon: Wrench,         label: 'Skills'   },
  { id: 'projects',       icon: FolderOpen,     label: 'Projects' },
  { id: 'certifications', icon: Award,          label: 'Certs'    },
  { id: 'languages',      icon: Languages,      label: 'Lang'     },
  { id: 'coverletter',    icon: Mail,           label: 'Cover'    },
  { id: 'design',         icon: Palette,        label: 'Design'   },
  { id: 'saved',          icon: Save,           label: 'Saved'    },
]

export default function SideNav() {
  const activeSection    = useResumeStore((s) => s.activeSection)
  const setActiveSection = useResumeStore((s) => s.setActiveSection)
  const savedAt          = useResumeStore((s) => s.savedAt)
  const data             = useResumeStore((s) => s.data)

  const handleExport = () => exportToPdf('resume-preview', data.personal.name || 'resume')

  return (
    <nav className="hidden h-full min-h-0 w-20 shrink-0 flex-col items-center justify-start gap-2 overflow-y-auto border-r border-hairline bg-void px-0 py-4 lg:flex">
      {/* Logo */}
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl border border-brand/40 bg-brand-subtle font-display text-lg font-bold tracking-tight text-brand shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-brand/20">
        R
      </div>

      {/* Divider */}
      <div className="h-px w-8 bg-gradient-to-r from-transparent via-hairline to-transparent" />

      {/* Nav Items */}
      <div className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {NAV_ITEMS.map((n) => {
          const isActive = activeSection === n.id

          return (
            <button
              key={n.id}
              onClick={() => setActiveSection(n.id)}
              aria-label={n.label}
              className={`group relative flex w-16 flex-col items-center justify-center gap-1 rounded-lg border-2 px-2 py-2 transition-all duration-200 ease-out ${
                isActive
                  ? 'border-brand/60 bg-brand-subtle text-brand shadow-lg shadow-brand/25'
                  : 'border-transparent bg-transparent text-secondary hover:border-brand/40 hover:bg-elevated/40 hover:text-brand'
              }`}
            >
              {/* Active state glow effect */}
              {isActive && (
                <div className="absolute inset-0 rounded-lg bg-brand/5 blur-md" aria-hidden="true" />
              )}

              {/* Icon with smooth scale */}
              <n.icon
                size={20}
                strokeWidth={isActive ? 2 : 1.5}
                className="relative z-10 transition-transform duration-200 group-hover:scale-110"
              />

              {/* Label text */}
              <span className="relative z-10 text-[9px] font-medium leading-none tracking-wide text-current">
                {n.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="h-px w-8 bg-gradient-to-r from-transparent via-hairline to-transparent" />

      {/* Save indicator */}
      {savedAt && (
        <div className="text-center text-[9px] font-mono tracking-wide text-text-muted/50 px-1">
          saved
        </div>
      )}

      {/* Export button */}
      <button
        onClick={handleExport}
        aria-label="Export as PDF"
        className="group relative flex w-16 flex-col items-center justify-center gap-1 rounded-lg border-2 border-success/40 bg-success-subtle px-2 py-2 text-success transition-all duration-200 hover:scale-105 hover:border-success/60 hover:shadow-lg hover:shadow-success/20 active:scale-95"
      >
        <FileDown size={20} strokeWidth={1.5} className="transition-transform duration-200 group-hover:scale-110" />
        <span className="text-[9px] font-medium leading-none tracking-wide">Export</span>
      </button>
    </nav>
  )
}
