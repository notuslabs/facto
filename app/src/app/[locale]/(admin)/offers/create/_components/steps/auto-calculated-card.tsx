import { PropsWithChildren } from "react";

type AutoCalculatedCardProps = {
  title: string;
};

export function AutoCalculatedCard({
  title,
  children,
}: PropsWithChildren<AutoCalculatedCardProps>) {
  return (
    <div className="flex flex-col gap-1 rounded-md bg-strong p-4">
      <span className="text-xs text-muted-foreground">{title}</span>
      <span className="font-medium text-foreground">{children}</span>
    </div>
  );
}
