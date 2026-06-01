import { getTemplate } from './index'
import type { ResumeData, CertificationEntry, LanguageEntry, ProjectEntry, EducationEntry, ExperienceEntry, CustomSectionEntry } from '../types'

function MainSectionTitle({ label, accent }: { label: string; accent: string }) {
  return (
    <h2
      style={{
        fontFamily: "'DM Sans', Arial, sans-serif",
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1.6px',
        marginTop: '16px',
        marginBottom: '10px',
        color: accent,
        borderBottom: `2px solid ${accent}`,
        paddingBottom: '4px',
      }}
    >
      {label}
    </h2>
  )
}

function SideSectionTitle({ label }: { label: string }) {
  return (
    <h3
      style={{
        fontFamily: "'DM Sans', Arial, sans-serif",
        fontSize: '9px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1.4px',
        marginTop: '14px',
        marginBottom: '8px',
        color: 'rgba(255,255,255,0.75)',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        paddingBottom: '3px',
      }}
    >
      {label}
    </h3>
  )
}

function Bullet({ text, color }: { text: string; color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        margin: '4px 0',
        fontSize: '9.5px',
        color: '#222',
        lineHeight: '1.5',
        alignItems: 'flex-start',
      }}
    >
      <span style={{ flexShrink: '0', width: '4px', height: '4px', borderRadius: '50%', marginTop: '5px', background: color, display: 'inline-block' }} />
      <span style={{ flex: 1 }}>{text}</span>
    </div>
  )
}

export default function TwoColumnTemplate({ data }: { data: ResumeData }) {
  const t = getTemplate(data.template)
  const { personal: p, experience, education, skills, projects, certifications, languages, customSections } = data

  return (
    <div
      style={{
        fontFamily: "'DM Sans', Arial, sans-serif",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        fontSize: '10px',
        background: '#ffffff',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '200px',
          flexShrink: '0',
          background: t.accent,
          color: 'rgba(255,255,255,0.92)',
          padding: '44px 20px',
          alignSelf: 'stretch',
        }}
      >
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px 0', lineHeight: '1.2' }}>
          {p.name || 'Your Name'}
        </h1>
        {p.title && (
          <div style={{ fontSize: '9px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: t.secondary }}>
            {p.title}
          </div>
        )}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '10px', fontSize: '8.5px', lineHeight: '1.7' }}>
          {p.email && <div style={{ wordBreak: 'break-word', marginBottom: '3px' }}>✉ {p.email}</div>}
          {p.phone && <div style={{ marginBottom: '3px' }}>✆ {p.phone}</div>}
          {p.location && <div style={{ marginBottom: '3px' }}>⌖ {p.location}</div>}
          {p.website && <div style={{ wordBreak: 'break-word', marginBottom: '3px' }}>🌐 {p.website}</div>}
          {p.linkedin && <div style={{ wordBreak: 'break-word', marginBottom: '3px' }}>in {p.linkedin}</div>}
        </div>

        {skills.length > 0 && (
          <>
            <SideSectionTitle label="Skills" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {skills.filter((s: string) => s.trim()).map((s: string, i: number) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff', borderRadius: '3px', padding: '3px 7px', fontSize: '8.5px', fontWeight: '500' }}>
                  {s}
                </div>
              ))}
            </div>
          </>
        )}

        {languages && languages.length > 0 && (
          <>
            <SideSectionTitle label="Languages" />
            {languages.map((l: LanguageEntry) => (
              <div key={l.id} style={{ marginBottom: '6px' }}>
                <div style={{ fontSize: '9px', fontWeight: '600', color: '#ffffff' }}>{l.language}</div>
                <div style={{ fontSize: '8px', color: t.secondary }}>{l.proficiency}</div>
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SideSectionTitle label="Certifications" />
            {certifications.map((c: CertificationEntry) => (
              <div key={c.id} style={{ marginBottom: '6px' }}>
                <div style={{ fontSize: '9px', fontWeight: '600', color: '#ffffff' }}>{c.name}</div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.55)' }}>{c.issuer}{c.year ? ` · ${c.year}` : ''}</div>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ flex: '1', padding: '44px 28px', background: '#ffffff', color: '#1a1a1a', overflowX: 'hidden', minWidth: '0' }}>
        {p.summary && (
          <div style={{ marginBottom: '16px', paddingBottom: '10px', paddingLeft: '12px', borderLeft: `3px solid ${t.secondary}` }}>
            <p style={{ fontSize: '10.5px', color: '#333', lineHeight: '1.65', margin: '0', fontStyle: 'italic' }}>"{p.summary}"</p>
          </div>
        )}

        {experience.length > 0 && (
          <>
            <MainSectionTitle label="Experience" accent={t.accent} />
            {experience.map((e: ExperienceEntry, idx: number) => (
              <div key={e.id} style={{ marginTop: idx > 0 ? '12px' : '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{e.role}</span>
                    {e.company && <span style={{ fontWeight: '600', marginLeft: '6px', fontSize: '10px', color: t.secondary }}>@ {e.company}</span>}
                  </div>
                  <div style={{ fontSize: '9px', color: '#777', textAlign: 'right', flexShrink: '0' }}>
                    <div style={{ whiteSpace: 'nowrap', fontWeight: '600' }}>{e.start}{e.end ? ` – ${e.end}` : ''}</div>
                    {e.location && <div style={{ whiteSpace: 'nowrap', fontSize: '8.5px' }}>{e.location}</div>}
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
            <MainSectionTitle label="Education" accent={t.accent} />
            {education.map((e: EducationEntry, idx: number) => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginTop: idx > 0 ? '10px' : '0' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{e.degree}</span>
                  {e.school && <span style={{ marginLeft: '6px', fontSize: '10px', color: t.secondary }}>· {e.school}</span>}
                </div>
                <div style={{ fontSize: '9px', color: '#777', textAlign: 'right', flexShrink: '0' }}>
                  <div style={{ whiteSpace: 'nowrap', fontWeight: '600' }}>{e.start}{e.end ? ` – ${e.end}` : ''}</div>
                  {e.gpa && <div style={{ whiteSpace: 'nowrap', fontSize: '8.5px' }}>GPA: {e.gpa}</div>}
                </div>
              </div>
            ))}
          </>
        )}

        {projects.length > 0 && (
          <>
            <MainSectionTitle label="Projects" accent={t.accent} />
            {projects.map((pr: ProjectEntry, idx: number) => (
              <div key={pr.id} style={{ marginTop: idx > 0 ? '10px' : '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{pr.name}</span>
                  {pr.url && <span style={{ fontSize: '9px', textDecoration: 'underline', flexShrink: '0', color: t.secondary }}>View</span>}
                </div>
                {pr.description && <p style={{ fontSize: '10px', color: '#333', margin: '4px 0 0 0' }}>{pr.description}</p>}
              </div>
            ))}
          </>
        )}

        {customSections && customSections.length > 0 && (
          <>{customSections.map((cs: CustomSectionEntry) => (
            <div key={cs.id}>
              <MainSectionTitle label={cs.name} accent={t.accent} />
              {cs.description && (
                <p style={{ fontSize: '10px', color: '#333', margin: '6px 0 0 0', lineHeight: '1.6' }}>
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
    </div>
  )
}
