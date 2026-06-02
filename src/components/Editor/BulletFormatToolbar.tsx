import { Bold, Italic } from 'lucide-react'
import IconButton from '../UI/IconButton'
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
      <IconButton onClick={() => applyFormat('**')} variant="ghost" size="sm" title="Bold" aria-label="Bold">
        <Bold size={12} />
      </IconButton>
      <IconButton onClick={() => applyFormat('*')} variant="ghost" size="sm" title="Italic" aria-label="Italic">
        <Italic size={12} />
      </IconButton>
    </div>
  )
}
