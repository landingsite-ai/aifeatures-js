import * as React from 'react'
import { cn } from '../lib/cn'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'af-flex af-h-9 af-w-full af-rounded-md af-border af-border-input af-bg-transparent af-px-3 af-py-1 af-text-sm af-shadow-sm af-transition-colors file:af-border-0 file:af-bg-transparent file:af-text-sm file:af-font-medium file:af-text-foreground placeholder:af-text-muted-foreground focus-visible:af-outline-none focus-visible:af-ring-1 focus-visible:af-ring-ring disabled:af-cursor-not-allowed disabled:af-opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
