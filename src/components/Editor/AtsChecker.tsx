import { useState } from 'react'
import { Activity, X } from 'lucide-react'
import { calculateAtsScore, getScoreColor, getScoreLabel } from '../../utils/ats'
import { Button, Hint } from '../UI'
import useResumeStore from '../../store/useResumeStore'

export default function AtsChecker() {
  const data = useResumeStore((s) => s.data)
  const [result, setResult] = useState(null)
  const [visible, setVisible] = useState(false)

  const run = () => {
    setResult(calculateAtsScore(data))
    setVisible(true)
  }

  const color = result ? getScoreColor(result.score) : '#4ade80'

  return (
    <div className="mt-3">
      <Button onClick={run} variant="ghost" size="full" icon={<Activity size={12} />}>
        Check ATS Score
      </Button>

      {visible && result && (
        <div className="mt-2 bg-success-subtle border border-success/20 rounded-xl p-3 relative animate-slide-up">
          <button
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 text-text-muted hover:text-primary transition-colors"
          >
            <X size={12} />
          </button>

          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-body font-bold" style={{ color }}>
                {getScoreLabel(result.score)}
              </span>
              <span className="text-caption text-text-muted ml-1.5">ATS Score</span>
            </div>
            <span className="text-display font-mono" style={{ color, fontSize: '20px' }}>
              {result.score}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-elevated-2 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${result.score}%`, background: color }}
            />
          </div>

          {result.feedback.length === 0 ? (
            <Hint variant="success">Your resume looks excellent!</Hint>
          ) : (
            <div className="space-y-1">
              {result.feedback.map((f, i) => (
                <div key={i} className="text-caption text-warning">→ {f}</div>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-3 pt-2 border-t border-hairline text-caption text-text-muted">
            <span>Action verbs: <span className="text-primary">{result.verbCount}</span></span>
            <span>Metrics: <span className="text-primary">{result.metricCount}</span></span>
          </div>
        </div>
      )}
    </div>
  )
}
