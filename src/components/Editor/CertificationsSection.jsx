import { Card, EntryCard, Input } from '../UI'
import useResumeStore from '../../store/useResumeStore'

export default function CertificationsSection() {
  const certifications     = useResumeStore((s) => s.data.certifications)
  const addCertification   = useResumeStore((s) => s.addCertification)
  const removeCertification = useResumeStore((s) => s.removeCertification)
  const updateCertification = useResumeStore((s) => s.updateCertification)

  return (
    <Card title="Certifications" onAdd={addCertification} addLabel="Add Certification">
      {certifications.map((c) => (
        <EntryCard key={c.id} onDelete={() => removeCertification(c.id)}>
          <Input label="Certification Name" value={c.name}   onChange={(v) => updateCertification(c.id, 'name', v)}   placeholder="AWS Solutions Architect" />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Issuer" value={c.issuer} onChange={(v) => updateCertification(c.id, 'issuer', v)} placeholder="Amazon" />
            <Input label="Year"   value={c.year}   onChange={(v) => updateCertification(c.id, 'year', v)}   placeholder="2023" />
          </div>
        </EntryCard>
      ))}
    </Card>
  )
}
