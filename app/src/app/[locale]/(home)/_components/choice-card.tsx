import { cn } from "@/lib/utils";
import { PropsWithChildren, ReactNode } from "react";
import { IconRight } from "react-day-picker";

type ChoiceCardProps = {
  title: string;
  description: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
  icon: ReactNode;
};

export function ChoiceCard({
  children,
  title,
  description,
  titleClassName,
  descriptionClassName,
  icon,
  className,
  contentClassName,
}: PropsWithChildren<ChoiceCardProps>) {
  return (
    <div className={cn("relative rounded-2xl border bg-transparent p-px", className)}>
      <div className={cn("relative", contentClassName)}>
        {children}

        <div className="px-8 pb-6 pt-8">{icon}</div>

        <div className="flex flex-col items-start justify-start gap-1 px-8 pb-8">
          {/* TODO: add gradient */}
          <h3 className={cn("text-2xl font-semibold", titleClassName)}>{title}</h3>
          <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>{description}</p>
        </div>
      </div>
    </div>
  );
}
