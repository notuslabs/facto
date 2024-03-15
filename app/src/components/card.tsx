import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ children, className, ...props }: PropsWithChildren<DivProps>) {
  return (
    <div className={cn("rounded-2xl bg-white p-8 shadow-md", className)} {...props}>
      {children}
    </div>
  );
}
