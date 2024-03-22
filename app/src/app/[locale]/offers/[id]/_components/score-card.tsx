import { ScoreBadge } from "@/components/score-badge";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export function ScoreCard() {
  const t = useTranslations("offer-page.score-card");
  return (
    <div className="rounded-2xl dark:bg-primary-foreground dark:text-primary">
      <div className="flex flex-col gap-4 px-8 py-6">
        <div className="flex items-center justify-between">
          <h2 className="pb-2 text-xl font-bold">{t("title")}</h2>
          <ScoreBadge score={999} />
        </div>

        <Separator className="dark:bg-secondary" />

        <p className="text-balance text-sm">{t("description")}</p>
      </div>
    </div>
  );
}
