'use client'

import Providers from '../providers'
import dynamic from 'next/dynamic'
import AuthGuard from '../../src/components/AuthGuard'

const App = dynamic(() => import('../../src/App'), { ssr: false })

export default function BuilderPage() {
  return (
    <Providers>
      <AuthGuard>
        <App />
      </AuthGuard>
    </Providers>
  )
}
