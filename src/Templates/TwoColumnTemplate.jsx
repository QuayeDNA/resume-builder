import { getTemplate } from './index'

function MainST({ label, accent }) {
  return (
    <div
      className="font-serif text-[11px] font-bold uppercase tracking-[1.5px] pb-[3px] mb-[8px] mt-[13px]"
      style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}
    >
      {label}
    </div>
  )
}
function SideST({ label }) {
  return (
    <div
      className="font-serif text-[9.5px] font-bold uppercase tracking-[1.5px] pb-[3px] mb-[7px] mt-[12px]"
      style={{ color: 'rgba(255,255,255,0.65)', borderBottom: '1px solid rgba(255,255,255,0.15)' }}
    >
      {label}
    </div>
  )
}
function Bullet({ text, color }) {
  return (
    <div className="relative my-[3px] pl-[12px] text-[#333] text-[9.5px]">
      <span className="absolute left-0 top-[5px] w-[4px] h-[4px] rounded-full" style={{ background: color }} />
      {text}
    </div>
  )
}

export default function TwoColumnTemplate({ data }) {
  const t = getTemplate(data.template)
  const { personal:p, experience, education, skills, projects, certifications, languages } = data

  return (
    <div
      id="resume-preview"
      className="font-sans flex min-h-full text-[10px]"
      style={{ fontFamily: "'DM Sans',sans-serif" }}
    >
      {/* Sidebar */}
      <div
        className="w-[195px] text-[rgba(255,255,255,0.9)] p-[26px_16px] flex-shrink-0"
        style={{ background: t.accent }}
      >
        <h1 className="font-serif text-[18px] font-bold text-white m-0 leading-[1.2]">
          {p.name || 'Your Name'}
        </h1>
        {p.title && (
          <div className="text-[8.5px] font-semibold mt-[4px] uppercase tracking-[1px]" style={{ color: t.secondary }}>
            {p.title}
          </div>
        )}
        <div className="border-t border-[rgba(255,255,255,0.12)] mt-[10px] pt-[9px]">
          {p.email    && <div className="text-[8.5px] mb-[4px] break-words">✉ {p.email}</div>}
          {p.phone    && <div className="text-[8.5px] mb-[4px]">✆ {p.phone}</div>}
          {p.location && <div className="text-[8.5px] mb-[4px]">⌖ {p.location}</div>}
          {p.website  && <div className="text-[8.5px] mb-[4px] break-words">⟁ {p.website}</div>}
          {p.linkedin && <div className="text-[8.5px] break-words">in {p.linkedin}</div>}
        </div>

        {skills.length > 0 && (
          <>
            <SideST label="Skills" />
            {skills.filter(s=>s.trim()).map((s,i)=>(
              <div key={i} className="bg-[rgba(255,255,255,0.08)] rounded-[3px] px-[7px] py-[3px] text-[8.5px] mb-[3px] text-white">{s}</div>
            ))}
          </>
        )}

        {languages && languages.length > 0 && (
          <>
            <SideST label="Languages" />
            {languages.map(l=>(
              <div key={l.id} className="mb-[4px]">
                <div className="text-[8.5px] font-semibold text-white">{l.language}</div>
                <div className="text-[8px]" style={{ color: t.secondary }}>{l.proficiency}</div>
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SideST label="Certifications" />
            {certifications.map(c=>(
              <div key={c.id} className="mb-[4px]">
                <div className="text-[8.5px] font-semibold text-white">{c.name}</div>
                <div className="text-[8px] text-[rgba(255,255,255,0.45)]">{c.issuer}{c.year?` · ${c.year}`:''}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-[26px_22px] bg-white text-[#1a1a1a]">
        {p.summary && (
          <p className="text-[10px] text-[#444] leading-[1.65] border-l-[3px] pl-[10px] m-0" style={{ borderColor: t.secondary }}>
            {p.summary}
          </p>
        )}

        {experience.length > 0 && (
          <>
            <MainST label="Experience" accent={t.accent} />
            {experience.map(e=>(
              <div key={e.id} className="mb-[11px]">
                <div className="flex justify-between">
                  <div>
                    <span className="font-semibold text-[11px]">{e.role}</span>
                    {e.company && <span className="font-semibold ml-[5px]" style={{ color: t.secondary }}>@ {e.company}</span>}
                  </div>
                  <div className="text-[9px] text-[#777] text-right">
                    {e.start}{e.end?` – ${e.end}`:''}
                    {e.location && <div>{e.location}</div>}
                  </div>
                </div>
                {e.bullets.filter(b=>b.trim()).map((b,i)=><Bullet key={i} text={b} color={t.secondary}/>)}
              </div>
            ))}
          </>
        )}

        {education.length > 0 && (
          <>
            <MainST label="Education" accent={t.accent} />
            {education.map(e=>(
              <div key={e.id} className="mb-[8px] flex justify-between">
                <div>
                  <span className="font-semibold text-[11px]">{e.degree}</span>
                  {e.school && <span className="ml-[5px]" style={{ color: t.secondary }}>· {e.school}</span>}
                </div>
                <div className="text-[9px] text-[#777]">
                  {e.start}{e.end?` – ${e.end}`:''}
                  {e.gpa && <div>GPA: {e.gpa}</div>}
                </div>
              </div>
            ))}
          </>
        )}

        {projects.length > 0 && (
          <>
            <MainST label="Projects" accent={t.accent} />
            {projects.map(pr=>(
              <div key={pr.id} className="mb-[8px]">
                <div className="flex justify-between">
                  <span className="font-semibold text-[11px]">{pr.name}</span>
                  {pr.url && <span className="text-[9px]" style={{ color: t.secondary }}>{pr.url}</span>}
                </div>
                {pr.description && <div className="text-[9.5px] text-[#444] mt-[2px]">{pr.description}</div>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
