import { cn } from '../../utils/classNames'

export default function Divider({ className }) {
  return (
    <hr className={cn('border-t border-hairline my-2', className)} />
  )
}
