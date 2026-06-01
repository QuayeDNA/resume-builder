import { getTemplate } from './index'
import type { ResumeData, CertificationEntry, LanguageEntry, ProjectEntry, EducationEntry, ExperienceEntry, CustomSectionEntry } from '../types'

function SectionTitle({ label, accent }: { label: string; accent: string }) {
  return (
    <div style={{ marginTop: '16px', marginBottom: '10px' }}>
      <h2
        style={{
          fontFamily: "'DM Sans', Arial, sans-serif",
          fontSize: '12px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1.8px',
          margin: '0',
          color: accent,
        }}
      >
        {label}
      </h2>
      <div style={{ height: '1.5px', marginTop: '4px', background: accent }} />
    </div>
  )
}

function Bullet({ text, color }: { text: string; color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '6px',
        margin: '4px 0',
        fontSize: '10px',
        color: '#222222',
        lineHeight: '1.5',
      }}
    >
      <span
        style={{
          marginTop: '5px',
          height: '4px',
          width: '4px',
          flexShrink: '0',
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }}
      />
      <span style={{ flex: 1 }}>{text}</span>
    </div>
  )
}

export default function SingleColumnTemplate({ data }: { data: ResumeData }) {
  const t = getTemplate(data.template)
  const { personal: p, experience, education, skills, projects, certifications, languages, customSections } = data

  return (
    <div
      style={{
        width: '100%',
        margin: '0 auto',
        padding: '48px 44px',
        fontFamily: "'DM Sans', Arial, sans-serif",
        fontSize: '10.5px',
        lineHeight: '1.6',
        color: '#1a1a1a',
        background: '#ffffff',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          marginBottom: '18px',
          paddingBottom: '14px',
          borderBottom: `2px solid ${t.accent}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '28px',
                fontWeight: '700',
                margin: '0 0 2px 0',
                letterSpacing: '-0.3px',
                color: t.accent,
              }}
            >
              {p.name || 'Your Name'}
            </h1>
            {p.title && (
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: t.secondary,
                }}
              >
                {p.title}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '4px',
              textAlign: 'right',
              fontSize: '9.5px',
              color: '#555555',
              lineHeight: '1.4',
              flexShrink: '0',
            }}
          >
            {p.email    && <div>✉ {p.email}</div>}
            {p.phone    && <div>✆ {p.phone}</div>}
            {p.location && <div>⌖ {p.location}</div>}
            {p.website  && <div>🌐 {p.website}</div>}
            {p.linkedin && <div>in {p.linkedin}</div>}
          </div>
        </div>

        {p.summary && (
          <p
            style={{
              fontSize: '10.5px',
              color: '#333333',
              marginTop: '10px',
              marginBottom: '0',
              lineHeight: '1.65',
            }}
          >
            "{p.summary}"
          </p>
        )}
      </div>

      {experience.length > 0 && (
        <>
          <SectionTitle label="Experience" accent={t.accent} />
          {experience.map((e: ExperienceEntry, idx: number) => (
            <div key={e.id} style={{ marginTop: idx > 0 ? '14px' : '0' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>
                    {e.role}
                  </span>
                  {e.company && (
                    <span style={{ fontWeight: '600', marginLeft: '6px', fontSize: '10.5px', color: t.secondary }}>
                      @ {e.company}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '9.5px', color: '#777777', textAlign: 'right', flexShrink: '0' }}>
                  <div style={{ whiteSpace: 'nowrap' }}>
                    {e.start}{e.end ? ` – ${e.end}` : ''}
                  </div>
                  {e.location && <div style={{ whiteSpace: 'nowrap' }}>{e.location}</div>}
                </div>
              </div>
              {e.bullets.filter((b: string) => b.trim()).map((b: string, i: number) => (
                <Bullet key={i} text={b} color={t.secondary} />
              ))}
            </div>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <SectionTitle label="Education" accent={t.accent} />
          {education.map((e: EducationEntry, idx: number) => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginTop: idx > 0 ? '10px' : '0' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{e.degree}</span>
                {e.school && <span style={{ marginLeft: '6px', fontSize: '10.5px', color: t.secondary }}>· {e.school}</span>}
              </div>
              <div style={{ fontSize: '9.5px', color: '#777777', textAlign: 'right', flexShrink: '0' }}>
                <div style={{ whiteSpace: 'nowrap' }}>{e.start}{e.end ? ` – ${e.end}` : ''}</div>
                {e.gpa && <div style={{ whiteSpace: 'nowrap' }}>GPA: {e.gpa}</div>}
              </div>
            </div>
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <SectionTitle label="Skills" accent={t.accent} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.filter((s: string) => s.trim()).map((s: string, i: number) => (
              <span key={i} style={{ borderRadius: '4px', padding: '4px 10px', fontSize: '9.5px', fontWeight: '500', background: `${t.accent}18`, border: `1px solid ${t.accent}44`, color: t.accent }}>
                {s}
              </span>
            ))}
          </div>
        </>
      )}

      {projects.length > 0 && (
        <>
          <SectionTitle label="Projects" accent={t.accent} />
          {projects.map((pr: ProjectEntry, idx: number) => (
            <div key={pr.id} style={{ marginTop: idx > 0 ? '10px' : '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{pr.name}</span>
                {pr.url && <span style={{ fontSize: '9.5px', textDecoration: 'underline', flexShrink: '0', color: t.secondary }}>View</span>}
              </div>
              {pr.description && <p style={{ fontSize: '10px', color: '#333333', margin: '4px 0 0 0' }}>{pr.description}</p>}
            </div>
          ))}
        </>
      )}

      {certifications.length > 0 && (
        <>
          <SectionTitle label="Certifications" accent={t.accent} />
          {certifications.map((c: CertificationEntry, idx: number) => (
            <div key={c.id} style={{ marginTop: idx > 0 ? '8px' : '0' }}>
              <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{c.name}</span>
              {(c.issuer || c.year) && (
                <div style={{ fontSize: '9.5px', color: '#777777' }}>{c.issuer}{c.year ? ` · ${c.year}` : ''}</div>
              )}
            </div>
          ))}
        </>
      )}

      {languages && languages.length > 0 && (
        <>
          <SectionTitle label="Languages" accent={t.accent} />
          {languages.map((l: LanguageEntry, idx: number) => (
            <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: idx > 0 ? '8px' : '0' }}>
              <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{l.language}</span>
              <span style={{ fontSize: '9.5px', color: t.secondary }}>{l.proficiency}</span>
            </div>
          ))}
        </>
      )}

      {customSections && customSections.length > 0 && (
        <>{customSections.map((cs: CustomSectionEntry) => (
          <div key={cs.id}>
            <SectionTitle label={cs.name} accent={t.accent} />
            {cs.description && (
              <p style={{ fontSize: '10.5px', color: '#333333', margin: '6px 0 0 0', lineHeight: '1.65' }}>
                {cs.description}
              </p>
            )}
            {cs.bullets.filter((b: string) => b.trim()).map((b: string, i: number) => (
              <Bullet key={i} text={b} color={t.secondary} />
            ))}
          </div>
        ))}</>
      )}
    </div>
  )
}
