import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium',
    'transition-colors',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0',
    'select-none',
  ].join(' '),
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-transparent text-text hover:bg-white/5',
        premium: [
          'relative isolate border border-transparent text-text',
          'before:absolute before:inset-0 before:rounded-xl before:p-px before:content-[\'\']',
          'before:-z-10 before:bg-gradient-to-r before:from-primary/60 before:to-primary',
          'overflow-hidden',
          'bg-bg hover:bg-card/60',
        ].join(' '),
        ghost: 'bg-transparent text-text hover:bg-white/5',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-5 text-[15px]',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'


