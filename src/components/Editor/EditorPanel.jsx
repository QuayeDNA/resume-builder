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
    <aside className="w-[300px] bg-[#0a0a18] border-r border-[#0d0d1e] flex flex-col flex-shrink-0 overflow-hidden">
      {/* Section header */}
      <div className="px-3.5 pt-3 pb-2 flex-shrink-0">
        <h2 className="text-[11px] font-semibold text-brand-400 font-display">
          {SECTION_LABELS[activeSection] || ''}
        </h2>
        <div className="h-px mt-1" style={{ background: 'linear-gradient(to right, rgba(108,99,255,0.2), transparent)' }} />
      </div>

      {/* Scrollable section content */}
      <div key={activeSection} className="flex-1 overflow-y-auto px-3.5 pb-3 animate-fade-up">
        <SectionContent section={activeSection} />
        {SHOW_ATS.includes(activeSection) && <AtsChecker />}
      </div>
    </aside>
  )
}
