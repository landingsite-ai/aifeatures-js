import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../lib/cn'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'af-inline-flex af-h-9 af-items-center af-justify-center af-rounded-lg af-bg-muted af-p-1 af-text-muted-foreground',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'af-inline-flex af-items-center af-justify-center af-whitespace-nowrap af-rounded-md af-px-3 af-py-1 af-text-sm af-font-medium af-ring-offset-background af-transition-all focus-visible:af-outline-none focus-visible:af-ring-2 focus-visible:af-ring-ring focus-visible:af-ring-offset-2 disabled:af-pointer-events-none disabled:af-opacity-50 data-[state=active]:af-bg-background data-[state=active]:af-text-foreground data-[state=active]:af-shadow',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'af-mt-2 af-ring-offset-background focus-visible:af-outline-none focus-visible:af-ring-2 focus-visible:af-ring-ring focus-visible:af-ring-offset-2',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
