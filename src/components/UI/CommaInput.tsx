import { useState, useRef, useCallback } from 'react'
import Badge from './Badge'
import { cn } from '../../utils/classNames'

type CommaInputProps = {
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  label?: string
  hint?: string
  className?: string
}

const SEPARATOR_REGEX = /[,;，；\n]+/

function normalizeValue(v: string) {
  return v.trim()
}

export default function CommaInput({ values, onChange, placeholder, label, hint, className }: CommaInputProps) {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const commit = useCallback((raw: string) => {
    const parts = raw.split(SEPARATOR_REGEX).map(normalizeValue).filter(Boolean)
    if (parts.length === 0) return
    const existing = new Set(values.map((v) => v.toLowerCase()))
    const newOnes = parts.filter((p) => !existing.has(p.toLowerCase()))
    if (newOnes.length > 0) {
      onChange([...values, ...newOnes])
    }
  }, [values, onChange])

  const removeValue = useCallback((idx: number) => {
    onChange(values.filter((_, i) => i !== idx))
  }, [values, onChange])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (SEPARATOR_REGEX.test(val)) {
      const parts = val.split(SEPARATOR_REGEX)
      const last = parts.pop() || ''
      const toAdd = parts.map(normalizeValue).filter(Boolean)
      if (toAdd.length > 0) {
        const existing = new Set(values.map((v) => v.toLowerCase()))
        const newOnes = toAdd.filter((p) => !existing.has(p.toLowerCase()))
        if (newOnes.length > 0) {
          onChange([...values, ...newOnes])
        }
      }
      setInput(last)
    } else {
      setInput(val)
    }
  }, [values, onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      commit(input)
      setInput('')
    }
    if (e.key === 'Backspace' && !input && values.length > 0) {
      removeValue(values.length - 1)
    }
  }, [input, values, commit, removeValue])

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text')
    if (SEPARATOR_REGEX.test(text)) {
      e.preventDefault()
      const parts = text.split(SEPARATOR_REGEX).map(normalizeValue).filter(Boolean)
      if (parts.length > 0) {
        const existing = new Set(values.map((v) => v.toLowerCase()))
        const newOnes = parts.filter((p) => !existing.has(p.toLowerCase()))
        if (newOnes.length > 0) {
          onChange([...values, ...newOnes])
        }
      }
    }
  }, [values, onChange])

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const inputId = useRef(`comma-input-${Math.random().toString(36).slice(2, 8)}`).current

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-label text-ink-muted">{label}</label>
      )}
      <div
        className={cn(
          'flex flex-wrap gap-1.5 rounded-xl border bg-white px-2.5 py-2 shadow-soft transition-all duration-200 cursor-text',
          focused ? 'border-terracotta ring-2 ring-terracotta-dim' : 'border-warm-border-strong',
        )}
        onClick={handleContainerClick}
      >
        {values.map((s, i) => (
          <Badge key={`${s}-${i}`} variant="brand" onRemove={() => removeValue(i)}>
            {s}
          </Badge>
        ))}
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (input.trim()) { commit(input); setInput('') } }}
          placeholder={values.length === 0 ? (placeholder || 'Type and press Enter or comma…') : ''}
          className="min-w-[80px] flex-1 border-none bg-transparent text-body text-ink outline-none placeholder:text-ink-muted/60"
          aria-label={label || 'Add items'}
        />
      </div>
      {hint && (
        <p className="text-caption text-ink-muted">{hint}</p>
      )}
    </div>
  )
}
