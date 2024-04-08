import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useTranslations } from "use-intl";

interface DisclamerCardProps {
  background: boolean;
}

export default function DisclaimerCard({ background }: DisclamerCardProps) {
  const t = useTranslations("deposit-page");
  return (
    <div className={cn(background && "h-full rounded-3xl bg-primary-foreground p-4")}>
      <div className="flex items-center gap-2 rounded-lg border border-[#e0ff92] bg-gradient-to-r from-[#37373A] to-[#313131] p-6">
        <Info className="text-brand-500" size={20} />
        <span className="text-xs text-muted-foreground">{t("disclaimer")}</span>
      </div>
    </div>
  );
}
