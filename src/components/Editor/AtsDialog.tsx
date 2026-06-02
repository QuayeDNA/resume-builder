import { X } from 'lucide-react'
import AtsChecker from './AtsChecker'
import IconButton from '../UI/IconButton'
import useResumeStore from '../../store/useResumeStore'

export default function AtsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const setAtsDialogOpen = useResumeStore((s) => s.setAtsDialogOpen)

  if (!open) return null

  const handleClose = () => {
    setAtsDialogOpen(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 backdrop-blur-sm pt-4 lg:pt-8">
      <div className="mx-3 w-full max-w-lg rounded-2xl border border-warm-border bg-paper shadow-card-lg max-h-[calc(100%-2rem)] flex flex-col">
        <div className="flex items-center justify-between border-b border-warm-border px-4 py-3 shrink-0">
          <h2 className="font-display text-base font-bold text-ink">ATS Checker</h2>
          <IconButton onClick={handleClose} variant="ghost" size="md" aria-label="Close ATS Checker">
            <X size={14} />
          </IconButton>
        </div>
        <div className="overflow-y-auto px-4 py-3">
          <AtsChecker />
        </div>
      </div>
    </div>
  )
}
