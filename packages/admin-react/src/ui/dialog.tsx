import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../lib/cn'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'aifeatures-dialog-overlay af-fixed af-inset-0 af-z-50 af-bg-black/80',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    {/* Wrapper div provides CSS variables since portal renders outside .aifeatures-admin */}
    <div className="aifeatures-admin">
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'aifeatures-dialog-content af-fixed af-left-[50%] af-top-[50%] af-z-50 af-grid af-w-full af-max-w-lg af-translate-x-[-50%] af-translate-y-[-50%] af-gap-4 af-border af-bg-background af-p-6 af-shadow-lg sm:af-rounded-lg',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="af-absolute af-right-4 af-top-4 af-rounded-sm af-opacity-70 af-ring-offset-background af-transition-opacity hover:af-opacity-100 focus:af-outline-none focus:af-ring-2 focus:af-ring-ring focus:af-ring-offset-2 disabled:af-pointer-events-none data-[state=open]:af-bg-accent data-[state=open]:af-text-muted-foreground">
          <X className="af-h-4 af-w-4" />
          <span className="af-sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </div>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'af-flex af-flex-col af-space-y-1.5 af-text-center sm:af-text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'af-flex af-flex-col-reverse sm:af-flex-row sm:af-justify-end sm:af-space-x-2',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'af-text-lg af-font-semibold af-leading-none af-tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('af-text-sm af-text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
