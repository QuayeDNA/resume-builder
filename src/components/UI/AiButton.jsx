import { Sparkles, Loader2 } from 'lucide-react'

export default function AiButton({ onClick, loading, disabled, children, size = 'md' }) {
  const isDisabled = loading || disabled
  const pad = size === 'sm' ? 'py-1 px-2 text-[9.5px]' : 'py-1.5 px-3 text-[10.5px]'

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full flex items-center justify-center gap-1.5 font-semibold rounded-md border transition-all
        ${pad}
        ${isDisabled
          ? 'bg-[#111120] border-[#1e1e38] text-[#3a3a5a] cursor-not-allowed'
          : 'bg-gradient-to-br from-[#16103a] to-[#1e1545] border-[#30205e] text-[#9080e8] hover:text-brand-400 hover:border-brand-500 cursor-pointer'
        }
      `}
    >
      {loading
        ? <Loader2 size={12} className="animate-spin" />
        : <Sparkles size={12} />
      }
      {children}
    </button>
  )
}
