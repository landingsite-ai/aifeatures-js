import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../lib/cn'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'af-flex af-h-9 af-w-full af-items-center af-justify-between af-whitespace-nowrap af-rounded-md af-border af-border-input af-bg-transparent af-px-3 af-py-2 af-text-sm af-shadow-sm af-ring-offset-background placeholder:af-text-muted-foreground focus:af-outline-none focus:af-ring-1 focus:af-ring-ring disabled:af-cursor-not-allowed disabled:af-opacity-50 [&>span]:af-line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="af-h-4 af-w-4 af-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'af-flex af-cursor-default af-items-center af-justify-center af-py-1',
      className
    )}
    {...props}
  >
    <ChevronUp className="af-h-4 af-w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'af-flex af-cursor-default af-items-center af-justify-center af-py-1',
      className
    )}
    {...props}
  >
    <ChevronDown className="af-h-4 af-w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'af-relative af-z-50 af-max-h-96 af-min-w-[8rem] af-overflow-hidden af-rounded-md af-border af-bg-popover af-text-popover-foreground af-shadow-md data-[state=open]:af-animate-in data-[state=closed]:af-animate-out data-[state=closed]:af-fade-out-0 data-[state=open]:af-fade-in-0 data-[state=closed]:af-zoom-out-95 data-[state=open]:af-zoom-in-95 data-[side=bottom]:af-slide-in-from-top-2 data-[side=left]:af-slide-in-from-right-2 data-[side=right]:af-slide-in-from-left-2 data-[side=top]:af-slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:af-translate-y-1 data-[side=left]:af--translate-x-1 data-[side=right]:af-translate-x-1 data-[side=top]:af--translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'af-p-1',
          position === 'popper' &&
            'af-h-[var(--radix-select-trigger-height)] af-w-full af-min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('af-px-2 af-py-1.5 af-text-sm af-font-semibold', className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'af-relative af-flex af-w-full af-cursor-default af-select-none af-items-center af-rounded-sm af-py-1.5 af-pl-2 af-pr-8 af-text-sm af-outline-none focus:af-bg-accent focus:af-text-accent-foreground data-[disabled]:af-pointer-events-none data-[disabled]:af-opacity-50',
      className
    )}
    {...props}
  >
    <span className="af-absolute af-right-2 af-flex af-h-3.5 af-w-3.5 af-items-center af-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="af-h-4 af-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('af--mx-1 af-my-1 af-h-px af-bg-muted', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
