import { Card, Input, TextArea, AiButton } from '../UI'
import { useAi } from '../../hooks/useAi'
import { aiImproveSummary } from '../../api/ai'
import useResumeStore from '../../store/useResumeStore'

export default function PersonalSection() {
  const personal       = useResumeStore((s) => s.data.personal)
  const updatePersonal = useResumeStore((s) => s.updatePersonal)
  const { run, isLoading } = useAi()

  const handleImproveSummary = () =>
    run<string>('summary', () => aiImproveSummary(personal.summary, personal.title), (v) =>
      updatePersonal('summary', v),
    )

  return (
    <Card title="Personal Information">
      <Input label="Full Name"  value={personal.name}     onChange={(v) => updatePersonal('name', v)}     placeholder="Jane Doe" />
      <Input label="Job Title"  value={personal.title}    onChange={(v) => updatePersonal('title', v)}    placeholder="Software Engineer" />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input label="Email"  value={personal.email} onChange={(v) => updatePersonal('email', v)} placeholder="jane@email.com" />
        <Input label="Phone"  value={personal.phone} onChange={(v) => updatePersonal('phone', v)} placeholder="+1 555 0000" />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input label="Location" value={personal.location} onChange={(v) => updatePersonal('location', v)} placeholder="New York, NY" />
        <Input label="Website"  value={personal.website}  onChange={(v) => updatePersonal('website', v)}  placeholder="yoursite.com" />
      </div>

      <Input label="LinkedIn" value={personal.linkedin} onChange={(v) => updatePersonal('linkedin', v)} placeholder="linkedin.com/in/you" />

      <TextArea
        label="Professional Summary"
        value={personal.summary}
        onChange={(v) => updatePersonal('summary', v)}
        placeholder="Write a compelling 2–3 sentence summary…"
        rows={8}
      />

      <AiButton
        onClick={handleImproveSummary}
        loading={isLoading('summary')}
        disabled={!personal.summary.trim()}
      >
        AI Improve Summary
      </AiButton>
    </Card>
  )
}
