import { type ReactNode } from 'react'

export const PAGE_WIDTH = 794
export const PAGE_HEIGHT = 1123

type PageContainerProps = {
  pageNumber: number
  totalPages: number
  children: ReactNode
}

export default function PageContainer({ pageNumber, totalPages, children }: PageContainerProps) {
  return (
    <div
      data-page-container
      style={{
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        overflow: 'hidden',
        position: 'relative',
        background: '#ffffff',
        boxShadow: '0 2px 16px rgba(42,37,32,0.1)',
      }}
    >
      {children}
      {totalPages > 1 && (
        <div
          data-page-number-overlay
          style={{
            position: 'absolute',
            bottom: 12,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: "'DM Sans', Arial, sans-serif",
            fontSize: 9,
            color: '#999',
            pointerEvents: 'none',
          }}
        >
          {pageNumber} / {totalPages}
        </div>
      )}
    </div>
  )
}
