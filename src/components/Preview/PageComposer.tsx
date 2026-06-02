import { Fragment, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../Templates/theme'
import PageContainer from './PageContainer'

type PageComposerProps = {
  children: ReactNode
}

type SectionMeasure = {
  id: string
  top: number
  height: number
}

type PageAssignment = {
  sectionIds: string[]
  topOffset: number
}

function packSections(sections: SectionMeasure[]): PageAssignment[] {
  const pages: PageAssignment[] = []
  let current: string[] = []
  let pageTop = 0

  for (const s of sections) {
    const sectionEnd = s.top + s.height
    const pageEnd = pageTop + PAGE_HEIGHT

    if (current.length === 0 || sectionEnd <= pageEnd) {
      current.push(s.id)
    } else {
      pages.push({ sectionIds: current, topOffset: pageTop })
      current = [s.id]
      pageTop = s.top
    }
  }

  if (current.length > 0) {
    pages.push({ sectionIds: current, topOffset: pageTop })
  }

  return pages
}

export default function PageComposer({ children }: PageComposerProps) {
  const measurerRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<PageAssignment[]>([])

  useLayoutEffect(() => {
    const el = measurerRef.current
    if (!el) return

    const containerRect = el.getBoundingClientRect()
    const sectionEls = el.querySelectorAll<HTMLElement>('[data-section-id]')

    const measured: SectionMeasure[] = Array.from(sectionEls).map((s) => {
      const rect = s.getBoundingClientRect()
      return {
        id: s.dataset.sectionId!,
        top: rect.top - containerRect.top,
        height: rect.height,
      }
    })

    // Multi-column layouts (two-col) have sections with overlapping tops —
    // fall back to simple height-based page estimation for those.
    const isMultiCol = measured.some((a, i) =>
      measured.slice(i + 1).some((b) => Math.abs(a.top - b.top) < 5),
    )

    if (isMultiCol || measured.length === 0) {
      const totalHeight = el.scrollHeight
      const count = Math.max(1, Math.ceil(totalHeight / PAGE_HEIGHT))
      setPages(
        Array.from({ length: count }, (_, i) => ({
          sectionIds: measured.map((s) => s.id),
          topOffset: i * PAGE_HEIGHT,
        })),
      )
    } else {
      setPages(packSections(measured))
    }
  }, [children])

  return (
    <>
      <div
        ref={measurerRef}
        aria-hidden
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: PAGE_WIDTH,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        {children}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
        {pages.length === 0 && (
          <PageContainer pageNumber={1} totalPages={1}>
            <div style={{ width: PAGE_WIDTH, minHeight: PAGE_HEIGHT }}>
              {children}
            </div>
          </PageContainer>
        )}

        {pages.map((page, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <div style={{ width: PAGE_WIDTH, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', height: 0, borderTop: '1.5px dashed rgba(192,107,68,0.35)' }} />
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#a8998a', letterSpacing: '0.12em' }}>
                  Page {i} / Page {i + 1}
                </span>
              </div>
            )}
            <PageContainer pageNumber={i + 1} totalPages={pages.length}>
              <div
                style={{
                  transform: `translateY(-${page.topOffset}px)`,
                  width: PAGE_WIDTH,
                  minHeight: PAGE_HEIGHT,
                }}
              >
                {children}
              </div>
            </PageContainer>
          </Fragment>
        ))}
      </div>
    </>
  )
}
