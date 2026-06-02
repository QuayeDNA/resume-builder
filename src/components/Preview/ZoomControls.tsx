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
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(ZOOM_FIT)}
        className={`rounded-md px-2 py-1 text-caption font-medium transition-all duration-150 ${
          zoom === ZOOM_FIT
            ? 'bg-white text-terracotta shadow-soft border border-warm-border'
            : 'text-ink-muted hover:text-ink'
        }`}
      >
        Fit
      </button>
      <input
        type="range"
        min={ZOOM_MIN}
        max={ZOOM_MAX}
        step={ZOOM_STEP}
        value={zoom === ZOOM_FIT ? 1 : zoom}
        onChange={handleSliderChange}
        className="w-20 h-1.5 appearance-none cursor-pointer rounded-full bg-paper-deep accent-terracotta [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-terracotta [&::-webkit-slider-thumb]:shadow-soft [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
        aria-label="Zoom level"
      />
      <span className="font-mono text-ui text-ink-muted w-8 text-right tabular-nums">
        {zoomPercent}%
      </span>
    </div>
  )
}
