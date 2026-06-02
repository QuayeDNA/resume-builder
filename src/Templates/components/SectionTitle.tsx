import type { TemplateTheme } from '../theme'

type Props = {
  label: string
  theme: TemplateTheme
  sidebar?: boolean
}

export default function SectionTitle({ label, theme, sidebar }: Props) {
  if (sidebar) {
    return (
      <h3
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: '9px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1.4px',
          marginTop: '14px',
          marginBottom: '8px',
          color: 'rgba(255,255,255,0.75)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          paddingBottom: '3px',
        }}
      >
        {label}
      </h3>
    )
  }

  switch (theme.sectionTitle) {
    case 'underline':
      return (
        <div style={{ marginTop: '16px', marginBottom: '10px' }}>
          <h2
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: theme.fontSize.sectionHeading,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.8px',
              margin: '0',
              color: theme.colors.accent,
            }}
          >
            {label}
          </h2>
          <div style={{ height: '2.5px', marginTop: '5px', background: theme.colors.accent, borderRadius: '2px' }} />
        </div>
      )
    case 'border-bottom':
      return (
        <h2
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: theme.fontSize.sectionHeading,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1.6px',
            marginTop: '16px',
            marginBottom: '6px',
            paddingBottom: '4px',
            color: theme.colors.accent,
            borderBottom: `1px solid ${theme.colors.textMuted}66`,
          }}
        >
          {label}
        </h2>
      )
    case 'accent-bar':
      return (
        <div style={{ marginTop: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '4px', height: '18px', borderRadius: '2px', background: theme.colors.accent, flexShrink: 0 }} />
          <h2
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: theme.fontSize.sectionHeading,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              color: theme.colors.accent,
              margin: '0',
            }}
          >
            {label}
          </h2>
        </div>
      )
  }
}
