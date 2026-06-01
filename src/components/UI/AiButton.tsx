import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import Button from '../../design/components/Button'
import { getProviderLabel } from '../../api/ai'

type AiButtonProps = {
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  children: ReactNode
  size?: 'sm' | 'md'
  showProvider?: boolean
}

export default function AiButton({ onClick, loading, disabled, children, size = 'md', showProvider = false }: AiButtonProps) {
  const providerLabel = showProvider ? getProviderLabel() : null

  return (
    <Button
      onClick={onClick}
      variant="ai"
      size={size === 'sm' ? 'sm' : 'full'}
      loading={loading}
      disabled={disabled}
      icon={!loading && <Sparkles size={12} />}
      title={providerLabel ? `Powered by ${providerLabel}` : undefined}
    >
      <span className="flex items-center gap-1.5">
        {children}
        {providerLabel && (
          <span className="text-[9px] opacity-50 font-normal">({providerLabel})</span>
        )}
      </span>
    </Button>
  )
}
