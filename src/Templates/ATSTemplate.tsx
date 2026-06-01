import { getTemplate } from './index'
import type { ResumeData, ExperienceEntry, EducationEntry, ProjectEntry, CertificationEntry, LanguageEntry } from '../types'

function SectionHeader({ label, accent }: { label: string; accent: string }) {
  return (
    <div style={{ marginTop: '14px', marginBottom: '8px' }}>
      <h2 style={{ margin: '0', fontFamily: "'Arial', 'Helvetica', sans-serif", fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase', color: accent }}>
        {label}
      </h2>
      <div style={{ marginTop: '3px', height: '1px', background: '#2f2f2f' }} />
    </div>
  )
}

function DateRange({ start, end }: { start: string; end: string }) {
  if (!start && !end) return null
  return <span style={{ whiteSpace: 'nowrap' }}>{[start, end].filter(Boolean).join(' - ')}</span>
}

export default function ATSTemplate({ data }: { data: ResumeData }) {
  const t = getTemplate(data.template)
  const { personal: p, experience, education, skills, projects, certifications, languages } = data

  return (
    <div
      id="resume-preview"
      style={{
        width: '100%',
        minHeight: '1122px',
        boxSizing: 'border-box',
        background: '#ffffff',
        color: '#111111',
        padding: '46px 44px',
        fontFamily: "'Arial', 'Helvetica', sans-serif",
        fontSize: '10.5px',
        lineHeight: '1.5',
      }}
    >
      <header style={{ marginBottom: '12px' }}>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', letterSpacing: '0.2px', color: '#000000' }}>
          {p.name || 'Your Name'}
        </h1>
        {p.title && (
          <div style={{ marginBottom: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: t.accent }}>
            {p.title}
          </div>
        )}
        <div style={{ fontSize: '9.5px', color: '#2f2f2f' }}>
          {[p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean).join(' | ')}
        </div>
      </header>

      {p.summary && (
        <section>
          <SectionHeader label="Professional Summary" accent={t.accent} />
          <p style={{ margin: '0', color: '#222222' }}>{p.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <SectionHeader label="Experience" accent={t.accent} />
          {experience.map((e: ExperienceEntry, idx: number) => (
            <div key={e.id} style={{ marginTop: idx > 0 ? '10px' : '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: '700' }}>{e.role || 'Role'}</span>
                  {e.company && <span style={{ marginLeft: '6px' }}>{e.company}</span>}
                </div>
                <DateRange start={e.start} end={e.end} />
              </div>
              {e.location && <div style={{ color: '#444444', fontSize: '9.5px' }}>{e.location}</div>}
              {e.bullets.filter((b: string) => b.trim()).map((b: string, i: number) => (
                <div key={i} style={{ marginTop: '3px', color: '#1f1f1f' }}>- {b}</div>
              ))}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section>
          <SectionHeader label="Education" accent={t.accent} />
          {education.map((e: EducationEntry, idx: number) => (
            <div key={e.id} style={{ marginTop: idx > 0 ? '8px' : '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: '700' }}>{e.degree || 'Degree'}</span>
                  {e.school && <span style={{ marginLeft: '6px' }}>{e.school}</span>}
                </div>
                <DateRange start={e.start} end={e.end} />
              </div>
              {e.gpa && <div style={{ fontSize: '9.5px', color: '#444444' }}>GPA: {e.gpa}</div>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <SectionHeader label="Skills" accent={t.accent} />
          <p style={{ margin: '0', color: '#1f1f1f' }}>{skills.filter((s: string) => s.trim()).join(', ')}</p>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <SectionHeader label="Projects" accent={t.accent} />
          {projects.map((pr: ProjectEntry, idx: number) => (
            <div key={pr.id} style={{ marginTop: idx > 0 ? '8px' : '0' }}>
              <div style={{ fontWeight: '700' }}>{pr.name || 'Project'}</div>
              {pr.url && <div style={{ color: '#2f2f2f', fontSize: '9.5px' }}>{pr.url}</div>}
              {pr.description && <div style={{ color: '#1f1f1f' }}>{pr.description}</div>}
            </div>
          ))}
        </section>
      )}

      {certifications.length > 0 && (
        <section>
          <SectionHeader label="Certifications" accent={t.accent} />
          {certifications.map((c: CertificationEntry, idx: number) => (
            <div key={c.id} style={{ marginTop: idx > 0 ? '6px' : '0' }}>
              <span style={{ fontWeight: '700' }}>{c.name}</span>
              {(c.issuer || c.year) && <span style={{ color: '#444444' }}> - {[c.issuer, c.year].filter(Boolean).join(' | ')}</span>}
            </div>
          ))}
        </section>
      )}

      {languages && languages.length > 0 && (
        <section>
          <SectionHeader label="Languages" accent={t.accent} />
          {languages.map((l: LanguageEntry, idx: number) => (
            <div key={l.id} style={{ marginTop: idx > 0 ? '6px' : '0' }}>
              <span style={{ fontWeight: '700' }}>{l.language}</span>
              {l.proficiency && <span style={{ color: '#444444' }}> - {l.proficiency}</span>}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
