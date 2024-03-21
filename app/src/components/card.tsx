import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ children, className, ...props }: PropsWithChildren<DivProps>) {
  return (
    <div
      className={cn("rounded-2xl p-8 shadow-md dark:bg-primary-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
}
