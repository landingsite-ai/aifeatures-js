import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const labelVariants = cva(
  'af-text-sm af-font-medium af-leading-none peer-disabled:af-cursor-not-allowed peer-disabled:af-opacity-70'
)

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn(labelVariants(), className)} {...props} />
  )
)
Label.displayName = 'Label'

export { Label }
