import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper p-8">
      <div className="max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-ink-muted/30 bg-paper-deep">
            <span className="text-2xl font-serif text-ink-muted">404</span>
          </div>
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-ink">Page not found</h1>
        <p className="mb-6 text-body text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-6 py-2.5 text-body font-medium text-white transition-all hover:bg-terracotta/90 active:scale-[0.97]"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
