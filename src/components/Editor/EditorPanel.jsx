import { useMemo } from 'react'
import useResumeStore from '../../store/useResumeStore'
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
import AtsChecker            from './AtsChecker'

const SECTION_LABELS = {
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

const SHOW_ATS = ['personal','experience','skills','projects','certifications','languages']

function SectionContent({ section }) {
  switch (section) {
    case 'personal':       return <PersonalSection />
    case 'experience':     return <ExperienceSection />
    case 'education':      return <EducationSection />
    case 'skills':         return <SkillsSection />
    case 'projects':       return <ProjectsSection />
    case 'certifications': return <CertificationsSection />
    case 'languages':      return <LanguagesSection />
    case 'coverletter':    return <CoverLetterSection />
    case 'design':         return <DesignSection />
    case 'saved':          return <SavedSection />
    default:               return null
  }
}

export default function EditorPanel() {
  const activeSection = useResumeStore((s) => s.activeSection)

  return (
    <aside className="flex min-h-0 w-full min-w-0 flex-col overflow-hidden border-r border-hairline bg-obsidian lg:w-full lg:max-w-[24rem] xl:max-w-[26rem]">
      <div className="flex-shrink-0 border-b border-hairline px-4 py-3">
        <h2 className="text-heading text-brand">
          {SECTION_LABELS[activeSection] || ''}
        </h2>
        <div className="mt-2 h-px bg-gradient-to-r from-brand/20 to-transparent" />
      </div>

      <div key={activeSection} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 animate-fade-up">
        <SectionContent section={activeSection} />
        {SHOW_ATS.includes(activeSection) && <AtsChecker />}
      </div>
    </aside>
  )
}
