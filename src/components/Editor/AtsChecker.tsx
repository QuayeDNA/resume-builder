import { useEffect, useState, useMemo, useCallback } from 'react'
import { Activity, RefreshCw, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Target, ArrowRight, FileText, Zap } from 'lucide-react'
import { calculateAtsScore, getScoreColor, getScoreLabel, getScoreVariant, hashResumeData } from '../../utils/ats'
import { Button } from '../UI'
import { Skeleton, Surface, Badge, Hint } from '../../design/components'
import useResumeStore from '../../store/useResumeStore'
import type { AtsResult } from '../../types'
import { cn } from '../../utils/classNames'
import { aiCalculateAtsScore } from '../../api/ai'

const CATEGORY_TO_SECTION: Record<string, string> = {
  contact: 'personal',
  content: 'personal',
  experience: 'experience',
  skills: 'skills',
  education: 'education',
  extras: 'certifications',
}

const VARIANT_TEXT: Record<string, string> = {
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
}

const VARIANT_BG: Record<string, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
}

type AtsState = 'idle' | 'loading' | 'loaded' | 'error'

export default function AtsChecker() {
  const data = useResumeStore((s) => s.data)
  const atsCachedResult = useResumeStore((s) => s.atsCachedResult)
  const atsCachedHash = useResumeStore((s) => s.atsCachedHash)
  const atsCachedType = useResumeStore((s) => s.atsCachedType)
  const setAtsCache = useResumeStore((s) => s.setAtsCache)
  const setAtsDialogOpen = useResumeStore((s) => s.setAtsDialogOpen)

  const currentHash = useMemo(() => hashResumeData(data), [data])
  const hasValidCache = atsCachedHash === currentHash && atsCachedResult

  const [state, setState] = useState<AtsState>(hasValidCache ? 'loaded' : 'idle')
  const [result, setResult] = useState<AtsResult | null>(hasValidCache ? atsCachedResult : null)
  const [error, setError] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [analysisType, setAnalysisType] = useState<'ai' | 'basic' | null>(hasValidCache ? atsCachedType : null)
  const [refreshLoading, setRefreshLoading] = useState(false)

  const variant = result ? getScoreVariant(result.score) : 'success'
  const scoreColor = result ? getScoreColor(result.score) : '#4ade80'

  const runAiAnalysis = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const r = await aiCalculateAtsScore(data)
      const h = hashResumeData(data)
      setResult(r)
      setAnalysisType('ai')
      setAtsCache(r, h, 'ai')
      setState('loaded')
    } catch {
      try {
        const r = calculateAtsScore(data)
        const h = hashResumeData(data)
        setResult(r)
        setAnalysisType('basic')
        setAtsCache(r, h, 'basic')
        setState('loaded')
      } catch (e2) {
        setError(e2 instanceof Error ? e2.message : 'Analysis failed')
        setState('error')
      }
    }
  }, [data, setAtsCache])

  useEffect(() => {
    if (hasValidCache) return
    runAiAnalysis()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGoToSection = useCallback((sectionId?: string) => {
    if (sectionId) {
      setAtsDialogOpen(false)
      useResumeStore.getState().setActiveSection(sectionId === 'summary' ? 'personal' : sectionId)
    }
  }, [setAtsDialogOpen])

  const handleRefresh = useCallback(async () => {
    if (state !== 'loaded' || refreshLoading) return
    setRefreshLoading(true)
    const h = hashResumeData(data)

    if (analysisType === 'ai') {
      const r = calculateAtsScore(data)
      setResult(r)
      setAnalysisType('basic')
      setAtsCache(r, h, 'basic')
    } else {
      try {
        const r = await aiCalculateAtsScore(data)
        setResult(r)
        setAnalysisType('ai')
        setAtsCache(r, h, 'ai')
      } catch {
        /* keep current result */
      }
    }

    setRefreshLoading(false)
  }, [data, state, analysisType, refreshLoading, setAtsCache])

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

  const scoreRing = (score: number) => {
    const size = 56
    const stroke = 4
    const r = (size - stroke) / 2
    const circumference = 2 * Math.PI * r
    const offset = circumference - (score / 100) * circumference
    return (
      <svg width={size} height={size} className="shrink-0" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-warm-border-strong" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={scoreColor} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-700"
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-sm font-bold fill-current">
          {score}
        </text>
      </svg>
    )
  }

  /* ── Idle ── */
  if (state === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-3">
        <Activity size={28} className="text-sage animate-pulse" />
        <p className="text-body text-ink-muted">Analyzing with AI…</p>
      </div>
    )
  }

  /* ── Error ── */
  if (state === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <AlertTriangle size={28} className="text-error" />
        <p className="text-body text-ink-soft text-center max-w-[240px]">{error || 'Analysis failed.'}</p>
        <Button onClick={runAiAnalysis} variant="primary" size="sm">Retry</Button>
      </div>
    )
  }

  /* ── Loading (first run, no result yet) ── */
  if (state === 'loading' && !result) {
    return (
      <div className="space-y-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-paper-deep animate-pulse shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-28 bg-paper-deep rounded animate-pulse" />
            <div className="h-3 w-20 bg-paper-deep rounded animate-pulse" />
          </div>
        </div>
        <Skeleton lines={5} />
        <p className="text-caption text-ink-muted text-center">AI is analyzing your resume for role-specific feedback…</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* ── Status badges ── */}
      <div className="flex items-center gap-2">
        {analysisType === 'ai' && (
          <div className="flex items-center gap-1.5 text-caption text-sage">
            <Zap size={12} />
            AI-powered
          </div>
        )}
        {analysisType === 'basic' && (
          <div className="flex items-center gap-1.5 text-caption text-ink-muted">
            <AlertTriangle size={10} />
            Basic analysis
          </div>
        )}
        {refreshLoading && (
          <span className="text-caption text-ink-muted animate-pulse">Refreshing…</span>
        )}
      </div>

      {/* ── Score header ── */}
      <div className="flex items-center gap-4">
        {result && scoreRing(result.score)}
        <div className="flex-1 min-w-0">
          <p className={cn('text-subheading font-display font-semibold', VARIANT_TEXT[variant])}>
            {result ? getScoreLabel(result.score) : '-'}
          </p>
          <p className="text-caption text-ink-muted">ATS Compatibility Score</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="ghost"
          size="sm"
          icon={<RefreshCw size={12} className={refreshLoading ? 'animate-spin' : ''} />}
          className="shrink-0"
          disabled={refreshLoading}
        >
          {analysisType === 'ai' ? 'Basic Check' : 'AI Analysis'}
        </Button>
      </div>

      {/* ── Progress bar ── */}
      {result && (
        <div className="h-2 bg-warm-border-strong rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700 ease-out', VARIANT_BG[variant])}
            style={{ width: `${result.score}%` }}
          />
        </div>
      )}

      {/* ── Verb & Metric counts ── */}
      {result && (
        <div className="flex gap-4 text-caption text-ink-muted">
          <span>Action verbs <span className="text-ink font-medium">{result.verbCount}</span></span>
          <span>Metrics <span className="text-ink font-medium">{result.metricCount}</span></span>
        </div>
      )}

      {/* ── Category breakdown ── */}
      {result && result.categoryScores.length > 0 && (
        <section>
          <h3 className="text-label font-semibold text-ink mb-2 flex items-center gap-1.5">
            <Target size={14} className="text-sage" />
            Category Breakdown
          </h3>
          <div className="space-y-1">
            {result.categoryScores.map((cat) => {
              const pct = cat.maxScore > 0 ? Math.round((cat.score / cat.maxScore) * 100) : 0
              const isOpen = expandedCategory === cat.category
              const catVariant = getScoreVariant(pct)
              return (
                <div key={cat.category} className="rounded-lg border border-warm-border bg-paper-warm/40 overflow-hidden">
                  <button
                    onClick={() => setExpandedCategory(isOpen ? null : cat.category)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-paper-deep/30 transition-colors text-left"
                  >
                    <span className="flex-1 text-body text-ink font-medium min-w-0 truncate">{cat.label}</span>
                    <span className={cn('text-label font-semibold shrink-0', VARIANT_TEXT[catVariant])}>
                      {cat.score}/{cat.maxScore}
                    </span>
                    <div className="w-16 h-1.5 bg-warm-border-strong rounded-full overflow-hidden shrink-0">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', VARIANT_BG[catVariant])}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {isOpen
                      ? <ChevronUp size={12} className="text-ink-muted shrink-0" />
                      : <ChevronDown size={12} className="text-ink-muted shrink-0" />
                    }
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-2.5 space-y-1.5 border-t border-warm-border pt-2">
                      {cat.feedback.length === 0 ? (
                        <Hint variant="success">No issues — this category looks good!</Hint>
                      ) : (
                        cat.feedback.map((f, i) => {
                          const isPositive = f.includes('complete') || f.includes('strong') || f.includes('well') || f.includes('optimized') || f.includes('listed') || f.includes('good')
                          return (
                            <div key={i} className="flex items-start gap-2 pl-1">
                              <span className={cn('text-caption mt-0.5 shrink-0', isPositive ? 'text-success' : 'text-ink-muted')}>
                                {isPositive ? '✓' : '→'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <Hint variant={isPositive ? 'success' : 'default'}>{f}</Hint>
                              </div>
                              {!isPositive && CATEGORY_TO_SECTION[cat.category] && (
                                <Button
                                  onClick={() => handleGoToSection(CATEGORY_TO_SECTION[cat.category])}
                                  variant="ghost"
                                  size="sm"
                                  className="shrink-0 mt-0.5"
                                >
                                  Fix
                                </Button>
                              )}
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Suggestions with Fix buttons ── */}
      {topSuggestions.length > 0 && (
        <section>
          <h3 className="text-label font-semibold text-ink mb-2 flex items-center gap-1.5">
            <FileText size={14} className="text-terracotta" />
            Top Suggestions
          </h3>
          <div className="space-y-2">
            {topSuggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 bg-paper-deep/30 rounded-lg px-3 py-2.5 border border-warm-border">
                <span className="text-caption text-ink-muted font-mono mt-0.5 shrink-0">{i + 1}.</span>
                <p className="flex-1 text-body text-ink-soft leading-snug">{s.message}</p>
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <Badge variant="brand" className="text-[10px]">{s.section}</Badge>
                  <Button onClick={() => handleGoToSection(s.section)} variant="ghost" size="sm" icon={<ArrowRight size={10} />}>
                    Fix
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Keyword density ── */}
      {topKeywords.length > 0 && (
        <section>
          <h3 className="text-label font-semibold text-ink mb-2 flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-warning" />
            Top Keywords by Density
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {topKeywords.map(([kw, density]) => (
              <Badge key={kw} variant="default">
                {kw}
                <span className="font-mono opacity-60 ml-1">{density}%</span>
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* ── Empty state (loaded, no issues) ── */}
      {state === 'loaded' && result && result.suggestions.length === 0 && result.categoryScores.every((c) => c.feedback.every((f) => !f.toLowerCase().includes('missing') && !f.toLowerCase().includes('add') && !f.toLowerCase().includes('consider'))) && (
        <Surface variant="success" className="text-center py-6">
          <CheckCircle size={24} className="text-success mx-auto mb-2" />
          <p className="text-body text-ink-soft">Your resume looks great! No issues found.</p>
        </Surface>
      )}
    </div>
  )
}