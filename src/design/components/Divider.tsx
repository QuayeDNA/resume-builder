import { cn } from '../../utils/classNames'

type DividerProps = {
  className?: string
}

export default function Divider({ className }: DividerProps) {
  return (
    <hr className={cn('border-t border-warm-border my-2', className)} />
  )
}
