/**
 * Conditional class name merger
 * Like clsx + tailwind-merge in one tiny function
 */
export function cn(...inputs) {
  const classes = inputs.filter(Boolean).join(' ').split(/\s+/)
  const classMap = {}
  for (const cls of classes) {
    if (cls) classMap[cls] = true
  }
  return Object.keys(classMap).join(' ')
}
