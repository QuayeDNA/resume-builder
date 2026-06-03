const ZOOM_MIN = 0.5
const ZOOM_MAX = 2
const ZOOM_STEP = 0.25
export const ZOOM_FIT = -1

type ZoomControlsProps = {
  zoom: number
  onChange: (zoom: number) => void
}

export default function ZoomControls({ zoom, onChange }: ZoomControlsProps) {
  const zoomPercent = zoom === ZOOM_FIT ? 100 : Math.round(zoom * 100)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    onChange(val === 1 ? ZOOM_FIT : val)
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        onClick={() => onChange(ZOOM_FIT)}
        className={`rounded-md px-1.5 sm:px-2 py-1 text-caption font-medium transition-all duration-150 ${
          zoom === ZOOM_FIT
            ? 'bg-white text-terracotta shadow-soft border border-warm-border'
            : 'text-ink-muted hover:text-ink'
        }`}
        aria-label="Fit to width"
      >
        <span className="hidden sm:inline">Fit</span>
        <span className="sm:hidden" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </span>
      </button>
      <input
        type="range"
        min={ZOOM_MIN}
        max={ZOOM_MAX}
        step={ZOOM_STEP}
        value={zoom === ZOOM_FIT ? 1 : zoom}
        onChange={handleSliderChange}
        className="w-12 sm:w-20 h-1.5 appearance-none cursor-pointer rounded-full bg-paper-deep accent-terracotta [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-terracotta [&::-webkit-slider-thumb]:shadow-soft [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
        aria-label="Zoom level"
      />
      <span className="hidden sm:block font-mono text-ui text-ink-muted w-8 text-right tabular-nums">
        {zoomPercent}%
      </span>
    </div>
  )
}
