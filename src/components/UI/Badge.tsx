import type { ReactNode } from 'react'
import BadgeBase from '../../design/components/Badge'

const variantMap: Record<string, 'default' | 'brand' | 'success' | 'error' | 'ai'> = {
  default: 'default',
  brand: 'brand',
  success: 'success',
  danger: 'error',
  ai: 'ai',
}

type BadgeProps = {
  children: ReactNode
  variant?: keyof typeof variantMap
  onRemove?: () => void
  className?: string
}

export default function Badge({ children, variant = 'default', onRemove, className }: BadgeProps) {
  return (
    <BadgeBase variant={variantMap[variant] || 'default'} onRemove={onRemove} className={className}>
      {children}
    </BadgeBase>
  )
}
