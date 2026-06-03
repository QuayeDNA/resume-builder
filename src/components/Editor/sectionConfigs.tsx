import { type ReactNode, useRef, useState } from 'react'
import { Sparkles, Loader2, X } from 'lucide-react'
import { Input, Button, IconButton } from '../UI'
import SortableList from '../SortableList'
import SectionEntryList from './SectionEntryList'
import RichTextEditor from './RichTextEditor'
import type { FieldConfig } from './SectionEntryList'
import { useAi } from '../../hooks/useAi'
import { aiImproveBullet, aiSuggestBullets } from '../../api/ai'
import useResumeStore from '../../store/useResumeStore'
import type { ResumeData, ExperienceEntry } from '../../types'
import { PROFICIENCY_OPTIONS } from '../../types'

/* ─── Section Configs ─── */

type EntrySection = {
  title: string
  addLabel: string
  selectItems: (data: ResumeData) => { id: number }[]
  fields: FieldConfig[]
  onAdd: () => void
  onRemove: (id: number) => void
  onUpdate: (id: number, field: string, value: string) => void
  onReorder: (from: number, to: number) => void
  renderChildren?: (item: { id: number }) => ReactNode
}

export const ENTRY_SECTIONS: Record<string, EntrySection> = {
  education: {
    title: 'Education',
    addLabel: 'Add Education',
    selectItems: (d) => d.education,
    fields: [
      { key: 'school', label: 'School', placeholder: 'University Name' },
      { key: 'degree', label: 'Degree', placeholder: 'B.S. Computer Science' },
      { key: 'start',  label: 'Start',  placeholder: '2018' },
      { key: 'end',    label: 'End',    placeholder: '2022' },
      { key: 'gpa',    label: 'GPA',    placeholder: '3.8' },
    ],
    onAdd:      () => useResumeStore.getState().addEducation(),
    onRemove:   (id) => useResumeStore.getState().removeEducation(id),
    onUpdate:   (id, f, v) => useResumeStore.getState().updateEducation(id, f as never, v as never),
    onReorder:  (f, t) => useResumeStore.getState().reorderEducation(f, t),
  },

  projects: {
    title: 'Projects',
    addLabel: 'Add Project',
    selectItems: (d) => d.projects,
    fields: [
      { key: 'name',        label: 'Project Name', placeholder: 'My Awesome Project' },
      { key: 'url',         label: 'URL / GitHub', placeholder: 'github.com/you/project' },
      { key: 'description', label: 'Description',  type: 'richtext', placeholder: 'What did you build and what was the impact?' },
    ],
    onAdd:      () => useResumeStore.getState().addProject(),
    onRemove:   (id) => useResumeStore.getState().removeProject(id),
    onUpdate:   (id, f, v) => useResumeStore.getState().updateProject(id, f as never, v as never),
    onReorder:  (f, t) => useResumeStore.getState().reorderProject(f, t),
  },

  certifications: {
    title: 'Certifications',
    addLabel: 'Add Certification',
    selectItems: (d) => d.certifications,
    fields: [
      { key: 'name',   label: 'Certification Name', placeholder: 'AWS Solutions Architect' },
      { key: 'issuer', label: 'Issuer',              placeholder: 'Amazon' },
      { key: 'year',   label: 'Year',                placeholder: '2023' },
    ],
    onAdd:      () => useResumeStore.getState().addCertification(),
    onRemove:   (id) => useResumeStore.getState().removeCertification(id),
    onUpdate:   (id, f, v) => useResumeStore.getState().updateCertification(id, f as never, v as never),
    onReorder:  (f, t) => useResumeStore.getState().reorderCertification(f, t),
  },

  languages: {
    title: 'Languages',
    addLabel: 'Add Language',
    selectItems: (d) => d.languages,
    fields: [
      { key: 'language',    label: 'Language',    placeholder: 'Spanish' },
      { key: 'proficiency', label: 'Proficiency', type: 'select', options: PROFICIENCY_OPTIONS },
    ],
    onAdd:      () => useResumeStore.getState().addLanguage(),
    onRemove:   (id) => useResumeStore.getState().removeLanguage(id),
    onUpdate:   (id, f, v) => useResumeStore.getState().updateLanguage(id, f as never, v as never),
    onReorder:  (f, t) => useResumeStore.getState().reorderLanguage(f, t),
  },

  experience: {
    title: 'Work Experience',
    addLabel: 'Add Position',
    selectItems: (d) => d.experience,
    fields: [
      { key: 'company',  label: 'Company',    placeholder: 'Acme Corp' },
      { key: 'role',     label: 'Role/Title', placeholder: 'Software Engineer' },
      { key: 'start',    label: 'Start',      placeholder: 'Jan 2022' },
      { key: 'end',      label: 'End',        placeholder: 'Present' },
      { key: 'location', label: 'Location',   placeholder: 'City, State' },
    ],
    onAdd:      () => useResumeStore.getState().addExperience(),
    onRemove:   (id) => useResumeStore.getState().removeExperience(id),
    onUpdate:   (id, f, v) => useResumeStore.getState().updateExperience(id, f as never, v as never),
    onReorder:  (f, t) => useResumeStore.getState().reorderExperience(f, t),
    renderChildren: (item) => <ExperienceBullets entry={item as ExperienceEntry} />,
  },
}

