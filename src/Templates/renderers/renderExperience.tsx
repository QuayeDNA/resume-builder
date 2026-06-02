import type { ExperienceEntry } from '../../types'
import type { TemplateTheme } from '../theme'
import SectionTitle from '../components/SectionTitle'
import Bullet from '../components/Bullet'
import DateRange from '../components/DateRange'

function renderTimeline(entries: ExperienceEntry[], theme: TemplateTheme) {
  const cols = entries.map((e, idx) => (
    <div key={e.id} style={{ display: 'flex', gap: '12px', marginTop: idx > 0 ? '14px' : '0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12px', flexShrink: 0 }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.colors.accent, marginTop: '4px', flexShrink: 0 }} />
        {idx < entries.length - 1 && (
          <div style={{ width: '1.5px', flex: 1, background: theme.colors.accent + '44', minHeight: '20px' }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div>
            <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{e.role}</span>
            {e.company && (
              <span style={{ marginLeft: '4px', fontSize: '10.5px', color: theme.colors.secondary }}>@ {e.company}</span>
            )}
          </div>
          <DateRange start={e.start} end={e.end} theme={theme} />
        </div>
        {e.location && <div style={{ fontSize: '9.5px', color: theme.colors.textMuted, marginTop: '2px' }}>{e.location}</div>}
        {e.bullets.filter((b) => b.trim()).map((b, i) => (
          <Bullet key={i} text={b} theme={theme} />
        ))}
      </div>
    </div>
  ))
  return <>{cols}</>
}

function renderCompact(entries: ExperienceEntry[], theme: TemplateTheme) {
  return <>
    {entries.map((e, idx) => (
      <div key={e.id} style={{ marginTop: idx > 0 ? '10px' : '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontWeight: '600', fontSize: '10.5px', color: '#1a1a1a' }}>{e.role}</span>
          {e.company && (
            <span style={{ fontSize: '10px', color: theme.colors.secondary }}>@ {e.company}</span>
          )}
          <div style={{ flex: 1 }} />
          <DateRange start={e.start} end={e.end} theme={theme} />
        </div>
        {e.location && <div style={{ fontSize: '9px', color: theme.colors.textMuted }}>{e.location}</div>}
        {e.bullets.filter((b) => b.trim()).map((b, i) => (
          <Bullet key={i} text={b} theme={theme} />
        ))}
      </div>
    ))}
  </>
}

function renderCards(entries: ExperienceEntry[], theme: TemplateTheme) {
  return <>
    {entries.map((e, idx) => (
      <div
        key={e.id}
        style={{
          marginTop: idx > 0 ? '12px' : '0',
          border: `1px solid ${theme.colors.accent}22`,
          borderRadius: '6px',
          padding: '12px 14px',
          background: theme.colors.background === '#ffffff' ? '#fafbfc' : theme.colors.background,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontWeight: '600', fontSize: '11px', color: theme.colors.accent }}>{e.role}</span>
            {e.company && (
              <span style={{ fontWeight: '500', marginLeft: '6px', fontSize: '10.5px', color: theme.colors.secondary }}>
                @ {e.company}
              </span>
            )}
          </div>
          <DateRange start={e.start} end={e.end} theme={theme} />
        </div>
        {e.location && <div style={{ fontSize: '9.5px', color: theme.colors.textMuted, marginTop: '2px' }}>{e.location}</div>}
        {e.bullets.filter((b) => b.trim()).map((b, i) => (
          <Bullet key={i} text={b} theme={theme} />
        ))}
      </div>
    ))}
  </>
}

export function renderExperience(experience: ExperienceEntry[], theme: TemplateTheme) {
  if (experience.length === 0) return null

  const style = theme.experienceStyle || 'default'

  return (
    <section>
      <SectionTitle label="Experience" theme={theme} />
      {style === 'timeline' && renderTimeline(experience, theme)}
      {style === 'compact' && renderCompact(experience, theme)}
      {style === 'cards' && renderCards(experience, theme)}
      {style === 'default' && experience.map((e, idx) => (
        <div key={e.id} style={{ marginTop: idx > 0 ? '14px' : '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{e.role}</span>
              {e.company && (
                <span style={{ fontWeight: '600', marginLeft: '6px', fontSize: '10.5px', color: theme.colors.secondary }}>
                  @ {e.company}
                </span>
              )}
            </div>
            <div style={{ fontSize: '9.5px', color: '#777', textAlign: 'right', flexShrink: 0 }}>
              <DateRange start={e.start} end={e.end} theme={theme} />
              {e.location && <div style={{ whiteSpace: 'nowrap' }}>{e.location}</div>}
            </div>
          </div>
          {e.bullets.filter((b) => b.trim()).map((b, i) => (
            <Bullet key={i} text={b} theme={theme} />
          ))}
        </div>
      ))}
    </section>
  )
}
