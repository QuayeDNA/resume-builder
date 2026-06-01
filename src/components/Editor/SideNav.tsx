import { FileDown, User, Briefcase, GraduationCap, Wrench, FolderOpen, Award, Languages, Mail, Palette, Save, Plus, FileText } from 'lucide-react'
import { exportToPdf } from '../../utils/pdf'
import useResumeStore from '../../store/useResumeStore'
import SortableList from '../SortableList'
import { BUILTIN_SECTION_IDS, TOOL_SECTION_IDS } from '../../types'
import type { LucideIcon } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'

const BUILTIN_ICONS: Record<string, LucideIcon> = {
  personal:       User,
  experience:     Briefcase,
  education:      GraduationCap,
  skills:         Wrench,
  projects:       FolderOpen,
  certifications: Award,
  languages:      Languages,
}

const TOOL_NAV_ITEMS: { id: string; icon: LucideIcon; label: string }[] = [
  { id: 'coverletter', icon: Mail,    label: 'Cover' },
  { id: 'design',      icon: Palette, label: 'Design' },
  { id: 'saved',       icon: Save,    label: 'Saved' },
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
      className={`group relative flex w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 px-2 py-2 transition-all duration-200 ease-out ${
        isActive
          ? 'border-brand/60 bg-brand-subtle text-brand shadow-lg shadow-brand/25'
          : 'border-transparent bg-transparent text-secondary hover:border-brand/40 hover:bg-elevated/40 hover:text-brand'
      }`}
    >
      {isActive && (
        <div className="absolute inset-0 rounded-lg bg-brand/5 blur-md" aria-hidden="true" />
      )}
      <Icon
        size={20}
        strokeWidth={isActive ? 2 : 1.5}
        className="relative z-10 transition-transform duration-200 group-hover:scale-110"
      />
      <span className="relative z-10 text-[9px] font-medium leading-none tracking-wide text-current">
        {label}
      </span>
    </button>
  )
}

function SortableNavButton({ id, icon: Icon, label, isActive, onClick }: {
  id: string
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 0,
    position: 'relative' as const,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        onClick={onClick}
        aria-label={label}
        className={`group relative flex w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 px-2 py-2 transition-all duration-200 ease-out ${
          isActive
            ? 'border-brand/60 bg-brand-subtle text-brand shadow-lg shadow-brand/25'
            : 'border-transparent bg-transparent text-secondary hover:border-brand/40 hover:bg-elevated/40 hover:text-brand'
        }`}
      >
        {isActive && (
          <div className="absolute inset-0 rounded-lg bg-brand/5 blur-md" aria-hidden="true" />
        )}
        <Icon
          size={20}
          strokeWidth={isActive ? 2 : 1.5}
          className="relative z-10 transition-transform duration-200 group-hover:scale-110"
        />
        <span className="relative z-10 text-[9px] font-medium leading-none tracking-wide text-current">
          {label}
        </span>
      </button>
    </div>
  )
}

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
  const addCustomSection = useResumeStore((s) => s.addCustomSection)
  const reorderNavSection = useResumeStore((s) => s.reorderNavSection)

  const handleExport = () => exportToPdf('resume-preview', data.personal.name || 'resume')

  const sectionOrder = data.sectionOrder || BUILTIN_SECTION_IDS

  const getNavItem = (id: string) => {
    if (id.startsWith('custom_')) {
      const customSection = data.customSections.find((cs) => `custom_${cs.id}` === id)
      return {
        id,
        icon: FileText,
        label: customSection?.name?.trim() ? customSection.name : 'Custom',
      }
    }
    return {
      id,
      icon: BUILTIN_ICONS[id] || FileText,
      label: id.charAt(0).toUpperCase() + id.slice(1),
    }
  }

  return (
    <nav className="hidden h-full min-h-0 w-28 shrink-0 flex-col items-center justify-start gap-2 overflow-y-auto border-r border-hairline bg-void px-0 py-4 lg:flex">
      {/* Logo */}
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl border border-brand/40 bg-brand-subtle font-display text-lg font-bold tracking-tight text-brand shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-brand/20">
        R
      </div>

      {/* Divider */}
      <div className="h-px w-8 bg-gradient-to-r from-transparent via-hairline to-transparent" />

      {/* Resume Content Sections — reorderable */}
      <div className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <SortableList
          items={sectionOrder}
          getId={(id) => id}
          onReorder={reorderNavSection}
        >
          {(id) => {
            const item = getNavItem(id)
            return (
              <SortableNavButton
                id={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
              />
            )
          }}
        </SortableList>

        {/* Add Section button */}
        <button
          onClick={addCustomSection}
          aria-label="Add custom section"
          className="flex w-16 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-subtle px-2 py-2 text-text-muted transition-all duration-200 hover:border-brand/40 hover:text-brand"
        >
          <Plus size={16} strokeWidth={1.5} />
          <span className="text-[9px] font-medium leading-none tracking-wide">Add</span>
        </button>
      </div>

      {/* Divider */}
      <div className="h-px w-8 bg-gradient-to-r from-transparent via-hairline to-transparent" />

      {/* Tool sections — fixed */}
      <div className="flex flex-col items-center gap-1.5">
        {TOOL_NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
          />
        ))}
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
