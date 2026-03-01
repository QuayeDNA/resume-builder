import { Card, AiButton, Badge } from '../UI'
import { useAi } from '../../hooks/useAi'
import { aiSuggestSkills } from '../../api/claude'
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
      const newSkills = suggested.filter((s) => !skills.includes(s))
      if (newSkills.length === 0) {
        toast('No new skills to add!')
        return
      }
      addSkills(newSkills)
      toast.success(`Added: ${newSkills.join(', ')}`)
    })

  return (
    <Card title="Skills">
      <p className="text-[9.5px] text-gray-600 mb-2">Comma-separated. Click × to remove.</p>
      <textarea
        value={skills.join(', ')}
        onChange={(e) =>
          setSkills(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
        }
        placeholder="React, TypeScript, Node.js, Figma…"
        rows={3}
        className="w-full bg-[#1c1c2e] border border-[#2a2a44] rounded-md px-3 py-2 text-[#dcdcf0] text-[11.5px] font-sans placeholder-[#3a3a5a] resize-y mb-2 transition-colors"
      />
      <AiButton onClick={handleSuggest} loading={isLoading('skills')}>
        AI Suggest Skills
      </AiButton>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {skills.filter((s) => s.trim()).map((s, i) => (
            <Badge key={i} onRemove={() => removeSkill(i)}>
              {s}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  )
}
