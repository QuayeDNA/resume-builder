import { cn } from '../../utils/classNames'

export function Field({ label, children, hint, error, className }) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="block text-ui uppercase tracking-[0.12em] text-text-muted">{label}</label>
      )}
      {children}
      {error && (
        <p className="text-caption text-error">{error}</p>
      )}
      {hint && !error && (
        <p className="text-caption text-text-muted">{hint}</p>
      )}
    </div>
  )
}

export function Input({ value, onChange, placeholder, type = 'text', className, error, ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'w-full min-w-0 appearance-none rounded-xl border border-subtle bg-elevated-2 px-3 py-2 text-body text-primary shadow-sm',
        'placeholder:text-disabled transition-all duration-100',
        'focus:border-brand focus:ring-1 focus:ring-brand-subtle focus:outline-none',
        error && 'border-error focus:border-error focus:ring-error-subtle',
        className,
      )}
      {...rest}
    />
  )
}

export function TextArea({ value, onChange, placeholder, rows = 3, className, error, ...rest }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        'w-full min-w-0 appearance-none rounded-xl border border-subtle bg-elevated-2 px-3 py-2 text-body text-primary shadow-sm',
        'placeholder:text-disabled resize-y transition-all duration-100',
        'focus:border-brand focus:ring-1 focus:ring-brand-subtle focus:outline-none',
        error && 'border-error focus:border-error focus:ring-error-subtle',
        className,
      )}
      {...rest}
    />
  )
}

export function Select({ value, onChange, options, className, error, ...rest }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        'w-full min-w-0 appearance-none rounded-xl border border-subtle bg-elevated-2 px-3 py-2 text-body text-primary shadow-sm cursor-pointer',
        'transition-all duration-100',
        'focus:border-brand focus:ring-1 focus:ring-brand-subtle focus:outline-none',
        error && 'border-error focus:border-error focus:ring-error-subtle',
        className,
      )}
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
