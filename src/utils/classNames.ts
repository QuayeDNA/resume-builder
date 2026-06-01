export function cn(...inputs: (string | boolean | null | undefined)[]) {
  const classes = inputs.filter(Boolean).join(' ').split(/\s+/)
  const classMap: Record<string, boolean> = {}
  for (const cls of classes) {
    if (cls) classMap[cls] = true
  }
  return Object.keys(classMap).join(' ')
}
