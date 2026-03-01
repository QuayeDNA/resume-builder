import { X } from 'lucide-react'

export default function EntryCard({ children, onDelete }) {
  return (
    <div className="relative bg-[#161626] rounded-lg p-3 mb-2 border border-[#1e1e35]">
      {children}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 bg-[#251515] text-[#7a3333] rounded p-0.5 hover:bg-[#3a2020] hover:text-[#cc5555] transition-colors"
        aria-label="Delete"
      >
        <X size={12} />
      </button>
    </div>
  )
}
