import { Save, FolderOpen, Trash2, Download, Upload, RotateCcw } from 'lucide-react'
import { Card, Button, EmptyState, Hint } from '../UI'
import { exportAsJSON, importFromJSON } from '../../utils/storage'
import useResumeStore from '../../store/useResumeStore'
import toast from 'react-hot-toast'

export default function SavedSection() {
  const data        = useResumeStore((s) => s.data)
  const cl          = useResumeStore((s) => s.cl)
  const slots       = useResumeStore((s) => s.slots)
  const saveToSlot  = useResumeStore((s) => s.saveToSlot)
  const loadFromSlot = useResumeStore((s) => s.loadFromSlot)
  const deleteSlot  = useResumeStore((s) => s.deleteSlot)
  const loadFromJSON = useResumeStore((s) => s.loadFromJSON)
  const reset       = useResumeStore((s) => s.reset)

  const handleSave = () => { saveToSlot(); toast.success('Saved to slot!') }

  const handleExport = () => {
    exportAsJSON(data, cl, data.personal.name || 'resume')
    toast.success('JSON exported!')
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const parsed = await importFromJSON(file)
      loadFromJSON(parsed)
      toast.success('Resume loaded!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import failed')
    }
    e.target.value = ''
  }

  const handleReset = () => {
    if (confirm('Reset all data to defaults? This cannot be undone.')) {
      reset()
      toast('Reset to default resume')
    }
  }

  return (
    <div className="space-y-3">
      <Card title="Resume Slots">
        <Button onClick={handleSave} variant="success" size="full" icon={<Save size={12} />}>
          Save Current Resume
        </Button>

        {slots.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No saved resumes"
            description="Save your current resume to a slot for safekeeping."
          />
        ) : (
          <div className="space-y-1.5">
            {slots.map((slot) => (
              <div key={slot.id} className="bg-paper-deep border border-warm-border-strong rounded-lg p-2.5 animate-fade-in">
                <p className="text-caption text-ink font-medium mb-2 truncate">{slot.name}</p>
                <div className="flex gap-1.5">
                  <Button
                    onClick={() => { loadFromSlot(slot); toast.success('Loaded!') }}
                    variant="success"
                    size="sm"
                    icon={<FolderOpen size={10} />}
                    className="flex-1"
                  >
                    Load
                  </Button>
                  <Button
                    onClick={() => { if (confirm('Delete this slot?')) deleteSlot(slot.id) }}
                    variant="danger"
                    size="sm"
                    icon={<Trash2 size={10} />}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Import / Export">
        <div className="grid grid-cols-1 gap-2 mb-2 sm:grid-cols-2">
          <Button onClick={handleExport} variant="success" size="md" icon={<Download size={11} />}>
            Save JSON
          </Button>
          <label className="flex items-center justify-center gap-1.5 bg-info-subtle border border-info/20 rounded-lg py-2 text-info text-caption font-medium hover:bg-info/15 transition-all duration-100 cursor-pointer">
            <Upload size={11} /> Load JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
        <Button onClick={handleReset} variant="danger" size="full" icon={<RotateCcw size={10} />}>
          Reset to Default
        </Button>
        <Hint>Resets all fields to the sample resume data.</Hint>
      </Card>
    </div>
  )
}
