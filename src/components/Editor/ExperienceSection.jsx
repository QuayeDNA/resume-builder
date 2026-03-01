import { Plus, Sparkles, Loader2, X } from 'lucide-react'
import { Card, EntryCard, Input, AiButton } from '../UI'
import { useAi } from '../../hooks/useAi'
import { aiImproveBullet, aiSuggestBullets } from '../../api/claude'
import useResumeStore from '../../store/useResumeStore'

function BulletRow({ bullet, expId, idx }) {
  const updateBullet = useResumeStore((s) => s.updateBullet)
  const removeBullet = useResumeStore((s) => s.removeBullet)
  const exp          = useResumeStore((s) => s.data.experience.find((e) => e.id === expId))
  const { run, isLoading } = useAi()

  const key = `b_${expId}_${idx}`

  return (
    <div className="flex gap-1.5 mb-1.5 items-start">
      <textarea
        value={bullet}
        onChange={(e) => updateBullet(expId, idx, e.target.value)}
        placeholder="Achieved X by doing Y, resulting in Z…"
        rows={2}
        className="flex-1 bg-[#1c1c2e] border border-[#2a2a44] rounded px-2 py-1.5 text-[#dcdcf0] text-[10.5px] font-sans resize-y placeholder-[#3a3a5a] transition-colors"
      />
      <div className="flex flex-col gap-1 flex-shrink-0">
        <button
          onClick={() =>
            run(key, () => aiImproveBullet(bullet, exp?.role, exp?.company), (v) => updateBullet(expId, idx, v))
          }
          disabled={isLoading(key) || !bullet.trim()}
          title="AI improve this bullet"
          className="w-6 h-6 flex items-center justify-center bg-[#160f38] border border-[#28185a] text-[#6a58cc] rounded hover:text-brand-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isLoading(key) ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
        </button>
        <button
          onClick={() => removeBullet(expId, idx)}
          className="w-6 h-6 flex items-center justify-center bg-[#251515] text-[#7a3333] rounded hover:bg-[#3a2020] transition-colors"
        >
          <X size={10} />
        </button>
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
      <div className="grid grid-cols-2 gap-2">
        <Input label="Start" value={exp.start} onChange={(v) => updateExperience(exp.id, 'start', v)} placeholder="Jan 2022" />
        <Input label="End"   value={exp.end}   onChange={(v) => updateExperience(exp.id, 'end', v)}   placeholder="Present" />
      </div>
      <Input label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, 'location', v)} placeholder="City, State" />

      <div className="text-[9px] text-gray-600 mt-2 mb-1.5 uppercase tracking-[0.7px] font-semibold">Bullet Points</div>
      {exp.bullets.map((b, i) => (
        <BulletRow key={i} bullet={b} expId={exp.id} idx={i} />
      ))}

      <div className="grid grid-cols-2 gap-1.5 mt-1">
        <button
          onClick={() => addBullet(exp.id)}
          className="border border-dashed border-[#1e1e38] text-[#3a3a5a] rounded py-1 text-[9.5px] hover:border-brand-500 hover:text-brand-400 transition-colors"
        >
          + bullet
        </button>
        <button
          onClick={() =>
            run(suggestKey, () => aiSuggestBullets(exp.role, exp.company), (bullets) =>
              appendBullets(exp.id, bullets),
            )
          }
          disabled={isLoading(suggestKey)}
          className="flex items-center justify-center gap-1 bg-[#120e32] border border-[#241858] text-[#6a58cc] rounded py-1 text-[9.5px] hover:text-brand-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading(suggestKey) ? <Loader2 size={9} className="animate-spin" /> : <Sparkles size={9} />}
          AI suggest
        </button>
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
