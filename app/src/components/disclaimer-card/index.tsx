import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useTranslations } from "use-intl";

interface DisclamerCardProps {
  background: boolean;
}

export default function DisclaimerCard({ background }: DisclamerCardProps) {
  const t = useTranslations("deposit-page");
  return (
    <div
      className={cn(
        background && "from-#CAE5854D to-#313131 h-full rounded-3xl bg-gradient-to-r p-4",
      )}
    >
      <div className="flex items-center gap-2 rounded-lg border border-facto-secondary bg-primary-foreground p-6 ">
        <Info className="text-facto-primary" size={20} />
        <span className="text-xs text-muted-foreground">{t("disclaimer")}</span>
      </div>
    </div>
  );
}
