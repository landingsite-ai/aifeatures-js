import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const buttonVariants = cva(
  'af-inline-flex af-items-center af-justify-center af-gap-2 af-whitespace-nowrap af-rounded-md af-text-sm af-font-medium af-transition-colors focus-visible:af-outline-none focus-visible:af-ring-1 focus-visible:af-ring-ring disabled:af-pointer-events-none disabled:af-opacity-50 [&_svg]:af-pointer-events-none [&_svg]:af-size-4 [&_svg]:af-shrink-0',
  {
    variants: {
      variant: {
        default:
          'af-bg-primary af-text-primary-foreground af-shadow hover:af-bg-primary/90',
        destructive:
          'af-bg-destructive af-text-destructive-foreground af-shadow-sm hover:af-bg-destructive/90',
        outline:
          'af-border af-border-input af-bg-background af-shadow-sm hover:af-bg-accent hover:af-text-accent-foreground',
        secondary:
          'af-bg-secondary af-text-secondary-foreground af-shadow-sm hover:af-bg-secondary/80',
        ghost: 'hover:af-bg-accent hover:af-text-accent-foreground',
        link: 'af-text-primary af-underline-offset-4 hover:af-underline',
      },
      size: {
        default: 'af-h-9 af-px-4 af-py-2',
        sm: 'af-h-8 af-rounded-md af-px-3 af-text-xs',
        lg: 'af-h-10 af-rounded-md af-px-8',
        icon: 'af-h-9 af-w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
