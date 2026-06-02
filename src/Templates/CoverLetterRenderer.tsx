import type { ResumeData, CoverLetterData } from '../types'
import { TEMPLATES } from './index'
import { mergeWithATS } from './theme'

export default function CoverLetterRenderer({ resume, cl }: { resume: ResumeData; cl: CoverLetterData }) {
  const def = TEMPLATES[resume.template]
  if (!def) return null

  const theme = resume.atsMode ? mergeWithATS(def.theme) : def.theme
  const p = resume.personal

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      style={{
        fontFamily: theme.fonts.body,
        background: '#ffffff',
        color: theme.colors.text,
        fontSize: theme.fontSize.body,
        lineHeight: '1.8',
        padding: '50px 54px',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <div style={{ borderBottom: `3px solid ${theme.colors.accent}`, paddingBottom: '12px', marginBottom: '28px' }}>
        <h1
          style={{
            fontFamily: theme.fonts.name,
            fontSize: '22px',
            fontWeight: '700',
            margin: '0 0 6px 0',
            color: theme.colors.accent,
          }}
        >
          {p.name || 'Your Name'}
        </h1>
        <div style={{ fontSize: '10px', color: '#777777', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      <div style={{ marginBottom: '20px', fontSize: '10px', color: '#777777' }}>{today}</div>

      <div style={{ marginBottom: '20px', fontSize: '10.5px' }}>
        <span style={{ fontWeight: '600' }}>Dear {cl.recipientName || 'Hiring Manager'},</span>
      </div>

      <div
        style={{
          whiteSpace: 'pre-wrap',
          fontSize: '10.5px',
          color: '#333333',
          lineHeight: '1.85',
          marginBottom: '32px',
        }}
      >
        {cl.body ||
          `I am writing to express my strong interest in the ${cl.role || '[Role]'} position at ${cl.company || '[Company]'}.\n\n[Use the AI Generate button in the Cover Letter tab to create a personalized letter, or write your own here.]`}
      </div>

      <div style={{ fontSize: '10.5px', fontWeight: '600', marginBottom: '36px' }}>Sincerely,</div>
      <div
        style={{
          fontFamily: theme.fonts.name,
          fontSize: '16px',
          fontWeight: '700',
          color: theme.colors.accent,
        }}
      >
        {p.name || 'Your Name'}
      </div>
    </div>
  )
}
