import type { ResumeData, CoverLetterData } from '../types'
import { BUILTIN_SECTION_IDS } from '../types'

export const DEFAULT_RESUME: ResumeData = {
  personal: {
    name: 'Alexandra Chen',
    title: 'Senior Product Designer',
    email: 'alex.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'alexchen.design',
    linkedin: 'linkedin.com/in/alexchen',
    summary:
      'Passionate product designer with 7+ years crafting intuitive digital experiences for Fortune 500 companies. Specializing in user research, design systems, and cross-functional collaboration to drive measurable business outcomes.',
  },
  experience: [
    {
      id: 1,
      company: 'Stripe',
      role: 'Senior Product Designer',
      start: 'Jan 2021',
      end: 'Present',
      location: 'San Francisco, CA',
      bullets: [
        'Led redesign of merchant dashboard, improving task completion by 34% and reducing support tickets by 22%',
        'Built and maintained a design system used by 40+ engineers across 6 product teams',
        'Conducted 80+ user interviews to inform the next generation payment flow',
      ],
    },
    {
      id: 2,
      company: 'Airbnb',
      role: 'Product Designer',
      start: 'Mar 2018',
      end: 'Dec 2020',
      location: 'San Francisco, CA',
      bullets: [
        'Owned end-to-end design for host onboarding, increasing host conversion by 18%',
        'Collaborated with engineering to ship features used by 4M+ active hosts globally',
      ],
    },
  ],
  education: [
    {
      id: 1,
      school: 'Carnegie Mellon University',
      degree: 'M.S. Human-Computer Interaction',
      start: '2016',
      end: '2018',
      gpa: '3.9',
    },
  ],
  skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'A/B Testing', 'SQL', 'React', 'Accessibility'],
  projects: [
    {
      id: 1,
      name: 'OpenType — Open Source Font Explorer',
      url: 'opentype.dev',
      description: 'A web app for designers to explore and pair fonts. 12k monthly active users.',
    },
  ],
  certifications: [{ id: 1, name: 'Google UX Design Certificate', issuer: 'Google', year: '2020' }],
  languages: [
    { id: 1, language: 'English', proficiency: 'Native' },
    { id: 2, language: 'Mandarin', proficiency: 'Fluent' },
  ],
  customSections: [],
  sectionOrder: [...BUILTIN_SECTION_IDS],
  template: 'modern',
  atsMode: false,
  hiddenSections: [],
  themeOverrides: {},
}

export const DEFAULT_COVER_LETTER: CoverLetterData = {
  recipientName: 'Hiring Manager',
  company: 'Target Company',
  role: 'Product Designer',
  tone: 'professional',
  body: '',
}
