import { Separator } from "@/components/ui/separator";
import { CalendarDays, HandCoins } from "lucide-react";
import { useTranslations } from "next-intl";

export function DetailsCard() {
  const t = useTranslations("offer-page.details-card");
  const percentageYield = 2.5;
  return (
    <div className="flex flex-col gap-4 rounded-2xl p-8 dark:bg-primary-foreground dark:text-primary">
      <div className="flex justify-between pb-2">
        <div className="flex gap-2">
          <HandCoins size={32} /> {t("title")}
        </div>
        <div>
          <span className="text-2xl font-bold">{percentageYield}%</span> {t("per-year")}
        </div>
      </div>
      <Separator className="dark:bg-secondary" />
      <div className="flex justify-between pb-4">
        <div className="flex gap-2">
          <CalendarDays size={24} /> {t("loan-term")}
        </div>
        <div className="font-semibold">6 {t("months")}</div>
      </div>
      <p className="text-pretty text-sm">{t("description")}</p>
    </div>
  );
}
