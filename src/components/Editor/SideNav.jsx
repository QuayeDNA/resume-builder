import { FileDown } from 'lucide-react'
import { exportToPdf } from '../../utils/pdf'
import useResumeStore from '../../store/useResumeStore'

const NAV_ITEMS = [
  { id: 'personal',       icon: '◈', label: 'Info'     },
  { id: 'experience',     icon: '◉', label: 'Work'     },
  { id: 'education',      icon: '◑', label: 'Edu'      },
  { id: 'skills',         icon: '⬡', label: 'Skills'   },
  { id: 'projects',       icon: '◆', label: 'Projects' },
  { id: 'certifications', icon: '◇', label: 'Certs'    },
  { id: 'languages',      icon: '◎', label: 'Lang'     },
  { id: 'coverletter',    icon: '✉', label: 'Cover'    },
  { id: 'design',         icon: '◻', label: 'Design'   },
  { id: 'saved',          icon: '⊞', label: 'Saved'    },
]

export default function SideNav() {
  const activeSection   = useResumeStore((s) => s.activeSection)
  const setActiveSection = useResumeStore((s) => s.setActiveSection)
  const savedAt         = useResumeStore((s) => s.savedAt)
  const data            = useResumeStore((s) => s.data)

  const handleExport = () => exportToPdf('resume-preview', data.personal.name || 'resume')

  return (
    <nav className="w-14 bg-[#040408] flex flex-col items-center py-3 gap-0.5 border-r border-[#0c0c1c] flex-shrink-0">
      {/* Logo */}
      <div className="font-display text-brand-500 text-base font-bold mb-3 mt-1">R</div>

      {/* Nav items */}
      {NAV_ITEMS.map((n) => (
        <button
          key={n.id}
          onClick={() => setActiveSection(n.id)}
          title={n.label}
          className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${
            activeSection === n.id
              ? 'bg-brand-500/10 text-brand-400'
              : 'bg-transparent text-[#2e2e4e] hover:text-[#5e5e8e]'
          }`}
        >
          <span className="text-[13px] leading-none">{n.icon}</span>
          <span className="text-[6px] font-mono tracking-[0.2px]">{n.label}</span>
        </button>
      ))}

      <div className="flex-1" />

      {/* Auto-save indicator */}
      {savedAt && (
        <div className="text-[6px] text-[#1a1a30] font-mono mb-1 text-center leading-tight">
          auto<br/>saved
        </div>
      )}

      {/* Export button */}
      <button
        onClick={handleExport}
        title="Export PDF"
        className="w-11 h-11 rounded-lg bg-[#0c1e0c] text-[#3a8a3a] flex items-center justify-center hover:bg-[#122012] transition-colors mb-1"
      >
        <FileDown size={15} />
      </button>
    </nav>
  )
}
