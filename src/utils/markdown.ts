export function mdToHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

export function htmlToMd(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return nodeToMd(div)
}

function nodeToMd(node: Node): string {
  let result = ''
  for (const child of node.childNodes) {
    switch (child.nodeType) {
      case Node.TEXT_NODE:
        result += child.textContent
        break
      case Node.ELEMENT_NODE: {
        const el = child as HTMLElement
        const tag = el.tagName.toLowerCase()
        if (tag === 'strong' || tag === 'b') {
          result += '**' + nodeToMd(el) + '**'
        } else if (tag === 'em' || tag === 'i') {
          result += '*' + nodeToMd(el) + '*'
        } else if (tag === 'br') {
          result += '\n'
        } else if (tag === 'div') {
          result += nodeToMd(el) + '\n'
        } else if (tag === 'p') {
          result += nodeToMd(el) + '\n'
        } else if (tag === 'span') {
          result += nodeToMd(el)
        } else if (tag === 'ul' || tag === 'ol') {
          result += '\n' + nodeToMd(el)
        } else if (tag === 'li') {
          result += nodeToMd(el) + '\n'
        } else {
          result += el.textContent || ''
        }
        break
      }
    }
  }
  return result.replace(/\n{3,}/g, '\n\n')
}
