import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-black font-bold",
        secondary: "bg-secondary text-white",
        outline: "border border-[#38383A] text-muted-foreground",
        hardmode: "bg-brand-hardmode text-black font-bold shadow-[0_0_10px_rgba(255,149,0,0.5)]",
        playing: "bg-primary/20 text-primary border border-primary/40",
        queued: "bg-brand-hardmode/20 text-brand-hardmode border border-brand-hardmode/40",
        sitting: "bg-muted/20 text-muted-foreground border border-muted-foreground/40",
        destructive: "bg-red-500/20 text-red-400 border border-red-500/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
