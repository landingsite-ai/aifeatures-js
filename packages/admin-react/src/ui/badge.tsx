import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const badgeVariants = cva(
  'af-inline-flex af-items-center af-rounded-md af-border af-px-2.5 af-py-0.5 af-text-xs af-font-semibold af-transition-colors focus:af-outline-none focus:af-ring-2 focus:af-ring-ring focus:af-ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'af-border-transparent af-bg-primary af-text-primary-foreground af-shadow hover:af-bg-primary/80',
        secondary:
          'af-border-transparent af-bg-secondary af-text-secondary-foreground hover:af-bg-secondary/80',
        destructive:
          'af-border-transparent af-bg-destructive af-text-destructive-foreground af-shadow hover:af-bg-destructive/80',
        outline: 'af-text-foreground',
        success:
          'af-border-transparent af-bg-green-100 af-text-green-800',
        warning:
          'af-border-transparent af-bg-yellow-100 af-text-yellow-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
