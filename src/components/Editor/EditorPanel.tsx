import { Undo2, Redo2, Eye, EyeOff, Activity } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useResumeStore from '../../store/useResumeStore'
import { Button, IconButton } from '../UI'

import PersonalSection       from './PersonalSection'
import SkillsSection         from './SkillsSection'
import CoverLetterSection    from './CoverLetterSection'
import DesignSection         from './DesignSection'
import CustomizationPanel    from './CustomizationPanel'
import SavedSection          from './SavedSection'
import CustomSectionEditor  from './CustomSectionEditor'
import JobMatchPanel        from './JobMatchPanel'
import { GenericSection, ENTRY_SECTIONS } from './sectionConfigs'
import { BUILTIN_SECTION_IDS } from '../../types'
import { DragHandleContext } from './DragHandleContext'

const BUILTIN_SECTION_KEYS: Record<string, () => JSX.Element> = {
  personal: () => <PersonalSection />,
  skills:   () => <SkillsSection />,
}

const SPECIAL_VIEWS: Record<string, { label: string; render: () => JSX.Element }> = {
  coverletter: { label: 'Cover Letter', render: () => <CoverLetterSection /> },
  templates:   { label: 'Templates',     render: () => <DesignSection /> },
  customize:   { label: 'Customize',     render: () => <CustomizationPanel /> },
  saved:       { label: 'Saved Resumes', render: () => <SavedSection /> },
  jobmatch:    { label: 'Job Match',     render: () => <JobMatchPanel /> },
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

function DraggableSection({ section, hidden, children }: { section: string; hidden: boolean; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: section })
  const toggleSectionVisibility = useResumeStore((s) => s.toggleSectionVisibility)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 10 : 0,
  }

  return (
    <DragHandleContext.Provider value={{ attributes, listeners, setActivatorNodeRef }}>
      <div ref={setNodeRef} style={style} className={`animate-fade-up relative group ${hidden ? 'opacity-50' : ''}`}>
        <div className="flex-1 min-w-0">{children}</div>
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <IconButton
            onClick={() => toggleSectionVisibility(section)}
            variant="ghost"
            size="sm"
            title={hidden ? 'Show in preview' : 'Hide from preview'}
            aria-label={hidden ? 'Show in preview' : 'Hide from preview'}
          >
            {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
          </IconButton>
        </div>
      </div>
    </DragHandleContext.Provider>
  )
}

export default function EditorPanel() {
  const activeSection = useResumeStore((s) => s.activeSection)
  const data = useResumeStore((s) => s.data)
  const addCustomSection = useResumeStore((s) => s.addCustomSection)
  const reorderNavSection = useResumeStore((s) => s.reorderNavSection)
  const sectionOrder = data.sectionOrder || BUILTIN_SECTION_IDS
  const hiddenSections = data.hiddenSections || []

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = sectionOrder.indexOf(active.id as string)
    const to = sectionOrder.indexOf(over.id as string)
    if (from !== -1 && to !== -1) reorderNavSection(from, to)
  }

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
          <div className="rounded-xl border border-warm-border bg-paper-deep/30 p-4">
            <p className="text-body text-ink-soft">Account settings coming soon.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section aria-label="Editor" className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden border-r border-warm-border bg-paper lg:h-full lg:max-h-none lg:w-full lg:max-w-[24rem] xl:max-w-[26rem]">
      <div className="flex-shrink-0 border-b border-warm-border bg-paper-warm px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-heading text-ink font-display font-semibold">Editor</h2>
          <div className="flex gap-1">
            <IconButton
              onClick={() => useResumeStore.getState().setAtsDialogOpen(true)}
              variant="ghost"
              size="sm"
              aria-label="ATS Checker"
              title="ATS Checker"
            >
              <Activity size={14} />
            </IconButton>
            <IconButton
              onClick={() => useResumeStore.getState().undo()}
              variant="ghost"
              size="sm"
              aria-label="Undo (Ctrl+Z)"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </IconButton>
            <IconButton
              onClick={() => useResumeStore.getState().redo()}
              variant="ghost"
              size="sm"
              aria-label="Redo (Ctrl+Shift+Z)"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={14} />
            </IconButton>
          </div>
        </div>
        <p className="text-caption text-ink-muted mt-0.5">Build your resume section by section</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            {sectionOrder.map((section, index) => {
              const hidden = hiddenSections.includes(section)
              return (
                <DraggableSection key={section} section={section} hidden={hidden}>
                  <SectionRenderer section={section} />
                </DraggableSection>
              )
            })}
          </SortableContext>
        </DndContext>

        <Button onClick={addCustomSection} variant="ghost" size="full" className="border-2 border-dashed rounded-xl">
          + Add Custom Section
        </Button>
      </div>
    </section>
  )
}
