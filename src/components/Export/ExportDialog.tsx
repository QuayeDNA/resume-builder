import { useState, useCallback } from 'react'
import { X, FileDown, FileText, FileSignature, Printer, Download, Archive } from 'lucide-react'
import useResumeStore from '../../store/useResumeStore'
import type { ExportFormat } from '../../utils/export'

type ExportDialogProps = {
  open: boolean
  onClose: () => void
}

const FORMATS: { id: ExportFormat; label: string; description: string; icon: typeof FileDown }[] = [
  { id: 'pdf', label: 'PDF (Canvas)', description: 'Direct download via canvas render — high fidelity', icon: FileDown },
  { id: 'pdf-print', label: 'PDF (Print)', description: 'Browser print dialog — best for physical copies', icon: Printer },
  { id: 'docx', label: 'DOCX', description: 'Microsoft Word document — editable', icon: FileText },
  { id: 'txt', label: 'Plain Text', description: 'Plain text file — universal compatibility', icon: FileText },
  { id: 'html', label: 'HTML', description: 'Standalone web page — view in any browser', icon: Download },
  { id: 'json', label: 'JSON', description: 'Raw data export — backup or transfer', icon: FileSignature },
]

export default function ExportDialog({ open, onClose }: ExportDialogProps) {
  const data = useResumeStore((s) => s.data)
  const cl = useResumeStore((s) => s.cl)
  const slots = useResumeStore((s) => s.slots)
  const [exporting, setExporting] = useState<string | null>(null)
  const [batchExporting, setBatchExporting] = useState(false)

  const handleExport = useCallback(async (format: ExportFormat) => {
    setExporting(format)
    try {
      const { exportResume } = await import('../../utils/export')
      await exportResume({ format }, data, cl, slots)
    } catch (e) {
      console.error(`Export failed (${format}):`, e)
    }
    setExporting(null)
    onClose()
  }, [data, cl, slots, onClose])

  const handleBatchExport = useCallback(async () => {
    if (slots.length === 0) return
    setBatchExporting(true)
    try {
      const { exportBatch } = await import('../../utils/export')
      await exportBatch(slots)
    } catch (e) {
      console.error('Batch export failed:', e)
    }
    setBatchExporting(false)
    onClose()
  }, [slots, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-lg rounded-2xl border border-warm-border bg-paper-warm shadow-card-lg">
        <div className="flex items-center justify-between border-b border-warm-border px-5 py-4">
          <div className="flex items-center gap-2">
            <FileDown size={16} className="text-sage" />
            <h2 className="font-display text-base font-bold text-ink">Export Resume</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-paper-deep hover:text-ink"
            aria-label="Close dialog"
          >
            <X size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5">
          {FORMATS.map(({ id, label, description, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleExport(id)}
              disabled={exporting !== null}
              className="flex flex-col items-start gap-1.5 rounded-xl border border-warm-border bg-paper p-3.5 text-left transition-all duration-200 hover:border-sage/40 hover:shadow-soft disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Icon size={14} className="text-sage" />
                <span className="text-caption font-semibold text-ink">
                  {exporting === id ? 'Exporting…' : label}
                </span>
              </div>
              <span className="text-[10px] leading-tight text-ink-muted">{description}</span>
            </button>
          ))}
        </div>

        {slots.length > 0 && (
          <div className="border-t border-warm-border px-5 py-3">
            <button
              onClick={handleBatchExport}
              disabled={batchExporting}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-sage/30 bg-sage-dim px-4 py-2.5 text-caption font-semibold text-sage transition-all duration-200 hover:border-sage/50 hover:bg-sage/20 disabled:opacity-50"
            >
              <Archive size={14} />
              {batchExporting ? 'Zipping…' : `Export All ${slots.length} Slots (ZIP)`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
