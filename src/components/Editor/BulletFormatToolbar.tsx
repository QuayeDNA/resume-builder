import { Bold, Italic } from 'lucide-react'
import { wrapSelection } from '../../utils/bulletFormatting'

export default function BulletFormatToolbar({
  textareaRef,
  onUpdate,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onUpdate: (value: string) => void
}) {
  const applyFormat = (wrapper: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const { newText, cursorPos } = wrapSelection(ta.value, start, end, wrapper)
    onUpdate(newText)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(cursorPos, cursorPos)
    })
  }

  return (
    <div className="flex gap-0.5 mb-1">
      <button
        type="button"
        onClick={() => applyFormat('**')}
        className="flex h-6 w-6 items-center justify-center rounded text-ink-muted hover:bg-paper-deep hover:text-ink transition-colors"
        title="Bold"
        aria-label="Bold"
      >
        <Bold size={12} />
      </button>
      <button
        type="button"
        onClick={() => applyFormat('*')}
        className="flex h-6 w-6 items-center justify-center rounded text-ink-muted hover:bg-paper-deep hover:text-ink transition-colors"
        title="Italic"
        aria-label="Italic"
      >
        <Italic size={12} />
      </button>
    </div>
  )
}
