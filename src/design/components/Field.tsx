import { useId, useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/classNames'

type FieldProps = {
  label?: string
  children: React.ReactNode
  hint?: string
  error?: string
  className?: string
  htmlFor?: string
}

export function Field({ label, children, hint, error, className, htmlFor }: FieldProps) {
  const autoId = useId()
  const fieldId = htmlFor || autoId
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label htmlFor={fieldId} className="block text-label text-ink-muted">{label}</label>
      )}
      {children}
      {error && (
        <p id={errorId} className="text-caption text-error" role="alert">{error}</p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-caption text-ink-muted">{hint}</p>
      )}
    </div>
  )
}

type InputProps = {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
  className?: string
  error?: string
  [key: string]: unknown
}

export function Input({ value, onChange, placeholder, type = 'text', className, error, ...rest }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      aria-invalid={!!error}
      className={cn(
        'w-full min-w-0 appearance-none rounded-xl border border-warm-border-strong bg-white px-3 py-2.5 text-body text-ink shadow-soft',
        'placeholder:text-ink-muted transition-all duration-200',
        'focus:border-terracotta focus:ring-2 focus:ring-terracotta-dim focus:outline-none',
        error && 'border-error focus:border-error focus:ring-error-subtle',
        className,
      )}
      {...rest}
    />
  )
}

type TextAreaProps = {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  error?: string
  [key: string]: unknown
}

export function TextArea({ value, onChange, placeholder, rows = 6, className, error, ...rest }: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      aria-invalid={!!error}
      className={cn(
        'w-full min-w-0 appearance-none rounded-xl border border-warm-border-strong bg-white px-3 py-2.5 text-body text-ink shadow-soft',
        'placeholder:text-ink-muted resize-y transition-all duration-200',
        'focus:border-terracotta focus:ring-2 focus:ring-terracotta-dim focus:outline-none',
        error && 'border-error focus:border-error focus:ring-error-subtle',
        className,
      )}
      {...rest}
    />
  )
}

type SelectOption = {
  label: string
  value: string
}

type SelectProps = {
  value: string
  onChange?: (value: string) => void
  options: SelectOption[]
  className?: string
  error?: string
  placeholder?: string
  [key: string]: unknown
}

function SelectDropdown({ value, onChange, options, position, triggerRect, selectId, activeIndex, setActiveIndex, closeDropdown, triggerRef, onDropdownMount }: {
  value: string
  onChange?: (value: string) => void
  options: SelectOption[]
  position: 'below' | 'above'
  triggerRect: DOMRect | null
  selectId: string
  activeIndex: number
  setActiveIndex: (i: number) => void
  closeDropdown: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  onDropdownMount: (el: HTMLElement | null) => void
}) {
  const listRef = useRef<HTMLUListElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onDropdownMount(dropdownRef.current)
    return () => onDropdownMount(null)
  }, [onDropdownMount])

  const selectOption = (optValue: string) => {
    onChange?.(optValue)
    closeDropdown()
    triggerRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      selectOption(options[activeIndex].value)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (activeIndex + 1) % options.length
      setActiveIndex(next)
      setTimeout(() => {
        (listRef.current?.children[next] as HTMLElement)?.scrollIntoView({ block: 'nearest' })
      }, 0)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (activeIndex - 1 + options.length) % options.length
      setActiveIndex(prev)
      setTimeout(() => {
        (listRef.current?.children[prev] as HTMLElement)?.scrollIntoView({ block: 'nearest' })
      }, 0)
    }
  }

  if (!triggerRect) return null

  const style: React.CSSProperties = {
    position: 'fixed',
    left: triggerRect.left,
    width: triggerRect.width,
    maxHeight: 240,
    zIndex: 9999,
  }

  if (position === 'below') {
    style.top = triggerRect.bottom + 4
  } else {
    style.bottom = window.innerHeight - triggerRect.top + 4
  }

  return createPortal(
    <div
      ref={dropdownRef}
      role="listbox"
      id={`${selectId}-listbox`}
      aria-label="Options"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="rounded-xl border border-warm-border bg-white shadow-elevated py-1 overflow-y-auto"
      style={style}
    >
      <ul ref={listRef} className="list-none m-0 p-0" role="none">
        {options.map((opt, i) => (
          <li
            key={opt.value}
            role="option"
            aria-selected={opt.value === value}
            className={cn(
              'px-3 py-2 text-body cursor-pointer transition-colors duration-100',
              opt.value === value && 'bg-terracotta-dim text-terracotta font-medium',
              activeIndex === i && opt.value !== value && 'bg-paper-deep text-ink',
              activeIndex === i && opt.value === value && 'bg-terracotta-dim text-terracotta font-medium',
              'hover:bg-paper-deep hover:text-ink',
            )}
            onClick={() => selectOption(opt.value)}
            onMouseEnter={() => setActiveIndex(i)}
          >
            {opt.label}
          </li>
        ))}
      </ul>
    </div>,
    document.body,
  )
}

