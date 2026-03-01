import { getTemplate } from './index'

export default function CoverLetterTemplate({ resume, cl }) {
  const t     = getTemplate(resume.template)
  const p     = resume.personal
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div
      id="resume-preview"
      className="font-sans bg-white text-[#1a1a1a] text-[10.5px] leading-[1.8] p-[50px_54px] box-border min-h-full"
    >
      {/* Letterhead */}
      <div className="border-b-[3px] pb-[12px] mb-[28px]" style={{ borderColor: t.accent }}>
        <h1 className="font-serif text-[22px] font-bold m-0" style={{ color: t.accent }}>
          {p.name || 'Your Name'}
        </h1>
        <div className="text-[10px] text-[#777] mt-[4px] flex gap-[16px] flex-wrap">
          {p.email    && <span>{p.email}</span>}
          {p.phone    && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website  && <span>{p.website}</span>}
        </div>
      </div>

      {/* Date */}
      <div className="mb-[20px] text-[10px] text-[#777]">{today}</div>

      {/* Salutation */}
      <div className="mb-[20px]">
        <span className="font-semibold">Dear {cl.recipientName || 'Hiring Manager'},</span>
      </div>

      {/* Body */}
      <div className="whitespace-pre-wrap text-[10.5px] text-[#333] leading-[1.85] mb-[32px]">
        {cl.body ||
          `I am writing to express my strong interest in the ${cl.role || '[Role]'} position at ${cl.company || '[Company]'}.\n\n[Use the AI Generate button in the Cover Letter tab to create a personalized letter, or write your own here.]`}
      </div>

      {/* Sign-off */}
      <div className="font-semibold mb-[36px]">Sincerely,</div>
      <div className="font-serif text-[16px] font-bold" style={{ color: t.accent }}>
        {p.name || 'Your Name'}
      </div>
    </div>
  )
}
