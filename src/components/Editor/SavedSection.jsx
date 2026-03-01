import { Save, FolderOpen, Trash2, Download, Upload, RotateCcw } from 'lucide-react'
import { Card } from '../UI'
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

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const parsed = await importFromJSON(file)
      loadFromJSON(parsed)
      toast.success('Resume loaded!')
    } catch (err) {
      toast.error(err.message)
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
    <div className="space-y-2">
      <Card title="Resume Slots">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-[#0c1a28] border border-[#163050] rounded-lg py-2 text-[#4a8ab8] text-[10.5px] font-semibold hover:bg-[#0e2038] transition-colors mb-2"
        >
          <Save size={12} /> Save Current Resume
        </button>

        {slots.length === 0 ? (
          <p className="text-[10px] text-[#2a2a45] text-center py-4">No saved resumes yet.</p>
        ) : (
          <div className="space-y-1.5">
            {slots.map((slot) => (
              <div key={slot.id} className="bg-[#141424] border border-[#1e1e35] rounded-lg p-2">
                <p className="text-[10px] text-[#8080b0] font-medium mb-2 truncate">{slot.name}</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => { loadFromSlot(slot); toast.success('Loaded!') }}
                    className="flex-1 flex items-center justify-center gap-1 bg-[#0c180c] border border-[#163016] rounded py-1 text-[#3a7a3a] text-[9.5px] hover:bg-[#122012] transition-colors"
                  >
                    <FolderOpen size={10} /> Load
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this slot?')) deleteSlot(slot.id) }}
                    className="w-7 flex items-center justify-center bg-[#201010] border border-transparent rounded text-[#7a3333] hover:bg-[#2a1818] transition-colors"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Import / Export">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-1.5 bg-[#0c180c] border border-[#163016] rounded-lg py-2 text-[#3a7a3a] text-[10px] font-semibold hover:bg-[#122012] transition-colors"
          >
            <Download size={11} /> Save JSON
          </button>
          <label className="flex items-center justify-center gap-1.5 bg-[#0c0c1c] border border-[#16162a] rounded-lg py-2 text-[#3a3a7a] text-[10px] font-semibold hover:bg-[#121226] transition-colors cursor-pointer">
            <Upload size={11} /> Load JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-1.5 border border-[#2a1515] rounded-lg py-1.5 text-[#4a2222] text-[9.5px] hover:border-[#3a2020] transition-colors"
        >
          <RotateCcw size={10} /> Reset to Default
        </button>
      </Card>
    </div>
  )
}
