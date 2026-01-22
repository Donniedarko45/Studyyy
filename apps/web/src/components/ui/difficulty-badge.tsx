import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const difficultyBadgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    {
        variants: {
            difficulty: {
                Easy: 'bg-easy/15 text-easy',
                Medium: 'bg-medium/15 text-medium',
                Hard: 'bg-hard/15 text-hard',
            },
        },
        defaultVariants: {
            difficulty: 'Easy',
        },
    }
)

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

interface DifficultyBadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof difficultyBadgeVariants> {
    difficulty: Difficulty
}

export function DifficultyBadge({
    className,
    difficulty,
    ...props
}: DifficultyBadgeProps) {
    return (
        <div
            className={cn(difficultyBadgeVariants({ difficulty }), className)}
            {...props}
        >
            {difficulty}
        </div>
    )
}
