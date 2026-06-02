import { useId } from 'react'
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

export function TextArea({ value, onChange, placeholder, rows = 3, className, error, ...rest }: TextAreaProps) {
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
  [key: string]: unknown
}

export function Select({ value, onChange, options, className, error, ...rest }: SelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-invalid={!!error}
        className={cn(
          'w-full min-w-0 appearance-none rounded-xl border border-warm-border-strong bg-white px-3 py-2.5 pr-8 text-body text-ink shadow-soft cursor-pointer',
          'transition-all duration-200',
          'focus:border-terracotta focus:ring-2 focus:ring-terracotta-dim focus:outline-none',
          error && 'border-error focus:border-error focus:ring-error-subtle',
          className,
        )}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {/* Custom chevron */}
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
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
    </div>
  )
}
