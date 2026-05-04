import { getTemplate } from './index'

function SectionTitle({ label, accent }) {
  return (
    <div className="mt-[16px] mb-[12px] first:mt-0">
      <h2
        className="font-sans text-[12px] font-bold uppercase tracking-[1.8px] m-0"
        style={{ color: accent }}
      >
        {label}
      </h2>
      <div
        className="h-[1.5px] mt-[4px]"
        style={{ background: accent }}
      />
    </div>
  )
}

function Bullet({ text, color }) {
  return (
    <div className="grid grid-cols-[10px_minmax(0,1fr)] items-start gap-[6px] my-[4px] text-[10px] text-[#222] leading-[1.5]">
      <span
        className="mt-[5px] h-[4px] w-[4px] flex-shrink-0 rounded-full"
        style={{ background: color }}
      />
      <span>{text}</span>
    </div>
  )
}

export default function SingleColumnTemplate({ data }) {
  const t = getTemplate(data.template)
  const { personal: p, experience, education, skills, projects, certifications, languages } = data

  return (
    <div
      className="resume-page min-h-full box-border bg-white"
      id="resume-preview"
      style={{
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
        padding: '48px 44px',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '10.5px',
        lineHeight: '1.6',
        color: '#1a1a1a',
      }}
    >
      {/* Header */}
      <div className="mb-[18px] pb-[14px]" style={{ borderBottom: `2px solid ${t.accent}` }}>
        <div className="grid grid-cols-[minmax(0,1fr)_max-content] items-start gap-x-[24px] gap-y-[10px]">
          <div>
            <h1
              className="font-serif text-[28px] font-bold m-0 mb-[2px] tracking-[-0.3px]"
              style={{ color: t.accent }}
            >
              {p.name || 'Your Name'}
            </h1>
            {p.title && (
              <div
                className="text-[11px] font-semibold uppercase tracking-[1.2px]"
                style={{ color: t.secondary }}
              >
                {p.title}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-end gap-[4px] text-right text-[9.5px] text-[#555] leading-[1.4]">
            {p.email && <div>✉ {p.email}</div>}
            {p.phone && <div>✆ {p.phone}</div>}
            {p.location && <div>⌖ {p.location}</div>}
            {p.website && <div>🌐 {p.website}</div>}
            {p.linkedin && <div>in {p.linkedin}</div>}
          </div>

          {/* Summary */}
          {p.summary && (
            <p className="col-span-2 text-[10.5px] text-[#333] mt-[2px] mb-0 leading-[1.65]">
              {p.summary}
            </p>
          )}
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <>
          <SectionTitle label="Experience" accent={t.accent} />
          {experience.map((e, idx) => (
            <div key={e.id} className={idx > 0 ? 'mt-[14px]' : ''}>
              <div className="flex justify-between items-start gap-[12px]">
                <div>
                  <span className="font-semibold text-[11px] text-[#1a1a1a]">{e.role}</span>
                  {e.company && (
                    <span
                      className="font-semibold ml-[6px] text-[10.5px]"
                      style={{ color: t.secondary }}
                    >
                      @ {e.company}
                    </span>
                  )}
                </div>
                <div className="text-[9.5px] text-[#777] text-right flex-shrink-0">
                  <div className="whitespace-nowrap">{e.start}{e.end ? ` – ${e.end}` : ''}</div>
                  {e.location && <div className="whitespace-nowrap">{e.location}</div>}
                </div>
              </div>
              {e.bullets.filter((b) => b.trim()).map((b, i) => (
                <Bullet key={i} text={b} color={t.secondary} />
              ))}
            </div>
          ))}
        </>
      )}

      {/* Education */}
      {education.length > 0 && (
        <>
          <SectionTitle label="Education" accent={t.accent} />
          {education.map((e, idx) => (
            <div key={e.id} className={`flex justify-between items-start gap-[12px] ${idx > 0 ? 'mt-[10px]' : ''}`}>
              <div>
                <span className="font-semibold text-[11px] text-[#1a1a1a]">{e.degree}</span>
                {e.school && (
                  <span
                    className="ml-[6px] text-[10.5px]"
                    style={{ color: t.secondary }}
                  >
                    · {e.school}
                  </span>
                )}
              </div>
              <div className="text-[9.5px] text-[#777] text-right flex-shrink-0">
                <div className="whitespace-nowrap">{e.start}{e.end ? ` – ${e.end}` : ''}</div>
                {e.gpa && <div className="whitespace-nowrap">GPA: {e.gpa}</div>}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <>
          <SectionTitle label="Skills" accent={t.accent} />
          <div className="flex flex-wrap justify-center gap-[8px]">
            {skills.filter((s) => s.trim()).map((s, i) => (
              <span
                key={i}
                className="rounded-[4px] px-[10px] py-[4px] text-[9.5px] font-medium"
                style={{
                  background: `${t.accent}14`,
                  border: `1px solid ${t.accent}40`,
                  color: t.accent,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <>
          <SectionTitle label="Projects" accent={t.accent} />
          {projects.map((pr, idx) => (
            <div key={pr.id} className={idx > 0 ? 'mt-[10px]' : ''}>
              <div className="flex justify-between items-start gap-[12px]">
                <span className="font-semibold text-[11px] text-[#1a1a1a]">{pr.name}</span>
                {pr.url && (
                  <a
                    href={pr.url}
                    className="text-[9.5px] underline flex-shrink-0"
                    style={{ color: t.secondary }}
                  >
                    View
                  </a>
                )}
              </div>
              {pr.description && (
                <p className="text-[10px] text-[#333] my-[4px]">{pr.description}</p>
              )}
            </div>
          ))}
        </>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <>
          <SectionTitle label="Certifications" accent={t.accent} />
          {certifications.map((c, idx) => (
            <div key={c.id} className={idx > 0 ? 'mt-[8px]' : ''}>
              <span className="font-semibold text-[11px] text-[#1a1a1a]">{c.name}</span>
              {(c.issuer || c.year) && (
                <div className="text-[9.5px] text-[#777]">
                  {c.issuer}{c.year ? ` · ${c.year}` : ''}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <>
          <SectionTitle label="Languages" accent={t.accent} />
          {languages.map((l, idx) => (
            <div key={l.id} className={idx > 0 ? 'mt-[8px]' : ''}>
              <div className="flex justify-between items-start gap-[12px]">
                <span className="font-semibold text-[11px] text-[#1a1a1a]">{l.language}</span>
                <span className="text-[9.5px]" style={{ color: t.secondary }}>
                  {l.proficiency}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
