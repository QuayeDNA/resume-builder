import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import type { ResumeData, CoverLetterData, ResumeSlot } from '../types'
import { PAGE_WIDTH, PAGE_HEIGHT } from '../Templates/theme'

export type ExportFormat = 'pdf' | 'pdf-print' | 'docx' | 'txt' | 'html' | 'json'

export type ExportOptions = {
  format: ExportFormat
  includeCoverLetter?: boolean
  filename?: string
}

const CANVAS_SCALE = 3

async function capturePage(element: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(element, {
    scale: CANVAS_SCALE,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  })
}

export async function exportPdfCanvas(data: ResumeData, filename = 'resume'): Promise<void> {
  const pageContainers = document.querySelectorAll<HTMLElement>('[data-page-container]')
  if (!pageContainers.length) return

  const pdf = new jsPDF('p', 'pt', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  for (let i = 0; i < pageContainers.length; i++) {
    if (i > 0) pdf.addPage()
    const canvas = await capturePage(pageContainers[i])
    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight)
  }

  pdf.save(`${filename}.pdf`)
}

export async function exportDocx(data: ResumeData, filename = 'resume'): Promise<void> {
  const children: (Paragraph | import('docx').TableOfContents | import('docx').Table)[] = []

  const addHeading = (text: string, level?: string) => {
    children.push(new Paragraph({ text, heading: level as any, spacing: { after: 120 } }))
  }

  const addParagraph = (text: string, opts?: { bold?: boolean; spacing?: { after?: number } }) => {
    children.push(new Paragraph({
      children: [new TextRun({ text, bold: opts?.bold })],
      spacing: opts?.spacing || { after: 80 },
    }))
  }

  const addBullet = (text: string) => {
    children.push(new Paragraph({
      children: [new TextRun({ text })],
      bullet: { level: 0 },
      spacing: { after: 40 },
    }))
  }

  const { personal } = data

  addHeading(personal.name || 'Resume', HeadingLevel.TITLE)
  const headerLine = [personal.title, personal.email, personal.phone, personal.location].filter(Boolean).join(' | ')
  if (headerLine) addParagraph(headerLine, { spacing: { after: 200 } })

  if (personal.summary) {
    addHeading('Summary', HeadingLevel.HEADING_1)
    addParagraph(personal.summary)
  }

  if (data.experience.length > 0) {
    addHeading('Experience', HeadingLevel.HEADING_1)
    for (const exp of data.experience) {
      addParagraph(exp.role, { bold: true })
      addParagraph(`${exp.company}${exp.location ? ` — ${exp.location}` : ''} | ${exp.start} — ${exp.end}`)
      for (const b of exp.bullets.filter(Boolean)) {
        addBullet(b)
      }
    }
  }

  if (data.education.length > 0) {
    addHeading('Education', HeadingLevel.HEADING_1)
    for (const edu of data.education) {
      addParagraph(`${edu.degree} — ${edu.school}`, { bold: true })
      addParagraph(`${edu.start} — ${edu.end}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`)
    }
  }

  if (data.skills.length > 0) {
    addHeading('Skills', HeadingLevel.HEADING_1)
    addParagraph(data.skills.join(', '))
  }

  if (data.projects.length > 0) {
    addHeading('Projects', HeadingLevel.HEADING_1)
    for (const proj of data.projects) {
      addParagraph(proj.name, { bold: true })
      if (proj.description) addParagraph(proj.description)
    }
  }

  if (data.certifications.length > 0) {
    addHeading('Certifications', HeadingLevel.HEADING_1)
    for (const cert of data.certifications) {
      addParagraph(`${cert.name} — ${cert.issuer}${cert.year ? ` (${cert.year})` : ''}`)
    }
  }

  if (data.languages && data.languages.length > 0) {
    addHeading('Languages', HeadingLevel.HEADING_1)
    for (const lang of data.languages) {
      addParagraph(`${lang.language} — ${lang.proficiency}`)
    }
  }

  for (const cs of data.customSections) {
    if (data.hiddenSections?.includes(`custom_${cs.id}`)) continue
    if (cs.entries.length === 0) continue
    addHeading(cs.name, HeadingLevel.HEADING_1)
    for (const entry of cs.entries) {
      const line = cs.fields.map((f) => entry.values[f.key] || '').filter(Boolean).join(' — ')
      if (line) addParagraph(line, { bold: true })
      for (const b of entry.bullets.filter(Boolean)) {
        addBullet(b)
      }
    }
  }

  const doc = new Document({
    title: personal.name || 'Resume',
    description: `Resume for ${personal.name}`,
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22 },
          paragraph: { spacing: { after: 80 } },
        },
      },
    },
    sections: [{ children }],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${filename}.docx`)
}

export async function exportText(data: ResumeData, filename = 'resume'): Promise<void> {
  const lines: string[] = []
  const { personal } = data

  lines.push(personal.name || 'Resume')
  const headerLine = [personal.title, personal.email, personal.phone, personal.location].filter(Boolean).join(' | ')
  if (headerLine) lines.push(headerLine)
  lines.push('')

  if (personal.summary) {
    lines.push('SUMMARY')
    lines.push(personal.summary)
    lines.push('')
  }

  if (data.experience.length > 0) {
    lines.push('EXPERIENCE')
    for (const exp of data.experience) {
      lines.push(`${exp.role} — ${exp.company}${exp.location ? ` (${exp.location})` : ''}`)
      lines.push(`${exp.start} — ${exp.end}`)
      for (const b of exp.bullets.filter(Boolean)) {
        lines.push(`  • ${b}`)
      }
      lines.push('')
    }
  }

  if (data.education.length > 0) {
    lines.push('EDUCATION')
    for (const edu of data.education) {
      lines.push(`${edu.degree} — ${edu.school}, ${edu.start} — ${edu.end}${edu.gpa ? `, GPA: ${edu.gpa}` : ''}`)
    }
    lines.push('')
  }

  if (data.skills.length > 0) {
    lines.push('SKILLS')
    lines.push(data.skills.join(', '))
    lines.push('')
  }

  if (data.projects.length > 0) {
    lines.push('PROJECTS')
    for (const proj of data.projects) {
      lines.push(proj.name)
      if (proj.description) lines.push(proj.description)
    }
    lines.push('')
  }

  if (data.certifications.length > 0) {
    lines.push('CERTIFICATIONS')
    for (const cert of data.certifications) {
      lines.push(`${cert.name} — ${cert.issuer}${cert.year ? ` (${cert.year})` : ''}`)
    }
    lines.push('')
  }

  if (data.languages && data.languages.length > 0) {
    lines.push('LANGUAGES')
    for (const lang of data.languages) {
      lines.push(`${lang.language} — ${lang.proficiency}`)
    }
    lines.push('')
  }

  for (const cs of data.customSections) {
    if (data.hiddenSections?.includes(`custom_${cs.id}`)) continue
    if (cs.entries.length === 0) continue
    lines.push(cs.name.toUpperCase())
    for (const entry of cs.entries) {
      const line = cs.fields.map((f) => entry.values[f.key] || '').filter(Boolean).join(' — ')
      if (line) lines.push(line)
      for (const b of entry.bullets.filter(Boolean)) {
        lines.push(`  • ${b}`)
      }
    }
    lines.push('')
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, `${filename}.txt`)
}

export async function exportHtml(data: ResumeData, filename = 'resume'): Promise<void> {
  const pageContainers = document.querySelectorAll<HTMLElement>('[data-page-container]')
  let pagesHTML = ''
  pageContainers.forEach((pc) => {
    const clone = pc.cloneNode(true) as HTMLElement
    const overlay = clone.querySelector('[data-page-number-overlay]')
    if (overlay) overlay.remove()
    clone.style.boxShadow = 'none'
    clone.style.borderRadius = '0'
    pagesHTML += clone.outerHTML
  })

  let stylesHTML = ''
  document.querySelectorAll('style').forEach((s: HTMLStyleElement) => {
    stylesHTML += `<style>${s.innerHTML}</style>\n`
  })
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    stylesHTML += `<link rel="stylesheet" href="${(link as HTMLLinkElement).href}">\n`
  })

  const doc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.personal.name || 'Resume'}</title>
  ${stylesHTML}
  <style>
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
    @page { size: A4 portrait; margin: 0; }
    html, body { margin: 0; padding: 0; background: #ffffff; }
    [data-page-container] { box-shadow: none !important; }
    @media screen { body { background: #e0e0e0; display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 20px; } }
  </style>
</head>
<body>
  ${pagesHTML}
</body>
</html>`

  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' })
  saveAs(blob, `${filename}.html`)
}

