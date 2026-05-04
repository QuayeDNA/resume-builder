import { getTemplate } from './index'

function SectionTitle({ label, accent }) {
  return (
    <h2
      className="font-sans text-[12px] font-bold uppercase tracking-[2px] mt-[14px] mb-[8px] m-0 first:mt-0"
      style={{ color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: '4px' }}
    >
      {label}
    </h2>
  )
}

export default function ATSTemplate({ data }) {
  const t = getTemplate(data.template)
  const { personal: p, experience, education, skills, projects, certifications, languages } = data

  return (
    <div
      className="resume-page min-h-full box-border bg-white"
      id="resume-preview"
      style={{
        padding: '48px 44px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '10.5px',
        lineHeight: '1.6',
        color: '#000',
      }}
    >
      {/* Header */}
      <div className="text-center mb-[16px] pb-[12px]" style={{ borderBottom: `2px solid ${t.accent}` }}>
        <h1
          className="font-bold m-0 mb-[4px]"
          style={{ fontSize: '24px', color: t.accent }}
        >
          {p.name || 'Your Name'}
        </h1>
        {p.title && (
          <div
            className="font-semibold mb-[6px] uppercase tracking-[1px]"
            style={{ fontSize: '11px', color: t.secondary }}
          >
            {p.title}
          </div>
        )}
        <div className="text-[10px] text-[#333] leading-[1.6]">
          {[p.email, p.phone, p.location].filter(Boolean).join(' | ')}
        </div>
        {(p.website || p.linkedin) && (
          <div className="text-[10px] text-[#333] mt-[2px]">
            {[p.website, p.linkedin].filter(Boolean).join(' | ')}
          </div>
        )}
      </div>

      {/* Summary */}
      {p.summary && (
        <div className="mb-[14px]">
          <SectionTitle label="Professional Summary" accent={t.accent} />
          <p className="m-0 text-[10.5px] text-[#111] leading-[1.65]">{p.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-[14px]">
          <SectionTitle label="Experience" accent={t.accent} />
          {experience.map((e, idx) => (
            <div key={e.id} className={idx > 0 ? 'mt-[10px]' : ''}>
              <div className="flex justify-between items-baseline gap-[12px]">
                <div>
                  <span className="font-bold text-[11px] text-[#000]">{e.role}</span>
                  {e.company && (
                    <span className="font-semibold ml-[4px] text-[10.5px]" style={{ color: t.secondary }}>
                      | {e.company}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#444] text-right font-semibold flex-shrink-0 whitespace-nowrap">
                  {e.start}{e.end ? ` – ${e.end}` : ''}
                </div>
              </div>
              {e.location && (
                <div className="text-[10px] text-[#444] italic my-[3px]">{e.location}</div>
              )}
              {e.bullets.filter((b) => b.trim()).map((b, i) => (
                <div key={i} className="flex gap-[8px] my-[3px] text-[10.5px] text-[#111] leading-[1.5]">
                  <span className="flex-shrink-0">•</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-[14px]">
          <SectionTitle label="Education" accent={t.accent} />
          {education.map((e, idx) => (
            <div key={e.id} className={`flex justify-between items-start gap-[12px] ${idx > 0 ? 'mt-[8px]' : ''}`}>
              <div>
                <span className="font-bold text-[11px] text-[#000]">{e.degree}</span>
                {e.school && (
                  <span className="ml-[4px] text-[10.5px]" style={{ color: t.secondary }}>
                    | {e.school}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#444] text-right flex-shrink-0">
                <div className="whitespace-nowrap font-semibold">{e.start}{e.end ? ` – ${e.end}` : ''}</div>
                {e.gpa && <div className="whitespace-nowrap text-[9.5px]">GPA: {e.gpa}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-[14px]">
          <SectionTitle label="Skills" accent={t.accent} />
          <div className="flex flex-wrap gap-[8px]">
            {skills.filter(s => s.trim()).map((s, i) => (
              <span key={i} className="text-[10.5px]">{s}{i < skills.length - 1 ? ' |' : ''}</span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-[14px]">
          <SectionTitle label="Projects" accent={t.accent} />
          {projects.map((pr, idx) => (
            <div key={pr.id} className={idx > 0 ? 'mt-[8px]' : ''}>
              <div className="flex justify-between items-start gap-[12px]">
                <span className="font-bold text-[11px] text-[#000]">{pr.name}</span>
                {pr.url && (
                  <span className="text-[10px] flex-shrink-0 whitespace-nowrap" style={{ color: t.secondary }}>
                    {pr.url}
                  </span>
                )}
              </div>
              {pr.description && (
                <p className="text-[10.5px] text-[#111] mt-[3px] mb-0 leading-[1.5]">
                  {pr.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-[14px]">
          <SectionTitle label="Certifications" accent={t.accent} />
          {certifications.map((c, idx) => (
            <div key={c.id} className={idx > 0 ? 'mt-[8px]' : ''}>
              <span className="font-bold text-[11px] text-[#000]">{c.name}</span>
              {(c.issuer || c.year) && (
                <div className="text-[10px] text-[#444]">
                  {c.issuer}{c.year ? ` · ${c.year}` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div>
          <SectionTitle label="Languages" accent={t.accent} />
          {languages.map((l, idx) => (
            <div key={l.id} className={`flex justify-between items-start gap-[12px] ${idx > 0 ? 'mt-[6px]' : ''}`}>
              <span className="font-bold text-[11px] text-[#000]">{l.language}</span>
              <span className="text-[10px]" style={{ color: t.secondary }}>
                {l.proficiency}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
