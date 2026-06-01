import { Card, EntryCard, Input } from '../UI'
import SortableList from '../SortableList'
import useResumeStore from '../../store/useResumeStore'

export default function CertificationsSection() {
  const certifications      = useResumeStore((s) => s.data.certifications)
  const addCertification    = useResumeStore((s) => s.addCertification)
  const removeCertification = useResumeStore((s) => s.removeCertification)
  const updateCertification = useResumeStore((s) => s.updateCertification)
  const reorderCertification = useResumeStore((s) => s.reorderCertification)

  return (
    <Card title="Certifications" onAdd={addCertification} addLabel="Add Certification">
      <SortableList
        items={certifications}
        getId={(c) => c.id}
        onReorder={reorderCertification}
      >
        {(c) => (
          <EntryCard onDelete={() => removeCertification(c.id)}>
            <Input label="Certification Name" value={c.name}   onChange={(v) => updateCertification(c.id, 'name', v)}   placeholder="AWS Solutions Architect" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Input label="Issuer" value={c.issuer} onChange={(v) => updateCertification(c.id, 'issuer', v)} placeholder="Amazon" />
              <Input label="Year"   value={c.year}   onChange={(v) => updateCertification(c.id, 'year', v)}   placeholder="2023" />
            </div>
          </EntryCard>
        )}
      </SortableList>
    </Card>
  )
}
