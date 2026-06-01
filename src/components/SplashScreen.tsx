import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'

/**
 * SplashScreen / Loader component shown on initial app load
 * Automatically dismisses after 2.5 seconds
 */
export default function SplashScreen({ onDismiss }) {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Auto-dismiss after 2.5 seconds
    const timer = window.setTimeout(() => {
      setIsClosing(true)
      // Wait for fade-out animation to complete
      const dismissTimer = window.setTimeout(onDismiss, 400)
      return () => clearTimeout(dismissTimer)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-void transition-opacity duration-400 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-brand/10 via-void to-void opacity-30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/30 bg-brand-subtle">
          <FileText size={32} className="text-brand" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-brand mb-2">
            Resume Builder
          </h1>
          <p className="text-body text-secondary opacity-75">
            Craft your perfect resume
          </p>
        </div>

        {/* Simple dot loader */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-brand"
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
