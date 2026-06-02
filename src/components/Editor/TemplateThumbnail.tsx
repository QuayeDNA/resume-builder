import { memo, useMemo } from 'react'
import type { ResumeData } from '../../types'
import type { TemplateDefinition } from '../../Templates'
import TemplateRenderer from '../../Templates/TemplateRenderer'
import { PAGE_WIDTH } from '../../Templates/theme'

const THUMBNAIL_DATA: ResumeData = {
  personal: {
    name: 'Alex Morgan',
    title: 'Senior Product Designer',
    email: 'alex@example.com',
    phone: '(415) 555‑0123',
    location: 'San Francisco, CA',
    website: '',
    linkedin: '',
    summary: '',
  },
  experience: [
    {
      id: 1,
      company: 'Stripe',
      role: 'Product Designer',
      start: '2020',
      end: 'Present',
      location: 'Remote',
      bullets: ['Led redesign improving NPS by 32%', 'Built design system for 40+ engineers'],
    },
    {
      id: 2,
      company: 'Figma',
      role: 'Design Engineer',
      start: '2018',
      end: '2020',
      location: '',
      bullets: ['Developed plugin ecosystem SDK'],
    },
  ],
  education: [
    { id: 1, school: 'RISD', degree: 'BFA Graphic Design', start: '2014', end: '2018', gpa: '' },
  ],
  skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'React', 'TypeScript'],
  projects: [],
  certifications: [],
  languages: [{ id: 1, language: 'English', proficiency: 'Native' }],
  customSections: [],
  sectionOrder: ['personal', 'experience', 'education', 'skills', 'languages'],
  template: 'modern',
  themeOverrides: {},
  atsMode: false,
  hiddenSections: [],
}

type Props = {
  template: TemplateDefinition
}

const SCALE = 0.22

function TemplateThumbnailInner({ template }: Props) {
  const data = useMemo<ResumeData>(
    () => ({ ...THUMBNAIL_DATA, template: template.id, atsMode: false }),
    [template.id],
  )

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{ position: 'relative' }}
    >
      <div
        className="transition-transform duration-300 ease-out-expo will-change-transform group-hover:scale-[0.24]"
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          width: PAGE_WIDTH,
        }}
      >
        <TemplateRenderer data={data} />
      </div>
    </div>
  )
}

const TemplateThumbnail = memo(TemplateThumbnailInner)

export default TemplateThumbnail
