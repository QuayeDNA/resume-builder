import { getTemplate } from './index'

function MainSectionTitle({ label, accent }) {
  return (
    <h2
      className="font-sans text-[11px] font-bold uppercase tracking-[1.6px] mt-[16px] mb-[10px] m-0 first:mt-0"
      style={{ color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: '4px' }}
    >
      {label}
    </h2>
  )
}

function SideSectionTitle({ label }) {
  return (
    <h3
      className="font-sans text-[9px] font-bold uppercase tracking-[1.4px] mt-[12px] mb-[8px] m-0 first:mt-0"
      style={{ color: 'rgba(255,255,255,0.75)', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '3px' }}
    >
      {label}
    </h3>
  )
}

function Bullet({ text, color }) {
  return (
    <div className="flex gap-[8px] my-[4px] text-[9.5px] text-[#222] leading-[1.5]">
      <span
        className="flex-shrink-0 w-[4px] h-[4px] rounded-full mt-[5px]"
        style={{ background: color }}
      />
      <span>{text}</span>
    </div>
  )
}

export default function TwoColumnTemplate({ data }) {
  const t = getTemplate(data.template)
  const { personal: p, experience, education, skills, projects, certifications, languages } = data

  return (
    <div
      id="resume-preview"
      className="font-sans flex min-h-full text-[10px] bg-white"
      style={{ fontFamily: "'DM Sans',sans-serif" }}
    >
      {/* Sidebar */}
      <div
        className="w-[200px] text-[rgba(255,255,255,0.92)] p-[44px_20px] flex-shrink-0"
        style={{ background: t.accent }}
      >
        <h1 className="font-serif text-[20px] font-bold text-white m-0 mb-[4px] leading-[1.2]">
          {p.name || 'Your Name'}
        </h1>
        {p.title && (
          <div className="text-[9px] font-semibold mb-[12px] uppercase tracking-[1px]" style={{ color: t.secondary }}>
            {p.title}
          </div>
        )}

        <div className="border-t border-[rgba(255,255,255,0.15)] pt-[10px] text-[8.5px] leading-[1.7] space-y-[3px]">
          {p.email && <div className="break-words">✉ {p.email}</div>}
          {p.phone && <div>✆ {p.phone}</div>}
          {p.location && <div>⌖ {p.location}</div>}
          {p.website && <div className="break-words">🌐 {p.website}</div>}
          {p.linkedin && <div className="break-words">in {p.linkedin}</div>}
        </div>

        {skills.length > 0 && (
          <>
            <SideSectionTitle label="Skills" />
            <div className="flex flex-wrap gap-[4px]">
              {skills.filter(s => s.trim()).map((s, i) => (
                <div key={i} className="bg-[rgba(255,255,255,0.12)] text-white rounded-[3px] px-[7px] py-[3px] text-[8.5px] font-medium">
                  {s}
                </div>
              ))}
            </div>
          </>
        )}

        {languages && languages.length > 0 && (
          <>
            <SideSectionTitle label="Languages" />
            <div className="space-y-[6px]">
              {languages.map(l => (
                <div key={l.id}>
                  <div className="text-[9px] font-semibold text-white">{l.language}</div>
                  <div className="text-[8px]" style={{ color: t.secondary }}>
                    {l.proficiency}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SideSectionTitle label="Certifications" />
            <div className="space-y-[6px]">
              {certifications.map(c => (
                <div key={c.id}>
                  <div className="text-[9px] font-semibold text-white">{c.name}</div>
                  <div className="text-[8px] text-[rgba(255,255,255,0.55)]">
                    {c.issuer}{c.year ? ` · ${c.year}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-[44px_28px] bg-white text-[#1a1a1a]">
        {p.summary && (
          <div className="mb-[16px] pb-[10px] border-l-[3px] pl-[12px]" style={{ borderColor: t.secondary }}>
            <p className="text-[10.5px] text-[#333] leading-[1.65] m-0">
              {p.summary}
            </p>
          </div>
        )}

        {experience.length > 0 && (
          <>
            <MainSectionTitle label="Experience" accent={t.accent} />
            {experience.map((e, idx) => (
              <div key={e.id} className={idx > 0 ? 'mt-[12px]' : ''}>
                <div className="flex justify-between items-start gap-[12px]">
                  <div>
                    <span className="font-semibold text-[11px] text-[#1a1a1a]">{e.role}</span>
                    {e.company && (
                      <span className="font-semibold ml-[6px]" style={{ color: t.secondary }}>
                        @ {e.company}
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-[#777] text-right flex-shrink-0">
                    <div className="whitespace-nowrap font-semibold">{e.start}{e.end ? ` – ${e.end}` : ''}</div>
                    {e.location && <div className="whitespace-nowrap text-[8.5px]">{e.location}</div>}
                  </div>
                </div>
                {e.bullets.filter(b => b.trim()).map((b, i) => (
                  <Bullet key={i} text={b} color={t.secondary} />
                ))}
              </div>
            ))}
          </>
        )}

        {education.length > 0 && (
          <>
            <MainSectionTitle label="Education" accent={t.accent} />
            {education.map((e, idx) => (
              <div key={e.id} className={`flex justify-between items-start gap-[12px] ${idx > 0 ? 'mt-[10px]' : ''}`}>
                <div>
                  <span className="font-semibold text-[11px] text-[#1a1a1a]">{e.degree}</span>
                  {e.school && <span className="ml-[6px]" style={{ color: t.secondary }}>· {e.school}</span>}
                </div>
                <div className="text-[9px] text-[#777] text-right flex-shrink-0">
                  <div className="whitespace-nowrap font-semibold">{e.start}{e.end ? ` – ${e.end}` : ''}</div>
                  {e.gpa && <div className="whitespace-nowrap text-[8.5px]">GPA: {e.gpa}</div>}
                </div>
              </div>
            ))}
          </>
        )}

        {projects.length > 0 && (
          <>
            <MainSectionTitle label="Projects" accent={t.accent} />
            {projects.map((pr, idx) => (
              <div key={pr.id} className={idx > 0 ? 'mt-[10px]' : ''}>
                <div className="flex justify-between items-start gap-[12px]">
                  <span className="font-semibold text-[11px] text-[#1a1a1a]">{pr.name}</span>
                  {pr.url && (
                    <a
                      href={pr.url}
                      className="text-[9px] underline flex-shrink-0"
                      style={{ color: t.secondary }}
                    >
                      View
                    </a>
                  )}
                </div>
                {pr.description && (
                  <p className="text-[10px] text-[#333] my-[4px] m-0">{pr.description}</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
