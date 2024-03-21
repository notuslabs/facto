import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export function ScoreCard() {
  const t = useTranslations("offer-page.tabs.credit-score");
  return (
    <div className="rounded-2xl dark:bg-primary-foreground dark:text-primary">
      <div className="flex flex-col gap-4 px-8 py-6">
        <h2 className="pb-2 text-xl font-bold">{t("title")}</h2>
        <Separator className="dark:bg-secondary" />
      </div>
    </div>
  );
}
