import { getTemplate } from './index'

function SectionTitle({ label, accent }) {
  return (
    <div
      className="font-serif text-[12px] font-bold uppercase tracking-[2px] pb-[3px] mb-[9px] mt-[14px]"
      style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}
    >
      {label}
    </div>
  )
}

function Bullet({ text, color }) {
  return (
    <div className="relative my-[3px] pl-[13px] text-[#333] text-[10px]">
      <span
        className="absolute left-0 top-[5px] w-[4px] h-[4px] rounded-full"
        style={{ background: color }}
      />
      {text}
    </div>
  )
}

export default function SingleColumnTemplate({ data }) {
  const t = getTemplate(data.template)
  const { personal: p, experience, education, skills, projects, certifications, languages } = data

  return (
    <div
      className="resume-page p-[36px_40px] min-h-full box-border"
      id="resume-preview"
    >
      {/* Header */}
      <div className="border-b-[3px] pb-[14px] mb-[14px]" style={{ borderColor: t.accent }}>
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="font-serif text-[26px] font-bold m-0 tracking-[-0.5px]"
              style={{ color: t.accent }}
            >
              {p.name || 'Your Name'}
            </h1>
            {p.title && (
              <div
                className="text-[11px] font-semibold mt-[2px] uppercase tracking-[1.5px]"
                style={{ color: t.secondary }}
              >
                {p.title}
              </div>
            )}
          </div>
          <div className="text-right text-[9.5px] text-[#555] leading-[1.9]">
            {p.email    && <div>✉ {p.email}</div>}
            {p.phone    && <div>✆ {p.phone}</div>}
            {p.location && <div>⌖ {p.location}</div>}
            {p.website  && <div>⟁ {p.website}</div>}
            {p.linkedin && <div>in {p.linkedin}</div>}
          </div>
        </div>
        {p.summary && (
          <p className="text-[10px] text-[#444] mt-[10px] mb-0 leading-[1.65]">
            {p.summary}
          </p>
        )}
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <>
          <SectionTitle label="Experience" accent={t.accent} />
          {experience.map((e) => (
            <div key={e.id} className="mb-[12px]">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-[11px]">{e.role}</span>
                  {e.company && (
                    <span
                      className="font-semibold ml-[5px] text-[10.5px]"
                      style={{ color: t.secondary }}
                    >
                      @ {e.company}
                    </span>
                  )}
                </div>
                <div className="text-[9.5px] text-[#777] text-right">
                  <div>{e.start}{e.end ? ` – ${e.end}` : ''}</div>
                  {e.location && <div>{e.location}</div>}
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
          {education.map((e) => (
            <div key={e.id} className="mb-[8px] flex justify-between">
              <div>
                <span className="font-semibold text-[11px]">{e.degree}</span>
                {e.school && (
                  <span
                    className="ml-[5px] text-[10.5px]"
                    style={{ color: t.secondary }}
                  >
                    · {e.school}
                  </span>
                )}
              </div>
              <div className="text-[9.5px] text-[#777] text-right">
                {e.start}{e.end ? ` – ${e.end}` : ''}
                {e.gpa && <div>GPA: {e.gpa}</div>}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <>
          <SectionTitle label="Skills" accent={t.accent} />
          <div className="flex flex-wrap gap-[5px]">
            {skills.filter((s) => s.trim()).map((s, i) => (
              <span
                key={i}
                className="rounded-[3px] px-[8px] py-[2px] text-[9.5px] font-medium"
                style={{
                  background: `${t.accent}12`,
                  border: `1px solid ${t.accent}28`,
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
          {projects.map((pr) => (
            <div key={pr.id} className="mb-[9px]">
              <div className="flex justify-between">
                <span className="font-semibold text-[11px]">{pr.name}</span>
                {pr.url && (
                  <span className="text-[9.5px]" style={{ color: t.secondary }}>
                    {pr.url}
                  </span>
                )}
              </div>
              {pr.description && (
                <div className="text-[10px] text-[#444] mt-[2px]">
                  {pr.description}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Certifications + Languages side by side */}
      {(certifications.length > 0 || (languages && languages.length > 0)) && (
        <div className="grid grid-cols-2 gap-[24px]">
          {certifications.length > 0 && (
            <div>
              <SectionTitle label="Certifications" accent={t.accent} />
              {certifications.map((c) => (
                <div key={c.id} className="mb-[5px]">
                  <div className="font-medium text-[10.5px]">{c.name}</div>
                  <div className="text-[9.5px] text-[#777]">
                    {c.issuer}{c.year ? ` · ${c.year}` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
          {languages && languages.length > 0 && (
            <div>
              <SectionTitle label="Languages" accent={t.accent} />
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between mb-[4px]">
                  <span className="font-medium text-[10.5px]">{l.language}</span>
                  <span className="text-[9.5px]" style={{ color: t.secondary }}>
                    {l.proficiency}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
