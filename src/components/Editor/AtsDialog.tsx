import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import AtsChecker from './AtsChecker'
import IconButton from '../UI/IconButton'
import useResumeStore from '../../store/useResumeStore'

export default function AtsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const setAtsDialogOpen = useResumeStore((s) => s.setAtsDialogOpen)
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement as HTMLElement
    panelRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAtsDialogOpen(false)
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      previousFocusRef.current?.focus()
    }
  }, [open, onClose, setAtsDialogOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setAtsDialogOpen(false)
      onClose()
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 backdrop-blur-sm pt-4 lg:pt-8"
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="ATS Checker"
        className="mx-3 w-full max-w-lg rounded-2xl border border-warm-border bg-paper shadow-card-lg max-h-[calc(100%-2rem)] flex flex-col outline-none"
      >
        <div className="flex items-center justify-between border-b border-warm-border px-4 py-3 shrink-0">
          <h2 className="font-display text-base font-bold text-ink">ATS Checker</h2>
          <IconButton onClick={() => { setAtsDialogOpen(false); onClose() }} variant="ghost" size="md" aria-label="Close ATS Checker">
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