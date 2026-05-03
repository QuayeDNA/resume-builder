import { getTemplate } from './index'

export default function ATSTemplate({ data }) {
  const t = getTemplate(data.template)
  const { personal: p, experience, education, skills, projects, certifications, languages } = data

  return (
    <div
      className="resume-page p-[36px_40px] min-h-full box-border"
      id="resume-preview"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '10.5px', lineHeight: '1.5', color: '#000' }}
    >
      {/* Header */}
      <div className="text-center border-b-[2px] pb-[10px] mb-[12px]" style={{ borderColor: t.accent }}>
        <h1
          className="font-bold m-0"
          style={{ fontSize: '22px', color: t.accent }}
        >
          {p.name || 'Your Name'}
        </h1>
        {p.title && (
          <div
            className="font-semibold mt-[2px] mb-[4px]"
            style={{ fontSize: '11px', color: t.secondary }}
          >
            {p.title}
          </div>
        )}
        <div className="text-[10px] text-[#333] mt-[4px]">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span> | {p.phone}</span>}
          {p.location && <span> | {p.location}</span>}
        </div>
        {(p.website || p.linkedin) && (
          <div className="text-[10px] text-[#333]">
            {p.website && <span>{p.website}</span>}
            {p.website && p.linkedin && <span> | </span>}
            {p.linkedin && <span>{p.linkedin}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {p.summary && (
        <div className="mb-[12px]">
          <h2
            className="font-bold uppercase mb-[6px]"
            style={{ fontSize: '12px', color: t.accent, borderBottom: `1.5px solid ${t.accent}` }}
          >
            Professional Summary
          </h2>
          <p className="m-0 text-[10.5px] text-[#111]">{p.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-[12px]">
          <h2
            className="font-bold uppercase mb-[6px]"
            style={{ fontSize: '12px', color: t.accent, borderBottom: `1.5px solid ${t.accent}` }}
          >
            Experience
          </h2>
          {experience.map((e) => (
            <div key={e.id} className="mb-[10px]">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-[11px]">{e.role}</span>
                  {e.company && (
                    <span className="font-semibold ml-[4px] text-[10.5px]" style={{ color: t.secondary }}>
                      | {e.company}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#444] text-right font-semibold">
                  {e.start}{e.end ? ` – ${e.end}` : ''}
                </div>
              </div>
              {e.location && (
                <div className="text-[10px] text-[#444] italic">{e.location}</div>
              )}
              {e.bullets.filter((b) => b.trim()).map((b, i) => (
                <div key={i} className="my-[2px] ml-[14px] text-[10.5px] text-[#111]">
                  <span className="absolute ml-[-10px]">•</span>{b}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-[12px]">
          <h2
            className="font-bold uppercase mb-[6px]"
            style={{ fontSize: '12px', color: t.accent, borderBottom: `1.5px solid ${t.accent}` }}
          >
            Education
          </h2>
          {education.map((e) => (
            <div key={e.id} className="mb-[6px] flex justify-between items-baseline">
              <div>
                <span className="font-bold text-[11px]">{e.degree}</span>
                {e.school && (
                  <span className="font-semibold ml-[4px] text-[10.5px]" style={{ color: t.secondary }}>
                    | {e.school}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#444] text-right font-semibold">
                {e.start}{e.end ? ` – ${e.end}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-[12px]">
          <h2
            className="font-bold uppercase mb-[6px]"
            style={{ fontSize: '12px', color: t.accent, borderBottom: `1.5px solid ${t.accent}` }}
          >
            Skills
          </h2>
          <div className="text-[10.5px] text-[#111]">
            {skills.filter((s) => s.trim()).map((s, i) => (
              <span key={i}>
                {s}{i < skills.filter((s) => s.trim()).length - 1 ? ' | ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-[12px]">
          <h2
            className="font-bold uppercase mb-[6px]"
            style={{ fontSize: '12px', color: t.accent, borderBottom: `1.5px solid ${t.accent}` }}
          >
            Projects
          </h2>
          {projects.map((pr) => (
            <div key={pr.id} className="mb-[6px]">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[11px]">{pr.name}</span>
                {pr.url && (
                  <span className="text-[10px]" style={{ color: t.secondary }}>
                    {pr.url}
                  </span>
                )}
              </div>
              {pr.description && (
                <div className="text-[10.5px] text-[#111] mt-[2px]">{pr.description}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-[12px]">
          <h2
            className="font-bold uppercase mb-[6px]"
            style={{ fontSize: '12px', color: t.accent, borderBottom: `1.5px solid ${t.accent}` }}
          >
            Certifications
          </h2>
          {certifications.map((c) => (
            <div key={c.id} className="mb-[4px]">
              <span className="font-bold text-[10.5px]">{c.name}</span>
              {c.issuer && (
                <span className="font-semibold ml-[4px] text-[10px]" style={{ color: t.secondary }}>
                  | {c.issuer}
                </span>
              )}
              {c.year && <span className="text-[10px] text-[#444] ml-[4px]">{c.year}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="mb-[12px]">
          <h2
            className="font-bold uppercase mb-[6px]"
            style={{ fontSize: '12px', color: t.accent, borderBottom: `1.5px solid ${t.accent}` }}
          >
            Languages
          </h2>
          {languages.map((l) => (
            <div key={l.id} className="mb-[3px]">
              <span className="font-bold text-[10.5px]">{l.language}</span>
              <span className="font-semibold ml-[4px] text-[10px]" style={{ color: t.secondary }}>
                | {l.proficiency}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
