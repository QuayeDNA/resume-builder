import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export default function Card({ title, children, onAdd, addLabel = 'Add', defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-[#0e0e1c] rounded-xl mb-2 overflow-hidden border border-[#18182e]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3.5 py-2.5 flex justify-between items-center bg-[#09091a] hover:bg-[#0c0c20] transition-colors"
      >
        <span className="text-[11px] font-semibold text-[#aaaac8] tracking-[0.3px]">{title}</span>
        {open ? (
          <ChevronUp size={12} className="text-[#2a2a4a]" />
        ) : (
          <ChevronDown size={12} className="text-[#2a2a4a]" />
        )}
      </button>

      {open && (
        <div className="px-3.5 py-3">
          {children}
          {onAdd && (
            <button
              onClick={onAdd}
              className="mt-1.5 w-full border border-dashed border-[#222240] text-[#4a4a70] rounded-md py-1.5 text-[10px] hover:border-brand-500 hover:text-brand-400 transition-colors"
            >
              + {addLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
