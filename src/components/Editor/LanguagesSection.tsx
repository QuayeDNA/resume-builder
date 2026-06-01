import { Card, EntryCard, Input, Select } from '../UI'
import { PROFICIENCY_OPTIONS } from '../../types'
import useResumeStore from '../../store/useResumeStore'

export default function LanguagesSection() {
  const languages      = useResumeStore((s) => s.data.languages || [])
  const addLanguage    = useResumeStore((s) => s.addLanguage)
  const removeLanguage = useResumeStore((s) => s.removeLanguage)
  const updateLanguage = useResumeStore((s) => s.updateLanguage)

  return (
    <Card title="Languages" onAdd={addLanguage} addLabel="Add Language">
      {languages.map((l) => (
        <EntryCard key={l.id} onDelete={() => removeLanguage(l.id)}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Input
              label="Language"
              value={l.language}
              onChange={(v) => updateLanguage(l.id, 'language', v)}
              placeholder="Spanish"
            />
            <Select
              label="Proficiency"
              value={l.proficiency}
              onChange={(v) => updateLanguage(l.id, 'proficiency', v)}
              options={[...PROFICIENCY_OPTIONS]}
            />
          </div>
        </EntryCard>
      ))}
    </Card>
  )
}
