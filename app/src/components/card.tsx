import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { FormTexture } from "./svgs/form-texture";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  withTexture?: boolean;
};

export function Card({
  children,
  className,
  withTexture = false,
  ...props
}: PropsWithChildren<CardProps>) {
  return (
    <div
      className={cn("relative rounded-2xl bg-primary-foreground shadow-md md:p-8", className)}
      {...props}
    >
      <div className="relative z-[1]">{children}</div>

      {withTexture && <FormTexture className="absolute bottom-0 left-0" />}
    </div>
  );
}
