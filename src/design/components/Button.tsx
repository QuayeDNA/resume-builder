import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/classNames'

const variants = {
  primary: 'bg-terracotta text-white border border-terracotta/80 hover:bg-terracotta/90 active:scale-[0.97] rounded-full',
  ghost: 'bg-transparent text-ink-soft border border-warm-border-strong hover:bg-paper-deep hover:text-ink rounded-full',
  danger: 'bg-transparent text-error border border-error/30 hover:bg-error-subtle hover:border-error/50 rounded-full',
  success: 'bg-transparent text-success border border-success/30 hover:bg-success-subtle hover:border-success/50 rounded-full',
  ai: 'bg-sage-dim text-sage border border-sage/20 hover:bg-sage/20 hover:border-sage/30 rounded-full',
} as const

const sizes = {
  sm: 'px-3 py-1.5 text-[11px]',
  md: 'px-4 py-2 text-[12px]',
  lg: 'px-5 py-2.5 text-body',
  full: 'w-full px-4 py-2.5 text-body',
} as const

type ButtonProps = {
  children?: ReactNode
  onClick?: () => void
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  disabled?: boolean
  loading?: boolean
  className?: string
  icon?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

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
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-medium',
        'transition-all duration-200 ease-out-expo active:scale-[0.97]',
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
