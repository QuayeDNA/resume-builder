import { cn } from '../../utils/classNames'

type SkeletonProps = {
  lines?: number
  className?: string
}

export default function Skeleton({ lines = 3, className }: SkeletonProps) {
  return (
    <div className={cn('space-y-2 animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded bg-elevated-2"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}
