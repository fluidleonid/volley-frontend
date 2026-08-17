import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:text-current [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-white",
        destructive: "bg-destructive/20 text-destructive",
        neutral: "bg-card text-muted-foreground",
      },
      size: {
        default: "h-[28px] px-2 has-[>svg:first-child]:pl-1.5 has-[>svg:last-child]:pr-1.5 text-sm gap-1.5 [&_svg]:size-5",
        sm: "h-[18px] px-1.5 has-[>svg:first-child]:pl-1 has-[>svg:last-child]:pr-1 text-xs gap-1 [&_svg]:size-4.5",
        lg: "h-[32px] px-2 has-[>svg:first-child]:pl-1 has-[>svg:last-child]:pr-1 text-sm gap-1 [&_svg]:size-6",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
