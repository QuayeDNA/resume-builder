import BadgeBase from '../../design/components/Badge'

const variantMap = {
  default: 'default',
  brand: 'brand',
  success: 'success',
  danger: 'error',
  ai: 'ai',
}

export default function Badge({ children, variant = 'default', onRemove, className }) {
  return (
    <BadgeBase variant={variantMap[variant] || variant} onRemove={onRemove} className={className}>
      {children}
    </BadgeBase>
  )
}
