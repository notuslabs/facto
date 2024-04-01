import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ children, className, ...props }: PropsWithChildren<DivProps>) {
  return (
    <div
      className={cn("rounded-2xl shadow-md md:bg-primary-foreground md:p-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}
