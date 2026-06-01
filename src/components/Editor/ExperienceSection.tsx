import { Plus, Sparkles, Loader2, X } from 'lucide-react'
import { Card, EntryCard, Input, AiButton, Button, IconButton } from '../UI'
import { useAi } from '../../hooks/useAi'
import { aiImproveBullet, aiSuggestBullets } from '../../api/ai'
import useResumeStore from '../../store/useResumeStore'

function BulletRow({ bullet, expId, idx }) {
  const updateBullet = useResumeStore((s) => s.updateBullet)
  const removeBullet = useResumeStore((s) => s.removeBullet)
  const exp          = useResumeStore((s) => s.data.experience.find((e) => e.id === expId))
  const { run, isLoading } = useAi()

  const key = `b_${expId}_${idx}`

  return (
    <div className="flex gap-1.5 items-start">
      <textarea
        value={bullet}
        onChange={(e) => updateBullet(expId, idx, e.target.value)}
        placeholder="Achieved X by doing Y, resulting in Z…"
        rows={2}
        className="flex-1 bg-elevated-2 border border-subtle rounded-lg px-2.5 py-1.5 text-body text-primary resize-y placeholder:text-disabled transition-all duration-100 focus:border-brand focus:ring-1 focus:ring-brand-subtle focus:outline-none"
      />
      <div className="flex flex-col gap-1 flex-shrink-0">
        <IconButton
          onClick={() =>
            run(key, () => aiImproveBullet(bullet, exp?.role, exp?.company), (v) => updateBullet(expId, idx, v))
          }
          disabled={isLoading(key) || !bullet.trim()}
          title="AI improve this bullet"
          variant="ai"
          size="sm"
        >
          {isLoading(key) ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
        </IconButton>
        <IconButton
          onClick={() => removeBullet(expId, idx)}
          title="Remove bullet"
          variant="danger"
          size="sm"
        >
          <X size={10} />
        </IconButton>
      </div>
    </div>
  )
}

function ExperienceEntry({ exp }) {
  const updateExperience = useResumeStore((s) => s.updateExperience)
  const removeExperience = useResumeStore((s) => s.removeExperience)
  const addBullet        = useResumeStore((s) => s.addBullet)
  const appendBullets    = useResumeStore((s) => s.appendBullets)
  const { run, isLoading } = useAi()

  const suggestKey = `suggest_${exp.id}`

  return (
    <EntryCard onDelete={() => removeExperience(exp.id)}>
      <Input label="Company"    value={exp.company}  onChange={(v) => updateExperience(exp.id, 'company', v)}  placeholder="Acme Corp" />
      <Input label="Role/Title" value={exp.role}     onChange={(v) => updateExperience(exp.id, 'role', v)}     placeholder="Software Engineer" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input label="Start" value={exp.start} onChange={(v) => updateExperience(exp.id, 'start', v)} placeholder="Jan 2022" />
        <Input label="End"   value={exp.end}   onChange={(v) => updateExperience(exp.id, 'end', v)}   placeholder="Present" />
      </div>
      <Input label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, 'location', v)} placeholder="City, State" />

      <p className="text-label uppercase text-text-muted mt-1">Bullet Points</p>
      {exp.bullets.map((b, i) => (
        <BulletRow key={i} bullet={b} expId={exp.id} idx={i} />
      ))}

      <div className="grid grid-cols-1 gap-2 mt-1 sm:grid-cols-2">
        <Button
          onClick={() => addBullet(exp.id)}
          variant="ghost"
          size="sm"
          className="border-dashed"
        >
          + Bullet
        </Button>
        <Button
          onClick={() =>
            run(suggestKey, () => aiSuggestBullets(exp.role, exp.company), (bullets) =>
              appendBullets(exp.id, bullets),
            )
          }
          variant="ai"
          size="sm"
          loading={isLoading(suggestKey)}
          icon={!isLoading(suggestKey) && <Sparkles size={10} />}
        >
          AI Suggest
        </Button>
      </div>
    </EntryCard>
  )
}

export default function ExperienceSection() {
  const experience   = useResumeStore((s) => s.data.experience)
  const addExperience = useResumeStore((s) => s.addExperience)

  return (
    <Card title="Work Experience" onAdd={addExperience} addLabel="Add Position">
      {experience.map((exp) => (
        <ExperienceEntry key={exp.id} exp={exp} />
      ))}
    </Card>
  )
}