export function Select({ value, onChange, options, className, error, placeholder, ...rest }: SelectProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<'below' | 'above'>('below')
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const selectId = useId()

  const selectedOption = options.find((o) => o.value === value)
  const displayValue = selectedOption?.label ?? placeholder ?? 'Select...'

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setTriggerRect(rect)
    const spaceBelow = window.innerHeight - rect.bottom - 8
    const spaceAbove = rect.top - 8
    const dropdownHeight = Math.min(options.length * 40 + 8, 240)
    setPosition(spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove ? 'below' : 'above')
  }, [options.length])

  const openDropdown = useCallback(() => {
    calculatePosition()
    setOpen(true)
    const idx = options.findIndex((o) => o.value === value)
    setActiveIndex(idx >= 0 ? idx : 0)
  }, [calculatePosition, options, value])

  const closeDropdown = useCallback(() => {
    setOpen(false)
    setActiveIndex(-1)
    setTriggerRect(null)
  }, [])

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      const isTrigger = triggerRef.current?.contains(target)
      const isDropdown = dropdownRef.current?.contains(target)
      if (!isTrigger && !isDropdown) {
        closeDropdown()
      }
    }
    const reposition = () => {
      calculatePosition()
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeDropdown()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handleClick)
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, closeDropdown, calculatePosition])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => calculatePosition())
    }
  }, [open, calculatePosition])

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) {
        openDropdown()
      } else {
        const next = (activeIndex + 1) % options.length
        setActiveIndex(next)
      }
    }
    if (e.key === 'ArrowUp' && open) {
      e.preventDefault()
      const prev = (activeIndex - 1 + options.length) % options.length
      setActiveIndex(prev)
    }
    if (e.key === 'Escape') {
      closeDropdown()
    }
  }

  const handleDropdownMount = useCallback((el: HTMLElement | null) => {
    dropdownRef.current = el
  }, [])

  return (
    <div className="relative" {...rest}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${selectId}-listbox`}
        aria-invalid={!!error}
        onClick={() => (open ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'w-full min-w-0 appearance-none rounded-xl border border-warm-border-strong bg-white px-3 py-2.5 pr-8 text-body text-ink shadow-soft cursor-pointer text-left',
          'transition-all duration-200',
          'focus:border-terracotta focus:ring-2 focus:ring-terracotta-dim focus:outline-none',
          error && 'border-error focus:border-error focus:ring-error-subtle',
          !selectedOption && 'text-ink-muted',
          className,
        )}
      >
        {displayValue}
      </button>
      <svg
        className={cn(
          'pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted transition-transform duration-200',
          open && 'rotate-180',
        )}
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>

      {open && (
        <SelectDropdown
          value={value}
          onChange={onChange}
          options={options}
          position={position}
          triggerRect={triggerRect}
          selectId={selectId}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          closeDropdown={closeDropdown}
          triggerRef={triggerRef}
          onDropdownMount={handleDropdownMount}
        />
      )}
    </div>
  )
}
