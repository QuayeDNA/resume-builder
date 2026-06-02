import type { TemplateTheme } from '../theme'

export default function DateRange({ start, end, theme }: { start: string; end: string; theme: TemplateTheme }) {
  if (!start && !end) return null
  return (
    <span
      style={{
        whiteSpace: 'nowrap',
        fontSize: theme.fontSize.small,
        color: theme.colors.textMuted,
      }}
    >
      {start}
      {start && end ? ' – ' : ''}
      {end}
    </span>
  )
}
