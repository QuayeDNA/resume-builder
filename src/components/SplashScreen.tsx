import { useEffect, useState } from 'react'

/**
 * ResumeForge — SplashScreen
 *
 * Design philosophy: warm analog, cotton-paper tactility.
 * A hand-inked "R" strokes slowly into existence — unhurried, crafted, never anxious.
 *
 * Animation timeline (~5.5s total draw, ~6.8s before dismiss):
 *   0.1s  — card background fades in
 *   0.3s  — border starts drawing (2.2s)
 *   1.9s  — stem draws (1.4s)
 *   2.5s  — serif flicks appear (0.5s)
 *   2.7s  — bowl draws (2.0s)
 *   3.2s  — wordmark reveals
 *   4.0s  — status line + progress bar fade in
 *   4.45s — leg draws (1.0s)
 *   5.35s — ink pool blot appears
 *   6.8s  — begins fade-out → onDismiss after 700ms
 */

export default function SplashScreen({ onDismiss }: { onDismiss: () => void }) {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsClosing(true)
      const dismissTimer = window.setTimeout(onDismiss, 700)
      return () => clearTimeout(dismissTimer)
    }, 6800)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: '#f0ebe3' }}
      role="status"
      aria-label="ResumeForge loading"
    >

      {/* ── Atmosphere layers ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 20% 80%, rgba(192,107,68,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 50% 35% at 80% 15%, rgba(122,140,120,0.05) 0%, transparent 70%)
        `,
      }} />

      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.4,
        backgroundImage: `repeating-linear-gradient(
          to bottom,
          transparent, transparent 31px,
          rgba(168,153,138,0.12) 31px, rgba(168,153,138,0.12) 32px
        )`,
      }} />

      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        opacity: 0.042, mixBlendMode: 'multiply',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: '300px 300px',
      }} />

      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(91,62,40,0.07) 100%)',
      }} />

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '36px' }}>

        {/* Logo SVG */}
        <div aria-hidden="true" style={{
          position: 'relative',
          filter: 'drop-shadow(0 6px 24px rgba(30,23,18,0.1)) drop-shadow(0 2px 6px rgba(30,23,18,0.06))',
        }}>
          <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="paperSheen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,248,240,0.4)" />
                <stop offset="100%" stopColor="rgba(255,248,240,0)" />
              </linearGradient>
            </defs>

            {/* Card fill */}
            <rect x="4" y="4" width="100" height="100" rx="22" fill="#faf6f0"
              style={{ opacity: 0, animation: 'rf-fadeIn 0.5s 0.1s ease forwards' }} />
            <rect x="4" y="4" width="100" height="44" rx="22" fill="url(#paperSheen)"
              style={{ opacity: 0, animation: 'rf-fadeIn 0.5s 0.15s ease forwards' }} />
            <rect x="4" y="26" width="100" height="18" fill="url(#paperSheen)"
              style={{ opacity: 0, animation: 'rf-fadeIn 0.5s 0.15s ease forwards' }} />

            {/* Card border */}
            <rect x="4" y="4" width="100" height="100" rx="22"
              stroke="#c06b44" strokeWidth="2" fill="none"
              strokeDasharray="390" strokeDashoffset="390"
              style={{ animation: 'rf-draw 2.2s 0.3s cubic-bezier(0.37,0,0.63,1) forwards' }} />

            {/* R — Stem */}
            <path d="M 35 26 L 35 82"
              stroke="#c06b44" strokeWidth="5" strokeLinecap="round" fill="none"
              strokeDasharray="58" strokeDashoffset="58"
              style={{ animation: 'rf-draw 1.4s 1.9s cubic-bezier(0.37,0,0.63,1) forwards' }} />

            {/* R — Serif bottom (moved to y=87, same strokeWidth as stem) */}
            <path d="M 28 87 L 42 87"
              stroke="#c06b44" strokeWidth="5" strokeLinecap="round" fill="none"
              strokeDasharray="16" strokeDashoffset="16"
              style={{ animation: 'rf-draw 0.5s 3.0s cubic-bezier(0.37,0,0.63,1) forwards' }} />

            {/* R — Bowl */}
            <path d="M 35 26 L 60 26 Q 78 26 78 44 Q 78 62 60 62 L 35 62"
              stroke="#c06b44" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"
              strokeDasharray="116" strokeDashoffset="116"
              style={{ animation: 'rf-draw 2.0s 2.7s cubic-bezier(0.37,0,0.63,1) forwards' }} />

            {/* R — Leg */}
            <path d="M 60 62 L 76 82"
              stroke="#c06b44" strokeWidth="5" strokeLinecap="round" fill="none"
              strokeDasharray="40" strokeDashoffset="40"
              style={{ animation: 'rf-draw 1.0s 4.45s cubic-bezier(0.37,0,0.63,1) forwards' }} />

            {/* Ink pool blot */}
            <circle cx="76" cy="82" r="0" fill="#c06b44"
              style={{ opacity: 0, animation: 'rf-inkPool 0.6s 5.35s cubic-bezier(0.19,1,0.22,1) forwards' }} />
          </svg>
        </div>

        {/* Wordmark */}
        <div style={{
          textAlign: 'center',
          opacity: 0,
          transform: 'translateY(14px)',
          animation: 'rf-revealUp 0.9s 3.2s cubic-bezier(0.19,1,0.22,1) forwards',
        }}>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: '28px',
            fontWeight: 600,
            color: '#1e1712',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            marginBottom: '8px',
          }}>
            Resume<em style={{ fontStyle: 'italic', fontWeight: 300, color: '#c06b44' }}>Forge</em>
          </h1>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10.5px',
            fontWeight: 300,
            color: '#a8998a',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>
            Craft your story
          </p>
        </div>

        {/* Status line + progress */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            opacity: 0,
            animation: 'rf-fadeIn 0.7s 4.0s ease forwards',
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: '#c06b44', opacity: 0.25,
                  animation: `rf-inkDrop 1.8s ${4.1 + i * 0.18}s ease-in-out infinite`,
                }} />
              ))}
            </div>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '9.5px', fontWeight: 300,
              color: '#a8998a',
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              Preparing workspace
            </span>
          </div>

          <div style={{
            width: '72px', height: '1px',
            background: 'rgba(168,153,138,0.25)', borderRadius: '1px',
            overflow: 'hidden',
            opacity: 0,
            animation: 'rf-fadeIn 0.4s 4.0s ease forwards',
          }}>
            <div style={{
              height: '100%', width: '0%',
              background: '#c06b44', borderRadius: '1px',
              animation: 'rf-progress 1.6s 4.0s cubic-bezier(0.37,0,0.63,1) forwards',
            }} />
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=IBM+Plex+Mono:wght@300;400&display=swap');

        @keyframes rf-fadeIn   { to { opacity: 1; } }
        @keyframes rf-draw     { to { stroke-dashoffset: 0; } }
        @keyframes rf-revealUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes rf-inkPool  {
          0%   { r: 0;   opacity: 0; }
          30%  { r: 3.5; opacity: 0.9; }
          100% { r: 2.5; opacity: 0.55; }
        }
        @keyframes rf-inkDrop  {
          0%, 80%, 100% { opacity: 0.22; transform: scale(1); }
          40%           { opacity: 1;    transform: scale(1.35); }
        }
        @keyframes rf-progress { to { width: 100%; } }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}