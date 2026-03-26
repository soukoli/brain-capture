# Component Improvements & Missing Components

**Brain Capture Design System**
**Last Updated**: March 25, 2026

This document catalogs all UI components, identifies gaps, and provides recommendations for improvements and new components needed.

---

## Table of Contents

1. [Existing Components Analysis](#existing-components-analysis)
2. [Missing Critical Components](#missing-critical-components)
3. [Recommended New Components](#recommended-new-components)
4. [Component API Improvements](#component-api-improvements)
5. [Accessibility Enhancements](#accessibility-enhancements)
6. [Implementation Priority](#implementation-priority)

---

## Existing Components Analysis

### Button Component

**Location**: `/src/components/ui/button.tsx`
**Quality Score**: 7/10
**Dependencies**: Radix UI Slot, CVA

#### Current Implementation

**Variants**: default, destructive, outline, secondary, ghost, link
**Sizes**: default (36px), sm (32px), lg (40px), icon (36px)

#### Issues

1. **Touch targets too small** - All sizes below 44px minimum (CRITICAL)
2. **No loading state** - Can't show async operations
3. **No icon positioning** - Manual icon placement required
4. **No disabled tooltip** - Users don't know why button is disabled
5. **Focus ring too subtle** - 1px ring not visible enough

#### Recommended Improvements

```tsx
// Enhanced button.tsx with new features

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-blue-500",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        destructive:
          "bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link:
          "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
      },
      size: {
        default: "h-11 px-6 py-3 min-h-[44px]",
        sm: "h-11 px-4 text-sm min-h-[44px]",
        lg: "h-14 px-8 text-lg min-h-[56px]",
        icon: "h-11 w-11 min-w-[44px] min-h-[44px]",
      },
      iconPosition: {
        left: "flex-row",
        right: "flex-row-reverse",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      iconPosition: "left",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    loadingText,
    icon,
    iconPosition = "left",
    disabled,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";

    const content = loading ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        {loadingText || children}
      </>
    ) : icon ? (
      <>
        {icon}
        {children}
      </>
    ) : (
      children
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, iconPosition, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

**Usage Examples**:

```tsx
// Loading state
<Button loading loadingText="Saving...">
  Save
</Button>

// Icon left (default)
<Button icon={<Save className="h-4 w-4" />}>
  Save Idea
</Button>

// Icon right
<Button icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
  Next
</Button>

// Disabled with tooltip
<Tooltip>
  <TooltipTrigger asChild>
    <Button disabled>
      Save
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    Please fill in all required fields
  </TooltipContent>
</Tooltip>
```

---

### Card Component

**Location**: `/src/components/ui/card.tsx`
**Quality Score**: 8/10
**Dependencies**: None (pure CSS)

#### Current Implementation

**Subcomponents**: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

#### Issues

1. **No interactive variant** - Can't make clickable cards
2. **No elevation variants** - All cards have same shadow
3. **No loading skeleton** - Must create manually
4. **No hover effects** - Static appearance

#### Recommended Improvements

```tsx
// Enhanced card.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl border text-slate-950 dark:text-slate-50",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow",
        interactive:
          "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow hover:shadow-lg transition-all duration-200 cursor-pointer",
        flat: "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800",
        elevated:
          "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-xl",
        outline: "border-slate-200 dark:border-slate-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asButton?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, asButton = false, onClick, ...props }, ref) => {
    const Component = asButton ? "button" : "div";

    return (
      <Component
        ref={ref as any}
        className={cn(cardVariants({ variant }), className)}
        onClick={onClick}
        role={asButton ? "button" : undefined}
        tabIndex={asButton ? 0 : undefined}
        onKeyDown={
          asButton
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.(e as any);
                }
              }
            : undefined
        }
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

// Skeleton variant
const CardSkeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Card className={cn("animate-pulse", className)} {...props}>
      <CardHeader>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
        </div>
      </CardContent>
    </Card>
  );
};

// ... rest of Card subcomponents unchanged

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardSkeleton };
```

**Usage Examples**:

```tsx
// Clickable card
<Card
  variant="interactive"
  asButton
  onClick={() => router.push(`/ideas/${id}`)}
>
  <CardHeader>
    <CardTitle>My Idea</CardTitle>
  </CardHeader>
</Card>

// Elevated card (hero section)
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Featured Project</CardTitle>
  </CardHeader>
</Card>

// Loading skeleton
<CardSkeleton />
```

---

## Missing Critical Components

### 1. Input Component (CRITICAL)

**Priority**: P0 - Blocks all text input functionality
**Effort**: 1 hour
**Complexity**: Low

**Full implementation provided in RECOMMENDATIONS.md** (see P0.2)

**Required Features**:
- ✅ Minimum 44px height (touch target)
- ✅ 16px font size (prevent iOS zoom)
- ✅ Visible focus ring (3px blue)
- ✅ Dark mode support
- ✅ Disabled state
- ✅ Error state
- ✅ Icon support (left/right)

---

### 2. Textarea Component (CRITICAL)

**Priority**: P0 - Blocks idea capture
**Effort**: 1 hour
**Complexity**: Low

**Full implementation provided in RECOMMENDATIONS.md** (see P0.3)

**Required Features**:
- ✅ Auto-resize option
- ✅ Character count integration
- ✅ 16px font size
- ✅ Max height with scroll
- ✅ Dark mode support

---

### 3. Dialog/Modal Component (CRITICAL)

**Priority**: P0 - Needed for capture UI, confirmations
**Effort**: 2 hours
**Complexity**: Medium

```tsx
// src/components/ui/dialog.tsx
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full max-w-lg",
        "translate-x-[-50%] translate-y-[-50%]",
        "rounded-xl border border-slate-200 bg-white p-6 shadow-2xl",
        "dark:border-slate-800 dark:bg-slate-950",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2",
        "data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2",
        "data-[state=open]:slide-in-from-top-[48%]",
        "duration-200",
        "mx-4 sm:mx-0",  // Mobile margins
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className={cn(
          "absolute right-4 top-4 rounded-lg p-2",
          "hover:bg-slate-100 dark:hover:bg-slate-800",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
          "transition-colors",
          "disabled:pointer-events-none"
        )}
        aria-label="Close dialog"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-slate-600 dark:text-slate-400", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
```

**Usage Example**:

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Delete Idea</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your idea.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### 4. Alert Component (HIGH)

**Priority**: P1 - Error/success messaging
**Effort**: 1 hour
**Complexity**: Low

```tsx
// src/components/ui/alert.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-8 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
        destructive:
          "border-red-500/50 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-900/10 dark:text-red-400",
        success:
          "border-green-500/50 bg-green-50 text-green-900 dark:border-green-500 dark:bg-green-900/10 dark:text-green-400",
        warning:
          "border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:border-yellow-500 dark:bg-yellow-900/10 dark:text-yellow-400",
        info:
          "border-blue-500/50 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-900/10 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
```

**Usage**:

```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to save your idea. Please try again.
  </AlertDescription>
</Alert>
```

---

### 5. Badge Component (MEDIUM)

**Priority**: P2 - Tags, categories
**Effort**: 30 minutes
**Complexity**: Low

```tsx
// src/components/ui/badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        secondary:
          "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        success:
          "border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        destructive:
          "border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        warning:
          "border-transparent bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
        outline:
          "text-slate-950 dark:text-slate-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
```

---

### 6. Skeleton Component (HIGH)

**Implementation provided in RECOMMENDATIONS.md** (P2.3)

---

### 7. Select Component (MEDIUM)

**Priority**: P2 - Project selection, filters
**Effort**: 2 hours
**Complexity**: Medium

```tsx
// src/components/ui/select.tsx
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-11 min-h-[44px] w-full items-center justify-between",
      "rounded-lg border border-slate-200 bg-white px-4 py-3 text-base",
      "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "dark:border-slate-800 dark:bg-slate-950",
      "[&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
        "rounded-lg border border-slate-200 bg-white text-slate-950 shadow-lg",
        "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center",
      "rounded-lg py-2 pl-8 pr-2 text-base outline-none",
      "min-h-[44px]",  // Touch target
      "focus:bg-slate-100 focus:text-slate-900",
      "dark:focus:bg-slate-800 dark:focus:text-slate-50",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-slate-200 dark:bg-slate-800", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

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
};
```

**Usage**:

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a project" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="personal">Personal</SelectItem>
    <SelectItem value="work">Work</SelectItem>
    <SelectItem value="side-project">Side Project</SelectItem>
  </SelectContent>
</Select>
```

---

## Component API Improvements

### Standardized Props

All components should support these common props:

```tsx
interface CommonComponentProps {
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "data-testid"?: string;
}
```

### Consistent Sizing

All interactive components should use the same size scale:

```tsx
type ComponentSize = "sm" | "default" | "lg";

// Minimum heights for touch targets
const sizeHeights = {
  sm: "h-11 min-h-[44px]",      // 44px
  default: "h-11 min-h-[44px]",  // 44px
  lg: "h-14 min-h-[56px]",       // 56px
};
```

### Loading States

All async components should support loading prop:

```tsx
interface AsyncComponentProps {
  loading?: boolean;
  loadingText?: string;
}
```

---

## Accessibility Enhancements

### All Components Must Include

1. **Keyboard Navigation**: Tab, Enter, Space, Escape
2. **ARIA Labels**: Meaningful labels for screen readers
3. **Focus Indicators**: Visible 3px ring with 2px offset
4. **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
5. **Touch Targets**: Minimum 44x44px
6. **Error States**: aria-invalid, aria-describedby

---

## Implementation Priority

### Week 1 (P0 - Critical)
- [ ] Input component
- [ ] Textarea component
- [ ] Button improvements (touch targets)
- [ ] Toast system (Sonner)

### Week 2 (P1 - High)
- [ ] Dialog/Modal component
- [ ] Alert component
- [ ] Voice Recorder component
- [ ] Card improvements

### Week 3 (P2 - Medium)
- [ ] Badge component
- [ ] Select component
- [ ] Skeleton component
- [ ] Tooltip component

### Week 4+ (P3 - Low)
- [ ] Tabs component enhancements
- [ ] Dropdown Menu enhancements
- [ ] Avatar component
- [ ] Progress component

---

## Testing Checklist

For each component:

- [ ] Renders correctly in light/dark mode
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Touch targets are 44px minimum
- [ ] Focus indicators are visible
- [ ] Works on mobile Safari
- [ ] Works on Android Chrome
- [ ] Passes axe accessibility audit
- [ ] Has TypeScript types
- [ ] Has usage examples in Storybook (future)

---

**Last Updated**: March 25, 2026
**Maintained By**: Design System Team
