import type { TemplateTheme } from '../theme'

export default function Bullet({ text, theme }: { text: string; theme: TemplateTheme }) {
  switch (theme.bullet) {
    case 'dot':
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px',
            margin: '4px 0',
            fontSize: theme.fontSize.body,
            color: theme.colors.text,
            lineHeight: '1.5',
          }}
        >
          <span
            style={{
              marginTop: '5px',
              height: '4px',
              width: '4px',
              flexShrink: 0,
              borderRadius: '50%',
              background: theme.colors.secondary,
              display: 'inline-block',
            }}
          />
          <span style={{ flex: 1 }}>{text}</span>
        </div>
      )
    case 'dash':
      return (
        <div style={{ marginTop: '3px', color: theme.colors.text, fontSize: theme.fontSize.body }}>
          - {text}
        </div>
      )
    case 'plain':
      return (
        <div style={{ marginTop: '3px', color: theme.colors.text, fontSize: theme.fontSize.body }}>
          {text}
        </div>
      )
  }
}
