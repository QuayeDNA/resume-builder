import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { PAGE_HEIGHT } from '../../Templates/theme'
import PageContainer from './PageContainer'

type PageComposerProps = {
  children: ReactNode
}

export default function PageComposer({ children }: PageComposerProps) {
  const measurerRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState(1)

  useLayoutEffect(() => {
    const el = measurerRef.current
    if (el) {
      const totalHeight = el.scrollHeight
      setPages(Math.max(1, Math.ceil(totalHeight / PAGE_HEIGHT)))
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
          width: '794px',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
        {Array.from({ length: pages }, (_, i) => (
          <PageContainer key={i} pageNumber={i + 1} totalPages={pages}>
            <div
              style={{
                transform: `translateY(-${i * PAGE_HEIGHT}px)`,
                width: '794px',
                minHeight: PAGE_HEIGHT,
              }}
            >
              {children}
            </div>
          </PageContainer>
        ))}
      </div>
    </>
  )
}
