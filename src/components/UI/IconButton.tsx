import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/classNames'

const variants = {
  ghost:   'bg-transparent text-ink-muted hover:text-ink hover:bg-paper-deep',
  danger:  'bg-error-subtle text-error border border-error/20 hover:bg-error/20',
  success: 'bg-success-subtle text-success border border-success/20 hover:bg-success/20',
  primary: 'bg-terracotta text-white border border-terracotta/80 hover:bg-terracotta/90',
} as const

type IconButtonProps = {
  onClick?: () => void
  children: ReactNode
  title?: string
  variant?: keyof typeof variants
  className?: string
  size?: 'sm' | 'md' | 'lg'
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function IconButton({ onClick, children, title, variant = 'ghost', className, size = 'md', ...props }: IconButtonProps) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  } as const

  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'flex items-center justify-center rounded-lg transition-all duration-150 active:scale-95',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
