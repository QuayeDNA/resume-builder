import { useEffect, useState, useRef, useMemo } from 'react'
import { Activity, RefreshCw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { calculateAtsScore, getScoreColor, getScoreLabel } from '../../utils/ats'
import { Button, AiButton } from '../UI'
import useResumeStore from '../../store/useResumeStore'
import type { AtsResult } from '../../types'
import { cn } from '../../utils/classNames'
import { aiAtsSuggestions } from '../../api/ai'
import type { AtsAiResult } from '../../api/ai'
import { useAi } from '../../hooks/useAi'

export default function AtsChecker() {
  const data = useResumeStore((s) => s.data)
  const setActiveSection = useResumeStore((s) => s.setActiveSection)
  const [result, setResult] = useState<AtsResult | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<AtsAiResult | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { run: runAi, isLoading } = useAi()

  const scoreColor = result ? getScoreColor(result.score) : '#4ade80'

  const run = () => setResult(calculateAtsScore(data))

  const handleAiSuggest = () =>
    runAi<AtsAiResult>('atsai', () => aiAtsSuggestions(data), (v) => setAiResult(v))

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(run, 2000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [data])

  const topSuggestions = useMemo(() => {
    if (!result) return []
    return result.suggestions.slice(0, 3)
  }, [result])

  const topKeywords = useMemo(() => {
    if (!result) return []
    return Object.entries(result.keywordDensity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
  }, [result])

  const handleGoToSection = (sectionId: string) => {
    setActiveSection(sectionId)
  }

  return (
    <div className="mt-3 space-y-3">
      <Button onClick={run} variant="ghost" size="full" icon={<RefreshCw size={12} />}>
        Refresh ATS Score
      </Button>

      {result && (
        <div className="bg-paper-deep/40 border border-warm-border rounded-xl p-3 animate-fade-up space-y-3">
          {/* ─── Overall Score ─── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} style={{ color: scoreColor }} />
              <span className="text-body font-bold" style={{ color: scoreColor }}>
                {getScoreLabel(result.score)}
              </span>
              <span className="text-caption text-ink-muted">ATS Score</span>
            </div>
            <span className="font-mono font-bold" style={{ color: scoreColor, fontSize: '18px' }}>
              {result.score}%
            </span>
          </div>

          <div className="h-2 bg-warm-border-strong rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${result.score}%`, background: scoreColor }}
            />
          </div>

          {/* ─── Category Scores ─── */}
          <div className="space-y-1.5">
            <p className="text-label text-ink-muted">Score Breakdown</p>
            {result.categoryScores.map((cat) => {
              const pct = cat.maxScore > 0 ? Math.round((cat.score / cat.maxScore) * 100) : 0
              const isOpen = expandedCategory === cat.category
              return (
                <div key={cat.category}>
                  <button
                    onClick={() => setExpandedCategory(isOpen ? null : cat.category)}
                    className="flex w-full items-center justify-between py-1 text-caption text-ink-soft hover:text-ink transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="flex-1">{cat.label}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium" style={{ color: getScoreColor(pct) }}>
                          {cat.score}/{cat.maxScore}
                        </span>
                        <div className="w-16 h-1.5 bg-warm-border-strong rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: getScoreColor(pct) }}
                          />
                        </div>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp size={12} className="ml-1 shrink-0" /> : <ChevronDown size={12} className="ml-1 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="pl-2 pb-1 space-y-0.5 animate-fade-in">
                      {cat.feedback.map((f, i) => (
                        <p key={i} className={cn('text-caption', f.includes('complete') || f.includes('strong') || f.includes('well') ? 'text-sage' : 'text-ink-muted')}>
                          → {f}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* ─── Verb & Metric Counts ─── */}
          <div className="flex gap-3 pt-2 border-t border-warm-border text-caption text-ink-muted">
            <span>Action verbs: <span className="text-ink font-medium">{result.verbCount}</span></span>
            <span>Metrics: <span className="text-ink font-medium">{result.metricCount}</span></span>
          </div>

          {/* ─── Suggestions with Fix Buttons ─── */}
          {topSuggestions.length > 0 && (
            <div className="pt-2 border-t border-warm-border space-y-1.5">
              <p className="text-label text-ink-muted">Suggestions</p>
              {topSuggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <p className="text-caption text-ink-soft flex-1">{s.message}</p>
                  <button
                    onClick={() => handleGoToSection(s.section)}
                    className="shrink-0 text-caption font-medium text-terracotta hover:text-ink transition-colors"
                  >
                    Fix
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ─── Keyword Density ─── */}
          {topKeywords.length > 0 && (
            <div className="pt-2 border-t border-warm-border space-y-1.5">
              <p className="text-label text-ink-muted">Top Keywords by Density</p>
              <div className="flex flex-wrap gap-1.5">
                {topKeywords.map(([kw, density]) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 rounded-full bg-warm-border/50 px-2 py-0.5 text-caption text-ink-soft"
                  >
                    {kw}
                    <span className="font-mono text-ink-muted" style={{ fontSize: '9px' }}>{density}%</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI-powered suggestions */}
      <div className="pt-2 border-t border-warm-border">
        <AiButton onClick={handleAiSuggest} loading={isLoading('atsai')} size="sm" showProvider>
          AI Suggestions
        </AiButton>
      </div>

      {aiResult && (
        <div className="bg-paper-deep/40 border border-warm-border rounded-xl p-3 animate-fade-up space-y-3">
          {aiResult.strengths.length > 0 && (
            <div>
              <p className="text-label text-green-600 font-semibold mb-1">Strengths</p>
              <ul className="space-y-1">
                {aiResult.strengths.map((s, i) => (
                  <li key={i} className="text-caption text-ink-soft flex items-start gap-1.5">
                    <span className="text-green-400">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aiResult.suggestions.length > 0 && (
            <div>
              <p className="text-label text-amber-600 font-semibold mb-1">Suggestions</p>
              <div className="space-y-1.5">
                {aiResult.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`shrink-0 text-caption font-bold ${s.impact === 'high' ? 'text-red-500' : s.impact === 'medium' ? 'text-amber-500' : 'text-blue-500'}`}>
                      {s.impact === 'high' ? '!!' : s.impact === 'medium' ? '!' : '·'}
                    </span>
                    <p className="text-caption text-ink-soft flex-1">{s.message}</p>
                    <button
                      onClick={() => handleGoToSection(s.section)}
                      className="shrink-0 text-caption font-medium text-terracotta hover:text-ink transition-colors"
                    >
                      Fix
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiResult.quickWins.length > 0 && (
            <div>
              <p className="text-label text-blue-600 font-semibold mb-1">Quick Wins</p>
              <ul className="space-y-1">
                {aiResult.quickWins.map((q, i) => (
                  <li key={i} className="text-caption text-ink-soft flex items-start gap-1.5">
                    <Sparkles size={10} className="text-blue-400 mt-0.5 shrink-0" /> {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
