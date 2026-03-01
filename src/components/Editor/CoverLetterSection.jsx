import { Card, Input, TextArea, AiButton } from '../UI'
import { COVER_LETTER_TONES } from '../../types'
import { useAi } from '../../hooks/useAi'
import { aiGenerateCoverLetter } from '../../api/claude'
import useResumeStore from '../../store/useResumeStore'

export default function CoverLetterSection() {
  const cl             = useResumeStore((s) => s.cl)
  const data           = useResumeStore((s) => s.data)
  const updateCL       = useResumeStore((s) => s.updateCoverLetter)
  const setActiveView  = useResumeStore((s) => s.setActiveView)
  const { run, isLoading } = useAi()

  const handleGenerate = () =>
    run(
      'cover',
      () =>
        aiGenerateCoverLetter({
          name:       data.personal.name,
          title:      data.personal.title,
          summary:    data.personal.summary,
          skills:     data.skills,
          experience: data.experience,
          role:       cl.role,
          company:    cl.company,
          tone:       cl.tone,
        }),
      (v) => {
        updateCL('body', v)
        setActiveView('cover')
      },
    )

  return (
    <Card title="Cover Letter">
      <div className="grid grid-cols-2 gap-2">
        <Input label="Recipient"    value={cl.recipientName} onChange={(v) => updateCL('recipientName', v)} placeholder="Hiring Manager" />
        <Input label="Company"      value={cl.company}       onChange={(v) => updateCL('company', v)}       placeholder="Acme Corp" />
      </div>
      <Input label="Role Applying For" value={cl.role} onChange={(v) => updateCL('role', v)} placeholder="Senior Designer" />

      <div className="mb-2">
        <div className="text-[9px] text-gray-500 mb-1.5 font-semibold uppercase tracking-[0.8px]">Tone</div>
        <div className="flex gap-1">
          {COVER_LETTER_TONES.map((tone) => (
            <button
              key={tone}
              onClick={() => updateCL('tone', tone)}
              className={`flex-1 py-1 rounded text-[8.5px] font-semibold capitalize transition-colors ${
                cl.tone === tone
                  ? 'bg-[#18103a] border border-brand-500 text-brand-400'
                  : 'bg-[#141420] border border-transparent text-[#3a3a5a] hover:text-[#6a6a9a]'
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      <AiButton onClick={handleGenerate} loading={isLoading('cover')}>
        AI Generate Cover Letter
      </AiButton>

      <div className="mt-2">
        <TextArea
          label="Edit / Write Your Own"
          value={cl.body}
          onChange={(v) => updateCL('body', v)}
          placeholder="Or write your cover letter body here…"
          rows={6}
        />
      </div>

      <p className="text-[9px] text-gray-700 mt-1">
        Switch to <strong className="text-[#5a5a8a]">Cover Letter</strong> view in the preview panel to see it rendered.
      </p>
    </Card>
  )
}
