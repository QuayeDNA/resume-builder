export default function Badge({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#161628] border border-[#222240] rounded px-2 py-0.5 text-[10px] text-[#7070aa] select-none">
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-[#4a4a7a] hover:text-[#9090cc] transition-colors leading-none"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  )
}
