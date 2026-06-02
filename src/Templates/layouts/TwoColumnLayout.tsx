import type { ReactNode } from 'react'
import type { TemplateTheme } from '../theme'
import { PAGE_HEIGHT } from '../theme'

export default function TwoColumnLayout({ theme, sidebar, main }: { theme: TemplateTheme; sidebar: ReactNode; main: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: theme.fonts.body,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        fontSize: '10px',
        background: theme.colors.background,
        width: '100%',
        minHeight: PAGE_HEIGHT,
      }}
    >
      <div
        style={{
          width: '200px',
          flexShrink: 0,
          background: theme.colors.accent,
          color: 'rgba(255,255,255,0.92)',
          padding: theme.spacing.sidebarPadding,
          alignSelf: 'stretch',
        }}
      >
        {sidebar}
      </div>
      <div
        style={{
          flex: 1,
          padding: theme.spacing.pagePadding,
          background: theme.colors.background,
          overflowX: 'hidden',
          minWidth: 0,
        }}
      >
        {main}
      </div>
    </div>
  )
}
