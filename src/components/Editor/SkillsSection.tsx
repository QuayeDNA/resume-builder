import { Card, AiButton, Badge } from '../UI'
import { Hint } from '../../design/components'
import { useAi } from '../../hooks/useAi'
import { aiSuggestSkills } from '../../api/ai'
import useResumeStore from '../../store/useResumeStore'
import toast from 'react-hot-toast'

export default function SkillsSection() {
  const skills    = useResumeStore((s) => s.data.skills)
  const personal  = useResumeStore((s) => s.data.personal)
  const setSkills = useResumeStore((s) => s.setSkills)
  const addSkills = useResumeStore((s) => s.addSkills)
  const removeSkill = useResumeStore((s) => s.removeSkill)
  const { run, isLoading } = useAi()

  const handleSuggest = () =>
    run('skills', () => aiSuggestSkills(personal.title, skills), async (suggested) => {
      const arr = Array.isArray(suggested) ? suggested : suggested.split(',').map((s: string) => s.trim()).filter(Boolean)
      const newSkills = arr.filter((s: string) => !skills.includes(s))
      if (newSkills.length === 0) {
        toast('No new skills to add!')
        return
      }
      addSkills(newSkills)
      toast.success(`Added: ${newSkills.join(', ')}`)
    })

  return (
    <Card title="Skills">
      <Hint>Comma-separated. Click × to remove a skill.</Hint>
      <textarea
        value={skills.join(', ')}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setSkills(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
        }
        placeholder="React, TypeScript, Node.js, Figma…"
        rows={3}
        className="w-full bg-elevated-2 border border-subtle rounded-lg px-2.5 py-1.5 text-body text-primary placeholder:text-disabled resize-y transition-all duration-100 focus:border-brand focus:ring-1 focus:ring-brand-subtle focus:outline-none"
      />
      <AiButton onClick={handleSuggest} loading={isLoading('skills')}>
        AI Suggest Skills
      </AiButton>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {skills.filter((s) => s.trim()).map((s, i) => (
            <Badge key={i} variant="brand" onRemove={() => removeSkill(i)}>
              {s}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  )
}