export async function exportJson(data: ResumeData, cl: CoverLetterData, filename = 'resume'): Promise<void> {
  const blob = new Blob([JSON.stringify({ data, cl }, null, 2)], { type: 'application/json' })
  saveAs(blob, `${filename}.json`)
}

export async function exportBatch(slots: ResumeSlot[]): Promise<void> {
  const zip = new JSZip()

  for (const slot of slots) {
    const folder = zip.folder(slot.name.replace(/[/\\?%*:|"<>]/g, '_'))!
    folder.file('resume.json', JSON.stringify({ data: slot.data, cl: slot.cl }, null, 2))

    const { personal } = slot.data
    const name = personal.name || 'resume'

    const txtLines: string[] = []
    txtLines.push(personal.name || 'Resume')
    if (personal.summary) txtLines.push('', 'SUMMARY', personal.summary)
    if (slot.data.skills.length > 0) txtLines.push('', 'SKILLS', slot.data.skills.join(', '))
    for (const exp of slot.data.experience) {
      txtLines.push('', `EXPERIENCE: ${exp.role} — ${exp.company}`)
      for (const b of exp.bullets.filter(Boolean)) txtLines.push(`  • ${b}`)
    }
    folder.file('resume.txt', txtLines.join('\n'))

    const docChildren: import('docx').Paragraph[] = []

    docChildren.push(new Paragraph({ text: personal.name || 'Resume', heading: HeadingLevel.TITLE }))
    if (personal.summary) {
      docChildren.push(new Paragraph({ text: personal.summary, spacing: { after: 200 } }))
    }
    for (const exp of slot.data.experience) {
      docChildren.push(new Paragraph({
        children: [new TextRun({ text: exp.role, bold: true })],
        spacing: { after: 40 },
      }))
      for (const b of exp.bullets.filter(Boolean)) {
        docChildren.push(new Paragraph({
          children: [new TextRun({ text: b })],
          bullet: { level: 0 },
          spacing: { after: 20 },
        }))
      }
    }

    const doc = new Document({
      title: name,
      sections: [{ children: docChildren }],
    })
    const docxBlob = await Packer.toBlob(doc)
    folder.file('resume.docx', docxBlob)
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  saveAs(zipBlob, 'resume-slots.zip')
}

export async function exportResume(
  opts: ExportOptions,
  data: ResumeData,
  cl: CoverLetterData,
  slots: ResumeSlot[],
): Promise<void> {
  const { format, filename } = opts
  const name = filename || data.personal.name || 'resume'

  switch (format) {
    case 'pdf':
      return exportPdfCanvas(data, name)
    case 'pdf-print':
      return (await import('./pdf')).exportToPdf(name)
    case 'docx':
      return exportDocx(data, name)
    case 'txt':
      return exportText(data, name)
    case 'html':
      return exportHtml(data, name)
    case 'json':
      return exportJson(data, cl, name)
    default:
      return exportPdfCanvas(data, name)
  }
}
