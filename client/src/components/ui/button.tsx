import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
// Type local pour VariantProps
type VariantProps<T> = Record<string, any>;

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " hover-elevate active-elevate-2 transition-all duration-200 hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary-border",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border",
        outline:
          // Shows the background color of whatever card / sidebar / accent background it is inside of.
          // Inherits the current text color.
          " border [border-color:var(--button-outline)]  shadow-xs active:shadow-none ",
        secondary: "border bg-secondary text-secondary-foreground border border-secondary-border ",
        // Add a transparent border so that when someone toggles a border on later, it doesn't shift layout/size.
        ghost: "border border-transparent",
      },
      // Heights are set as "min" heights, because sometimes Ai will place large amount of content
      // inside buttons. With a min-height they will look appropriate with small amounts of content,
      // but will expand to fit large amounts of content.
      size: {
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 rounded-md px-3 text-xs",
        lg: "min-h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Effet ripple
      const button = e.currentTarget;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.position = "absolute";
      ripple.style.width = "100px";
      ripple.style.height = "100px";
      ripple.style.background = "rgba(255, 255, 255, 0.4)";
      ripple.style.borderRadius = "50%";
      ripple.style.transform = "scale(0)";
      ripple.style.animation = "ripple 0.4s linear";
      ripple.style.left = "50%";
      ripple.style.top = "50%";
      ripple.style.marginLeft = "-50px";
      ripple.style.marginTop = "-50px";
      ripple.style.pointerEvents = "none";
      
      button.style.position = "relative";
      button.style.overflow = "hidden";
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 400);
      
      onClick?.(e);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
