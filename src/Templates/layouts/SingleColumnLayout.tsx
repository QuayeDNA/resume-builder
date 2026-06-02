import type { ReactNode } from 'react'
import type { TemplateTheme } from '../theme'

export default function SingleColumnLayout({ theme, children }: { theme: TemplateTheme; children: ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        margin: '0 auto',
        padding: theme.spacing.pagePadding,
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSize.body,
        lineHeight: '1.6',
        color: theme.colors.text,
        background: theme.colors.background,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  )
}
