'use client'

import Providers from './providers'
import dynamic from 'next/dynamic'

const App = dynamic(() => import('../src/App'), { ssr: false })

export default function HomePage() {
  return (
    <Providers>
      <App />
    </Providers>
  )
}
