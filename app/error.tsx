'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper p-8">
      <div className="max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-error/30 bg-error-subtle">
            <span className="text-2xl text-error">!</span>
          </div>
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-ink">Something went wrong</h1>
        <p className="mb-6 text-body text-ink-soft">
          An unexpected error occurred. Try refreshing the page.
        </p>
        <button
          onClick={reset}
          className="rounded-xl bg-terracotta px-6 py-2.5 text-body font-medium text-white transition-all hover:bg-terracotta/90 active:scale-[0.97]"
        >
          Try Again
        </button>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-6 rounded-lg bg-paper-deep p-4 text-left text-caption text-error">
            {error.message}
          </pre>
        )}
      </div>
    </div>
  )
}
