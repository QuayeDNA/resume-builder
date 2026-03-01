/**
 * Export the resume preview element as a PDF using html2pdf.js
 * Falls back to window.print() if html2pdf is unavailable
 * @param {string} elementId - DOM id of the element to export
 * @param {string} filename - Output filename (without .pdf)
 */
export async function exportToPdf(elementId = 'resume-preview', filename = 'resume') {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Export target element not found:', elementId)
    return
  }

  try {
    const html2pdf = (await import('html2pdf.js')).default
    const opt = {
      margin:       0,
      filename:     `${filename}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
    }
    await html2pdf().set(opt).from(element).save()
  } catch (err) {
    console.warn('html2pdf failed, falling back to print:', err)
    window.print()
  }
}