/* ─── Experience Bullets (special case for experience section) ─── */

function BulletRow({ bullet, expId, idx }: { bullet: string; expId: number; idx: number }) {
  const updateBullet = useResumeStore((s) => s.updateBullet)
  const removeBullet = useResumeStore((s) => s.removeBullet)
  const exp = useResumeStore((s) => s.data.experience.find((e) => e.id === expId))
  const { run, isLoading } = useAi()
  const key = `b_${expId}_${idx}`
  const [exiting, setExiting] = useState(false)

  const handleRemove = () => {
    setExiting(true)
    setTimeout(() => removeBullet(expId, idx), 150)
  }

  return (
    <div className={exiting ? 'animate-scale-out' : ''}>
      <div className="flex gap-1.5 items-start">
        <div className="flex-1 min-w-0">
          <RichTextEditor
            value={bullet}
            onChange={(v) => updateBullet(expId, idx, v)}
            placeholder="Achieved X by doing Y, resulting in Z…"
            minHeight={96}
          />
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0 pt-7">
          <IconButton
            onClick={() => run<string>(key, () => aiImproveBullet(bullet, exp?.role || '', exp?.company || ''), (v) => updateBullet(expId, idx, v))}
            disabled={isLoading(key) || !bullet.trim()}
            title="AI improve this bullet"
            variant="ghost" size="sm"
          >
            {isLoading(key) ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
          </IconButton>
          <IconButton onClick={handleRemove} title="Remove bullet" variant="danger" size="sm">
            <X size={10} />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

function ExperienceBullets({ entry }: { entry: ExperienceEntry }) {
  const addBullet = useResumeStore((s) => s.addBullet)
  const appendBullets = useResumeStore((s) => s.appendBullets)
  const reorderBullets = useResumeStore((s) => s.reorderBullets)
  const { run, isLoading } = useAi()
  const suggestKey = `suggest_${entry.id}`

  return (
    <>
      <p className="text-label uppercase text-ink-muted mt-3">Bullet Points</p>
      <SortableList
        items={entry.bullets}
        getId={(_, i) => `bullet-${entry.id}-${i}`}
        onReorder={(from, to) => reorderBullets(entry.id, from, to)}
      >
        {(b, i) => <BulletRow bullet={b} expId={entry.id} idx={i} />}
      </SortableList>

      <div className="grid grid-cols-1 gap-2 mt-1 sm:grid-cols-2">
        <Button onClick={() => addBullet(entry.id)} variant="ghost" size="sm" className="border-dashed">
          + Bullet
        </Button>
        <Button
          onClick={() => run<string[]>(suggestKey, () => aiSuggestBullets(entry.role, entry.company), (bullets) => appendBullets(entry.id, bullets))}
          variant="ghost" size="sm"
          loading={isLoading(suggestKey)}
          icon={!isLoading(suggestKey) && <Sparkles size={10} />}
        >
          AI Suggest
        </Button>
      </div>
    </>
  )
}

/* ─── GenericSection: renders any entry-based section from config ─── */

export function GenericSection({ config }: { config: EntrySection }) {
  const items = useResumeStore((s) => config.selectItems(s.data))

  return (
    <SectionEntryList
      title={config.title}
      addLabel={config.addLabel}
      items={items}
      fields={config.fields}
      onAdd={config.onAdd}
      onRemove={config.onRemove}
      onUpdate={config.onUpdate}
      onReorder={config.onReorder}
    >
      {config.renderChildren}
    </SectionEntryList>
  )
}
