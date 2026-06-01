import { useEffect, useState } from 'react'

export default function SplashScreen({ onDismiss }: { onDismiss: () => void }) {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsClosing(true)
      const dismissTimer = window.setTimeout(onDismiss, 500)
      return () => clearTimeout(dismissTimer)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper transition-opacity duration-500 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Hand-drawn R logo */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          <rect x="2" y="2" width="76" height="76" rx="20" stroke="#c76b4a" strokeWidth="3" fill="#f0ebe4" />
          <text
            x="40"
            y="52"
            textAnchor="middle"
            fill="#c76b4a"
            fontFamily="Fraunces, Georgia, serif"
            fontSize="36"
            fontWeight="700"
          >
            R
          </text>
        </svg>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink mb-2">
            Resume Builder
          </h1>
          <p className="text-body text-ink-soft opacity-75">
            Craft your perfect resume
          </p>
        </div>

        {/* Simple dot loader */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-terracotta"
              style={{
                animation: `bounce 1.4s infinite ease-in-out`,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}
