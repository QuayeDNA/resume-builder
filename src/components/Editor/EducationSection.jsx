import { Card, EntryCard, Input } from '../UI'
import useResumeStore from '../../store/useResumeStore'

export default function EducationSection() {
  const education      = useResumeStore((s) => s.data.education)
  const addEducation   = useResumeStore((s) => s.addEducation)
  const removeEducation = useResumeStore((s) => s.removeEducation)
  const updateEducation = useResumeStore((s) => s.updateEducation)

  return (
    <Card title="Education" onAdd={addEducation} addLabel="Add Education">
      {education.map((edu) => (
        <EntryCard key={edu.id} onDelete={() => removeEducation(edu.id)}>
          <Input label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, 'school', v)} placeholder="University Name" />
          <Input label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, 'degree', v)} placeholder="B.S. Computer Science" />
          <div className="grid grid-cols-3 gap-2">
            <Input label="Start" value={edu.start} onChange={(v) => updateEducation(edu.id, 'start', v)} placeholder="2018" />
            <Input label="End"   value={edu.end}   onChange={(v) => updateEducation(edu.id, 'end', v)}   placeholder="2022" />
            <Input label="GPA"   value={edu.gpa}   onChange={(v) => updateEducation(edu.id, 'gpa', v)}   placeholder="3.8" />
          </div>
        </EntryCard>
      ))}
    </Card>
  )
}
