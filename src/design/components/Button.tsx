import { cn } from '../../utils/classNames'

const variants = {
  primary: 'bg-brand text-white border border-brand-hover hover:bg-brand-hover active:scale-[0.98]',
  ghost: 'bg-transparent text-secondary border border-subtle hover:bg-elevated-2 hover:text-primary',
  danger: 'bg-transparent text-error border border-error/30 hover:bg-error-subtle hover:border-error/50',
  success: 'bg-transparent text-success border border-success/30 hover:bg-success-subtle hover:border-success/50',
  ai: 'bg-ai-subtle text-ai border border-ai/20 hover:bg-ai-hover hover:border-ai/30',
}

const sizes = {
  sm: 'px-2 py-1 text-[10px]',
  md: 'px-3 py-1.5 text-[11px]',
  lg: 'px-4 py-2 text-body',
  full: 'w-full px-3 py-2 text-body',
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  icon,
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg',
        'transition-all duration-100 active:scale-[0.98]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon}
      {children}
    </button>
  )
}
