export async function exportToPdf(elementId = 'resume-preview', filename = 'resume') {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Export target element not found:', elementId)
    return
  }

  let stylesHTML = ''

  document.querySelectorAll('style').forEach((s: HTMLStyleElement) => {
    stylesHTML += `<style>${s.innerHTML}</style>\n`
  })

  const linkPromises = Array.from(
    document.querySelectorAll('link[rel="stylesheet"]')
  ).map(async (link) => {
    const lnk = link as HTMLLinkElement
    try {
      const res = await fetch(lnk.href)
      if (res.ok) {
        const css = await res.text()
        return `<style>${css}</style>\n`
      }
    } catch (_) {}
    return `<link rel="stylesheet" href="${lnk.href}">\n`
  })

  const linkedStyles = await Promise.all(linkPromises)
  stylesHTML += linkedStyles.join('')

  if (!stylesHTML.includes('fonts.googleapis.com')) {
    stylesHTML += `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
`
  }

  const clone = element.cloneNode(true) as HTMLElement
  clone.removeAttribute('class')
  clone.style.boxShadow = 'none'
  clone.style.borderRadius = '0'
  clone.style.overflow = 'visible'
  clone.style.maxWidth = '100%'
  clone.style.width = '100%'

  const resumeHTML = clone.outerHTML

  const printDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  ${stylesHTML}
  <style>
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    @page {
      size: A4 portrait;
      margin: 0;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff !important;
      width: 210mm;
    }
    body > .resume-wrapper {
      width: 210mm;
      min-height: 297mm;
      margin: 0;
      padding: 0;
      background: #ffffff !important;
      overflow: visible;
    }
    @media print {
      html, body { background: #ffffff !important; }
    }
    @media screen {
      html, body { background: #e0e0e0 !important; display: flex; justify-content: center; padding: 20px; box-sizing: border-box; }
      body > .resume-wrapper { box-shadow: 0 4px 32px rgba(0,0,0,0.18); }
    }
  </style>
</head>
<body>
  <div class="resume-wrapper">
    ${resumeHTML}
  </div>
  <script>
    document.fonts.ready.then(function () {
      setTimeout(function () {
        window.print()
        window.addEventListener('afterprint', function () { window.close() })
      }, 500)
    })
  <\/script>
</body>
</html>`

  const printWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes')

  if (!printWindow) {
    console.warn('Print window blocked — falling back to same-window print.')
    const prev = document.title
    document.title = filename
    window.print()
    document.title = prev
    return
  }

  printWindow.document.open()
  printWindow.document.write(printDoc)
  printWindow.document.close()
}
