import type { ReactNode } from 'react'
import './globals.css'

export const metadata = {
  title: 'ResumeForge — Build Your Resume, Tell Your Story',
  description: 'Free, fully-featured resume builder with AI-powered assistance. Craft professional resumes in minutes. Sign up free.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Bricolage+Grotesque:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500&family=Lora:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;600&family=DM+Serif+Display:wght@400&family=Cormorant+Garamond:wght@300;400;500;600&family=Proza+Libre:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
