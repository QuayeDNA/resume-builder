import { useState } from 'react'
import { Activity, X } from 'lucide-react'
import { calculateAtsScore, getScoreColor, getScoreLabel } from '../../utils/ats'
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
      <button
        onClick={run}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[#12102e] to-[#181430] border border-[#28245a] rounded-lg py-2 text-[#7068cc] text-[10.5px] font-semibold hover:text-brand-400 hover:border-brand-500 transition-colors"
      >
        <Activity size={12} /> Check ATS Score
      </button>

      {visible && result && (
        <div className="mt-2 bg-[#08140a] border border-[#122814] rounded-lg p-3 relative">
          <button
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 text-[#2a2a4a] hover:text-[#5a5a7a] transition-colors"
          >
            <X size={12} />
          </button>

          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-[10.5px] font-bold" style={{ color }}>
                {getScoreLabel(result.score)}
              </span>
              <span className="text-[9px] text-gray-600 ml-1.5">ATS Score</span>
            </div>
            <span className="text-[20px] font-bold font-mono" style={{ color }}>
              {result.score}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-[#102010] rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${result.score}%`, background: color }}
            />
          </div>

          {result.feedback.length === 0 ? (
            <p className="text-[10px] text-green-400">✓ Your resume looks excellent!</p>
          ) : (
            <div className="space-y-1">
              {result.feedback.map((f, i) => (
                <div key={i} className="text-[9.5px] text-yellow-600">→ {f}</div>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-3 pt-2 border-t border-[#0f1f10] text-[9px] text-gray-700">
            <span>Action verbs: {result.verbCount}</span>
            <span>Metrics: {result.metricCount}</span>
          </div>
        </div>
      )}
    </div>
  )
}
