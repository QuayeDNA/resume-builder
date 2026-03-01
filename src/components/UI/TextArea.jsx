export default function TextArea({ label, value, onChange, placeholder, rows = 4, className = '' }) {
  return (
    <div className={`mb-2 ${className}`}>
      {label && (
        <label className="block text-[9px] text-gray-500 mb-1 font-semibold uppercase tracking-[0.8px]">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-[#1c1c2e] border border-[#2a2a44] rounded-md px-3 py-1.5 text-[#dcdcf0] text-[11.5px] font-sans placeholder-[#3a3a5a] resize-y transition-colors"
      />
    </div>
  )
}
