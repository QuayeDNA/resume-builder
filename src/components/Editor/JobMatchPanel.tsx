import { useState } from 'react'
import { Target, CheckCircle, XCircle, Lightbulb, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react'
import { Card, TextArea, AiButton } from '../UI'
import { Hint, Button } from '../../design/components'
import { useAi } from '../../hooks/useAi'
import { aiAnalyzeJobMatch } from '../../api/ai'
import useResumeStore from '../../store/useResumeStore'
import type { JobMatchResult } from '../../api/prompts'

export default function JobMatchPanel() {
  const data = useResumeStore((s) => s.data)
  const appendBullets = useResumeStore((s) => s.appendBullets)
  const addSkills = useResumeStore((s) => s.addSkills)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<JobMatchResult | null>(null)
  const { run, isLoading } = useAi()

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return
    run('jobmatch', () => aiAnalyzeJobMatch(data, jobDescription), (v) => setResult(v as JobMatchResult))
  }

  const scoreColor = result
    ? result.matchScore >= 70 ? '#4ade80'
      : result.matchScore >= 45 ? '#fbbf24'
        : '#f87171'
    : '#4ade80'

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-label font-semibold text-ink">Paste Job Description</label>
        <TextArea
          value={jobDescription}
          onChange={setJobDescription}
          placeholder="Paste the full job description here to analyze how well your resume matches…"
          rows={6}
        />
        <AiButton onClick={handleAnalyze} loading={isLoading('jobmatch')} disabled={!jobDescription.trim()}>
          Analyze Match
        </AiButton>
      </div>

      {result && (
        <div className="animate-fade-up space-y-4">
          {/* Score */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target size={16} style={{ color: scoreColor }} />
                <span className="text-body font-bold" style={{ color: scoreColor }}>
                  Match Score
                </span>
              </div>
              <span className="font-mono font-bold" style={{ color: scoreColor, fontSize: '24px' }}>
                {result.matchScore}%
              </span>
            </div>
            <div className="h-2 bg-warm-border-strong rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${result.matchScore}%`, background: scoreColor }} />
            </div>
            <p className="text-caption text-ink-muted mt-2 leading-relaxed">{result.overallFeedback}</p>
          </Card>

          {/* Strong / Weak Points */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={14} className="text-green-500" />
                <span className="text-label font-semibold text-ink">Strengths</span>
              </div>
              <ul className="space-y-1">
                {result.strongPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-caption text-ink-soft">
                    <CheckCircle size={10} className="text-green-400 mt-0.5 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle size={14} className="text-amber-500" />
                <span className="text-label font-semibold text-ink">Gaps</span>
              </div>
              <ul className="space-y-1">
                {result.weakPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-caption text-ink-soft">
                    <XCircle size={10} className="text-red-400 mt-0.5 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Keywords */}
          <Card>
            <p className="text-label font-semibold text-ink mb-2">Keyword Analysis</p>
            <div className="space-y-2">
              {result.matchedKeywords.length > 0 && (
                <div>
                  <p className="text-caption text-green-600 font-medium mb-1">Matched ({result.matchedKeywords.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {result.matchedKeywords.map((kw, i) => (
                      <span key={i} className="inline-flex items-center rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-caption text-green-700">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.missingKeywords.length > 0 && (
                <div>
                  <p className="text-caption text-red-600 font-medium mb-1">Missing ({result.missingKeywords.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-caption text-red-700">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Skills */}
          <Card>
            <p className="text-label font-semibold text-ink mb-2">Skills</p>
            <div className="space-y-2">
              {result.matchingSkills.length > 0 && (
                <div>
                  <p className="text-caption text-green-600 font-medium mb-1">Matching</p>
                  <div className="flex flex-wrap gap-1">
                    {result.matchingSkills.map((s, i) => (
                      <span key={i} className="inline-flex items-center rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-caption text-green-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.suggestedSkills.length > 0 && (
                <div>
                  <p className="text-caption text-amber-600 font-medium mb-1">Suggested to Add</p>
                  <div className="flex flex-wrap gap-1">
                    {result.suggestedSkills.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-caption text-amber-700">
                        {s}
                        <button
                          onClick={() => addSkills([s])}
                          className="text-amber-500 hover:text-amber-700 transition-colors"
                          title="Add this skill"
                        >
                          +
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Bullet suggestions */}
          {result.bulletSuggestions.length > 0 && (
            <Card>
              <div className="flex items-center gap-1.5 mb-2">
                <Lightbulb size={14} className="text-amber-500" />
                <span className="text-label font-semibold text-ink">Suggested Bullet Points</span>
              </div>
              <ul className="space-y-2">
                {result.bulletSuggestions.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-caption text-ink-soft flex-1 leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
              {data.experience[0] && (
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Sparkles size={12} />}
                    onClick={() => appendBullets(data.experience[0].id, result.bulletSuggestions)}
                  >
                    Add to {data.experience[0].role || 'latest'} role
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      <Hint>Job matching uses AI to analyze your resume against any job description. Results are suggestions — review before applying changes.</Hint>
    </div>
  )
}