'use client'

import { useEffect, type ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from '../src/components/ErrorBoundary'
import { initAuthListener } from '../src/store/useAuthStore'

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    initAuthListener()
  }, [])

  return (
    <ErrorBoundary>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0f0f1c',
            color: '#c8c8e8',
            border: '1px solid #1e1e35',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '12px',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#0f0f1c' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#0f0f1c' } },
        }}
      />
    </ErrorBoundary>
  )
}
