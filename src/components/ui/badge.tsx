import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#68BD44] text-black font-bold",
        secondary: "bg-[#2C2C2E] text-white",
        outline: "border border-[#38383A] text-[#8E8E93]",
        hardmode: "bg-[#FF9500] text-black font-bold shadow-[0_0_10px_rgba(255,149,0,0.5)]",
        playing: "bg-[#68BD44]/20 text-[#68BD44] border border-[#68BD44]/40",
        queued: "bg-[#FF9500]/20 text-[#FF9500] border border-[#FF9500]/40",
        sitting: "bg-[#8E8E93]/20 text-[#8E8E93] border border-[#8E8E93]/40",
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

export { Badge, badgeVariants }
