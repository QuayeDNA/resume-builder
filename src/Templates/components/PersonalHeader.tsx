import type { ResumeData } from '../../types'
import type { TemplateTheme, HeaderStyle } from '../theme'

const contactFields = (p: ResumeData['personal']) => [
  p.email && `✉ ${p.email}`,
  p.phone && `✆ ${p.phone}`,
  p.location && `⌖ ${p.location}`,
  p.website && `🌐 ${p.website}`,
  p.linkedin && `in ${p.linkedin}`,
].filter(Boolean) as string[]

export default function PersonalHeader({ data, theme, variant }: { data: ResumeData; theme: TemplateTheme; variant: HeaderStyle | 'sidebar' | 'ats' }) {
  const p = data.personal

  if (variant === 'sidebar') {
    return (
      <>
        <h1
          style={{
            fontFamily: theme.fonts.name,
            fontSize: '20px',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 4px 0',
            lineHeight: '1.2',
          }}
        >
          {p.name || 'Your Name'}
        </h1>
        {p.title && (
          <div
            style={{
              fontSize: '9px',
              fontWeight: '600',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: theme.colors.secondary,
            }}
          >
            {p.title}
          </div>
        )}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '10px',
            fontSize: '8.5px',
            lineHeight: '1.7',
          }}
        >
          {contactFields(p).map((line, i) => (
            <div key={i} style={{ wordBreak: 'break-word', marginBottom: i < contactFields(p).length - 1 ? '3px' : '0' }}>{line}</div>
          ))}
        </div>
      </>
    )
  }

  if (variant === 'ats') {
    return (
      <header style={{ marginBottom: '12px' }}>
        <h1
          style={{
            fontFamily: theme.fonts.name,
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 4px 0',
            letterSpacing: '0.2px',
            color: '#000000',
          }}
        >
          {p.name || 'Your Name'}
        </h1>
        {p.title && (
          <div
            style={{
              marginBottom: '6px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              color: theme.colors.accent,
            }}
          >
            {p.title}
          </div>
        )}
        <div style={{ fontSize: '9.5px', color: '#2f2f2f' }}>
          {contactFields(p).join(' | ')}
        </div>
      </header>
    )
  }

  if (variant === 'centered') {
    return (
      <div style={{ marginBottom: '22px', paddingBottom: '16px', borderBottom: `2px solid ${theme.colors.accent}`, textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: theme.fonts.name,
            fontSize: theme.fontSize.name,
            fontWeight: '700',
            margin: '0 0 2px 0',
            letterSpacing: '-0.3px',
            color: theme.colors.accent,
          }}
        >
          {p.name || 'Your Name'}
        </h1>
        {p.title && (
          <div
            style={{
              fontSize: theme.fontSize.title,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              color: theme.colors.secondary,
              marginBottom: '10px',
            }}
          >
            {p.title}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 14px', fontSize: theme.fontSize.small, color: theme.colors.textMuted }}>
          {contactFields(p).map((line, i) => (
            <span key={i}>{line}{i < contactFields(p).length - 1 ? ' ·' : ''}</span>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'stacked') {
    return (
      <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: `2px solid ${theme.colors.accent}` }}>
        <h1
          style={{
            fontFamily: theme.fonts.name,
            fontSize: theme.fontSize.name,
            fontWeight: '700',
            margin: '0 0 2px 0',
            letterSpacing: '-0.3px',
            color: theme.colors.accent,
          }}
        >
          {p.name || 'Your Name'}
        </h1>
        {p.title && (
          <div
            style={{
              fontSize: theme.fontSize.title,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              color: theme.colors.secondary,
              marginBottom: '8px',
            }}
          >
            {p.title}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '16px', fontSize: theme.fontSize.small, color: theme.colors.textMuted }}>
          {contactFields(p).map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        marginBottom: '18px',
        paddingBottom: '14px',
        borderBottom: `2px solid ${theme.colors.accent}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontFamily: theme.fonts.name,
              fontSize: theme.fontSize.name,
              fontWeight: '700',
              margin: '0 0 2px 0',
              letterSpacing: '-0.3px',
              color: theme.colors.accent,
            }}
          >
            {p.name || 'Your Name'}
          </h1>
          {p.title && (
            <div
              style={{
                fontSize: theme.fontSize.title,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                color: theme.colors.secondary,
              }}
            >
              {p.title}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px',
            textAlign: 'right',
            fontSize: theme.fontSize.small,
            color: theme.colors.textMuted,
            lineHeight: '1.4',
            flexShrink: 0,
          }}
        >
          {contactFields(p).map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
