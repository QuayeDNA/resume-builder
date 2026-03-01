export default function Select({ label, value, onChange, options, className = '' }) {
  return (
    <div className={`mb-2 ${className}`}>
      {label && (
        <label className="block text-[9px] text-gray-500 mb-1 font-semibold uppercase tracking-[0.8px]">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1c1c2e] border border-[#2a2a44] rounded-md px-3 py-1.5 text-[#dcdcf0] text-[11.5px] font-sans appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  )
}
