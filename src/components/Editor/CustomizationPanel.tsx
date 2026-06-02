import useResumeStore from '../../store/useResumeStore'
import Button from '../../design/components/Button'

const SPACING_PRESETS = [
  { label: 'Narrow', value: { pagePadding: '28px 28px', sidebarPadding: '28px 16px', sectionGap: '10px' } },
  { label: 'Medium', value: { pagePadding: '40px 36px', sidebarPadding: '36px 20px', sectionGap: '14px' } },
  { label: 'Wide',   value: { pagePadding: '56px 48px', sidebarPadding: '48px 24px', sectionGap: '20px' } },
]

const FONT_PAIRINGS = [
  { label: 'Classic', name: "'Playfair Display', Georgia, serif", heading: "'DM Sans', Arial, sans-serif", body: "'DM Sans', Arial, sans-serif", mono: "'DM Mono', monospace" },
  { label: 'Modern Serif', name: "'Fraunces', Georgia, serif", heading: "'Bricolage Grotesque', sans-serif", body: "'Bricolage Grotesque', sans-serif", mono: "'IBM Plex Mono', monospace" },
  { label: 'Clean', name: "'Inter', sans-serif", heading: "'Inter', sans-serif", body: "'Inter', sans-serif", mono: "'JetBrains Mono', monospace" },
  { label: 'Academic', name: "'Lora', Georgia, serif", heading: "'Lora', Georgia, serif", body: "'Source Sans 3', sans-serif", mono: "'IBM Plex Mono', monospace" },
  { label: 'Bold', name: "'DM Serif Display', serif", heading: "'DM Sans', Arial, sans-serif", body: "'DM Sans', Arial, sans-serif", mono: "'DM Mono', monospace" },
  { label: 'Elegant', name: "'Cormorant Garamond', serif", heading: "'Cormorant Garamond', serif", body: "'Proza Libre', sans-serif", mono: "'IBM Plex Mono', monospace" },
]

export default function CustomizationPanel() {
  const overrides = useResumeStore((s) => s.data.themeOverrides || {})
  const updateThemeOverride = useResumeStore((s) => s.updateThemeOverride)
  const resetThemeOverrides = useResumeStore((s) => s.resetThemeOverrides)

  const currentAccent = overrides.colors?.accent || ''
  const currentSecondary = overrides.colors?.secondary || ''
  const currentFonts = overrides.fonts
  const currentSpacing = overrides.spacing
  const currentFontSize = overrides.fontSize
  const currentScale = currentFontSize?.name
    ? Math.round(((parseInt(currentFontSize.name) - 10) / 6) * 4) / 4
    : 2

  const selectedPair = currentFonts
    ? FONT_PAIRINGS.findIndex(
        (p) => p.name === currentFonts.name && p.heading === currentFonts.heading,
      )
    : -1

  const selectedSpacing = currentSpacing
    ? SPACING_PRESETS.findIndex(
        (p) => p.value.pagePadding === currentSpacing.pagePadding,
      )
    : -1

  const hasOverrides = currentAccent || currentSecondary || currentFonts || currentSpacing || currentFontSize

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold tracking-tight text-ink">Customize Theme</h3>
        {hasOverrides && (
          <Button onClick={resetThemeOverrides} variant="ghost" size="sm">
            Reset
          </Button>
        )}
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <p className="text-caption font-semibold text-ink">Colors</p>
        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-medium text-ink-muted">Accent</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentAccent || '#1a1a2e'}
                onChange={(e) => updateThemeOverride('colors', { accent: e.target.value })}
                className="h-7 w-7 cursor-pointer rounded border border-warm-border bg-transparent p-0"
              />
              <input
                type="text"
                value={currentAccent || '#1a1a2e'}
                onChange={(e) => updateThemeOverride('colors', { accent: e.target.value })}
                className="flex-1 rounded-lg border border-warm-border bg-paper-deep/30 px-2 py-1 text-[10px] font-mono text-ink outline-none transition-all duration-150 focus:border-terracotta focus:bg-paper-deep/60"
              />
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-medium text-ink-muted">Secondary</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentSecondary || '#6c63ff'}
                onChange={(e) => updateThemeOverride('colors', { secondary: e.target.value })}
                className="h-7 w-7 cursor-pointer rounded border border-warm-border bg-transparent p-0"
              />
              <input
                type="text"
                value={currentSecondary || '#6c63ff'}
                onChange={(e) => updateThemeOverride('colors', { secondary: e.target.value })}
                className="flex-1 rounded-lg border border-warm-border bg-paper-deep/30 px-2 py-1 text-[10px] font-mono text-ink outline-none transition-all duration-150 focus:border-terracotta focus:bg-paper-deep/60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Font pair */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-ink-muted">Font Pair</label>
        <select
          value={selectedPair}
          onChange={(e) => {
            const i = parseInt(e.target.value)
            if (i >= 0) {
              const p = FONT_PAIRINGS[i]
              updateThemeOverride('fonts', { name: p.name, heading: p.heading, body: p.body, mono: p.mono })
            } else {
              updateThemeOverride('fonts', {} as any)
            }
          }}
          className="w-full rounded-lg border border-warm-border bg-paper-deep/30 px-2.5 py-1.5 text-caption text-ink outline-none transition-all duration-150 focus:border-terracotta"
        >
          <option value="-1">Template default</option>
          {FONT_PAIRINGS.map((p, i) => (
            <option key={p.label} value={i}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Spacing */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-ink-muted">Margins</label>
        <div className="flex gap-1 rounded-lg border border-warm-border bg-paper p-0.5">
          {SPACING_PRESETS.map((preset, i) => (
            <button
              key={preset.label}
              onClick={() => updateThemeOverride('spacing', preset.value)}
              className={`flex-1 rounded-md px-2 py-1 text-caption font-medium transition-all duration-150 ${
                selectedSpacing === i
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font size scale */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-ink-muted">Font Size</label>
        <input
          type="range"
          min="1"
          max="3"
          step="0.25"
          value={String(currentScale)}
          onChange={(e) => {
            const scale = parseFloat(e.target.value)
            const sizes = {
              name: `${10 + scale * 6}px`,
              title: `${6 + scale * 2}px`,
              sectionHeading: `${8 + scale * 1.5}px`,
              body: `${7 + scale * 1.5}px`,
              small: `${6 + scale * 1.5}px`,
            }
            updateThemeOverride('fontSize', sizes)
          }}
          className="w-full accent-terracotta"
        />
        <div className="flex justify-between text-[9px] text-ink-muted">
          <span>Small</span>
          <span>Large</span>
        </div>
      </div>
    </div>
  )
}
