export function renderBulletText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

export function wrapSelection(text: string, selectionStart: number, selectionEnd: number, wrapper: string): { newText: string; cursorPos: number } {
  const selected = text.slice(selectionStart, selectionEnd)
  const before = text.slice(0, selectionStart)
  const after = text.slice(selectionEnd)

  if (selected.length > 0) {
    return {
      newText: `${before}${wrapper}${selected}${wrapper}${after}`,
      cursorPos: selectionEnd + wrapper.length * 2,
    }
  }

  return {
    newText: `${before}${wrapper}${wrapper}${after}`,
    cursorPos: selectionStart + wrapper.length,
  }
}
