import { Card, AiButton, CommaInput } from '../UI'
import { Skeleton } from '../../design/components'
import { useAi } from '../../hooks/useAi'
import { aiSuggestSkills } from '../../api/ai'
import useResumeStore from '../../store/useResumeStore'
import toast from 'react-hot-toast'

export default function SkillsSection() {
  const skills    = useResumeStore((s) => s.data.skills)
  const personal  = useResumeStore((s) => s.data.personal)
  const setSkills = useResumeStore((s) => s.setSkills)
  const addSkills = useResumeStore((s) => s.addSkills)
  const { run, isLoading } = useAi()

  const handleSuggest = () =>
    run<string[]>('skills', () => aiSuggestSkills(personal.title, skills), async (suggested) => {
      const newSkills = suggested.filter((s: string) => !skills.includes(s))
      if (newSkills.length === 0) {
        toast('No new skills to add!')
        return
      }
      addSkills(newSkills)
      toast.success(`Added: ${newSkills.join(', ')}`)
    })

  return (
    <Card title="Skills">
      <CommaInput
        values={skills}
        onChange={setSkills}
        placeholder="React, TypeScript, Node.js, Figma…"
        hint="Type a skill and press comma or Enter to add it. Click × to remove."
      />
      <AiButton onClick={handleSuggest} loading={isLoading('skills')}>
        AI Suggest Skills
      </AiButton>
      {isLoading('skills') && (
        <div className="animate-fade-in">
          <Skeleton lines={2} />
        </div>
      )}
    </Card>
  )
}
