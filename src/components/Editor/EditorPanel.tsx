import { Undo2, Redo2, Eye, EyeOff } from 'lucide-react'
import useResumeStore from '../../store/useResumeStore'
import Card from '../UI/Card'
import PersonalSection       from './PersonalSection'
import SkillsSection         from './SkillsSection'
import CoverLetterSection    from './CoverLetterSection'
import DesignSection         from './DesignSection'
import SavedSection          from './SavedSection'
import CustomSectionEditor  from './CustomSectionEditor'
import AtsChecker           from './AtsChecker'
import { GenericSection, ENTRY_SECTIONS } from './sectionConfigs'
import { BUILTIN_SECTION_IDS } from '../../types'

const BUILTIN_SECTION_KEYS: Record<string, () => JSX.Element> = {
  personal: () => <PersonalSection />,
  skills:   () => <SkillsSection />,
}

const SPECIAL_VIEWS: Record<string, { label: string; render: () => JSX.Element }> = {
  coverletter: { label: 'Cover Letter', render: () => <CoverLetterSection /> },
  templates:   { label: 'Templates',     render: () => <DesignSection /> },
  saved:       { label: 'Saved Resumes', render: () => <SavedSection /> },
}

function SectionRenderer({ section }: { section: string }) {
  const customSections = useResumeStore((s) => s.data.customSections)

  /* Entry-based sections (via GenericSection) */
  if (ENTRY_SECTIONS[section]) return <GenericSection config={ENTRY_SECTIONS[section]} />
  /* Simple built-in sections (personal, skills) */
  if (BUILTIN_SECTION_KEYS[section]) return BUILTIN_SECTION_KEYS[section]()
  /* Custom sections */
  if (section.startsWith('custom_')) {
    const id = parseInt(section.replace('custom_', ''), 10)
    const cs = customSections.find((c) => c.id === id)
    if (cs) return <CustomSectionEditor section={cs} />
  }
  return null
}

export default function EditorPanel() {
  const activeSection = useResumeStore((s) => s.activeSection)
  const data = useResumeStore((s) => s.data)
  const addCustomSection = useResumeStore((s) => s.addCustomSection)
  const toggleSectionVisibility = useResumeStore((s) => s.toggleSectionVisibility)
  const sectionOrder = data.sectionOrder || BUILTIN_SECTION_IDS
  const hiddenSections = data.hiddenSections || []

  if (SPECIAL_VIEWS[activeSection]) {
    const view = SPECIAL_VIEWS[activeSection]
    return (
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden border-r border-warm-border bg-paper lg:h-full lg:max-h-none lg:w-full lg:max-w-[24rem] xl:max-w-[26rem]">
        <div className="flex-shrink-0 border-b border-warm-border bg-paper-warm px-4 py-3">
          <h2 className="text-heading text-ink font-display font-semibold">{view.label}</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 animate-fade-up">
          {view.render()}
        </div>
      </div>
    )
  }

  if (activeSection === 'settings') {
    return (
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden border-r border-warm-border bg-paper lg:h-full lg:max-h-none lg:w-full lg:max-w-[24rem] xl:max-w-[26rem]">
        <div className="flex-shrink-0 border-b border-warm-border bg-paper-warm px-4 py-3">
          <h2 className="text-heading text-ink font-display font-semibold">Settings</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 animate-fade-up">
          <Card title="Account">
            <p className="text-body text-ink-soft">Account settings coming soon.</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden border-r border-warm-border bg-paper lg:h-full lg:max-h-none lg:w-full lg:max-w-[24rem] xl:max-w-[26rem]">
      <div className="flex-shrink-0 border-b border-warm-border bg-paper-warm px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-heading text-ink font-display font-semibold">Editor</h2>
          <div className="flex gap-1">
            <button
              onClick={() => useResumeStore.getState().undo()}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-muted hover:bg-paper-deep hover:text-ink transition-colors"
              aria-label="Undo (Ctrl+Z)"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={() => useResumeStore.getState().redo()}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-muted hover:bg-paper-deep hover:text-ink transition-colors"
              aria-label="Redo (Ctrl+Shift+Z)"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={14} />
            </button>
          </div>
        </div>
        <p className="text-caption text-ink-muted mt-0.5">Build your resume section by section</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {sectionOrder.map((section, index) => {
          const hidden = hiddenSections.includes(section)
          return (
            <div
              key={section}
              className={`animate-fade-up relative group ${hidden ? 'opacity-50' : ''}`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <button
                onClick={() => toggleSectionVisibility(section)}
                className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-paper-warm/80 text-ink-muted opacity-0 group-hover:opacity-100 hover:bg-paper-deep hover:text-ink transition-all duration-150"
                title={hidden ? 'Show in preview' : 'Hide from preview'}
                aria-label={hidden ? 'Show in preview' : 'Hide from preview'}
              >
                {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
              <SectionRenderer section={section} />
            </div>
          )
        })}

        <div className="animate-fade-up">
          <Card title="ATS Checker">
            <AtsChecker />
          </Card>
        </div>

        <button
          onClick={addCustomSection}
          className="w-full border-2 border-dashed border-warm-border-strong text-ink-muted rounded-xl py-3 text-label hover:border-terracotta/50 hover:text-terracotta hover:bg-terracotta-dim transition-all duration-200"
        >
          + Add Custom Section
        </button>
      </div>
    </div>
  )
}
