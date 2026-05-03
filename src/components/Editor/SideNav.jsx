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
    <nav className="hidden h-full min-h-0 w-max shrink-0 flex-col items-stretch gap-1 overflow-y-auto border-r border-hairline bg-void px-2 py-3 lg:flex">
      <div className="mb-3 flex h-11 w-max items-center justify-center rounded-xl border border-hairline bg-elevated/60 px-3 font-display text-base font-bold tracking-tight text-brand">
        R
      </div>

      {NAV_ITEMS.map((n) => {
        const isActive = activeSection === n.id
        return (
          <button
            key={n.id}
            onClick={() => setActiveSection(n.id)}
            title={n.label}
            className={`flex h-11 w-max min-w-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-xl border px-3 transition-all duration-100 ${
              isActive
                ? 'border-brand/30 bg-brand-subtle text-brand'
                : 'border-transparent bg-transparent text-text-muted hover:border-subtle hover:bg-elevated/50 hover:text-primary'
            }`}
          >
            <n.icon size={14} strokeWidth={isActive ? 2 : 1.5} />
            <span className="text-[7px] font-mono tracking-wide leading-none">{n.label}</span>
          </button>
        )
      })}

      <div className="min-h-3 flex-1" />

      {savedAt && (
        <div className="mb-1 px-1 text-center font-mono text-[7px] leading-tight text-text-muted/40">
          saved
        </div>
      )}

      <button
        onClick={handleExport}
        title="Export PDF"
        className="mb-1 flex h-11 w-max min-w-[3.5rem] items-center justify-center rounded-xl border border-success/20 bg-success-subtle px-3 text-success transition-all duration-100 hover:bg-success/15"
      >
        <FileDown size={14} />
      </button>
    </nav>
  )
}
