import { useRef, useEffect, useCallback } from 'react'
import { Bold, Italic } from 'lucide-react'
import { cn } from '../../utils/classNames'
import { mdToHtml, htmlToMd } from '../../utils/markdown'
import IconButton from '../UI/IconButton'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
  className?: string
  error?: string
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 120, className, error }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const lastValueRef = useRef(value)
  const isFocusedRef = useRef(false)
  const isInternalRef = useRef(false)

  useEffect(() => {
    if (isInternalRef.current) {
      isInternalRef.current = false
      return
    }
    if (value !== lastValueRef.current) {
      lastValueRef.current = value
      if (editorRef.current) {
        const hadFocus = document.activeElement === editorRef.current
        editorRef.current.innerHTML = mdToHtml(value) || '<br>'
        if (hadFocus) {
          const sel = window.getSelection()
          if (sel) {
            sel.collapse(editorRef.current, 0)
          }
        }
      }
    }
  }, [value])

  const updateFromEditor = useCallback(() => {
    const el = editorRef.current
    if (!el) return
    const html = el.innerHTML
    const plain = html === '<br>' ? '' : htmlToMd(html)
    if (plain !== lastValueRef.current) {
      lastValueRef.current = plain
      isInternalRef.current = true
      onChange(plain)
    }
  }, [onChange])

  const handleInput = useCallback(() => {
    updateFromEditor()
  }, [updateFromEditor])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    updateFromEditor()
  }, [updateFromEditor])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      document.execCommand('insertText', false, '  ')
    }
  }, [])

  const exec = useCallback((command: string) => {
    document.execCommand(command)
    editorRef.current?.focus()
    updateFromEditor()
  }, [updateFromEditor])

  return (
    <div className={cn('relative', className)}>
      <div
        className="flex gap-0.5 mb-1"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <IconButton
          onClick={() => exec('bold')}
          variant="ghost"
          size="sm"
          title="Bold"
          aria-label="Bold"
        >
          <Bold size={12} />
        </IconButton>
        <IconButton
          onClick={() => exec('italic')}
          variant="ghost"
          size="sm"
          title="Italic"
          aria-label="Italic"
        >
          <Italic size={12} />
        </IconButton>
      </div>
      <div className="relative">
        {!value && !isFocusedRef.current && (
          <div
            className="absolute inset-0 pointer-events-none px-2.5 py-2 text-body text-ink-muted/60"
            style={{ minHeight }}
            aria-hidden
          >
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-invalid={!!error}
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onFocus={() => { isFocusedRef.current = true }}
          onBlur={() => { isFocusedRef.current = false; updateFromEditor() }}
          dangerouslySetInnerHTML={{ __html: mdToHtml(value) || '<br>' }}
          className={cn(
            'w-full min-w-0 rounded-xl border border-warm-border-strong bg-white px-2.5 py-2 text-body text-ink shadow-soft',
            'placeholder:text-ink-muted transition-all duration-200 whitespace-pre-wrap break-words',
            'focus:border-terracotta focus:ring-2 focus:ring-terracotta-dim focus:outline-none',
            error && 'border-error focus:border-error focus:ring-error-subtle',
            !value && !isFocusedRef.current && 'text-transparent',
          )}
          style={{ minHeight }}
        />
      </div>
    </div>
  )
}
