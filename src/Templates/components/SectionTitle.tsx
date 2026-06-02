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
          <div style={{ height: '1.5px', marginTop: '4px', background: theme.colors.accent }} />
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
            marginBottom: '10px',
            color: theme.colors.accent,
            borderBottom: `2px solid ${theme.colors.accent}`,
            paddingBottom: '4px',
          }}
        >
          {label}
        </h2>
      )
    case 'accent-bar':
      return (
        <div style={{ marginTop: '14px', marginBottom: '8px' }}>
          <h2
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: theme.fontSize.sectionHeading,
              fontWeight: '700',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              color: theme.colors.accent,
              margin: '0',
            }}
          >
            {label}
          </h2>
          <div style={{ marginTop: '3px', height: '1px', background: theme.colors.textMuted }} />
        </div>
      )
  }
}
