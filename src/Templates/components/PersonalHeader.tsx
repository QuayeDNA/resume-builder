import type { ResumeData } from '../../types'
import type { TemplateTheme } from '../theme'

type Props = {
  data: ResumeData
  theme: TemplateTheme
  variant: 'full' | 'sidebar' | 'ats'
}

export default function PersonalHeader({ data, theme, variant }: Props) {
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
          {p.email && <div style={{ wordBreak: 'break-word', marginBottom: '3px' }}>✉ {p.email}</div>}
          {p.phone && <div style={{ marginBottom: '3px' }}>✆ {p.phone}</div>}
          {p.location && <div style={{ marginBottom: '3px' }}>⌖ {p.location}</div>}
          {p.website && <div style={{ wordBreak: 'break-word', marginBottom: '3px' }}>🌐 {p.website}</div>}
          {p.linkedin && <div style={{ wordBreak: 'break-word' }}>in {p.linkedin}</div>}
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
          {[p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean).join(' | ')}
        </div>
      </header>
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
          {p.email && <div>✉ {p.email}</div>}
          {p.phone && <div>✆ {p.phone}</div>}
          {p.location && <div>⌖ {p.location}</div>}
          {p.website && <div>🌐 {p.website}</div>}
          {p.linkedin && <div>in {p.linkedin}</div>}
        </div>
      </div>

      {p.summary && (
        <p
          style={{
            fontSize: theme.fontSize.body,
            color: '#333333',
            marginTop: '10px',
            marginBottom: '0',
            lineHeight: '1.65',
          }}
        >
          &ldquo;{p.summary}&rdquo;
        </p>
      )}
    </div>
  )
}
