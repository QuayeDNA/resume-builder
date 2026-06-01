import { Card, Input, TextArea, AiButton } from '../UI'
import { Hint } from '../../design/components'
import { COVER_LETTER_TONES } from '../../types'
import { useAi } from '../../hooks/useAi'
import { aiGenerateCoverLetter } from '../../api/ai'
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
        updateCL('body', v as string)
        setActiveView('cover')
      },
    )

  return (
    <Card title="Cover Letter">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input label="Recipient"    value={cl.recipientName} onChange={(v) => updateCL('recipientName', v)} placeholder="Hiring Manager" />
        <Input label="Company"      value={cl.company}       onChange={(v) => updateCL('company', v)}       placeholder="Acme Corp" />
      </div>
      <Input label="Role Applying For" value={cl.role} onChange={(v) => updateCL('role', v)} placeholder="Senior Designer" />

      {/* Tone selector */}
      <div className="space-y-1">
        <label className="block text-label uppercase text-ink-muted">Tone</label>
        <div className="flex gap-1">
          {COVER_LETTER_TONES.map((tone) => (
            <button
              key={tone}
              onClick={() => updateCL('tone', tone)}
              className={`flex-1 py-1.5 rounded-lg text-caption font-medium capitalize transition-all duration-100 ${
                cl.tone === tone
                  ? 'bg-terracotta-dim border border-terracotta text-terracotta'
                  : 'bg-white border border-transparent text-ink-muted hover:text-ink hover:bg-paper-deep'
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

      <Hint>Switch to <span className="text-ink font-medium">Cover Letter</span> view in the preview panel to see it rendered.</Hint>
    </Card>
  )
}
