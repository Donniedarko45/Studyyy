import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        [
          'flex min-h-[96px] w-full resize-y rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-text',
          'placeholder:text-muted',
          'transition-colors',
          'focus-visible:outline-none focus-visible:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
        ].join(' '),
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'


