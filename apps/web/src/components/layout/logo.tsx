import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('font-semibold tracking-tight', className)}>
      Study<span className="text-primary">y</span>
    </div>
  )
}


