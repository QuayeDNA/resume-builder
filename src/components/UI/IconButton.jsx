export default function IconButton({ onClick, children, title, variant = 'ghost', className = '' }) {
  const variants = {
    ghost:   'bg-transparent text-[#333] hover:text-[#888]',
    danger:  'bg-[#251515] text-[#7a3333] hover:bg-[#3a2020] hover:text-[#cc5555]',
    success: 'bg-[#0c180c] text-[#3a7a3a] hover:bg-[#162016]',
    primary: 'bg-gradient-to-br from-[#3a2a8a] to-[#5c54e0] text-white hover:opacity-90',
  }

  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center rounded transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
