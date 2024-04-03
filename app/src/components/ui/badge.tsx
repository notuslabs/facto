import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        green: "border-transparent bg-success-muted text-success-strong",
        red: "border-transparent text-error-foreground bg-error-muted",
        yellow: "border-transparent bg-warning-muted text-warning-foreground",
        gray: "text-muted-foreground border-transparent bg-secondary",
        "credit-score-a": "bg-success-muted border-success-border text-success-foreground",
        "credit-score-b": "bg-info-muted border-info-muted-border text-info-foreground",
        "credit-score-c": "bg-warning-muted border-warning-muted-border text-warning-foreground",
        "credit-score-d": "bg-error-muted border-error-muted-border text-error-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
