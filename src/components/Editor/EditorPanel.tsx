import { useMemo } from 'react'
import useResumeStore from '../../store/useResumeStore'
import type { CustomSectionEntry } from '../../types'
import PersonalSection       from './PersonalSection'
import ExperienceSection     from './ExperienceSection'
import EducationSection      from './EducationSection'
import SkillsSection         from './SkillsSection'
import ProjectsSection       from './ProjectsSection'
import CertificationsSection from './CertificationsSection'
import LanguagesSection      from './LanguagesSection'
import CoverLetterSection    from './CoverLetterSection'
import DesignSection         from './DesignSection'
import SavedSection          from './SavedSection'
import CustomSectionEditor  from './CustomSectionEditor'
import AtsChecker           from './AtsChecker'

const SECTION_LABELS: Record<string, string> = {
  personal:       'Personal Info',
  experience:     'Work Experience',
  education:      'Education',
  skills:         'Skills',
  projects:       'Projects',
  certifications: 'Certifications',
  languages:      'Languages',
  coverletter:    'Cover Letter',
  design:         'Templates',
  saved:          'Saved Resumes',
}

const BUILTIN_RENDERERS: Record<string, () => JSX.Element> = {
  personal:       () => <PersonalSection />,
  experience:     () => <ExperienceSection />,
  education:      () => <EducationSection />,
  skills:         () => <SkillsSection />,
  projects:       () => <ProjectsSection />,
  certifications: () => <CertificationsSection />,
  languages:      () => <LanguagesSection />,
  coverletter:    () => <CoverLetterSection />,
  design:         () => <DesignSection />,
  saved:          () => <SavedSection />,
}

const ATS_SECTIONS: string[] = ['personal','experience','skills','projects','certifications','languages']

function SectionContent({ section }: { section: string }) {
  const customSections = useResumeStore((s) => s.data.customSections)

  const render = useMemo(() => {
    if (BUILTIN_RENDERERS[section]) {
      return BUILTIN_RENDERERS[section]()
    }
    if (section.startsWith('custom_')) {
      const id = parseInt(section.replace('custom_', ''), 10)
      const cs = customSections.find((c) => c.id === id)
      if (cs) return <CustomSectionEditor section={cs} />
    }
    return null
  }, [section, customSections])

  return <>{render}</>
}

export default function EditorPanel() {
  const activeSection = useResumeStore((s) => s.activeSection)

  const label = SECTION_LABELS[activeSection]
    || (activeSection.startsWith('custom_')
      ? 'Custom Section'
      : '')

  return (
    <aside className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden border-r border-hairline bg-obsidian lg:h-full lg:max-h-none lg:w-full lg:max-w-[24rem] xl:max-w-[26rem]">
      <div className="flex-shrink-0 border-b border-hairline px-4 py-3">
        <h2 className="text-heading text-brand">
          {label}
        </h2>
        <div className="mt-2 h-px bg-gradient-to-r from-brand/20 to-transparent" />
      </div>

      <div key={activeSection} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 animate-fade-up">
        <SectionContent section={activeSection} />
        {ATS_SECTIONS.includes(activeSection) && <AtsChecker />}
      </div>
    </aside>
  )
}
