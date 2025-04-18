// src/components/ui/dialog.tsx - Meticulously Checked Version
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils" // Ensure you have this utility file

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

// --- DIALOG OVERLAY --- Ensure this component exists and is styled
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80", // Covers screen, high z-index, dimmed background
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", // Standard animations
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// --- DIALOG CONTENT --- Ensure it renders Overlay *within* Portal, *before* Content
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal> {/* Portal is essential */}
    <DialogOverlay /> {/* Overlay MUST be rendered here */}
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
         // Standard positioning & sizing
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200",
         // Make scrollable if content overflows height constraint
        "max-h-[95vh] md:max-h-[90vh] overflow-y-auto",
         // Your contrast styles
        "bg-[#01220f] border-[#5e4b8b] text-[#d9c7f0] rounded-lg",
         // Standard animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children} {/* EditModal renders inside this */}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4 text-[#a5a0b3]" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// --- Header, Footer, Title, Description (Keep these standard) ---
const DialogHeader = ({className,...props}: React.HTMLAttributes<HTMLDivElement>) => (<div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props}/>)
DialogHeader.displayName = "DialogHeader"
const DialogFooter = ({className,...props}: React.HTMLAttributes<HTMLDivElement>) => (<div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 border-t border-[#5e4b8b]/50 pt-4 mt-auto", className)} {...props}/>)
DialogFooter.displayName = "DialogFooter"
const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>,React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(({ className, ...props }, ref) => (<DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight text-[#cbb9f5]", className)} {...props}/>))
DialogTitle.displayName = DialogPrimitive.Title.displayName
const DialogDescription = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Description>,React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(({ className, ...props }, ref) => (<DialogPrimitive.Description ref={ref} className={cn("text-sm text-[#a5a0b3]", className)} {...props}/>))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// --- Ensure everything needed is exported ---
export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, }